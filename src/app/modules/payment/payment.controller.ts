import { Request, Response } from 'express';
import { HttpStatus } from 'http-status-ts';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../Error/AppError';
import SSLCommerzService from './payment.service';
import { SubscriptionServices } from '../subscription/subscription.service';
import { getPlanByName } from '../subscription/subscription.constant';
import { Student } from '../student/student.model';
import { Transaction } from './transaction.model';
import config from '../../config';
import logger from '../../utils/logger';

// Initialize payment
const initPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { plan } = req.body; // monthly, yearly, or lifetime
  
  if (!userId) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  if (!plan) {
    throw new AppError(HttpStatus.BAD_REQUEST, 'Subscription plan is required');
  }

  // Get plan details
  const selectedPlan = getPlanByName(plan);
  if (!selectedPlan) {
    throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid subscription plan');
  }

  // Get student details
  const student = await Student.findOne({ user: userId }).populate('user', 'name email');
  if (!student) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Student profile not found');
  }

  // Generate unique transaction ID
  const tranId = `KT${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Store transaction in database
  await Transaction.create({
    userId: userId,
    transactionId: tranId,
    plan: plan,
    amount: selectedPlan.price,
    status: 'pending'
  });

  // Prepare payment data
  // Note: Callback URLs must point to BACKEND API, not frontend
  const backendUrl = `http://localhost:${config.port}`;
  const paymentData = {
    total_amount: selectedPlan.price,
    currency: 'BDT',
    tran_id: tranId,
    success_url: `${backendUrl}/api/v1/payment/success`,
    fail_url: `${backendUrl}/api/v1/payment/fail`,
    cancel_url: `${backendUrl}/api/v1/payment/cancel`,
    ipn_url: `${backendUrl}/api/v1/payment/ipn`,
    cus_name: student.name,
    cus_email: student.email,
    cus_add1: 'Bangladesh',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: '01700000000',
    product_name: `KlarText ${selectedPlan.displayName}`,
    product_category: 'Subscription',
    product_profile: 'general',
    shipping_method: 'NO', // Digital product - no shipping required
  };

  // Store transaction info temporarily (in production, use database)
  // For now, we'll pass it via session or store in memory
  // You should create a Payment/Transaction model for production

  // Initialize payment with SSLCommerz
  const paymentResult = await SSLCommerzService.initPayment(paymentData);

  if (paymentResult.success) {
    logger.info(`Payment initialized for user ${userId}`, {
      tranId,
      plan,
      amount: selectedPlan.price
    });

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Payment session created successfully',
      data: {
        gatewayUrl: paymentResult.gatewayUrl,
        sessionKey: paymentResult.sessionKey,
        transactionId: tranId,
        amount: selectedPlan.price,
        plan: plan
      },
    });
  } else {
    throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to initialize payment');
  }
});

// Payment success callback
const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { val_id, tran_id, amount, card_type } = req.body;

  logger.info('Payment success callback received', { val_id, tran_id, amount });

  // Validate payment with SSLCommerz
  const validationResult = await SSLCommerzService.validatePayment({ val_id });

  if (validationResult.success) {
    const paymentData = validationResult.data;
    
    // Get transaction from database
    const transaction = await Transaction.findOne({ transactionId: tran_id });
    
    if (!transaction) {
      logger.error('Transaction not found', { tran_id });
      return res.redirect(`${config.client_url}/payment/failed?error=transaction_not_found`);
    }

    // Update transaction status
    transaction.status = 'success';
    transaction.valId = val_id;
    transaction.cardType = card_type;
    await transaction.save();

    // Upgrade user subscription
    await SubscriptionServices.upgradeToPremium(
      transaction.userId,
      transaction.plan,
      tran_id
    );
    
    logger.info('Subscription upgraded successfully', { 
      userId: transaction.userId, 
      plan: transaction.plan,
      tran_id 
    });

    // Redirect to frontend success page
    res.redirect(`${config.client_url}/payment/success?tranId=${tran_id}&plan=${transaction.plan}`);
  } else {
    logger.error('Payment validation failed', { val_id, tran_id });
    
    // Update transaction as failed
    await Transaction.findOneAndUpdate(
      { transactionId: tran_id },
      { status: 'failed' }
    );
    
    res.redirect(`${config.client_url}/payment/failed?tranId=${tran_id}`);
  }
});

// Payment failure callback
const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.body;
  
  logger.warn('Payment failed', { tran_id });
  
  // Update transaction status
  await Transaction.findOneAndUpdate(
    { transactionId: tran_id },
    { status: 'failed' }
  );
  
  res.redirect(`${config.client_url}/payment/failed?tranId=${tran_id}`);
});

// Payment cancel callback
const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.body;
  
  logger.info('Payment cancelled by user', { tran_id });
  
  // Update transaction status
  await Transaction.findOneAndUpdate(
    { transactionId: tran_id },
    { status: 'cancelled' }
  );
  
  res.redirect(`${config.client_url}/payment/cancelled?tranId=${tran_id}`);
});

// IPN (Instant Payment Notification) - for backend verification
const paymentIPN = catchAsync(async (req: Request, res: Response) => {
  const { tran_id, val_id, status } = req.body;
  
  logger.info('IPN received', { tran_id, val_id, status });

  // Validate and update subscription
  if (status === 'VALID' || status === 'VALIDATED') {
    // Update user subscription in database
    // Fetch transaction details and upgrade user
  }

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'IPN received',
    data: null,
  });
});

export const PaymentControllers = {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN
};

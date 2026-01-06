import { Request, Response } from 'express';
import { HttpStatus } from 'http-status-ts';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../Error/AppError';
import { SubscriptionServices } from './subscription.service';

// Get all subscription plans
const getPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionServices.getSubscriptionPlans();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Subscription plans retrieved successfully',
    data: result,
  });
});

// Get subscription status
const getStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await SubscriptionServices.getSubscriptionStatus(userId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Subscription status retrieved successfully',
    data: result,
  });
});

// Upgrade to premium
const upgrade = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { plan, transactionId } = req.body;
  
  if (!userId) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  if (!plan) {
    throw new AppError(HttpStatus.BAD_REQUEST, 'Subscription plan is required');
  }

  const result = await SubscriptionServices.upgradeToPremium(userId, plan, transactionId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: result.message,
    data: result.subscription,
  });
});

// Cancel subscription
const cancel = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await SubscriptionServices.cancelSubscription(userId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: result.message,
    data: result.subscription,
  });
});

export const SubscriptionControllers = {
  getPlans,
  getStatus,
  upgrade,
  cancel
};

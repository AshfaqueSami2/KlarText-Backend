"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const payment_service_1 = __importDefault(require("./payment.service"));
const subscription_service_1 = require("../subscription/subscription.service");
const subscription_constant_1 = require("../subscription/subscription.constant");
const student_model_1 = require("../student/student.model");
const transaction_model_1 = require("./transaction.model");
const config_1 = __importDefault(require("../../config"));
const logger_1 = __importDefault(require("../../utils/logger"));
const initPayment = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    const { plan } = req.body;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    if (!plan) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription plan is required');
    }
    const selectedPlan = (0, subscription_constant_1.getPlanByName)(plan);
    if (!selectedPlan) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid subscription plan');
    }
    const student = await student_model_1.Student.findOne({ user: userId }).populate('user', 'name email');
    if (!student) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Student profile not found');
    }
    const tranId = `KT${Date.now()}${Math.floor(Math.random() * 1000)}`;
    await transaction_model_1.Transaction.create({
        userId: userId,
        transactionId: tranId,
        plan: plan,
        amount: selectedPlan.price,
        status: 'pending'
    });
    const backendUrl = config_1.default.backend_url;
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
        shipping_method: 'NO',
    };
    const paymentResult = await payment_service_1.default.initPayment(paymentData);
    if (paymentResult.success) {
        logger_1.default.info(`Payment initialized for user ${userId}`, {
            tranId,
            plan,
            amount: selectedPlan.price
        });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
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
    }
    else {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to initialize payment');
    }
});
const paymentSuccess = (0, catchAsync_1.default)(async (req, res) => {
    const { val_id, tran_id, amount, card_type } = req.body;
    logger_1.default.info('Payment success callback received', { val_id, tran_id, amount });
    const validationResult = await payment_service_1.default.validatePayment({ val_id });
    if (validationResult.success) {
        const paymentData = validationResult.data;
        const transaction = await transaction_model_1.Transaction.findOne({ transactionId: tran_id });
        if (!transaction) {
            logger_1.default.error('Transaction not found', { tran_id });
            return res.redirect(`${config_1.default.client_url}/payment/failed?error=transaction_not_found`);
        }
        transaction.status = 'success';
        transaction.valId = val_id;
        transaction.cardType = card_type;
        await transaction.save();
        await subscription_service_1.SubscriptionServices.upgradeToPremium(transaction.userId, transaction.plan, tran_id);
        logger_1.default.info('Subscription upgraded successfully', {
            userId: transaction.userId,
            plan: transaction.plan,
            tran_id
        });
        res.redirect(`${config_1.default.client_url}/payment/success?tranId=${tran_id}&plan=${transaction.plan}`);
    }
    else {
        logger_1.default.error('Payment validation failed', { val_id, tran_id });
        await transaction_model_1.Transaction.findOneAndUpdate({ transactionId: tran_id }, { status: 'failed' });
        res.redirect(`${config_1.default.client_url}/payment/failed?tranId=${tran_id}`);
    }
});
const paymentFail = (0, catchAsync_1.default)(async (req, res) => {
    const { tran_id } = req.body;
    logger_1.default.warn('Payment failed', { tran_id });
    await transaction_model_1.Transaction.findOneAndUpdate({ transactionId: tran_id }, { status: 'failed' });
    res.redirect(`${config_1.default.client_url}/payment/failed?tranId=${tran_id}`);
});
const paymentCancel = (0, catchAsync_1.default)(async (req, res) => {
    const { tran_id } = req.body;
    logger_1.default.info('Payment cancelled by user', { tran_id });
    await transaction_model_1.Transaction.findOneAndUpdate({ transactionId: tran_id }, { status: 'cancelled' });
    res.redirect(`${config_1.default.client_url}/payment/cancelled?tranId=${tran_id}`);
});
const paymentIPN = (0, catchAsync_1.default)(async (req, res) => {
    const { tran_id, val_id, status } = req.body;
    logger_1.default.info('IPN received', { tran_id, val_id, status });
    if (status === 'VALID' || status === 'VALIDATED') {
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'IPN received',
        data: null,
    });
});
exports.PaymentControllers = {
    initPayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    paymentIPN
};
//# sourceMappingURL=payment.controller.js.map
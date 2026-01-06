"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const subscription_service_1 = require("./subscription.service");
const getPlans = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subscription_service_1.SubscriptionServices.getSubscriptionPlans();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Subscription plans retrieved successfully',
        data: result,
    });
});
const getStatus = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    const result = await subscription_service_1.SubscriptionServices.getSubscriptionStatus(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Subscription status retrieved successfully',
        data: result,
    });
});
const upgrade = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    const { plan, transactionId } = req.body;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    if (!plan) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription plan is required');
    }
    const result = await subscription_service_1.SubscriptionServices.upgradeToPremium(userId, plan, transactionId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.message,
        data: result.subscription,
    });
});
const cancel = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    const result = await subscription_service_1.SubscriptionServices.cancelSubscription(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.message,
        data: result.subscription,
    });
});
exports.SubscriptionControllers = {
    getPlans,
    getStatus,
    upgrade,
    cancel
};
//# sourceMappingURL=subscription.controller.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionServices = void 0;
const student_model_1 = require("../student/student.model");
const subscription_constant_1 = require("./subscription.constant");
const logger_1 = __importDefault(require("../../utils/logger"));
const getSubscriptionPlans = async () => {
    return {
        plans: subscription_constant_1.SUBSCRIPTION_PLANS,
        currency: 'BDT',
        freeLevels: ['A1', 'A2'],
        premiumLevels: ['B1', 'B2', 'C1', 'C2']
    };
};
const getSubscriptionStatus = async (userId) => {
    const student = await student_model_1.Student.findOne({ user: userId });
    if (!student) {
        throw new Error('Student profile not found');
    }
    const isPremium = student.subscriptionStatus === 'premium';
    const now = new Date();
    const isExpired = student.subscriptionExpiry && now > student.subscriptionExpiry;
    const isActive = isPremium && (!student.subscriptionExpiry || !isExpired);
    if (isExpired && student.subscriptionPlan !== 'lifetime') {
        student.subscriptionStatus = 'free';
        student.subscriptionPlan = null;
        await student.save();
        logger_1.default.info(`Subscription expired for user ${userId}, downgraded to free`);
    }
    return {
        subscriptionStatus: student.subscriptionStatus,
        subscriptionPlan: student.subscriptionPlan,
        isPremium: isActive,
        isExpired: isExpired || false,
        subscriptionExpiry: student.subscriptionExpiry,
        subscriptionPrice: student.subscriptionPrice,
        accessLevels: isActive ? ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] : ['A1', 'A2']
    };
};
const upgradeToPremium = async (userId, plan, transactionId) => {
    const student = await student_model_1.Student.findOne({ user: userId });
    if (!student) {
        throw new Error('Student profile not found');
    }
    const selectedPlan = (0, subscription_constant_1.getPlanByName)(plan);
    if (!selectedPlan) {
        throw new Error('Invalid subscription plan');
    }
    let expiryDate = null;
    if (selectedPlan.durationDays) {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + selectedPlan.durationDays);
    }
    student.subscriptionStatus = 'premium';
    student.subscriptionPlan = plan;
    student.subscriptionExpiry = expiryDate;
    student.subscriptionPrice = selectedPlan.price;
    await student.save();
    logger_1.default.info(`User ${userId} upgraded to ${plan} plan`, {
        plan,
        price: selectedPlan.price,
        expiryDate,
        transactionId
    });
    return {
        success: true,
        message: `🎉 Successfully upgraded to ${selectedPlan.displayName}!`,
        subscription: {
            status: student.subscriptionStatus,
            plan: student.subscriptionPlan,
            expiry: student.subscriptionExpiry,
            price: student.subscriptionPrice,
            accessLevels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
        }
    };
};
const cancelSubscription = async (userId) => {
    const student = await student_model_1.Student.findOne({ user: userId });
    if (!student) {
        throw new Error('Student profile not found');
    }
    if (student.subscriptionPlan === 'lifetime') {
        throw new Error('Lifetime subscriptions cannot be cancelled');
    }
    student.subscriptionStatus = 'free';
    student.subscriptionPlan = null;
    student.subscriptionExpiry = null;
    await student.save();
    logger_1.default.info(`User ${userId} cancelled subscription`);
    return {
        success: true,
        message: 'Subscription cancelled. You now have access to A1 and A2 lessons only.',
        subscription: {
            status: student.subscriptionStatus,
            plan: null,
            accessLevels: ['A1', 'A2']
        }
    };
};
const hasActivePremium = async (userId) => {
    const student = await student_model_1.Student.findOne({ user: userId });
    if (!student || student.subscriptionStatus !== 'premium') {
        return false;
    }
    if (student.subscriptionPlan === 'lifetime') {
        return true;
    }
    if (student.subscriptionExpiry) {
        return new Date() < student.subscriptionExpiry;
    }
    return false;
};
exports.SubscriptionServices = {
    getSubscriptionPlans,
    getSubscriptionStatus,
    upgradeToPremium,
    cancelSubscription,
    hasActivePremium
};
//# sourceMappingURL=subscription.service.js.map
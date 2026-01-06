"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresPremium = exports.getPlanByName = exports.SUBSCRIPTION_PLANS = exports.FREE_LEVELS = exports.PREMIUM_LEVELS = void 0;
exports.PREMIUM_LEVELS = ['B1', 'B2', 'C1', 'C2'];
exports.FREE_LEVELS = ['A1', 'A2'];
exports.SUBSCRIPTION_PLANS = [
    {
        name: 'monthly',
        displayName: 'Monthly Plan',
        price: 399,
        durationDays: 30,
        features: [
            'Access to B1, B2, C1, C2 lessons',
            'Unlimited audio lessons',
            'Translation feature',
            'Progress tracking',
            'Email support'
        ]
    },
    {
        name: 'yearly',
        displayName: 'Yearly Plan',
        price: 3999,
        durationDays: 365,
        discount: 'Save 17%',
        features: [
            'All Monthly features',
            'Priority email support',
            'Early access to new features',
            'Downloadable resources',
            'Certificate of completion'
        ]
    },
    {
        name: 'lifetime',
        displayName: 'Lifetime Access',
        price: 7999,
        durationDays: null,
        discount: 'Best Value',
        features: [
            'All Yearly features',
            'Lifetime access - Pay once',
            'Future updates included',
            'Premium support',
            'Exclusive community access',
            'All future content free'
        ]
    }
];
const getPlanByName = (planName) => {
    return exports.SUBSCRIPTION_PLANS.find(plan => plan.name === planName);
};
exports.getPlanByName = getPlanByName;
const requiresPremium = (level) => {
    return exports.PREMIUM_LEVELS.includes(level);
};
exports.requiresPremium = requiresPremium;
//# sourceMappingURL=subscription.constant.js.map
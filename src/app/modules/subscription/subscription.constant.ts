import { ISubscriptionPlan } from './subscription.interface';

// Define premium levels (B1 and above require subscription)
export const PREMIUM_LEVELS = ['B1', 'B2', 'C1', 'C2'];
export const FREE_LEVELS = ['A1', 'A2'];

// Pricing Plans for Bangladesh (BDT)
export const SUBSCRIPTION_PLANS: ISubscriptionPlan[] = [
  {
    name: 'monthly',
    displayName: 'Monthly Plan',
    price: 399, // BDT
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
    price: 3999, // BDT (Save 17% - ~333/month)
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
    price: 7999, // BDT (One-time payment)
    durationDays: null, // Never expires
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

// Helper function to get plan by name
export const getPlanByName = (planName: string): ISubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.name === planName);
};

// Helper function to check if level requires premium
export const requiresPremium = (level: string): boolean => {
  return PREMIUM_LEVELS.includes(level);
};

import { Student } from '../student/student.model';
import { SUBSCRIPTION_PLANS, getPlanByName } from './subscription.constant';
import { TSubscriptionPlan } from './subscription.interface';
import logger from '../../utils/logger';

// Get all available subscription plans
const getSubscriptionPlans = async () => {
  return {
    plans: SUBSCRIPTION_PLANS,
    currency: 'BDT',
    freeLevels: ['A1', 'A2'],
    premiumLevels: ['B1', 'B2', 'C1', 'C2']
  };
};

// Get current subscription status
const getSubscriptionStatus = async (userId: string) => {
  const student = await Student.findOne({ user: userId });
  
  if (!student) {
    throw new Error('Student profile not found');
  }

  const isPremium = student.subscriptionStatus === 'premium';
  const now = new Date();
  const isExpired = student.subscriptionExpiry && now > student.subscriptionExpiry;
  const isActive = isPremium && (!student.subscriptionExpiry || !isExpired);

  // Auto-downgrade if expired (except lifetime)
  if (isExpired && student.subscriptionPlan !== 'lifetime') {
    student.subscriptionStatus = 'free';
    student.subscriptionPlan = null;
    await student.save();
    
    logger.info(`Subscription expired for user ${userId}, downgraded to free`);
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

// Upgrade to premium (Mock payment for development)
const upgradeToPremium = async (userId: string, plan: TSubscriptionPlan, transactionId?: string) => {
  const student = await Student.findOne({ user: userId });
  
  if (!student) {
    throw new Error('Student profile not found');
  }

  const selectedPlan = getPlanByName(plan);
  
  if (!selectedPlan) {
    throw new Error('Invalid subscription plan');
  }

  // Calculate expiry date
  let expiryDate: Date | null = null;
  if (selectedPlan.durationDays) {
    expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + selectedPlan.durationDays);
  }
  // null for lifetime

  // Update subscription
  student.subscriptionStatus = 'premium';
  student.subscriptionPlan = plan;
  student.subscriptionExpiry = expiryDate;
  student.subscriptionPrice = selectedPlan.price;
  await student.save();

  logger.info(`User ${userId} upgraded to ${plan} plan`, {
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

// Cancel subscription
const cancelSubscription = async (userId: string) => {
  const student = await Student.findOne({ user: userId });
  
  if (!student) {
    throw new Error('Student profile not found');
  }

  if (student.subscriptionPlan === 'lifetime') {
    throw new Error('Lifetime subscriptions cannot be cancelled');
  }

  // Downgrade to free
  student.subscriptionStatus = 'free';
  student.subscriptionPlan = null;
  student.subscriptionExpiry = null;
  await student.save();

  logger.info(`User ${userId} cancelled subscription`);

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

// Check if user has active premium subscription
const hasActivePremium = async (userId: string): Promise<boolean> => {
  const student = await Student.findOne({ user: userId });
  
  if (!student || student.subscriptionStatus !== 'premium') {
    return false;
  }

  // Lifetime subscriptions never expire
  if (student.subscriptionPlan === 'lifetime') {
    return true;
  }

  // Check if not expired
  if (student.subscriptionExpiry) {
    return new Date() < student.subscriptionExpiry;
  }

  return false;
};

export const SubscriptionServices = {
  getSubscriptionPlans,
  getSubscriptionStatus,
  upgradeToPremium,
  cancelSubscription,
  hasActivePremium
};

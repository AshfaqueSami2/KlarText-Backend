import express from 'express';
import { SubscriptionControllers } from './subscription.controller';
import { auth } from '../../middleWares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Get all subscription plans (Public - anyone can view pricing)
router.get(
  '/plans',
  SubscriptionControllers.getPlans
);

// Get current subscription status (Student only)
router.get(
  '/status',
  auth(USER_ROLE.STUDENT),
  SubscriptionControllers.getStatus
);

// Upgrade to premium (Student only)
router.post(
  '/upgrade',
  auth(USER_ROLE.STUDENT),
  SubscriptionControllers.upgrade
);

// Cancel subscription (Student only)
router.post(
  '/cancel',
  auth(USER_ROLE.STUDENT),
  SubscriptionControllers.cancel
);

export const SubscriptionRoutes = router;

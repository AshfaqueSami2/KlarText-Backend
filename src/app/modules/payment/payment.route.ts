import express from 'express';
import { PaymentControllers } from './payment.controller';
import { auth } from '../../middleWares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Initialize payment (Student only)
router.post(
  '/init',
  auth(USER_ROLE.STUDENT),
  PaymentControllers.initPayment
);

// SSLCommerz callback URLs (Public - no auth required)
router.post('/success', PaymentControllers.paymentSuccess);
router.post('/fail', PaymentControllers.paymentFail);
router.post('/cancel', PaymentControllers.paymentCancel);
router.post('/ipn', PaymentControllers.paymentIPN);

export const PaymentRoutes = router;

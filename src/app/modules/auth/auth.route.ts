import express from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middleWares/validateRequest';
import { AuthValidation } from './auth.validation';
import passport from '../../config/passport';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/logout',
  AuthControllers.logoutUser,
);

// 🆕 Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
  AuthControllers.googleCallback
);

router.get(
  '/google/failure',
  AuthControllers.googleFailure
);

// 🔧 Debug endpoint to check OAuth config
router.get('/oauth-debug', (req, res) => {
  const config = require('../../config').default;
  res.json({
    message: 'OAuth Configuration Check',
    google: {
      clientId: config.google?.client_id ? '✅ Configured' : '❌ Missing',
      clientSecret: config.google?.client_secret ? '✅ Configured' : '❌ Missing',
      callbackUrl: config.google?.callback_url || '❌ Missing',
    },
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

export const AuthRoutes = router;
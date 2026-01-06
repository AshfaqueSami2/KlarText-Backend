import { Request, Response } from 'express';

import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;

    // Set Refresh Token in Cookie (Secure)
    res.cookie('refreshToken', refreshToken, {
      secure: config.env === 'development',
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'User is logged in successfully!',
      data: {
        accessToken,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthServices.logoutUser();

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      secure: config.env === 'production',
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'User logged out successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🆕 Google OAuth Success Callback
const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user; // Set by Passport.js
    
    if (!user) {
      return res.redirect(`${config.client_url}/auth/error?message=Authentication failed`);
    }

    const result = await AuthServices.googleAuthSuccess(user);
    const { refreshToken, accessToken } = result;

    // Set Refresh Token in Cookie (Secure)
    res.cookie('refreshToken', refreshToken, {
      secure: config.env === 'production',
      httpOnly: true,
    });

    // Redirect to frontend with access token and user info
    const redirectUrl = `${config.client_url}/auth/success?token=${accessToken}&student_id=${result.user.student?.id || ''}`;
    res.redirect(redirectUrl);
    
  } catch (err: any) {
    console.error('❌ Google OAuth Callback Error:', err);
    res.redirect(`${config.client_url}/auth/error?message=${encodeURIComponent(err.message)}`);
  }
};

// 🆟 Google OAuth Failure Callback  
const googleFailure = (req: Request, res: Response) => {
  res.redirect(`${config.client_url}/auth/error?message=Google authentication failed`);
};

export const AuthControllers = {
  loginUser,
  logoutUser,
  googleCallback,
  googleFailure,
};
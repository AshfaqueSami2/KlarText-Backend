
import config from '../../config';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  // 1. Check if user exists (Using our DRY Model Method)
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new Error('User does not exist!');
  }

  if (user.isDeleted) {
    throw new Error('This user is deleted!');
  }

  // 2. Check Password (Using our DRY Model Method)
  if (!user.password) {
    throw new Error('User has no password set (Google OAuth user). Please use Google Sign-In.');
  }
  const isPasswordMatched = await user.isPasswordMatched(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new Error('Password do not match');
  }

  // 3. Create Tokens (Using our DRY Util)
  const jwtPayload = {
    userId: user._id.toString(), // Convert ObjectId to string
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.secret as string,
    config.jwt.expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange, // Optional feature
  };
};

const logoutUser = async () => {
  // For JWT-based auth, logout is mainly handled client-side
  // Server-side logout can involve token blacklisting if needed
  return {
    message: 'Logged out successfully'
  };
};

// 🆕 Google OAuth Success Handler
const googleAuthSuccess = async (user: any) => {
  // Create JWT tokens for Google authenticated user
  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.secret as string,
    config.jwt.expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      student: user.student,
    },
    authMethod: 'google',
    needsPasswordChange: false,
    message: 'Google authentication successful! Welcome to KlarText! 🎉',
  };
};

export const AuthServices = {
  loginUser,
  logoutUser,
  googleAuthSuccess,
};
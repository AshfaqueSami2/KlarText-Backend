
import config from '../../config';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';
import bcrypt from 'bcrypt';

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
    needsPasswordChange: user.needsPasswordChange, // True for Google users who haven't set password
    message: 'Google authentication successful! Welcome to KlarText! 🎉',
  };
};

// 🔐 Change Password (for manual signup users who already have a password)
const changePassword = async (
  userId: string, 
  currentPassword: string, 
  newPassword: string
) => {
  // 1. Get user with password
  const user = await User.findById(userId).select('+password');
  
  if (!user) {
    throw new Error('User not found');
  }

  // 2. Check if user has a password (manual signup)
  if (!user.password) {
    throw new Error('You signed up with Google. Please use "Set Password" instead.');
  }

  // 3. Verify current password
  const isPasswordMatched = await user.isPasswordMatched(currentPassword, user.password);
  if (!isPasswordMatched) {
    throw new Error('Current password is incorrect');
  }

  // 4. Hash and update new password
  const hashedPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));
  
  await User.findByIdAndUpdate(userId, { 
    password: hashedPassword,
    needsPasswordChange: false 
  });

  return { message: 'Password changed successfully!' };
};

// 🔐 Set Password (for Google OAuth users setting their first password)
const setPassword = async (userId: string, newPassword: string) => {
  // 1. Get user
  const user = await User.findById(userId).select('+password');
  
  if (!user) {
    throw new Error('User not found');
  }

  // 2. Check if user is a Google OAuth user
  if (!user.googleId) {
    throw new Error('You signed up with email/password. Please use "Change Password" instead.');
  }

  // 3. Check if password already set
  if (user.password && !user.needsPasswordChange) {
    throw new Error('Password already set. Use "Change Password" to update it.');
  }

  // 4. Hash and set password
  const hashedPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));
  
  await User.findByIdAndUpdate(userId, { 
    password: hashedPassword,
    needsPasswordChange: false 
  });

  return { message: 'Password set successfully! You can now login with email/password too.' };
};

export const AuthServices = {
  loginUser,
  logoutUser,
  googleAuthSuccess,
  changePassword,
  setPassword,
};
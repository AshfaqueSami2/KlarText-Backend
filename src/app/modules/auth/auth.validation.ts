import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    
    password: z
      .string({ message: 'Password is required' })
      .min(1, { message: 'Password cannot be empty' }),
  }),
});

// For manual users who want to change their existing password
const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({ message: 'Current password is required' })
      .min(1, { message: 'Current password cannot be empty' }),
    
    newPassword: z
      .string({ message: 'New password is required' })
      .min(6, { message: 'New password must be at least 6 characters' }),
    
    confirmPassword: z
      .string({ message: 'Confirm password is required' }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirm password do not match',
    path: ['confirmPassword'],
  }),
});

// For Google OAuth users setting their first password
const setPasswordSchema = z.object({
  body: z.object({
    newPassword: z
      .string({ message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' }),
    
    confirmPassword: z
      .string({ message: 'Confirm password is required' }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password and confirm password do not match',
    path: ['confirmPassword'],
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordSchema,
  setPasswordSchema,
};
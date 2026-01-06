import { Types } from 'mongoose';
import { GERMAN_LEVELS } from '../user/user.constant';

// Type for German levels
export type TStudentLevel = (typeof GERMAN_LEVELS)[number];

export interface IStudent {
  user: Types.ObjectId; // Reference to User
  
  // All user fields except role
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  
  // Student specific fields
  currentLevel: TStudentLevel | null;
  coins: number;
  
  // Subscription fields
  subscriptionStatus: 'free' | 'premium';
  subscriptionPlan?: 'monthly' | 'yearly' | 'lifetime' | null;
  subscriptionExpiry?: Date | null;
  subscriptionPrice?: number; // Price paid in BDT
  
  // Common fields
  isDeleted: boolean;
  needsPasswordChange: boolean;
}
import { Types, Model } from 'mongoose';
import { TUserRole } from './user.constant';

// 1. Main User Interface
export interface IUser {
  _id: Types.ObjectId;
  id:string,
  name: string;
  email: string;
  password?: string; // Optional for Google OAuth users
  googleId?: string; // Google OAuth ID
  role: TUserRole;
  profileImage?: string;
  isDeleted: boolean;
  needsPasswordChange: boolean;
}

// Instance methods interface
export interface IUserMethods {
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}

// Static methods interface  
export interface UserModel extends Model<IUser, {}, IUserMethods> {
  isUserExistsByEmail(email: string): Promise<(IUser & IUserMethods) | null>;
}

// 2. The Input Types (What comes from the frontend)
export type TCreateUserPayload = {
  name: string;
  email: string;
  password?: string;
  role: TUserRole;
  profileImage?: string;
  // Specific fields
  currentLevel?: string;
};
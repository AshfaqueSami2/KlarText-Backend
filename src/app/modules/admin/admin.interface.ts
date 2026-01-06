import { Types } from "mongoose";

export interface IAdmin {
  user: Types.ObjectId; // Reference to User
  
  // All user fields except role
  id: string;
  name: string;
  email: string;
  profileImage?: string;
 
  
  // Common fields
  isDeleted: boolean;
  needsPasswordChange: boolean;
}
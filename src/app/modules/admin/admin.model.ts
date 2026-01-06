import { Schema, model, } from 'mongoose';
import { IAdmin } from './admin.interface';



const adminSchema = new Schema<IAdmin>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // All user fields except role
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  profileImage: { type: String, default: '' },
  
  // Admin specific fields
 
  // Common fields
  isDeleted: { type: Boolean, default: false },
  needsPasswordChange: { type: Boolean, default: true },
}, { timestamps: true });

export const Admin = model('Admin', adminSchema);
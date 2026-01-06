import { Schema, model } from 'mongoose';
import { IStudent } from './student.interface';
import { GERMAN_LEVELS } from '../user/user.constant';

const studentSchema = new Schema<IStudent>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // All user fields except role
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  profileImage: { type: String, default: '' },
  
  // Student specific fields
  currentLevel: { 
    type: String, 
    enum: GERMAN_LEVELS,
    required: false,
    default: null
  },
  coins: { type: Number, default: 0 },
  
  // Subscription fields
  subscriptionStatus: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  subscriptionPlan: {
    type: String,
    enum: ['monthly', 'yearly', 'lifetime'],
    default: null
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  subscriptionPrice: {
    type: Number,
    default: 0
  },
  
  // Common fields
  isDeleted: { type: Boolean, default: false },
  needsPasswordChange: { type: Boolean, default: true },
}, { timestamps: true });

// ============================================
// 📊 INDEXES FOR QUERY OPTIMIZATION
// ============================================
// Note: user already indexed via unique: true in schema
studentSchema.index({ email: 1 }); // Email lookups
studentSchema.index({ currentLevel: 1 }); // Filter by level
studentSchema.index({ isDeleted: 1 }); // Filter deleted students
studentSchema.index({ coins: -1 }); // Leaderboard sorting

export const Student = model<IStudent>('Student', studentSchema);
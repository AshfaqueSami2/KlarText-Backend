import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { IUser, IUserMethods, UserModel } from './user.interface';
import { USER_ROLE } from './user.constant';

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function(this: IUser) {
      // Password not required for Google OAuth users
      return !this.googleId;
    },
    select: false // Don't return password by default
  },
  googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
  role: { 
    type: String, 
    enum: Object.values(USER_ROLE), 
    required: true 
  },
  profileImage: { type: String, default: '' },
  needsPasswordChange: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for student relationship
userSchema.virtual('student', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

//  Hash password before saving
userSchema.pre('save', async function () {
  // Skip hashing if password is not modified or doesn't exist (Google OAuth users)
  if (!this.isModified('password') || !this.password) return;
  
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
});

// Check if user exists by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email }).select('+password'); // Include password for comparison
};

// Check if password matches
userSchema.methods.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// ============================================
// 📊 INDEXES FOR QUERY OPTIMIZATION
// ============================================
// Note: email and googleId already indexed via unique: true in schema
userSchema.index({ role: 1 }); // Filter by role
userSchema.index({ isDeleted: 1 }); // Filter deleted users
userSchema.index({ createdAt: -1 }); // Sort by creation date

export const User = model<IUser, UserModel>('User', userSchema);
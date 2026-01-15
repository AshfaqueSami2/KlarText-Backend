import mongoose from 'mongoose';
import config from '../../config';
import { User } from './user.model';
import { Admin } from '../admin/admin.model';
import { Student } from '../student/student.model';
import { IUser, TCreateUserPayload } from './user.interface';
import { USER_ROLE } from './user.constant';
import { generateAdminId, generateStudentId } from './user.utils';

const createStudentIntoDB = async (payload: TCreateUserPayload & { googleId?: string }) => {
  // create a user object
  const userData: Partial<IUser> = {};

  // set user data
  if (payload.googleId) {
    // Google OAuth user - no password needed
    userData.googleId = payload.googleId;
    userData.needsPasswordChange = true;
  } else {
    // Regular user - set password
    userData.password = payload.password || (config.default_pass as string);
    userData.needsPasswordChange = false;
  }
  
  userData.role = USER_ROLE.STUDENT;
  userData.email = payload.email;
  userData.name = payload.name;

  // PRECHECKS: ensure email is unique before creating any records
  const existingStudentByEmail = await Student.findOne({
    email: payload.email,
  }).lean();
  
  if (existingStudentByEmail) {
    throw new Error(`Student with email ${payload.email} already exists`);
  }

  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    // Generate student ID
    userData.id = await generateStudentId();

    // create user inside transaction
    const [createdUser] = await User.create([userData], { session });

    if (!createdUser) {
      throw new Error('Failed to create user');
    }

    // prepare student payload
    const studentPayload = {
      user: createdUser._id,
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      profileImage: payload.profileImage || '',
      currentLevel: payload.currentLevel ?? null,
      coins: 50, // 🎉 Welcome bonus for all new students!
      isDeleted: false,
      needsPasswordChange: payload.googleId ? true : false,
    };

    // create student inside transaction
    const [createdStudent] = await Student.create([studentPayload], { session });

    if (!createdStudent) {
      throw new Error('Failed to create student');
    }

    // commit and return
    await session.commitTransaction();
    await session.endSession();
    return createdStudent;
  } catch (err) {
    // abort on any error to avoid orphaned users
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

const createAdminIntoDB = async (payload: TCreateUserPayload) => {
  // create a user object
  const userData: Partial<IUser> = {};

  // set user data
  userData.password = payload.password || (config.default_pass as string);
  userData.role = USER_ROLE.ADMIN;
  userData.email = payload.email;
  userData.name = payload.name;

  // PRECHECKS: ensure email is unique before creating any records
  const existingAdminByEmail = await Admin.findOne({
    email: payload.email,
  }).lean();
  
  if (existingAdminByEmail) {
    throw new Error(`Admin with email ${payload.email} already exists`);
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Generate admin ID
    userData.id = await generateAdminId();

    // create user inside transaction
    const [createdUser] = await User.create([userData], { session });

    if (!createdUser) {
      throw new Error('Failed to create user');
    }

    // prepare admin payload
    const adminPayload = {
      user: createdUser._id,
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      profileImage: payload.profileImage || '',
      department: 'General',
      isDeleted: false,
      needsPasswordChange: true,
    };

    // create admin inside transaction
    const [createdAdmin] = await Admin.create([adminPayload], { session });

    if (!createdAdmin) {
      throw new Error('Failed to create admin');
    }

    // commit and return
    await session.commitTransaction();
    await session.endSession();
    return createdAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};



// Main function that routes to appropriate creation function
const createUserIntoDB = async (payload: TCreateUserPayload) => {
  if (payload.role === USER_ROLE.ADMIN) {
    return await createAdminIntoDB(payload);
  } else if (payload.role === USER_ROLE.STUDENT) {
    return await createStudentIntoDB(payload);
  } else {
    // If no role provided (common in public registration), default to student
    return await createStudentIntoDB(payload);
  }
};





const getMe = async (userId: string, role: string) => {
  let result = null;

  // 1. If Student, fetch from Student collection
  if (role === USER_ROLE.STUDENT) {
    result = await Student.findOne({ user: userId }).populate('user');
  }

  // 2. If Admin, fetch from Admin collection
  if (role === USER_ROLE.ADMIN) {
    result = await Admin.findOne({ user: userId }).populate('user');
  }

  // 3. Fallback (just in case)
  if (!result) {
    throw new Error('User profile not found');
  }

  return result;
};

const updateProfile = async (userId: string, role: string, payload: { name?: string; profileImage?: string; bio?: string }) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    // Update User model (name)
    if (payload.name) {
      await User.findByIdAndUpdate(
        userId,
        { name: payload.name },
        { session, new: true }
      );
    }

    // Update Student or Admin model (profileImage, bio)
    let updatedProfile;
    
    if (role === USER_ROLE.STUDENT) {
      const updateData: any = {};
      if (payload.name) updateData.name = payload.name;
      if (payload.profileImage) updateData.profileImage = payload.profileImage;
      if (payload.bio !== undefined) updateData.bio = payload.bio;

      updatedProfile = await Student.findOneAndUpdate(
        { user: userId },
        updateData,
        { session, new: true }
      ).populate('user');
    } else if (role === USER_ROLE.ADMIN) {
      const updateData: any = {};
      if (payload.name) updateData.name = payload.name;
      if (payload.profileImage) updateData.profileImage = payload.profileImage;
      if (payload.bio !== undefined) updateData.bio = payload.bio;

      updatedProfile = await Admin.findOneAndUpdate(
        { user: userId },
        updateData,
        { session, new: true }
      ).populate('user');
    }

    if (!updatedProfile) {
      throw new Error('Profile not found');
    }

    await session.commitTransaction();
    await session.endSession();
    
    return updatedProfile;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const UserServices = {
  createUserIntoDB,
  createStudentIntoDB,
  createAdminIntoDB,
  getMe,
  updateProfile,
};
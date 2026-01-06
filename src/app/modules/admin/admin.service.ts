import mongoose from 'mongoose';
import { Admin } from './admin.model';
import { User } from '../user/user.model';

type TAdminUpdatePayload = {
  name?: string;
  profileImage?: string;
  department?: string;
};

const updateAdminIntoDB = async (id: string, payload: TAdminUpdatePayload) => {
  const isAdminExists = await Admin.findById(id);
  if (!isAdminExists) {
    throw new Error('Admin not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Prepare updates for both collections
    const userUpdateData: any = {};
    const adminUpdateData: any = {};

    // Separate shared fields (that exist in both User and Admin) from admin-specific fields
    if (payload.name) {
      userUpdateData.name = payload.name;
      adminUpdateData.name = payload.name;
    }
    
    if (payload.profileImage) {
      userUpdateData.profileImage = payload.profileImage;
      adminUpdateData.profileImage = payload.profileImage;
    }

    // Add admin-specific fields
    if (payload.department) {
      adminUpdateData.department = payload.department; // Only update in Admin collection
    }

    // Update User collection with shared fields
    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(
        isAdminExists.user,
        userUpdateData,
        { new: true, runValidators: true, session }
      );
    }

    // Update Admin collection with all relevant fields
    if (Object.keys(adminUpdateData).length > 0) {
      await Admin.findByIdAndUpdate(
        id,
        adminUpdateData,
        { new: true, runValidators: true, session }
      );
    }

    await session.commitTransaction();
    await session.endSession();

    // Return updated admin with populated user
    const result = await Admin.findById(id).populate('user');
    return result;

  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

export const AdminServices = {
  updateAdminIntoDB,
};
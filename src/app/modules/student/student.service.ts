// import mongoose from 'mongoose';
// import { Student } from './student.model';
// import { User } from '../user/user.model';

// type TStudentUpdatePayload = {
//   name?: string;
//   profileImage?: string;
//   bio?: string;
// };

// const updateStudentIntoDB = async (id: string, payload: TStudentUpdatePayload) => {
//   const isStudentExists = await Student.findById(id);
//   if (!isStudentExists) {
//     throw new Error('Student not found');
//   }

//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     // Prepare updates for both collections
//     const userUpdateData: any = {};
//     const studentUpdateData: any = {};

//     // Separate shared fields (that exist in both User and Student) from student-specific fields
//     if (payload.name) {
//       userUpdateData.name = payload.name;
//       studentUpdateData.name = payload.name;
//     }
    
//     if (payload.profileImage) {
//       userUpdateData.profileImage = payload.profileImage;
//       studentUpdateData.profileImage = payload.profileImage;
//     }

//     // Add any student-specific fields here
//     if (payload.bio) {
//       studentUpdateData.bio = payload.bio; // Only update in Student collection if bio is student-specific
//     }

//     // Update User collection with shared fields
//     if (Object.keys(userUpdateData).length > 0) {
//       await User.findByIdAndUpdate(
//         isStudentExists.user,
//         userUpdateData,
//         { new: true, runValidators: true, session }
//       );
//     }

//     // Update Student collection with all relevant fields
//     if (Object.keys(studentUpdateData).length > 0) {
//       await Student.findByIdAndUpdate(
//         id,
//         studentUpdateData,
//         { new: true, runValidators: true, session }
//       );
//     }

//     await session.commitTransaction();
//     await session.endSession();

//     // Return updated student with populated user
//     const result = await Student.findById(id).populate('user');
//     return result;

//   } catch (err) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw err;
//   }
// };

// export const StudentServices = {
//   updateStudentIntoDB,
// };



import mongoose from 'mongoose';
import { Student } from './student.model';
import { User } from '../user/user.model';

type TStudentUpdatePayload = {
  name?: string;
  profileImage?: string;
  bio?: string;
  currentLevel?: string; // 👈 Added this
};

const updateStudentIntoDB = async (id: string, payload: TStudentUpdatePayload) => {
  const isStudentExists = await Student.findById(id);
  if (!isStudentExists) {
    throw new Error('Student not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userUpdateData: any = {};
    const studentUpdateData: any = {};

    // Shared fields
    if (payload.name) {
      userUpdateData.name = payload.name;
      studentUpdateData.name = payload.name;
    }
    if (payload.profileImage) {
      userUpdateData.profileImage = payload.profileImage;
      studentUpdateData.profileImage = payload.profileImage;
    }

    // Student specific fields
    if (payload.bio) studentUpdateData.bio = payload.bio;
    
    // 👈 FIX: Add Level Update Logic
    if (payload.currentLevel) {
      studentUpdateData.currentLevel = payload.currentLevel;
    }

    // Update User
    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(isStudentExists.user, userUpdateData, { new: true, session });
    }

    // Update Student
    if (Object.keys(studentUpdateData).length > 0) {
      await Student.findByIdAndUpdate(id, studentUpdateData, { new: true, session });
    }

    await session.commitTransaction();
    await session.endSession();

    return await Student.findById(id).populate('user');

  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

// ✨ NEW: Helper to find student by USER ID (from token)
const getStudentByUserId = async (userId: string) => {
  return await Student.findOne({ user: userId });
}

export const StudentServices = {
  updateStudentIntoDB,
  getStudentByUserId
};
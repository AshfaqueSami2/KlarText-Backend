import { Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { HttpStatus } from "http-status-ts";
import logger from "../../utils/logger";

const createUser = catchAsync(async (req: Request, res: Response) => {
  let profileImageUrl = '';
  
  // Handle image upload if provided
  if (req.file) {
    try {
      logger.debug('File received for upload', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      const fileName = `student_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const uploadResult = await uploadImageToCloudinary(req.file.buffer, fileName);
      profileImageUrl = uploadResult.secure_url;
      
      logger.info('Profile image uploaded successfully');
    } catch (error) {
      logger.error('Cloudinary upload error', { error });
      // Continue with student creation even if image upload fails
    }
  } else {
    logger.debug('No file received in request');
  }

  // Add profile image URL to request body
  const userData = {
    ...req.body,
    profileImage: profileImageUrl
  };

  logger.debug('Creating student', { email: userData.email });

  const result = await UserServices.createStudentIntoDB(userData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Student created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  let profileImageUrl = '';
  
  // Handle image upload if provided
  if (req.file) {
    const fileName = `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const uploadResult = await uploadImageToCloudinary(req.file.buffer, fileName);
    profileImageUrl = uploadResult.secure_url;
  }

  // Add profile image URL to request body
  const userData = {
    ...req.body,
    profileImage: profileImageUrl
  };

  const result = await UserServices.createAdminIntoDB(userData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});


const getMe = catchAsync(async (req: Request, res: Response) => {
  // req.user is set by the auth middleware
  const user = req.user as { userId: string; role: string } | undefined;
  if (!user?.userId || !user?.role) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  const { userId, role } = user; 

  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as { userId: string; role: string } | undefined;
  if (!user?.userId || !user?.role) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  const { userId, role } = user;

  let profileImageUrl = '';
  
  // Handle image upload if provided
  if (req.file) {
    const fileName = `profile_${userId}_${Date.now()}`;
    const uploadResult = await uploadImageToCloudinary(req.file.buffer, fileName);
    profileImageUrl = uploadResult.secure_url;
    logger.info('Profile image updated successfully', { userId });
  }

  // Merge uploaded image URL with request body
  const updateData = {
    ...req.body,
    ...(profileImageUrl && { profileImage: profileImageUrl })
  };

  const result = await UserServices.updateProfile(userId, role, updateData);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});


export const UserControllers = {
  createUser,
  createAdmin,
  getMe,
  updateProfile,
};

import { Request, Response } from "express";
import { LessonServices } from "./lesson.service";
import sendResponse from "../../utils/sendResponse";
import { HttpStatus } from "http-status-ts";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../Error/AppError";
import logger from "../../utils/logger";

const createLesson = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  let coverImageUrl = '';
  
  // Handle cover image upload if provided
  if (req.file) {
    try {
      console.log('Lesson cover image received:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      const fileName = `lesson_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      console.log('Uploading lesson cover to Cloudinary with filename:', fileName);
      
      const uploadResult = await uploadImageToCloudinary(req.file.buffer, fileName, 'klartext/lessons');
      coverImageUrl = uploadResult.secure_url;
      
      console.log('Lesson cover Cloudinary upload successful:', coverImageUrl);
    } catch (error) {
      console.error('Lesson cover Cloudinary upload error:', error);
      // Continue with lesson creation even if image upload fails
    }
  }

  // Add cover image URL and admin ID to request body
  const lessonData = {
    ...req.body,
    coverImage: coverImageUrl,
    admin: req.user.userId // Capture admin's user ID from auth token
  };

  const result = await LessonServices.createLessonIntoDB(lessonData);
  
  // Format response with audio status for frontend
  const responseData = {
    ...result.toObject(),
    audioUrl: result.audioUrl || null,
    audioStatus: result.audioStatus || 'pending',
    message: result.isPublished ? 'Lesson created successfully. Audio generation started.' : 'Lesson created successfully.'
  };
  
  sendResponse(res, {
    statusCode: HttpStatus.CREATED,
    success: true,
    message: result.isPublished ? "Lesson created and audio generation started" : "Lesson created successfully",
    data: responseData,
  });
});

const getAllLessons = catchAsync(async (req: Request, res: Response) => {
  const result = await LessonServices.getAllLessonsFromDB(req.query);

  // Ensure each lesson includes audio fields for frontend (lean() returns plain objects)
  const lessonsWithAudio = result.data.map(lesson => ({
    ...lesson,
    audioUrl: lesson.audioUrl || null,
    audioStatus: lesson.audioStatus || 'pending'
  }));

  // Set pagination headers for client convenience
  res.set('X-Total-Count', String(result.meta.total));
  res.set('X-Page-Count', String(result.meta.totalPages));

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Lessons fetched successfully",
    data: lessonsWithAudio,
    meta: result.meta,
  });
});

//update
const updateLesson = catchAsync(async (req: Request, res: Response) => {
  const { lessonId } = req.params;
  let updateData = { ...req.body };
  
  // Handle cover image upload if provided
  if (req.file) {
    try {
      console.log('Lesson cover image update received:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      const fileName = `lesson_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const uploadResult = await uploadImageToCloudinary(req.file.buffer, fileName, 'klartext/lessons');
      updateData.coverImage = uploadResult.secure_url;
      
      console.log('Lesson cover update Cloudinary upload successful:', updateData.coverImage);
    } catch (error) {
      console.error('Lesson cover update Cloudinary upload error:', error);
      // Continue with lesson update even if image upload fails
    }
  }

  const result = await LessonServices.updateLessonInDB(lessonId, updateData);

  // Format response with audio status
  const responseData = {
    ...result!.toObject(),
    audioUrl: result!.audioUrl || null,
    audioStatus: result!.audioStatus || 'pending'
  };

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Lesson updated successfully",
    data: responseData,
  });
});

//delete
const deleteLesson = catchAsync(async (req: Request, res: Response) => {
  const { lessonId } = req.params;
  const result = await LessonServices.deleteLessonFromDB(lessonId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Lesson deleted successfully",
    data: result,
  });
});

// Get single lesson with audio status
const getLessonById = catchAsync(async (req: Request, res: Response) => {
  const { lessonId } = req.params;
  const result = await LessonServices.getLessonByIdFromDB(lessonId);
  
  if (!result) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Lesson not found');
  }

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Lesson fetched successfully",
    data: result,
  });
});

// Regenerate audio for a lesson (Admin only)
const regenerateAudio = catchAsync(async (req: Request, res: Response) => {
  const { lessonId } = req.params;
  const result = await LessonServices.regenerateAudioForLesson(lessonId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Audio regeneration started",
    data: result,
  });
});

export const LessonControllers = {
  createLesson,
  getAllLessons,
  updateLesson,
  deleteLesson,
  getLessonById,
  regenerateAudio,
};

import { Request, Response } from 'express';
import { LessonProgressServices } from './lessonProgress.service';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const markComplete = catchAsync(async (req: Request, res: Response) => {
  const { lessonId } = req.body;
  const user = req.user as { userId: string; role: string } | undefined;
  const userId = user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  const result = await LessonProgressServices.markLessonAsComplete(userId, lessonId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Lesson marked as complete! +10 Coins',
    data: result,
  });
});

const reviewLesson = catchAsync(async (req: Request, res: Response) => {
  const lessonId = req.params.lessonId as string;
  const user = req.user as { userId: string; role: string } | undefined;
  const userId = user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  const result = await LessonProgressServices.reviewCompletedLesson(userId, lessonId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Lesson content retrieved for review',
    data: result,
  });
});

const getMyProgress = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as { userId: string; role: string } | undefined;
  const userId = user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  const result = await LessonProgressServices.getStudentProgress(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Student progress retrieved successfully',
    data: result,
  });
});

const getAvailableLessons = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as { userId: string; role: string } | undefined;
  const userId = user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  const result = await LessonProgressServices.getAvailableLessons(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Available lessons retrieved successfully',
    data: result,
  });
});

export const LessonProgressControllers = { 
  markComplete, 
  reviewLesson,
  getMyProgress,
  getAvailableLessons
};
import { Request, Response } from 'express';
import { AnalyticsServices } from './analytics.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { HttpStatus } from 'http-status-ts';

const getMyStats = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as { userId: string; role: string } | undefined;
  const userId = user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }
  const result = await AnalyticsServices.getStudentAnalytics(userId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'User stats fetched successfully',
    data: result,
  });
});

//only for admin 
const getSystemStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getAdminStats();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'System stats fetched successfully',
    data: result,
  });
});

const getGlobalLeaderboard = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getLeaderboard();

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Leaderboard fetched successfully',
    data: result,
  });
});

const getAllLessonsForAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getAllLessonsForAdmin(req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'All lessons fetched successfully',
    data: result,
  });
});

export const AnalyticsControllers = {
  getMyStats,
  getGlobalLeaderboard,
  getSystemStats,
  getAllLessonsForAdmin,
};
import { Request, Response } from 'express';
import { StreakServices } from './streak.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

// Record daily activity (extends streak)
const recordActivity = async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await StreakServices.recordActivity(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.currentStreak > 1 
      ? `🔥 ${result.currentStreak} day streak! Keep it up!` 
      : 'Activity recorded! Start your streak!',
    data: result,
  });
};

// Get my streak stats
const getMyStreak = async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await StreakServices.getMyStreak(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Streak stats fetched successfully',
    data: result,
  });
};

// Get current streak leaderboard
const getStreakLeaderboard = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await StreakServices.getStreakLeaderboard(limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Streak leaderboard fetched successfully',
    data: result,
  });
};

// Get all-time longest streak leaderboard
const getLongestStreakLeaderboard = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await StreakServices.getLongestStreakLeaderboard(limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All-time streak leaderboard fetched successfully',
    data: result,
  });
};

export const StreakControllers = {
  recordActivity,
  getMyStreak,
  getStreakLeaderboard,
  getLongestStreakLeaderboard,
};

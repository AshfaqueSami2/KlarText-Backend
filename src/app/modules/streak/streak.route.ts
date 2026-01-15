import express from 'express';
import { USER_ROLE } from '../user/user.constant';
import { StreakControllers } from './streak.controller';
import { auth } from '../../middleWares/auth';

const router = express.Router();

// Record activity (call when user does something - lesson, vocab, etc.)
router.post(
  '/record',
  auth(USER_ROLE.STUDENT),
  StreakControllers.recordActivity
);

// Get my streak stats
router.get(
  '/my-streak',
  auth(USER_ROLE.STUDENT),
  StreakControllers.getMyStreak
);

// Get current streak leaderboard (public or auth required based on your preference)
router.get(
  '/leaderboard',
  auth(USER_ROLE.STUDENT),
  StreakControllers.getStreakLeaderboard
);

// Get all-time longest streak leaderboard
router.get(
  '/leaderboard/all-time',
  auth(USER_ROLE.STUDENT),
  StreakControllers.getLongestStreakLeaderboard
);

export const StreakRoutes = router;

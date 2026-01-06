import express from 'express';

import { USER_ROLE } from '../user/user.constant';
import { AnalyticsControllers } from './analytics.controller';
import { auth } from '../../middleWares/auth';


const router = express.Router();


router.get(
  '/dashboard',
  auth(USER_ROLE.STUDENT), // Only logged in students need this
  AnalyticsControllers.getMyStats
);


router.get(
  '/leaderboard',
  AnalyticsControllers.getGlobalLeaderboard // Public or Protected? usually Public is fine
);


router.get(
  '/admin-stats',
  auth(USER_ROLE.ADMIN), // 🔒 CRITICAL: Only Admin can see this
  AnalyticsControllers.getSystemStats
)

router.get(
  '/admin-lessons',
  auth(USER_ROLE.ADMIN), // 🔒 CRITICAL: Only Admin can see this
  AnalyticsControllers.getAllLessonsForAdmin
)

export const AnalyticsRoutes = router;
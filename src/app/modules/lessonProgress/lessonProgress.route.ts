import express from 'express';
import { LessonProgressControllers } from './lessonProgress.controller';

import { USER_ROLE } from '../user/user.constant';
import { auth } from '../../middleWares/auth';

const router = express.Router();


router.post(
  '/complete', 
  auth(USER_ROLE.STUDENT), 
  LessonProgressControllers.markComplete
);

// GET http://localhost:5000/api/v1/progress/review/:lessonId
// Protected Route: Students can review completed lessons
router.get(
  '/review/:lessonId', 
  auth(USER_ROLE.STUDENT), 
  LessonProgressControllers.reviewLesson
);

// GET http://localhost:5000/api/v1/progress/my-progress
// Protected Route: Get student's progress summary
router.get(
  '/my-progress', 
  auth(USER_ROLE.STUDENT), 
  LessonProgressControllers.getMyProgress
);

// GET http://localhost:5000/api/v1/progress/available-lessons
// Protected Route: Get lessons available to student based on their level
router.get(
  '/available-lessons', 
  auth(USER_ROLE.STUDENT), 
  LessonProgressControllers.getAvailableLessons
);

export const LessonProgressRoutes = router;
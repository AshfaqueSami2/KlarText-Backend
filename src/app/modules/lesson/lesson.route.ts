import express from 'express';

import { LessonControllers } from './lesson.controller';
import { LessonValidation } from './lesson.validation';
import validateRequest from '../../middleWares/validateRequest';
import { auth } from '../../middleWares/auth';
import { USER_ROLE } from '../user/user.constant';
import { uploadProfileImage } from '../../utils/cloudinary';
import { parseFormData } from '../../middleWares/parseFormData';
import { cache, invalidateCache } from '../../middleWares/cache';
import { CachePrefix } from '../../config/redis';

const router = express.Router();


router.post(
  '/create-lesson',
  auth(USER_ROLE.ADMIN),
  invalidateCache([`${CachePrefix.LESSON}*`]), // Invalidate lesson cache on create
  uploadProfileImage.single('coverImage'),
  parseFormData,
  validateRequest(LessonValidation.createLessonValidationSchema),
  LessonControllers.createLesson
);

// Cache lesson list for 5 minutes
router.get('/', auth(USER_ROLE.STUDENT), cache.lessons, LessonControllers.getAllLessons);

// Cache individual lessons for 1 hour
router.get(
  '/:lessonId', 
  auth(USER_ROLE.STUDENT), 
  cache.lessons,
  LessonControllers.getLessonById
);

router.post(
  '/:lessonId/regenerate-audio',
  auth(USER_ROLE.ADMIN),
  LessonControllers.regenerateAudio
);

router.put(
  '/:lessonId',
  auth(USER_ROLE.ADMIN),
  invalidateCache([`${CachePrefix.LESSON}*`]), // Invalidate cache on update
  uploadProfileImage.single('coverImage'),
  parseFormData,
  validateRequest(LessonValidation.updateLessonValidationSchema),
  LessonControllers.updateLesson
);


router.delete(
  '/:lessonId',
  auth(USER_ROLE.ADMIN),
  invalidateCache([`${CachePrefix.LESSON}*`]), // Invalidate cache on delete
  LessonControllers.deleteLesson
);

export const LessonRoutes = router;
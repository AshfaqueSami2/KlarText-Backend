import express from 'express';

import { LessonControllers } from './lesson.controller';
import { LessonValidation } from './lesson.validation';
import validateRequest from '../../middleWares/validateRequest';
import { auth } from '../../middleWares/auth';
import { USER_ROLE } from '../user/user.constant';
import { uploadProfileImage } from '../../utils/cloudinary';
import { parseFormData } from '../../middleWares/parseFormData';

const router = express.Router();


router.post(
  '/create-lesson',
  auth(USER_ROLE.ADMIN),
  uploadProfileImage.single('coverImage'),
  parseFormData,
  validateRequest(LessonValidation.createLessonValidationSchema),
  LessonControllers.createLesson
);

router.get('/', auth(USER_ROLE.STUDENT), LessonControllers.getAllLessons);

router.get(
  '/:lessonId', 
  auth(USER_ROLE.STUDENT), 
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
  uploadProfileImage.single('coverImage'),
  parseFormData,
  validateRequest(LessonValidation.updateLessonValidationSchema),
  LessonControllers.updateLesson
);


router.delete(
  '/:lessonId',
  auth(USER_ROLE.ADMIN),
  LessonControllers.deleteLesson
);

export const LessonRoutes = router;
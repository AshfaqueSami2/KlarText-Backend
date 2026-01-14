import express from 'express';
import { UserControllers } from './user.controller';
import { createUserValidationSchema } from './user.validation';
import validateRequest from '../../middleWares/validateRequest';
import { conditionalAuth, auth } from '../../middleWares/auth';
import { USER_ROLE } from './user.constant';
import { uploadProfileImage } from '../../utils/cloudinary';
import { parseFormData } from '../../middleWares/parseFormData';

const router = express.Router();


router.post(
  '/create-student',
  conditionalAuth(),
  uploadProfileImage.single('profileImage'),
  parseFormData,
  validateRequest(createUserValidationSchema),
  UserControllers.createUser
);


router.post(
  '/create-admin',
  // auth(USER_ROLE.ADMIN), 
  uploadProfileImage.single('profileImage'),
  parseFormData,
  validateRequest(createUserValidationSchema),
  UserControllers.createAdmin
);


router.get(
  '/me',
  auth(USER_ROLE.ADMIN, USER_ROLE.STUDENT), // Allow both roles
  UserControllers.getMe
);

router.put(
  '/update-profile',
  auth(USER_ROLE.ADMIN, USER_ROLE.STUDENT), // Allow both roles
  uploadProfileImage.single('profileImage'),
  parseFormData,
  UserControllers.updateProfile
);

export const UserRoutes = router;
// import express from 'express';
// import { StudentControllers } from './student.controller';

// import { StudentValidation } from './student.validation';
// import validateRequest from '../../middleWares/validateRequest';

// const router = express.Router();


// router.patch(
//   '/:id',
//   validateRequest(StudentValidation.updateStudentValidationSchema),
//   StudentControllers.updateStudent
// );

// export const StudentRoutes = router;



import express from 'express';
import { StudentControllers } from './student.controller';
import { auth } from '../../middleWares/auth'; // Your auth middleware
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middleWares/validateRequest';
import { StudentValidation } from './student.validation';

const router = express.Router();

// 1. Specific Routes FIRST
// PATCH http://localhost:5000/api/v1/student/update-level
router.patch(
  '/update-level',
  auth(USER_ROLE.STUDENT),
  validateRequest(StudentValidation.updateLevelValidationSchema), // ✅ Add Validation here
  StudentControllers.updateMyLevel
);

// 2. Dynamic Routes LAST
router.patch(
  '/:id',
  // auth(USER_ROLE.ADMIN), // Usually admins update by ID
  StudentControllers.updateStudent
);

export const StudentRoutes = router;
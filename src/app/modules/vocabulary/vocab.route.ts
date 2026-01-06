import express from 'express';

import { USER_ROLE } from '../user/user.constant';
import { VocabControllers } from './vocab.controller';

import { VocabValidation } from './vocab.validation';
import { auth } from '../../middleWares/auth';
import validateRequest from '../../middleWares/validateRequest';

const router = express.Router();

// Only Students can save words
router.post(
  '/add',
  auth(USER_ROLE.STUDENT),
  validateRequest(VocabValidation.addVocabSchema),
  VocabControllers.addVocab
);

router.get(
  '/my-list',
  auth(USER_ROLE.STUDENT),
  VocabControllers.getMyVocab
);

export const VocabRoutes = router;
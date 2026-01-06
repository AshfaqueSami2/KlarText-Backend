import express from 'express';
import { TranslationControllers } from './translation.controller';

const router = express.Router();

// POST http://localhost:4000/api/v1/translation
router.post('/word', TranslationControllers.translate);

export const TranslationRoutes = router;
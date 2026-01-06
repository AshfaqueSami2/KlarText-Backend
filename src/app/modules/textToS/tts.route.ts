import { Router } from 'express';
import { TTSController } from './tts.controller';
import validateRequest from '../../middleWares/validateRequest';
import { z } from 'zod';

const router = Router();

// Validation schemas
const generateTextAudioSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Text is required'),
    voiceName: z.string().optional(),
    language: z.string().optional(),
    speed: z.number().min(0.5).max(2).optional(),
    pitch: z.number().min(-50).max(50).optional()
  })
});

const generateLessonAudioSchema = z.object({
  params: z.object({
    lessonId: z.string().min(1, 'Lesson ID is required')
  }),
  body: z.object({
    voiceName: z.string().optional(),
    language: z.string().optional(),
    speed: z.number().min(0.5).max(2).optional(),
    pitch: z.number().min(-50).max(50).optional()
  }).optional()
});

const generateBatchAudioSchema = z.object({
  body: z.object({
    texts: z.array(z.string().min(1)).min(1, 'At least one text is required'),
    voiceName: z.string().optional(),
    language: z.string().optional(),
    speed: z.number().min(0.5).max(2).optional(),
    pitch: z.number().min(-50).max(50).optional()
  })
});

// Routes
router.post(
  '/generate-text',
  validateRequest(generateTextAudioSchema),
  TTSController.generateTextAudio
);

router.post(
  '/generate-lesson/:lessonId',
  validateRequest(generateLessonAudioSchema),
  TTSController.generateLessonAudio
);

router.post(
  '/generate-batch',
  validateRequest(generateBatchAudioSchema),
  TTSController.generateBatchAudio
);

router.get(
  '/voices',
  TTSController.getVoices
);

router.get(
  '/audio/:fileName',
  TTSController.streamAudio
);

export const TTSRoutes = router;

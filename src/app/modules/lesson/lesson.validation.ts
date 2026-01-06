import { z } from 'zod';
import { GERMAN_LEVELS } from '../../modules/user/user.constant';

const createLessonValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    content: z.string().min(10),
    difficulty: z.enum([...GERMAN_LEVELS] as [string, ...string[]]),
    coverImage: z.string().optional(),
  }),
});

// ✅ NEW: Update Schema (Everything is optional)
const updateLessonValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    content: z.string().min(10).optional(),
    difficulty: z.enum([...GERMAN_LEVELS] as [string, ...string[]]).optional(),
    coverImage: z.string().optional(),
    isPublished: z.boolean().optional(), // Admin might want to unpublish
  }),
});

export const LessonValidation = {
  createLessonValidationSchema,
  updateLessonValidationSchema,
};
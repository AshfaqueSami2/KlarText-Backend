import { z } from 'zod';
import { GERMAN_LEVELS } from '../../modules/user/user.constant';

const updateStudentValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    profileImage: z.string().optional(),
    bio: z.string().optional(),
    currentLevel: z.enum(GERMAN_LEVELS).optional(),
  }),
});

// ✅ NEW: Specific schema for the Level Update
const updateLevelValidationSchema = z.object({
  body: z.object({
    currentLevel: z.enum(GERMAN_LEVELS, {
      message: "Level is required (A1-C1)",
    }),
  }),
});

export const StudentValidation = {
  updateStudentValidationSchema,
  updateLevelValidationSchema, // Export this
};
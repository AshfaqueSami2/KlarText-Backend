import { z } from 'zod';
import { USER_ROLE } from './user.constant';

export const createUserValidationSchema = z.object({
  body: z.object({
    password: z.string().min(6),
    email: z.string().email(),
    name: z.string().min(1), // Moved Name to User (Shared)
    role: z.enum([USER_ROLE.ADMIN, USER_ROLE.STUDENT]),
    profileImage: z.string().optional(),
    // Student Specific (Optional) - Allow null or valid level
    currentLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1']).nullable().optional(),
    // Additional optional fields
    bio: z.string().optional(),
  }),
});

export const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    profileImage: z.string().optional(),
    bio: z.string().optional(),
  }),
});
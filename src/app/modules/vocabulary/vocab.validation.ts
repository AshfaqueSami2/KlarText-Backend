import { z } from 'zod';

const addVocabSchema = z.object({
  body: z.object({
    word: z.string().min(1),
    meaning: z.string().min(1),
    lessonId: z.string().optional(), // Optional linking
  }),
});

export const VocabValidation = { addVocabSchema };
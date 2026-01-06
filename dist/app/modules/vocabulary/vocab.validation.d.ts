import { z } from 'zod';
export declare const VocabValidation: {
    addVocabSchema: z.ZodObject<{
        body: z.ZodObject<{
            word: z.ZodString;
            meaning: z.ZodString;
            lessonId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=vocab.validation.d.ts.map
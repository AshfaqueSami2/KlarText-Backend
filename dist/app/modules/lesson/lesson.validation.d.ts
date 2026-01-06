import { z } from 'zod';
export declare const LessonValidation: {
    createLessonValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            slug: z.ZodString;
            content: z.ZodString;
            difficulty: z.ZodEnum<{
                [x: string]: string;
            }>;
            coverImage: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateLessonValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            slug: z.ZodOptional<z.ZodString>;
            content: z.ZodOptional<z.ZodString>;
            difficulty: z.ZodOptional<z.ZodEnum<{
                [x: string]: string;
            }>>;
            coverImage: z.ZodOptional<z.ZodString>;
            isPublished: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=lesson.validation.d.ts.map
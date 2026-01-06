import { z } from 'zod';
export declare const StudentValidation: {
    updateStudentValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            profileImage: z.ZodOptional<z.ZodString>;
            bio: z.ZodOptional<z.ZodString>;
            currentLevel: z.ZodOptional<z.ZodEnum<{
                A1: "A1";
                A2: "A2";
                B1: "B1";
                B2: "B2";
                C1: "C1";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateLevelValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            currentLevel: z.ZodEnum<{
                A1: "A1";
                A2: "A2";
                B1: "B1";
                B2: "B2";
                C1: "C1";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=student.validation.d.ts.map
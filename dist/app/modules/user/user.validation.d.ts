import { z } from 'zod';
export declare const createUserValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        password: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        role: z.ZodEnum<{
            admin: "admin";
            student: "student";
        }>;
        profileImage: z.ZodOptional<z.ZodString>;
        currentLevel: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            A1: "A1";
            A2: "A2";
            B1: "B1";
            B2: "B2";
            C1: "C1";
        }>>>;
        bio: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateProfileValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        profileImage: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=user.validation.d.ts.map
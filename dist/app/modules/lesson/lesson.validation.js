"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("../../modules/user/user.constant");
const createLessonValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1),
        slug: zod_1.z.string().min(1),
        content: zod_1.z.string().min(10),
        difficulty: zod_1.z.enum([...user_constant_1.GERMAN_LEVELS]),
        coverImage: zod_1.z.string().optional(),
    }),
});
const updateLessonValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        slug: zod_1.z.string().min(1).optional(),
        content: zod_1.z.string().min(10).optional(),
        difficulty: zod_1.z.enum([...user_constant_1.GERMAN_LEVELS]).optional(),
        coverImage: zod_1.z.string().optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
exports.LessonValidation = {
    createLessonValidationSchema,
    updateLessonValidationSchema,
};
//# sourceMappingURL=lesson.validation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("../../modules/user/user.constant");
const updateStudentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        bio: zod_1.z.string().optional(),
        currentLevel: zod_1.z.enum(user_constant_1.GERMAN_LEVELS).optional(),
    }),
});
const updateLevelValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentLevel: zod_1.z.enum(user_constant_1.GERMAN_LEVELS, {
            message: "Level is required (A1-C1)",
        }),
    }),
});
exports.StudentValidation = {
    updateStudentValidationSchema,
    updateLevelValidationSchema,
};
//# sourceMappingURL=student.validation.js.map
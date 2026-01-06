"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileValidationSchema = exports.createUserValidationSchema = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
exports.createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().min(6),
        email: zod_1.z.string().email(),
        name: zod_1.z.string().min(1),
        role: zod_1.z.enum([user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.STUDENT]),
        profileImage: zod_1.z.string().optional(),
        currentLevel: zod_1.z.enum(['A1', 'A2', 'B1', 'B2', 'C1']).nullable().optional(),
        bio: zod_1.z.string().optional(),
    }),
});
exports.updateProfileValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        profileImage: zod_1.z.string().optional(),
        bio: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=user.validation.js.map
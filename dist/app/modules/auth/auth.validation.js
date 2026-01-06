"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ message: 'Email is required' })
            .email({ message: 'Invalid email address' }),
        password: zod_1.z
            .string({ message: 'Password is required' })
            .min(1, { message: 'Password cannot be empty' }),
    }),
});
exports.AuthValidation = {
    loginValidationSchema,
};
//# sourceMappingURL=auth.validation.js.map
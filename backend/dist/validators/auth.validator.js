"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.createUserSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
// Admin-only: create new user (stricter validation)
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100),
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain uppercase letter')
            .regex(/[0-9]/, 'Must contain a number')
            .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
        role: zod_1.z.enum(['ADMIN', 'OPERATOR']).optional().default('OPERATOR'),
    }),
});
// Keep backward compatibility alias
exports.registerSchema = exports.createUserSchema;
//# sourceMappingURL=auth.validator.js.map
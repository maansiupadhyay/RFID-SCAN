"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToolSchema = exports.createToolSchema = void 0;
const zod_1 = require("zod");
exports.createToolSchema = zod_1.z.object({
    body: zod_1.z.object({
        toolCode: zod_1.z.string().min(1, 'Tool code is required').max(50),
        name: zod_1.z.string().min(1, 'Tool name is required').max(150),
        category: zod_1.z.string().min(1, 'Category is required').max(100),
        location: zod_1.z.string().max(200).optional(),
    }),
});
exports.updateToolSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(150).optional(),
        category: zod_1.z.string().min(1).max(100).optional(),
        location: zod_1.z.string().max(200).optional(),
        status: zod_1.z.enum(['AVAILABLE', 'ISSUED', 'MISSING']).optional(),
    }),
});
//# sourceMappingURL=tool.validator.js.map
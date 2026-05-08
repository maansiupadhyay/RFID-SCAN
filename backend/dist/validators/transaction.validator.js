"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnToolSchema = exports.issueToolSchema = void 0;
const zod_1 = require("zod");
exports.issueToolSchema = zod_1.z.object({
    body: zod_1.z.object({
        toolCode: zod_1.z.string().min(1, 'Tool code is required'),
        issuedTo: zod_1.z.string().min(1, 'Issued to field is required').max(150),
        remarks: zod_1.z.string().max(500).optional(),
    }),
});
exports.returnToolSchema = zod_1.z.object({
    body: zod_1.z.object({
        toolCode: zod_1.z.string().min(1, 'Tool code is required'),
        remarks: zod_1.z.string().max(500).optional(),
    }),
});
//# sourceMappingURL=transaction.validator.js.map
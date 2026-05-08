"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanSchema = void 0;
const zod_1 = require("zod");
exports.scanSchema = zod_1.z.object({
    body: zod_1.z.object({
        scannedIds: zod_1.z
            .array(zod_1.z.string().min(1))
            .min(1, 'At least one scanned ID is required')
            .max(1000, 'Maximum 1000 IDs per scan'),
    }),
});
//# sourceMappingURL=scan.validator.js.map
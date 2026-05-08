import { z } from 'zod';
export declare const scanSchema: z.ZodObject<{
    body: z.ZodObject<{
        scannedIds: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        scannedIds: string[];
    }, {
        scannedIds: string[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        scannedIds: string[];
    };
}, {
    body: {
        scannedIds: string[];
    };
}>;
//# sourceMappingURL=scan.validator.d.ts.map
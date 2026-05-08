import { z } from 'zod';
export declare const issueToolSchema: z.ZodObject<{
    body: z.ZodObject<{
        toolCode: z.ZodString;
        issuedTo: z.ZodString;
        remarks: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        toolCode: string;
        issuedTo: string;
        remarks?: string | undefined;
    }, {
        toolCode: string;
        issuedTo: string;
        remarks?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        toolCode: string;
        issuedTo: string;
        remarks?: string | undefined;
    };
}, {
    body: {
        toolCode: string;
        issuedTo: string;
        remarks?: string | undefined;
    };
}>;
export declare const returnToolSchema: z.ZodObject<{
    body: z.ZodObject<{
        toolCode: z.ZodString;
        remarks: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        toolCode: string;
        remarks?: string | undefined;
    }, {
        toolCode: string;
        remarks?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        toolCode: string;
        remarks?: string | undefined;
    };
}, {
    body: {
        toolCode: string;
        remarks?: string | undefined;
    };
}>;
//# sourceMappingURL=transaction.validator.d.ts.map
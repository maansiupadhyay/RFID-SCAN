import { z } from 'zod';
export declare const createToolSchema: z.ZodObject<{
    body: z.ZodObject<{
        toolCode: z.ZodString;
        name: z.ZodString;
        category: z.ZodString;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        category: string;
        toolCode: string;
        location?: string | undefined;
    }, {
        name: string;
        category: string;
        toolCode: string;
        location?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        category: string;
        toolCode: string;
        location?: string | undefined;
    };
}, {
    body: {
        name: string;
        category: string;
        toolCode: string;
        location?: string | undefined;
    };
}>;
export declare const updateToolSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["AVAILABLE", "ISSUED", "MISSING"]>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        status?: "AVAILABLE" | "ISSUED" | "MISSING" | undefined;
        category?: string | undefined;
        location?: string | undefined;
    }, {
        name?: string | undefined;
        status?: "AVAILABLE" | "ISSUED" | "MISSING" | undefined;
        category?: string | undefined;
        location?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        status?: "AVAILABLE" | "ISSUED" | "MISSING" | undefined;
        category?: string | undefined;
        location?: string | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        status?: "AVAILABLE" | "ISSUED" | "MISSING" | undefined;
        category?: string | undefined;
        location?: string | undefined;
    };
}>;
//# sourceMappingURL=tool.validator.d.ts.map
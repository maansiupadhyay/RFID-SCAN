import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        password: string;
        email: string;
    }, {
        password: string;
        email: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        password: string;
        email: string;
    };
}, {
    body: {
        password: string;
        email: string;
    };
}>;
export declare const createUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        role: z.ZodDefault<z.ZodOptional<z.ZodEnum<["ADMIN", "OPERATOR"]>>>;
    }, "strip", z.ZodTypeAny, {
        password: string;
        name: string;
        email: string;
        role: "OPERATOR" | "ADMIN";
    }, {
        password: string;
        name: string;
        email: string;
        role?: "OPERATOR" | "ADMIN" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        password: string;
        name: string;
        email: string;
        role: "OPERATOR" | "ADMIN";
    };
}, {
    body: {
        password: string;
        name: string;
        email: string;
        role?: "OPERATOR" | "ADMIN" | undefined;
    };
}>;
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        role: z.ZodDefault<z.ZodOptional<z.ZodEnum<["ADMIN", "OPERATOR"]>>>;
    }, "strip", z.ZodTypeAny, {
        password: string;
        name: string;
        email: string;
        role: "OPERATOR" | "ADMIN";
    }, {
        password: string;
        name: string;
        email: string;
        role?: "OPERATOR" | "ADMIN" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        password: string;
        name: string;
        email: string;
        role: "OPERATOR" | "ADMIN";
    };
}, {
    body: {
        password: string;
        name: string;
        email: string;
        role?: "OPERATOR" | "ADMIN" | undefined;
    };
}>;
//# sourceMappingURL=auth.validator.d.ts.map
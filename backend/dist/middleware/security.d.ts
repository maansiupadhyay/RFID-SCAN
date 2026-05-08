import { Request, Response, NextFunction } from 'express';
export declare const loginRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const registerRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const apiRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const requireActive: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=security.d.ts.map
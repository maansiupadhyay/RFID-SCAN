import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/apiResponse';

// ─── Rate Limiters ────────────────────────────────────────────────────────────

// Login: max 5 attempts per 15 minutes per IP
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ApiResponse.error(
      res,
      'Too many login attempts from this IP. Please try again after 15 minutes.',
      429
    );
  },
});

// Register / user creation: max 10 per hour per IP
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  handler: (req, res) => {
    ApiResponse.error(res, 'Too many requests. Please try again later.', 429);
  },
});

// General API limiter: 100 per minute per IP
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  handler: (req, res) => {
    ApiResponse.error(res, 'API rate limit exceeded. Slow down.', 429);
  },
});

// ─── Account Active Check ─────────────────────────────────────────────────────

export const requireActive = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && !(req.user as any).isActive) {
    ApiResponse.forbidden(res, 'Your account has been deactivated. Contact admin.');
    return;
  }
  next();
};

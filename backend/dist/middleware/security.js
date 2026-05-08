"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActive = exports.apiRateLimiter = exports.registerRateLimiter = exports.loginRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const apiResponse_1 = require("../utils/apiResponse");
// ─── Rate Limiters ────────────────────────────────────────────────────────────
// Login: max 5 attempts per 15 minutes per IP
exports.loginRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login attempts. Please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        apiResponse_1.ApiResponse.error(res, 'Too many login attempts from this IP. Please try again after 15 minutes.', 429);
    },
});
// Register / user creation: max 10 per hour per IP
exports.registerRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    handler: (req, res) => {
        apiResponse_1.ApiResponse.error(res, 'Too many requests. Please try again later.', 429);
    },
});
// General API limiter: 100 per minute per IP
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 100,
    handler: (req, res) => {
        apiResponse_1.ApiResponse.error(res, 'API rate limit exceeded. Slow down.', 429);
    },
});
// ─── Account Active Check ─────────────────────────────────────────────────────
const requireActive = (req, res, next) => {
    if (req.user && !req.user.isActive) {
        apiResponse_1.ApiResponse.forbidden(res, 'Your account has been deactivated. Contact admin.');
        return;
    }
    next();
};
exports.requireActive = requireActive;
//# sourceMappingURL=security.js.map
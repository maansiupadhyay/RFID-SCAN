"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const middleware_1 = require("../middleware");
const auth_validator_1 = require("../validators/auth.validator");
const security_1 = require("../middleware/security");
const env_1 = require("../config/env");
const apiResponse_1 = require("../utils/apiResponse");
const router = (0, express_1.Router)();
const isGoogleConfigured = !!(env_1.env.GOOGLE_CLIENT_ID &&
    env_1.env.GOOGLE_CLIENT_ID !== 'your-google-client-id.apps.googleusercontent.com');
// ─── Public Routes ────────────────────────────────────────────────────────────
// Anyone can register
router.post('/register', security_1.registerRateLimiter, auth_controller_1.default.register);
// Login with rate limiting
router.post('/login', security_1.loginRateLimiter, (0, middleware_1.validate)(auth_validator_1.loginSchema), auth_controller_1.default.login);
// Forgot / Reset password
router.post('/forgot-password', auth_controller_1.default.forgotPassword);
router.post('/reset-password', auth_controller_1.default.resetPassword);
// Token management
router.post('/refresh', auth_controller_1.default.refreshToken);
router.post('/logout', auth_controller_1.default.logout);
// OAuth status check
router.get('/oauth-status', (_req, res) => {
    apiResponse_1.ApiResponse.success(res, 'OAuth status', { googleConfigured: isGoogleConfigured });
});
// ─── Google OAuth ─────────────────────────────────────────────────────────────
if (isGoogleConfigured) {
    router.get('/google', auth_controller_1.default.googleAuth);
    router.get('/google/callback', passport_1.default.authenticate('google', { session: false, failureRedirect: '/login?error=oauth_failed' }), auth_controller_1.default.googleCallback);
}
else {
    router.get('/google', (_req, res) => {
        apiResponse_1.ApiResponse.error(res, 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env', 503);
    });
    router.get('/google/callback', (_req, res) => {
        res.redirect(`${env_1.env.FRONTEND_URL}/login?error=oauth_not_configured`);
    });
}
// ─── Protected ────────────────────────────────────────────────────────────────
router.get('/me', middleware_1.authMiddleware, auth_controller_1.default.me);
// ─── Admin Only ───────────────────────────────────────────────────────────────
router.post('/create-user', middleware_1.authMiddleware, (0, middleware_1.roleMiddleware)('ADMIN'), auth_controller_1.default.createUser);
router.get('/users', middleware_1.authMiddleware, (0, middleware_1.roleMiddleware)('ADMIN'), auth_controller_1.default.getAllUsers);
router.patch('/users/:id/deactivate', middleware_1.authMiddleware, (0, middleware_1.roleMiddleware)('ADMIN'), auth_controller_1.default.deactivateUser);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const passport_1 = __importDefault(require("passport"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const utils_1 = require("../utils");
const messages_1 = require("../constants/messages");
const env_1 = require("../config/env");
class AuthController {
    constructor() {
        // ─── Public Register ──────────────────────────────────────────────────────────
        this.register = (0, utils_1.asyncHandler)(async (req, res) => {
            const result = await auth_service_1.default.register(req.body);
            res.cookie('rfid_refresh_token', result.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return utils_1.ApiResponse.created(res, messages_1.MESSAGES.AUTH.REGISTER_SUCCESS, {
                user: result.user,
                accessToken: result.accessToken,
            });
        });
        // ─── Login ────────────────────────────────────────────────────────────────────
        this.login = (0, utils_1.asyncHandler)(async (req, res) => {
            const result = await auth_service_1.default.login(req.body);
            res.cookie('rfid_refresh_token', result.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return utils_1.ApiResponse.success(res, messages_1.MESSAGES.AUTH.LOGIN_SUCCESS, {
                user: result.user,
                accessToken: result.accessToken,
            });
        });
        // ─── Forgot Password ──────────────────────────────────────────────────────────
        this.forgotPassword = (0, utils_1.asyncHandler)(async (req, res) => {
            const { email } = req.body;
            if (!email)
                return utils_1.ApiResponse.error(res, 'Email is required', 400);
            const result = await auth_service_1.default.forgotPassword(email);
            // In production, you would email the token. Here we return it directly.
            return utils_1.ApiResponse.success(res, result.message, {
                resetToken: result.resetToken || undefined,
            });
        });
        // ─── Reset Password ───────────────────────────────────────────────────────────
        this.resetPassword = (0, utils_1.asyncHandler)(async (req, res) => {
            const { token, newPassword } = req.body;
            if (!token || !newPassword)
                return utils_1.ApiResponse.error(res, 'Token and new password are required', 400);
            if (newPassword.length < 6)
                return utils_1.ApiResponse.error(res, 'Password must be at least 6 characters', 400);
            await auth_service_1.default.resetPassword(token, newPassword);
            return utils_1.ApiResponse.success(res, 'Password reset successfully. Please login with your new password.');
        });
        // ─── Refresh Token ────────────────────────────────────────────────────────────
        this.refreshToken = (0, utils_1.asyncHandler)(async (req, res) => {
            const token = req.cookies?.rfid_refresh_token || req.body?.refreshToken;
            if (!token)
                return utils_1.ApiResponse.unauthorized(res, 'Refresh token not provided');
            const result = await auth_service_1.default.refreshAccessToken(token);
            return utils_1.ApiResponse.success(res, 'Token refreshed', result);
        });
        // ─── Logout ───────────────────────────────────────────────────────────────────
        this.logout = (0, utils_1.asyncHandler)(async (req, res) => {
            const token = req.cookies?.rfid_refresh_token || req.body?.refreshToken;
            if (token)
                await auth_service_1.default.logout(token);
            res.clearCookie('rfid_refresh_token');
            return utils_1.ApiResponse.success(res, 'Logged out successfully');
        });
        // ─── Google OAuth ─────────────────────────────────────────────────────────────
        this.googleAuth = passport_1.default.authenticate('google', { scope: ['profile', 'email'], session: false });
        this.googleCallback = (0, utils_1.asyncHandler)(async (req, res) => {
            const user = req.user;
            if (!user)
                return res.redirect(`${env_1.env.FRONTEND_URL}/login?error=oauth_failed`);
            const result = await auth_service_1.default.loginWithOAuth(user);
            res.cookie('rfid_refresh_token', result.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.redirect(`${env_1.env.FRONTEND_URL}/auth/callback?token=${result.accessToken}&name=${encodeURIComponent(result.user.name)}&role=${result.user.role}`);
        });
        // ─── Admin ────────────────────────────────────────────────────────────────────
        this.createUser = (0, utils_1.asyncHandler)(async (req, res) => {
            const result = await auth_service_1.default.createUser(req.body);
            return utils_1.ApiResponse.created(res, 'User created by admin', { user: result.user });
        });
        this.getAllUsers = (0, utils_1.asyncHandler)(async (req, res) => {
            const users = await auth_service_1.default.getAllUsers();
            return utils_1.ApiResponse.success(res, 'Users fetched', users);
        });
        this.deactivateUser = (0, utils_1.asyncHandler)(async (req, res) => {
            const raw = req.params.id;
            const id = parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
            await auth_service_1.default.deactivateUser(id);
            return utils_1.ApiResponse.success(res, 'User deactivated');
        });
        this.me = (0, utils_1.asyncHandler)(async (req, res) => {
            return utils_1.ApiResponse.success(res, 'User info', req.user);
        });
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map
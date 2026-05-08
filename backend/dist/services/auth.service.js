"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const refreshToken_repository_1 = __importDefault(require("../repositories/refreshToken.repository"));
const hashUtils_1 = require("../utils/hashUtils");
const tokenUtils_1 = require("../utils/tokenUtils");
const messages_1 = require("../constants/messages");
const passport_1 = require("../config/passport");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    // ─── Build token pair ─────────────────────────────────────────────────────────
    async issueTokens(user) {
        const accessToken = (0, tokenUtils_1.generateAccessToken)({ userId: user.id, email: user.email, role: user.role });
        const rawRefreshToken = (0, tokenUtils_1.generateRefreshToken)();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await refreshToken_repository_1.default.create(user.id, rawRefreshToken, expiresAt);
        return {
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            accessToken,
            refreshToken: rawRefreshToken,
        };
    }
    // ─── PUBLIC: Register (anyone can sign up as OPERATOR) ────────────────────────
    async register(data) {
        const existing = await user_repository_1.default.findByEmail(data.email);
        if (existing)
            throw new Error(messages_1.MESSAGES.AUTH.EMAIL_EXISTS);
        const hashedPassword = await (0, hashUtils_1.hashPassword)(data.password);
        const user = await user_repository_1.default.create({ name: data.name, email: data.email, password: hashedPassword, role: 'OPERATOR' });
        return this.issueTokens(user);
    }
    // ─── Login (with lockout) ─────────────────────────────────────────────────────
    async login(data) {
        const user = await user_repository_1.default.findByEmail(data.email);
        if (!user)
            throw new Error(messages_1.MESSAGES.AUTH.INVALID_CREDENTIALS);
        if (!user.isActive)
            throw new Error('Account is deactivated. Contact an administrator.');
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const remainingMin = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
            throw new Error(`Account locked. Try again in ${remainingMin} minute(s).`);
        }
        if (!user.password)
            throw new Error('This account uses Google Sign-In. Please login with Google.');
        const isValid = await (0, hashUtils_1.comparePassword)(data.password, user.password);
        if (!isValid) {
            const attempts = (user.failedLoginAttempts || 0) + 1;
            await user_repository_1.default.incrementFailedAttempts(user.id);
            if (attempts >= passport_1.MAX_FAILED_ATTEMPTS) {
                const lockUntil = new Date(Date.now() + passport_1.LOCK_DURATION_MS);
                await user_repository_1.default.lockAccount(user.id, lockUntil);
                throw new Error('Too many failed attempts. Account locked for 30 minutes.');
            }
            const remaining = passport_1.MAX_FAILED_ATTEMPTS - attempts;
            throw new Error(`${messages_1.MESSAGES.AUTH.INVALID_CREDENTIALS}. ${remaining} attempt(s) remaining.`);
        }
        await user_repository_1.default.resetFailedAttempts(user.id);
        return this.issueTokens(user);
    }
    // ─── ADMIN: Create user with specific role ────────────────────────────────────
    async createUser(data) {
        const existing = await user_repository_1.default.findByEmail(data.email);
        if (existing)
            throw new Error(messages_1.MESSAGES.AUTH.EMAIL_EXISTS);
        const hashedPassword = await (0, hashUtils_1.hashPassword)(data.password);
        const user = await user_repository_1.default.create({ ...data, password: hashedPassword });
        return this.issueTokens(user);
    }
    // ─── Google OAuth ─────────────────────────────────────────────────────────────
    async loginWithOAuth(oauthUser) {
        return this.issueTokens(oauthUser);
    }
    // ─── Forgot Password ──────────────────────────────────────────────────────────
    async forgotPassword(email) {
        const user = await user_repository_1.default.findByEmail(email);
        // Always succeed (prevents email enumeration), but only save token if user exists
        if (user && user.password) {
            const token = crypto_1.default.randomBytes(32).toString('hex');
            const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
            await user_repository_1.default.setResetToken(user.id, token, expires);
            return {
                resetToken: token,
                message: `Password reset token generated. Use it within 1 hour. Token: ${token}`,
            };
        }
        return { resetToken: '', message: 'If that email is registered, a reset token has been generated.' };
    }
    // ─── Reset Password ───────────────────────────────────────────────────────────
    async resetPassword(token, newPassword) {
        const user = await user_repository_1.default.findByResetToken(token);
        if (!user)
            throw new Error('Invalid or expired reset token.');
        const hashed = await (0, hashUtils_1.hashPassword)(newPassword);
        await user_repository_1.default.resetPassword(user.id, hashed);
        // Revoke all sessions
        await refreshToken_repository_1.default.deleteAllForUser(user.id);
    }
    // ─── Refresh token ────────────────────────────────────────────────────────────
    async refreshAccessToken(rawToken) {
        const record = await refreshToken_repository_1.default.findByToken(rawToken);
        if (!record)
            throw new Error('Invalid refresh token');
        if (record.expiresAt < new Date()) {
            await refreshToken_repository_1.default.deleteByToken(rawToken);
            throw new Error('Refresh token expired. Please login again.');
        }
        if (!record.user.isActive)
            throw new Error('Account deactivated.');
        const accessToken = (0, tokenUtils_1.generateAccessToken)({ userId: record.user.id, email: record.user.email, role: record.user.role });
        return { accessToken };
    }
    // ─── Logout ───────────────────────────────────────────────────────────────────
    async logout(refreshToken) {
        await refreshToken_repository_1.default.deleteByToken(refreshToken);
    }
    async getAllUsers() { return user_repository_1.default.findAll(); }
    async deactivateUser(id) {
        await user_repository_1.default.deactivate(id);
        await refreshToken_repository_1.default.deleteAllForUser(id);
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map
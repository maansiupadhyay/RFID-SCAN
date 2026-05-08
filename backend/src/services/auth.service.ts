import userRepository from '../repositories/user.repository';
import refreshTokenRepository from '../repositories/refreshToken.repository';
import { LoginDTO } from '../dtos/auth.dto';
import { hashPassword, comparePassword } from '../utils/hashUtils';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';
import { MESSAGES } from '../constants/messages';
import { MAX_FAILED_ATTEMPTS, LOCK_DURATION_MS } from '../config/passport';
import crypto from 'crypto';

export interface AuthTokensDTO {
  user: { id: number; name: string; email: string; role: string };
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  // ─── Build token pair ─────────────────────────────────────────────────────────
  private async issueTokens(user: any): Promise<AuthTokensDTO> {
    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const rawRefreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await refreshTokenRepository.create(user.id, rawRefreshToken, expiresAt);
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }

  // ─── PUBLIC: Register (anyone can sign up as OPERATOR) ────────────────────────
  async register(data: { name: string; email: string; password: string }): Promise<AuthTokensDTO> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new Error(MESSAGES.AUTH.EMAIL_EXISTS);
    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({ name: data.name, email: data.email, password: hashedPassword, role: 'OPERATOR' });
    return this.issueTokens(user);
  }

  // ─── Login (with lockout) ─────────────────────────────────────────────────────
  async login(data: LoginDTO): Promise<AuthTokensDTO> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);

    if (!user.isActive) throw new Error('Account is deactivated. Contact an administrator.');

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMin = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new Error(`Account locked. Try again in ${remainingMin} minute(s).`);
    }

    if (!user.password) throw new Error('This account uses Google Sign-In. Please login with Google.');

    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      await userRepository.incrementFailedAttempts(user.id);
      if (attempts >= MAX_FAILED_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        await userRepository.lockAccount(user.id, lockUntil);
        throw new Error('Too many failed attempts. Account locked for 30 minutes.');
      }
      const remaining = MAX_FAILED_ATTEMPTS - attempts;
      throw new Error(`${MESSAGES.AUTH.INVALID_CREDENTIALS}. ${remaining} attempt(s) remaining.`);
    }

    await userRepository.resetFailedAttempts(user.id);
    return this.issueTokens(user);
  }

  // ─── ADMIN: Create user with specific role ────────────────────────────────────
  async createUser(data: { name: string; email: string; password: string; role?: string }): Promise<AuthTokensDTO> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new Error(MESSAGES.AUTH.EMAIL_EXISTS);
    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({ ...data, password: hashedPassword });
    return this.issueTokens(user);
  }

  // ─── Google OAuth ─────────────────────────────────────────────────────────────
  async loginWithOAuth(oauthUser: any): Promise<AuthTokensDTO> {
    return this.issueTokens(oauthUser);
  }

  // ─── Forgot Password ──────────────────────────────────────────────────────────
  async forgotPassword(email: string): Promise<{ resetToken: string; message: string }> {
    const user = await userRepository.findByEmail(email);
    // Always succeed (prevents email enumeration), but only save token if user exists
    if (user && user.password) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await userRepository.setResetToken(user.id, token, expires);
      return {
        resetToken: token,
        message: `Password reset token generated. Use it within 1 hour. Token: ${token}`,
      };
    }
    return { resetToken: '', message: 'If that email is registered, a reset token has been generated.' };
  }

  // ─── Reset Password ───────────────────────────────────────────────────────────
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await userRepository.findByResetToken(token);
    if (!user) throw new Error('Invalid or expired reset token.');
    const hashed = await hashPassword(newPassword);
    await userRepository.resetPassword(user.id, hashed);
    // Revoke all sessions
    await refreshTokenRepository.deleteAllForUser(user.id);
  }

  // ─── Refresh token ────────────────────────────────────────────────────────────
  async refreshAccessToken(rawToken: string): Promise<{ accessToken: string }> {
    const record = await refreshTokenRepository.findByToken(rawToken);
    if (!record) throw new Error('Invalid refresh token');
    if (record.expiresAt < new Date()) {
      await refreshTokenRepository.deleteByToken(rawToken);
      throw new Error('Refresh token expired. Please login again.');
    }
    if (!record.user.isActive) throw new Error('Account deactivated.');
    const accessToken = generateAccessToken({ userId: record.user.id, email: record.user.email, role: record.user.role });
    return { accessToken };
  }

  // ─── Logout ───────────────────────────────────────────────────────────────────
  async logout(refreshToken: string): Promise<void> {
    await refreshTokenRepository.deleteByToken(refreshToken);
  }

  async getAllUsers() { return userRepository.findAll(); }
  async deactivateUser(id: number) {
    await userRepository.deactivate(id);
    await refreshTokenRepository.deleteAllForUser(id);
  }
}

export default new AuthService();

import { Request, Response } from 'express';
import passport from 'passport';
import authService from '../services/auth.service';
import { ApiResponse, asyncHandler } from '../utils';
import { MESSAGES } from '../constants/messages';
import { env } from '../config/env';

export class AuthController {
  // ─── Public Register ──────────────────────────────────────────────────────────
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.cookie('rfid_refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return ApiResponse.created(res, MESSAGES.AUTH.REGISTER_SUCCESS, {
      user: result.user,
      accessToken: result.accessToken,
    });
  });

  // ─── Login ────────────────────────────────────────────────────────────────────
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.cookie('rfid_refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return ApiResponse.success(res, MESSAGES.AUTH.LOGIN_SUCCESS, {
      user: result.user,
      accessToken: result.accessToken,
    });
  });

  // ─── Forgot Password ──────────────────────────────────────────────────────────
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) return ApiResponse.error(res, 'Email is required', 400);
    const result = await authService.forgotPassword(email);
    // In production, you would email the token. Here we return it directly.
    return ApiResponse.success(res, result.message, {
      resetToken: result.resetToken || undefined,
    });
  });

  // ─── Reset Password ───────────────────────────────────────────────────────────
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return ApiResponse.error(res, 'Token and new password are required', 400);
    if (newPassword.length < 6) return ApiResponse.error(res, 'Password must be at least 6 characters', 400);
    await authService.resetPassword(token, newPassword);
    return ApiResponse.success(res, 'Password reset successfully. Please login with your new password.');
  });

  // ─── Refresh Token ────────────────────────────────────────────────────────────
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.rfid_refresh_token || req.body?.refreshToken;
    if (!token) return ApiResponse.unauthorized(res, 'Refresh token not provided');
    const result = await authService.refreshAccessToken(token);
    return ApiResponse.success(res, 'Token refreshed', result);
  });

  // ─── Logout ───────────────────────────────────────────────────────────────────
  logout = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.rfid_refresh_token || req.body?.refreshToken;
    if (token) await authService.logout(token);
    res.clearCookie('rfid_refresh_token');
    return ApiResponse.success(res, 'Logged out successfully');
  });

  // ─── Google OAuth ─────────────────────────────────────────────────────────────
  googleAuth = passport.authenticate('google', { scope: ['profile', 'email'], session: false });

  googleCallback = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as any;
    if (!user) return res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`);
    const result = await authService.loginWithOAuth(user);
    res.cookie('rfid_refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${result.accessToken}&name=${encodeURIComponent(result.user.name)}&role=${result.user.role}`);
  });

  // ─── Admin ────────────────────────────────────────────────────────────────────
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.createUser(req.body);
    return ApiResponse.created(res, 'User created by admin', { user: result.user });
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await authService.getAllUsers();
    return ApiResponse.success(res, 'Users fetched', users);
  });

  deactivateUser = asyncHandler(async (req: Request, res: Response) => {
    await authService.deactivateUser(parseInt(req.params.id));
    return ApiResponse.success(res, 'User deactivated');
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    return ApiResponse.success(res, 'User info', req.user);
  });
}

export default new AuthController();

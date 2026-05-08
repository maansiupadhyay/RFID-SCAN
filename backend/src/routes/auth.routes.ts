import { Router } from 'express';
import passport from 'passport';
import authController from '../controllers/auth.controller';
import { authMiddleware, roleMiddleware, validate } from '../middleware';
import { loginSchema } from '../validators/auth.validator';
import { loginRateLimiter, registerRateLimiter } from '../middleware/security';
import { env } from '../config/env';
import { ApiResponse } from '../utils/apiResponse';

const router = Router();

const isGoogleConfigured = !!(
  env.GOOGLE_CLIENT_ID &&
  env.GOOGLE_CLIENT_ID !== 'your-google-client-id.apps.googleusercontent.com'
);

// ─── Public Routes ────────────────────────────────────────────────────────────

// Anyone can register
router.post('/register', registerRateLimiter, authController.register);

// Login with rate limiting
router.post('/login', loginRateLimiter, validate(loginSchema), authController.login);

// Forgot / Reset password
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Token management
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// OAuth status check
router.get('/oauth-status', (_req, res) => {
  ApiResponse.success(res, 'OAuth status', { googleConfigured: isGoogleConfigured });
});

// ─── Google OAuth ─────────────────────────────────────────────────────────────

if (isGoogleConfigured) {
  router.get('/google', authController.googleAuth);
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth_failed' }),
    authController.googleCallback
  );
} else {
  router.get('/google', (_req, res) => {
    ApiResponse.error(res, 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env', 503);
  });
  router.get('/google/callback', (_req, res) => {
    res.redirect(`${env.FRONTEND_URL}/login?error=oauth_not_configured`);
  });
}

// ─── Protected ────────────────────────────────────────────────────────────────

router.get('/me', authMiddleware, authController.me);

// ─── Admin Only ───────────────────────────────────────────────────────────────

router.post('/create-user', authMiddleware, roleMiddleware('ADMIN'), authController.createUser);
router.get('/users', authMiddleware, roleMiddleware('ADMIN'), authController.getAllUsers);
router.patch('/users/:id/deactivate', authMiddleware, roleMiddleware('ADMIN'), authController.deactivateUser);

export default router;

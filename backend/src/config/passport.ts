import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env';
import userRepository from '../repositories/user.repository';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export const configurePassport = () => {
  if (!env.GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID === 'your-google-client-id.apps.googleusercontent.com') {
    console.warn('⚠️  Google OAuth not configured — skipping Google strategy setup.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email from Google'), false);

          // 1. Check if OAuth user already exists
          let user = await userRepository.findByOAuth('google', profile.id);

          if (!user) {
            // 2. Check if email is already registered normally
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
              // Link Google OAuth to existing account
              user = existingUser;
            } else {
              // 3. Create new OAuth user with OPERATOR role
              user = await userRepository.createOAuthUser({
                name: profile.displayName || email,
                email,
                oauthProvider: 'google',
                oauthId: profile.id,
                role: 'OPERATOR',
              });
            }
          }

          if (!user.isActive) {
            return done(new Error('Account is deactivated'), false);
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error, false);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await userRepository.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export { MAX_FAILED_ATTEMPTS, LOCK_DURATION_MS };

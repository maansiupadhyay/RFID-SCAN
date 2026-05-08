"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOCK_DURATION_MS = exports.MAX_FAILED_ATTEMPTS = exports.configurePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
function toSessionUser(user) {
    return {
        ...user,
        userId: user.id,
        email: user.email,
        role: user.role,
    };
}
const MAX_FAILED_ATTEMPTS = 5;
exports.MAX_FAILED_ATTEMPTS = MAX_FAILED_ATTEMPTS;
const LOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes
exports.LOCK_DURATION_MS = LOCK_DURATION_MS;
const configurePassport = () => {
    if (!env_1.env.GOOGLE_CLIENT_ID || env_1.env.GOOGLE_CLIENT_ID === 'your-google-client-id.apps.googleusercontent.com') {
        console.warn('⚠️  Google OAuth not configured — skipping Google strategy setup.');
        return;
    }
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: env_1.env.GOOGLE_CLIENT_ID,
        clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
        callbackURL: env_1.env.GOOGLE_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            if (!email)
                return done(new Error('No email from Google'), false);
            // 1. Check if OAuth user already exists
            let user = await user_repository_1.default.findByOAuth('google', profile.id);
            if (!user) {
                // 2. Check if email is already registered normally
                const existingUser = await user_repository_1.default.findByEmail(email);
                if (existingUser) {
                    // Link Google OAuth to existing account
                    user = existingUser;
                }
                else {
                    // 3. Create new OAuth user with OPERATOR role
                    user = await user_repository_1.default.createOAuthUser({
                        name: profile.displayName || email,
                        email,
                        oauthProvider: 'google',
                        oauthId: profile.id,
                        role: 'OPERATOR',
                    });
                }
            }
            if (!user) {
                return done(new Error('Failed to resolve user after OAuth'), false);
            }
            if (!user.isActive) {
                return done(new Error('Account is deactivated'), false);
            }
            return done(null, toSessionUser(user));
        }
        catch (error) {
            return done(error, false);
        }
    }));
    passport_1.default.serializeUser((user, done) => done(null, user.id));
    passport_1.default.deserializeUser(async (id, done) => {
        try {
            const user = await user_repository_1.default.findById(id);
            if (!user) {
                done(null, false);
                return;
            }
            done(null, toSessionUser(user));
        }
        catch (err) {
            done(err, null);
        }
    });
};
exports.configurePassport = configurePassport;
//# sourceMappingURL=passport.js.map
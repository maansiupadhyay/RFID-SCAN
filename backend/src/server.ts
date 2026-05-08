import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { env } from './config/env';
import { configurePassport } from './config/passport';
import routes from './routes';
import { errorHandler } from './middleware';
import { apiRateLimiter } from './middleware/security';

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors({
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies
}));

app.use(express.json());
app.use(cookieParser());

// Session (needed for Passport)
app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: env.NODE_ENV === 'production',
    maxAge: 5 * 60 * 1000, // 5 min session (only for OAuth flow)
  },
}));

// Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', apiRateLimiter, routes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'RFID System API is running', version: '2.0.0' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`
  🚀 Server ready at: http://localhost:${PORT}
  🛠️  Environment: ${env.NODE_ENV}
  🔐 Auth: JWT (15m) + Refresh Tokens (7d)
  ${env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_ID !== 'your-google-client-id.apps.googleusercontent.com' ? '✅ Google OAuth: Configured' : '⚠️  Google OAuth: Not configured (set GOOGLE_CLIENT_ID in .env)'}
  `);
});

export default app;

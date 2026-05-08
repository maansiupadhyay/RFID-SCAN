"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const env_1 = require("./config/env");
const passport_2 = require("./config/passport");
const routes_1 = __importDefault(require("./routes"));
const middleware_1 = require("./middleware");
const security_1 = require("./middleware/security");
const app = (0, express_1.default)();
// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Session (needed for Passport)
app.use((0, express_session_1.default)({
    secret: env_1.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: env_1.env.NODE_ENV === 'production',
        maxAge: 5 * 60 * 1000, // 5 min session (only for OAuth flow)
    },
}));
// Passport
(0, passport_2.configurePassport)();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// ─── Security Headers ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});
// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', security_1.apiRateLimiter, routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'RFID System API is running', version: '2.0.0' });
});
// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(middleware_1.errorHandler);
// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = env_1.env.PORT;
app.listen(PORT, () => {
    console.log(`
  🚀 Server ready at: http://localhost:${PORT}
  🛠️  Environment: ${env_1.env.NODE_ENV}
  🔐 Auth: JWT (15m) + Refresh Tokens (7d)
  ${env_1.env.GOOGLE_CLIENT_ID && env_1.env.GOOGLE_CLIENT_ID !== 'your-google-client-id.apps.googleusercontent.com' ? '✅ Google OAuth: Configured' : '⚠️  Google OAuth: Not configured (set GOOGLE_CLIENT_ID in .env)'}
  `);
});
exports.default = app;
//# sourceMappingURL=server.js.map
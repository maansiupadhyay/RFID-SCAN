# RFID Tool Tracking System — Auth Security Enhancement Plan

## What's Being Fixed
- ❌ Anyone can currently register an account (major flaw)
- ❌ No OAuth support
- ❌ No refresh tokens (JWTs never expire gracefully)
- ❌ No rate limiting on auth endpoints
- ❌ No account lockout after failed attempts

## What's Being Added
- ✅ **Admin-Only User Creation** — Public registration removed; only ADMIN can create new users
- ✅ **Google OAuth 2.0** — "Sign in with Google" via Passport.js
- ✅ **Refresh Token System** — Short-lived access tokens + long-lived refresh tokens
- ✅ **Rate Limiting** — Max 5 login attempts per 15 min per IP
- ✅ **Account Lockout** — Auto-lock after 5 failed attempts for 30 min
- ✅ **Secure HTTP-only Cookies** — Refresh tokens stored in cookies, not localStorage
- ✅ **Token Blacklisting** — Logout invalidates tokens

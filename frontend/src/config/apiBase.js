/**
 * Deployed backend (production). Dev server still uses /api + Vite proxy unless you set VITE_API_BASE_URL.
 * Override anytime: VITE_API_BASE_URL=https://other-host.com (no path, no trailing slash).
 */
const PRODUCTION_BACKEND_ORIGIN = 'https://rfid-scan-psjd.onrender.com';

const raw = (import.meta.env.VITE_API_BASE_URL || '').trim();
// Prefer !DEV over PROD: PROD is false when `vite build --mode <non-production>`,
// which would incorrectly keep relative `/api` and break Netlify deploys.
const resolved =
  raw || (import.meta.env.DEV ? '' : PRODUCTION_BACKEND_ORIGIN);

export const BACKEND_ORIGIN = resolved.replace(/\/$/, '');

/** Full prefix for API routes (…/api). */
export const API_ROOT = BACKEND_ORIGIN ? `${BACKEND_ORIGIN}/api` : '/api';

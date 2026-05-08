/**
 * Production API origin (hardcoded). Local `npm run dev` uses `/api` + Vite proxy.
 */
export const BACKEND_ORIGIN =
  'https://rfid-scan-psjd.onrender.com'.replace(/\/$/, '');

/** Base path for axios + fetch — always Render in production builds */
export const API_ROOT = import.meta.env.DEV
  ? '/api'
  : `${BACKEND_ORIGIN}/api`;

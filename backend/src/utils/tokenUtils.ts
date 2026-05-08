import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import crypto from 'crypto';

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

// Short-lived access token (15 min)
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
};

// Long-lived refresh token (7 days) - stored in DB
export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};

// Keep backward compat alias
export const generateToken = generateAccessToken;
export const verifyToken = verifyAccessToken;

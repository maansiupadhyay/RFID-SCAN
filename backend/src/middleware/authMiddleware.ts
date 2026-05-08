import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokenUtils';
import { ApiResponse } from '../utils/apiResponse';
import { MESSAGES } from '../constants/messages';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ApiResponse.unauthorized(res, MESSAGES.AUTH.TOKEN_MISSING);
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      ApiResponse.unauthorized(res, MESSAGES.AUTH.TOKEN_MISSING);
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    ApiResponse.unauthorized(res, MESSAGES.AUTH.TOKEN_INVALID);
    return;
  }
};

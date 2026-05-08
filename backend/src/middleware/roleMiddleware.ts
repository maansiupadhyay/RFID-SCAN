import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { MESSAGES } from '../constants/messages';

export const roleMiddleware = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.unauthorized(res, MESSAGES.AUTH.UNAUTHORIZED);
      return;
    }

    if (!roles.includes(req.user.role)) {
      ApiResponse.forbidden(res, MESSAGES.AUTH.FORBIDDEN);
      return;
    }

    next();
  };
};

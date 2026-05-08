import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { MESSAGES } from '../constants/messages';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  // Prisma known errors
  if (err.code === 'P2002') {
    ApiResponse.conflict(res, 'A record with this unique field already exists');
    return;
  }

  if (err.code === 'P2025') {
    ApiResponse.notFound(res, 'Record not found');
    return;
  }

  // Zod validation error
  if (err.name === 'ZodError') {
    const errors = err.errors.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    ApiResponse.badRequest(res, MESSAGES.GENERAL.VALIDATION_ERROR, errors);
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    ApiResponse.unauthorized(res, MESSAGES.AUTH.TOKEN_INVALID);
    return;
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;
  ApiResponse.error(res, message, statusCode);
};

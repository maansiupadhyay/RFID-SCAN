import { Response } from 'express';

interface ApiResponseParams {
  res: Response;
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
  meta?: any;
}

export class ApiResponse {
  static send({ res, success, statusCode, message, data = null, meta = null }: ApiResponseParams): Response {
    const response: any = {
      success,
      message,
      data,
    };
    if (meta) {
      response.meta = meta;
    }
    return res.status(statusCode).json(response);
  }

  static success(res: Response, message: string, data: any = null, statusCode: number = 200, meta?: any): Response {
    return this.send({ res, success: true, statusCode, message, data, meta });
  }

  static created(res: Response, message: string, data: any = null): Response {
    return this.send({ res, success: true, statusCode: 201, message, data });
  }

  static error(res: Response, message: string, statusCode: number = 500, data: any = null): Response {
    return this.send({ res, success: false, statusCode, message, data });
  }

  static badRequest(res: Response, message: string, data: any = null): Response {
    return this.send({ res, success: false, statusCode: 400, message, data });
  }

  static unauthorized(res: Response, message: string): Response {
    return this.send({ res, success: false, statusCode: 401, message });
  }

  static forbidden(res: Response, message: string): Response {
    return this.send({ res, success: false, statusCode: 403, message });
  }

  static notFound(res: Response, message: string): Response {
    return this.send({ res, success: false, statusCode: 404, message });
  }

  static conflict(res: Response, message: string): Response {
    return this.send({ res, success: false, statusCode: 409, message });
  }
}

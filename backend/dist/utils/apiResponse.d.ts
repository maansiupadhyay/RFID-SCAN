import { Response } from 'express';
interface ApiResponseParams {
    res: Response;
    success: boolean;
    statusCode: number;
    message: string;
    data?: any;
    meta?: any;
}
export declare class ApiResponse {
    static send({ res, success, statusCode, message, data, meta }: ApiResponseParams): Response;
    static success(res: Response, message: string, data?: any, statusCode?: number, meta?: any): Response;
    static created(res: Response, message: string, data?: any): Response;
    static error(res: Response, message: string, statusCode?: number, data?: any): Response;
    static badRequest(res: Response, message: string, data?: any): Response;
    static unauthorized(res: Response, message: string): Response;
    static forbidden(res: Response, message: string): Response;
    static notFound(res: Response, message: string): Response;
    static conflict(res: Response, message: string): Response;
}
export {};
//# sourceMappingURL=apiResponse.d.ts.map
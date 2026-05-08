"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static send({ res, success, statusCode, message, data = null, meta = null }) {
        const response = {
            success,
            message,
            data,
        };
        if (meta) {
            response.meta = meta;
        }
        return res.status(statusCode).json(response);
    }
    static success(res, message, data = null, statusCode = 200, meta) {
        return this.send({ res, success: true, statusCode, message, data, meta });
    }
    static created(res, message, data = null) {
        return this.send({ res, success: true, statusCode: 201, message, data });
    }
    static error(res, message, statusCode = 500, data = null) {
        return this.send({ res, success: false, statusCode, message, data });
    }
    static badRequest(res, message, data = null) {
        return this.send({ res, success: false, statusCode: 400, message, data });
    }
    static unauthorized(res, message) {
        return this.send({ res, success: false, statusCode: 401, message });
    }
    static forbidden(res, message) {
        return this.send({ res, success: false, statusCode: 403, message });
    }
    static notFound(res, message) {
        return this.send({ res, success: false, statusCode: 404, message });
    }
    static conflict(res, message) {
        return this.send({ res, success: false, statusCode: 409, message });
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=apiResponse.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const messages_1 = require("../constants/messages");
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    // MySQL duplicate key
    if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
        apiResponse_1.ApiResponse.conflict(res, 'A record with this unique field already exists');
        return;
    }
    // Zod validation error
    if (err.name === 'ZodError') {
        const errors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        apiResponse_1.ApiResponse.badRequest(res, messages_1.MESSAGES.GENERAL.VALIDATION_ERROR, errors);
        return;
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        apiResponse_1.ApiResponse.unauthorized(res, messages_1.MESSAGES.AUTH.TOKEN_INVALID);
        return;
    }
    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || messages_1.MESSAGES.GENERAL.SERVER_ERROR;
    apiResponse_1.ApiResponse.error(res, message, statusCode);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map
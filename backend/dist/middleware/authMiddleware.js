"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const tokenUtils_1 = require("../utils/tokenUtils");
const apiResponse_1 = require("../utils/apiResponse");
const messages_1 = require("../constants/messages");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            apiResponse_1.ApiResponse.unauthorized(res, messages_1.MESSAGES.AUTH.TOKEN_MISSING);
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            apiResponse_1.ApiResponse.unauthorized(res, messages_1.MESSAGES.AUTH.TOKEN_MISSING);
            return;
        }
        const decoded = (0, tokenUtils_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        apiResponse_1.ApiResponse.unauthorized(res, messages_1.MESSAGES.AUTH.TOKEN_INVALID);
        return;
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map
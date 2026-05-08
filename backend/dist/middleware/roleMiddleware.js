"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const messages_1 = require("../constants/messages");
const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            apiResponse_1.ApiResponse.unauthorized(res, messages_1.MESSAGES.AUTH.UNAUTHORIZED);
            return;
        }
        if (!roles.includes(req.user.role)) {
            apiResponse_1.ApiResponse.forbidden(res, messages_1.MESSAGES.AUTH.FORBIDDEN);
            return;
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=roleMiddleware.js.map
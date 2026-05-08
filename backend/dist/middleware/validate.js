"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const apiResponse_1 = require("../utils/apiResponse");
const messages_1 = require("../constants/messages");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                apiResponse_1.ApiResponse.badRequest(res, messages_1.MESSAGES.GENERAL.VALIDATION_ERROR, errors);
                return;
            }
            next(error);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map
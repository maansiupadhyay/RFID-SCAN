"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transaction_service_1 = __importDefault(require("../services/transaction.service"));
const utils_1 = require("../utils");
const messages_1 = require("../constants/messages");
class TransactionController {
    constructor() {
        this.issueTool = (0, utils_1.asyncHandler)(async (req, res) => {
            const userId = req.user.userId;
            const result = await transaction_service_1.default.issueTool(userId, req.body);
            return utils_1.ApiResponse.created(res, messages_1.MESSAGES.TRANSACTION.ISSUED, result);
        });
        this.returnTool = (0, utils_1.asyncHandler)(async (req, res) => {
            const userId = req.user.userId;
            const result = await transaction_service_1.default.returnTool(userId, req.body);
            return utils_1.ApiResponse.created(res, messages_1.MESSAGES.TRANSACTION.RETURNED, result);
        });
        this.getTransactionHistory = (0, utils_1.asyncHandler)(async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await transaction_service_1.default.getTransactionHistory({ page, limit });
            return utils_1.ApiResponse.success(res, messages_1.MESSAGES.TRANSACTION.HISTORY_FETCHED, result.transactions, 200, result.meta);
        });
    }
}
exports.TransactionController = TransactionController;
exports.default = new TransactionController();
//# sourceMappingURL=transaction.controller.js.map
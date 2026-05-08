"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const transaction_repository_1 = __importDefault(require("../repositories/transaction.repository"));
const tool_repository_1 = __importDefault(require("../repositories/tool.repository"));
const messages_1 = require("../constants/messages");
class TransactionService {
    async issueTool(userId, data) {
        const tool = await tool_repository_1.default.findByCode(data.toolCode);
        if (!tool)
            throw new Error(messages_1.MESSAGES.TOOL.NOT_FOUND);
        if (tool.status === 'ISSUED')
            throw new Error(messages_1.MESSAGES.TRANSACTION.ALREADY_ISSUED);
        if (tool.status === 'MISSING')
            throw new Error(messages_1.MESSAGES.TRANSACTION.TOOL_MISSING);
        await tool_repository_1.default.update(tool.id, { status: 'ISSUED' });
        return transaction_repository_1.default.create({
            toolId: tool.id,
            userId,
            type: 'ISSUE',
            issuedTo: data.issuedTo,
            remarks: data.remarks,
        });
    }
    async returnTool(userId, data) {
        const tool = await tool_repository_1.default.findByCode(data.toolCode);
        if (!tool)
            throw new Error(messages_1.MESSAGES.TOOL.NOT_FOUND);
        if (tool.status !== 'ISSUED')
            throw new Error(messages_1.MESSAGES.TRANSACTION.NOT_ISSUED);
        await tool_repository_1.default.update(tool.id, { status: 'AVAILABLE' });
        return transaction_repository_1.default.create({
            toolId: tool.id,
            userId,
            type: 'RETURN',
            remarks: data.remarks,
        });
    }
    async getTransactionHistory(params) {
        const { page, limit } = params;
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            transaction_repository_1.default.findAll({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
            transaction_repository_1.default.count(),
        ]);
        return {
            transactions,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
}
exports.TransactionService = TransactionService;
exports.default = new TransactionService();
//# sourceMappingURL=transaction.service.js.map
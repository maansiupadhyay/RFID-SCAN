"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolService = void 0;
const tool_repository_1 = __importDefault(require("../repositories/tool.repository"));
const messages_1 = require("../constants/messages");
class ToolService {
    async getAllTools(params) {
        const { page, limit, search, status, category } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { toolCode: { contains: search } },
            ];
        }
        if (status)
            where.status = status;
        if (category)
            where.category = category;
        const [tools, total] = await Promise.all([
            tool_repository_1.default.findAll({
                skip,
                take: limit,
                where,
                orderBy: { updatedAt: 'desc' },
            }),
            tool_repository_1.default.count(where),
        ]);
        return {
            tools,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getToolById(id) {
        const tool = await tool_repository_1.default.findById(id);
        if (!tool)
            throw new Error(messages_1.MESSAGES.TOOL.NOT_FOUND);
        return tool;
    }
    async createTool(data) {
        const existingTool = await tool_repository_1.default.findByCode(data.toolCode);
        if (existingTool)
            throw new Error(messages_1.MESSAGES.TOOL.CODE_EXISTS);
        return tool_repository_1.default.create(data);
    }
    async updateTool(id, data) {
        const tool = await tool_repository_1.default.findById(id);
        if (!tool)
            throw new Error(messages_1.MESSAGES.TOOL.NOT_FOUND);
        return tool_repository_1.default.update(id, data);
    }
    async deleteTool(id) {
        return tool_repository_1.default.delete(id);
    }
}
exports.ToolService = ToolService;
exports.default = new ToolService();
//# sourceMappingURL=tool.service.js.map
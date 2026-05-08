"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolController = void 0;
const tool_service_1 = __importDefault(require("../services/tool.service"));
const utils_1 = require("../utils");
const messages_1 = require("../constants/messages");
class ToolController {
    constructor() {
        this.getAllTools = (0, utils_1.asyncHandler)(async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const status = req.query.status;
            const category = req.query.category;
            const result = await tool_service_1.default.getAllTools({ page, limit, search, status, category });
            return utils_1.ApiResponse.success(res, messages_1.MESSAGES.TOOL.LIST_FETCHED, result.tools, 200, result.meta);
        });
        this.getToolById = (0, utils_1.asyncHandler)(async (req, res) => {
            const raw = req.params.id;
            const id = parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
            const result = await tool_service_1.default.getToolById(id);
            return utils_1.ApiResponse.success(res, messages_1.MESSAGES.TOOL.FETCHED, result);
        });
        this.createTool = (0, utils_1.asyncHandler)(async (req, res) => {
            const result = await tool_service_1.default.createTool(req.body);
            return utils_1.ApiResponse.created(res, messages_1.MESSAGES.TOOL.CREATED, result);
        });
        this.updateTool = (0, utils_1.asyncHandler)(async (req, res) => {
            const raw = req.params.id;
            const id = parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
            const result = await tool_service_1.default.updateTool(id, req.body);
            return utils_1.ApiResponse.success(res, messages_1.MESSAGES.TOOL.UPDATED, result);
        });
        this.deleteTool = (0, utils_1.asyncHandler)(async (req, res) => {
            const raw = req.params.id;
            const id = parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
            await tool_service_1.default.deleteTool(id);
            return utils_1.ApiResponse.success(res, messages_1.MESSAGES.TOOL.DELETED);
        });
    }
}
exports.ToolController = ToolController;
exports.default = new ToolController();
//# sourceMappingURL=tool.controller.js.map
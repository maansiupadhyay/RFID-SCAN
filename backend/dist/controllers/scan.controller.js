"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanController = void 0;
const scan_service_1 = __importDefault(require("../services/scan.service"));
const utils_1 = require("../utils");
const messages_1 = require("../constants/messages");
class ScanController {
    constructor() {
        this.performScan = (0, utils_1.asyncHandler)(async (req, res) => {
            const userId = req.user.userId;
            const result = await scan_service_1.default.performScan(userId, req.body);
            return utils_1.ApiResponse.created(res, messages_1.MESSAGES.SCAN.COMPLETED, result);
        });
        this.getScanHistory = (0, utils_1.asyncHandler)(async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await scan_service_1.default.getScanHistory({ page, limit });
            return utils_1.ApiResponse.success(res, messages_1.MESSAGES.SCAN.HISTORY_FETCHED, result.scans, 200, result.meta);
        });
    }
}
exports.ScanController = ScanController;
exports.default = new ScanController();
//# sourceMappingURL=scan.controller.js.map
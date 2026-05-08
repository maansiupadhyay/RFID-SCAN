"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = __importDefault(require("../services/dashboard.service"));
const utils_1 = require("../utils");
const messages_1 = require("../constants/messages");
class DashboardController {
    constructor() {
        this.getStats = (0, utils_1.asyncHandler)(async (req, res) => {
            const result = await dashboard_service_1.default.getStats();
            return utils_1.ApiResponse.success(res, messages_1.MESSAGES.DASHBOARD.STATS_FETCHED, result);
        });
    }
}
exports.DashboardController = DashboardController;
exports.default = new DashboardController();
//# sourceMappingURL=dashboard.controller.js.map
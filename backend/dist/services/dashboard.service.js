"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const tool_repository_1 = __importDefault(require("../repositories/tool.repository"));
const transaction_repository_1 = __importDefault(require("../repositories/transaction.repository"));
const scan_repository_1 = __importDefault(require("../repositories/scan.repository"));
class DashboardService {
    async getStats() {
        const [totalTools, availableTools, issuedTools, missingTools, recentTransactions, latestScan,] = await Promise.all([
            tool_repository_1.default.count(),
            tool_repository_1.default.count({ status: 'AVAILABLE' }),
            tool_repository_1.default.count({ status: 'ISSUED' }),
            tool_repository_1.default.count({ status: 'MISSING' }),
            transaction_repository_1.default.findAll({ take: 10, orderBy: { createdAt: 'desc' } }),
            scan_repository_1.default.findLatest(),
        ]);
        return {
            totalTools,
            availableTools,
            issuedTools,
            missingTools,
            recentTransactions,
            latestScan,
        };
    }
}
exports.DashboardService = DashboardService;
exports.default = new DashboardService();
//# sourceMappingURL=dashboard.service.js.map
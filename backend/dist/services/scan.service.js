"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanService = void 0;
const scan_repository_1 = __importDefault(require("../repositories/scan.repository"));
const tool_repository_1 = __importDefault(require("../repositories/tool.repository"));
class ScanService {
    async performScan(userId, data) {
        const { scannedIds } = data;
        const allInventoryCodes = await tool_repository_1.default.getAllCodes();
        const scannedSet = new Set(scannedIds);
        const inventorySet = new Set(allInventoryCodes);
        const matchedTools = scannedIds.filter((id) => inventorySet.has(id));
        const extraTools = scannedIds.filter((id) => !inventorySet.has(id));
        // Find missing tools (in DB but not scanned)
        const missingTools = allInventoryCodes.filter((id) => !scannedSet.has(id));
        // Update status to MISSING only for tools that WERE available but were NOT scanned
        // This avoids marking "ISSUED" tools as "MISSING" if they are just out in the field
        if (missingTools.length > 0) {
            await tool_repository_1.default.markMissingIfCurrentlyAvailable(missingTools);
        }
        const result = {
            userId,
            scannedIds,
            matchedTools,
            missingTools,
            extraTools,
            totalScanned: scannedIds.length,
            totalMatched: matchedTools.length,
            totalMissing: missingTools.length,
            totalExtra: extraTools.length,
        };
        return scan_repository_1.default.create(result);
    }
    async getScanHistory(params) {
        const { page, limit } = params;
        const skip = (page - 1) * limit;
        const [scans, total] = await Promise.all([
            scan_repository_1.default.findAll({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
            scan_repository_1.default.count(),
        ]);
        return {
            scans,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
}
exports.ScanService = ScanService;
exports.default = new ScanService();
//# sourceMappingURL=scan.service.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class ScanRepository {
    mapScanRow(row, includeUser) {
        const base = {
            id: row.id,
            userId: row.user_id,
            scannedIds: JSON.parse(row.scanned_ids || '[]'),
            matchedTools: JSON.parse(row.matched_tools || '[]'),
            missingTools: JSON.parse(row.missing_tools || '[]'),
            extraTools: JSON.parse(row.extra_tools || '[]'),
            totalScanned: row.total_scanned,
            totalMatched: row.total_matched,
            totalMissing: row.total_missing,
            totalExtra: row.total_extra,
            createdAt: row.created_at,
        };
        if (includeUser && row.user_name != null) {
            base.user = {
                name: row.user_name,
                email: row.user_email,
            };
        }
        return base;
    }
    async create(data) {
        const [res] = await db_1.default.execute(`INSERT INTO inventory_scans (
        user_id, scanned_ids, matched_tools, missing_tools, extra_tools,
        total_scanned, total_matched, total_missing, total_extra, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`, [
            data.userId,
            JSON.stringify(data.scannedIds),
            JSON.stringify(data.matchedTools),
            JSON.stringify(data.missingTools),
            JSON.stringify(data.extraTools),
            data.totalScanned,
            data.totalMatched,
            data.totalMissing,
            data.totalExtra,
        ]);
        return this.findById(Number(res.insertId));
    }
    async findById(id) {
        const [rows] = await db_1.default.execute(`SELECT s.*, u.name AS user_name, u.email AS user_email
       FROM inventory_scans s
       INNER JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`, [id]);
        if (!rows[0])
            return null;
        return this.mapScanRow(rows[0], true);
    }
    async findAll(params) {
        const lim = Math.min(500, Math.max(1, Math.floor(Number(params.take)) || 100));
        const off = Math.max(0, Math.floor(Number(params.skip)) || 0);
        const [rows] = await db_1.default.query(`SELECT s.*, u.name AS user_name, u.email AS user_email
       FROM inventory_scans s
       INNER JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC
       LIMIT ${lim} OFFSET ${off}`);
        return rows.map((row) => this.mapScanRow(row, true));
    }
    async count() {
        const [rows] = await db_1.default.execute('SELECT COUNT(*) AS count FROM inventory_scans');
        return Number(rows[0].count);
    }
    async findLatest() {
        const [rows] = await db_1.default.execute(`SELECT * FROM inventory_scans ORDER BY created_at DESC LIMIT 1`);
        if (!rows[0])
            return null;
        return this.mapScanRow(rows[0], false);
    }
}
exports.ScanRepository = ScanRepository;
exports.default = new ScanRepository();
//# sourceMappingURL=scan.repository.js.map
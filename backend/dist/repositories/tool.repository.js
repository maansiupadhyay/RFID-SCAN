"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class ToolRepository {
    async findAll(params) {
        const limit = params.take || 10;
        const offset = params.skip || 0;
        const [rows] = await db_1.default.execute('SELECT * FROM tools ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
        return rows.map((t) => this.mapTool(t));
    }
    async count(where) {
        let query = 'SELECT COUNT(*) AS count FROM tools';
        const sqlParams = [];
        if (where && where.status) {
            query += ' WHERE status = ?';
            sqlParams.push(where.status);
        }
        const [rows] = await db_1.default.execute(query, sqlParams);
        return Number(rows[0].count);
    }
    mapTool(tool) {
        if (!tool)
            return null;
        return {
            id: Number(tool.id),
            toolCode: tool.tool_code,
            name: tool.name,
            category: tool.category,
            location: tool.location,
            status: tool.status,
            createdAt: tool.created_at,
            updatedAt: tool.updated_at,
        };
    }
    async findById(id) {
        const [rows] = await db_1.default.execute('SELECT * FROM tools WHERE id = ?', [id]);
        return this.mapTool(rows[0]);
    }
    async findByCode(toolCode) {
        const [rows] = await db_1.default.execute('SELECT * FROM tools WHERE tool_code = ?', [toolCode]);
        return this.mapTool(rows[0]);
    }
    async create(data) {
        const loc = data.location || null;
        await db_1.default.execute(`INSERT INTO tools (tool_code, name, category, location, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'AVAILABLE', NOW(3), NOW(3))`, [data.toolCode, data.name, data.category, loc]);
        return this.findByCode(data.toolCode);
    }
    async update(id, data) {
        const name = data.name !== undefined ? data.name || null : null;
        const cat = data.category !== undefined ? data.category || null : null;
        const loc = data.location !== undefined ? data.location || null : null;
        const status = data.status !== undefined ? data.status : null;
        await db_1.default.execute(`UPDATE tools SET name = COALESCE(?, name), category = COALESCE(?, category),
       location = COALESCE(?, location), status = COALESCE(?, status), updated_at = NOW(3) WHERE id = ?`, [name, cat, loc, status, id]);
        return this.findById(id);
    }
    async delete(id) {
        await db_1.default.execute('DELETE FROM tools WHERE id = ?', [id]);
    }
    async updateStatusBulk(codes, status) {
        if (codes.length === 0)
            return;
        const placeholders = codes.map(() => '?').join(',');
        await db_1.default.execute(`UPDATE tools SET status = ?, updated_at = NOW(3) WHERE tool_code IN (${placeholders})`, [status, ...codes]);
    }
    async markMissingIfCurrentlyAvailable(codes) {
        if (codes.length === 0)
            return;
        const placeholders = codes.map(() => '?').join(',');
        await db_1.default.execute(`UPDATE tools SET status = 'MISSING', updated_at = NOW(3)
       WHERE status = 'AVAILABLE' AND tool_code IN (${placeholders})`, codes);
    }
    async getAllCodes() {
        const [rows] = await db_1.default.execute('SELECT tool_code FROM tools');
        return rows.map((t) => t.tool_code);
    }
}
exports.ToolRepository = ToolRepository;
exports.default = new ToolRepository();
//# sourceMappingURL=tool.repository.js.map
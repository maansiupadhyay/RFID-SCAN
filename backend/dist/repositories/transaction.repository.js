"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
function mapTransactionRow(row) {
    return {
        id: row.id,
        toolId: row.tool_id,
        userId: row.user_id,
        type: row.type,
        issuedTo: row.issued_to,
        remarks: row.remarks,
        createdAt: row.created_at,
        tool: {
            id: Number(row.tool_pk),
            toolCode: row.tool_code,
            name: row.tool_name,
            category: row.tool_category,
            location: row.tool_location,
            status: row.tool_status,
            createdAt: row.tool_created_at,
            updatedAt: row.tool_updated_at,
        },
        user: {
            name: row.user_name,
            email: row.user_email,
        },
    };
}
const transactionSelect = `
  SELECT
    t.id,
    t.tool_id,
    t.user_id,
    t.type,
    t.issued_to,
    t.remarks,
    t.created_at,
    tl.id AS tool_pk,
    tl.tool_code,
    tl.name AS tool_name,
    tl.category AS tool_category,
    tl.location AS tool_location,
    tl.status AS tool_status,
    tl.created_at AS tool_created_at,
    tl.updated_at AS tool_updated_at,
    u.name AS user_name,
    u.email AS user_email
  FROM transactions t
  INNER JOIN tools tl ON t.tool_id = tl.id
  INNER JOIN users u ON t.user_id = u.id
`;
class TransactionRepository {
    async create(data) {
        const [res] = await db_1.default.execute(`INSERT INTO transactions (tool_id, user_id, type, issued_to, remarks, created_at)
       VALUES (?, ?, ?, ?, ?, NOW(3))`, [data.toolId, data.userId, data.type, data.issuedTo ?? null, data.remarks ?? null]);
        return this.findById(Number(res.insertId));
    }
    async findById(id) {
        const [rows] = await db_1.default.execute(`${transactionSelect} WHERE t.id = ? LIMIT 1`, [id]);
        if (!rows[0])
            return null;
        return mapTransactionRow(rows[0]);
    }
    async findAll(params) {
        const lim = Math.min(5000, Math.max(1, Math.floor(Number(params.take)) || 1000));
        const off = Math.max(0, Math.floor(Number(params.skip)) || 0);
        const [rows] = await db_1.default.query(`${transactionSelect} ORDER BY t.created_at DESC LIMIT ${lim} OFFSET ${off}`);
        return rows.map(mapTransactionRow);
    }
    async count(_where) {
        const [rows] = await db_1.default.execute('SELECT COUNT(*) AS count FROM transactions');
        return Number(rows[0].count);
    }
    async findLatestByToolId(toolId) {
        const [rows] = await db_1.default.execute(`${transactionSelect} WHERE t.tool_id = ? ORDER BY t.created_at DESC LIMIT 1`, [toolId]);
        if (!rows[0])
            return null;
        return mapTransactionRow(rows[0]);
    }
}
exports.TransactionRepository = TransactionRepository;
exports.default = new TransactionRepository();
//# sourceMappingURL=transaction.repository.js.map
import pool from '../config/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

function mapTransactionRow(row: RowDataPacket) {
  return {
    id: row.id as number,
    toolId: row.tool_id as number,
    userId: row.user_id as number,
    type: row.type as string,
    issuedTo: row.issued_to as string | null,
    remarks: row.remarks as string | null,
    createdAt: row.created_at as Date,
    tool: {
      id: Number(row.tool_pk),
      toolCode: row.tool_code as string,
      name: row.tool_name as string,
      category: row.tool_category as string,
      location: row.tool_location,
      status: row.tool_status as string,
      createdAt: row.tool_created_at as Date,
      updatedAt: row.tool_updated_at as Date,
    },
    user: {
      name: row.user_name as string,
      email: row.user_email as string,
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

export class TransactionRepository {
  async create(data: {
    toolId: number;
    userId: number;
    type: string;
    issuedTo?: string;
    remarks?: string;
  }) {
    const [res] = await pool.execute<ResultSetHeader>(
      `INSERT INTO transactions (tool_id, user_id, type, issued_to, remarks, created_at)
       VALUES (?, ?, ?, ?, ?, NOW(3))`,
      [data.toolId, data.userId, data.type, data.issuedTo ?? null, data.remarks ?? null]
    );
    return this.findById(Number(res.insertId));
  }

  private async findById(id: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `${transactionSelect} WHERE t.id = ? LIMIT 1`,
      [id]
    );
    if (!rows[0]) return null;
    return mapTransactionRow(rows[0]);
  }

  async findAll(params: { skip?: number; take?: number; where?: any; orderBy?: any }) {
    const lim = Math.min(5000, Math.max(1, Math.floor(Number(params.take)) || 1000));
    const off = Math.max(0, Math.floor(Number(params.skip)) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(
      `${transactionSelect} ORDER BY t.created_at DESC LIMIT ${lim} OFFSET ${off}`
    );
    return rows.map(mapTransactionRow);
  }

  async count(_where?: any) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) AS count FROM transactions'
    );
    return Number(rows[0].count);
  }

  async findLatestByToolId(toolId: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `${transactionSelect} WHERE t.tool_id = ? ORDER BY t.created_at DESC LIMIT 1`,
      [toolId]
    );
    if (!rows[0]) return null;
    return mapTransactionRow(rows[0]);
  }
}

export default new TransactionRepository();

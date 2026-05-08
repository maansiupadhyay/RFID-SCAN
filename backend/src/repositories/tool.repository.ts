import pool from '../config/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { CreateToolDTO, UpdateToolDTO } from '../dtos/tool.dto';

function safeLimitTake(take: number | undefined, max = 500): number {
  const n = Math.floor(Number(take));
  if (!Number.isFinite(n) || n < 1) return 10;
  return Math.min(max, n);
}

function safeSkip(skip: number | undefined): number {
  const n = Math.floor(Number(skip));
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

export class ToolRepository {
  async findAll(params: { skip?: number; take?: number; where?: any; orderBy?: any }) {
    const limit = safeLimitTake(params.take);
    const offset = safeSkip(params.skip);
    // LIMIT/OFFSET as prepared params often triggers ER_WRONG_ARGUMENTS / mysqld_stmt_execute on MySQL 8 + mysql2
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM tools ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );
    return rows.map((t) => this.mapTool(t));
  }

  async count(where?: any) {
    let query = 'SELECT COUNT(*) AS count FROM tools';
    const sqlParams: any[] = [];

    if (where && where.status) {
      query += ' WHERE status = ?';
      sqlParams.push(where.status);
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, sqlParams);
    return Number(rows[0].count);
  }

  private mapTool(tool: RowDataPacket | undefined) {
    if (!tool) return null;
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

  async findById(id: number) {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM tools WHERE id = ?', [id]);
    return this.mapTool(rows[0]);
  }

  async findByCode(toolCode: string) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM tools WHERE tool_code = ?',
      [toolCode]
    );
    return this.mapTool(rows[0]);
  }

  async create(data: CreateToolDTO) {
    const loc = data.location || null;
    await pool.execute(
      `INSERT INTO tools (tool_code, name, category, location, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'AVAILABLE', NOW(3), NOW(3))`,
      [data.toolCode, data.name, data.category, loc]
    );
    return this.findByCode(data.toolCode);
  }

  async update(id: number, data: UpdateToolDTO) {
    const name = data.name !== undefined ? data.name || null : null;
    const cat = data.category !== undefined ? data.category || null : null;
    const loc = data.location !== undefined ? data.location || null : null;
    const status = data.status !== undefined ? data.status : null;

    await pool.execute(
      `UPDATE tools SET name = COALESCE(?, name), category = COALESCE(?, category),
       location = COALESCE(?, location), status = COALESCE(?, status), updated_at = NOW(3) WHERE id = ?`,
      [name, cat, loc, status, id]
    );
    return this.findById(id);
  }

  async delete(id: number) {
    await pool.execute<ResultSetHeader>('DELETE FROM tools WHERE id = ?', [id]);
  }

  async updateStatusBulk(codes: string[], status: string) {
    if (codes.length === 0) return;
    const placeholders = codes.map(() => '?').join(',');
    await pool.execute(
      `UPDATE tools SET status = ?, updated_at = NOW(3) WHERE tool_code IN (${placeholders})`,
      [status, ...codes]
    );
  }

  async markMissingIfCurrentlyAvailable(codes: string[]) {
    if (codes.length === 0) return;
    const placeholders = codes.map(() => '?').join(',');
    await pool.execute(
      `UPDATE tools SET status = 'MISSING', updated_at = NOW(3)
       WHERE status = 'AVAILABLE' AND tool_code IN (${placeholders})`,
      codes
    );
  }

  async getAllCodes() {
    const [rows] = await pool.execute<RowDataPacket[]>('SELECT tool_code FROM tools');
    return rows.map((t) => t.tool_code as string);
  }
}

export default new ToolRepository();

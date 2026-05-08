import pool from '../config/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export class ScanRepository {
  private mapScanRow(row: RowDataPacket, includeUser: boolean) {
    const base: Record<string, unknown> = {
      id: row.id as number,
      userId: row.user_id as number,
      scannedIds: JSON.parse((row.scanned_ids as string) || '[]'),
      matchedTools: JSON.parse((row.matched_tools as string) || '[]'),
      missingTools: JSON.parse((row.missing_tools as string) || '[]'),
      extraTools: JSON.parse((row.extra_tools as string) || '[]'),
      totalScanned: row.total_scanned as number,
      totalMatched: row.total_matched as number,
      totalMissing: row.total_missing as number,
      totalExtra: row.total_extra as number,
      createdAt: row.created_at as Date,
    };
    if (includeUser && row.user_name != null) {
      base.user = {
        name: row.user_name as string,
        email: row.user_email as string,
      };
    }
    return base;
  }

  async create(data: {
    userId: number;
    scannedIds: unknown;
    matchedTools: unknown;
    missingTools: unknown;
    extraTools: unknown;
    totalScanned: number;
    totalMatched: number;
    totalMissing: number;
    totalExtra: number;
  }) {
    const [res] = await pool.execute<ResultSetHeader>(
      `INSERT INTO inventory_scans (
        user_id, scanned_ids, matched_tools, missing_tools, extra_tools,
        total_scanned, total_matched, total_missing, total_extra, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      [
        data.userId,
        JSON.stringify(data.scannedIds),
        JSON.stringify(data.matchedTools),
        JSON.stringify(data.missingTools),
        JSON.stringify(data.extraTools),
        data.totalScanned,
        data.totalMatched,
        data.totalMissing,
        data.totalExtra,
      ]
    );
    return this.findById(Number(res.insertId));
  }

  private async findById(id: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT s.*, u.name AS user_name, u.email AS user_email
       FROM inventory_scans s
       INNER JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [id]
    );
    if (!rows[0]) return null;
    return this.mapScanRow(rows[0], true);
  }

  async findAll(params: { skip?: number; take?: number; orderBy?: any }) {
    const limit = params.take ?? 100;
    const offset = params.skip ?? 0;
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT s.*, u.name AS user_name, u.email AS user_email
       FROM inventory_scans s
       INNER JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map((row) => this.mapScanRow(row, true));
  }

  async count() {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) AS count FROM inventory_scans'
    );
    return Number(rows[0].count);
  }

  async findLatest() {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM inventory_scans ORDER BY created_at DESC LIMIT 1`
    );
    if (!rows[0]) return null;
    return this.mapScanRow(rows[0], false);
  }
}

export default new ScanRepository();

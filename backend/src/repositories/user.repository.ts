import pool from '../config/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

function mapUser(row: RowDataPacket | undefined) {
  if (!row) return null;
  return {
    id: row.id as number,
    name: row.name as string,
    email: row.email as string,
    password: row.password as string | null,
    role: row.role as string,
    isActive: Boolean(row.is_active),
    oauthProvider: row.oauth_provider as string | null,
    oauthId: row.oauth_id as string | null,
    failedLoginAttempts: row.failed_login_attempts as number,
    lockedUntil: row.locked_until as Date | null,
    resetToken: row.reset_token as string | null,
    resetTokenExpires: row.reset_token_expires as Date | null,
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
  };
}

export class UserRepository {
  async findByEmail(email: string) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return mapUser(rows[0]);
  }

  async findById(id: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return mapUser(rows[0]);
  }

  async findByOAuth(provider: string, oauthId: string) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ? LIMIT 1',
      [provider, oauthId]
    );
    return mapUser(rows[0]);
  }

  async findByResetToken(token: string) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW(3) LIMIT 1',
      [token]
    );
    return mapUser(rows[0]);
  }

  async create(data: { name: string; email: string; password?: string; role?: string }) {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      [data.name, data.email, data.password ?? null, data.role || 'OPERATOR']
    );
    return this.findById(Number(result.insertId));
  }

  async createOAuthUser(data: {
    name: string;
    email: string;
    oauthProvider: string;
    oauthId: string;
    role?: string;
  }) {
    const [res] = await pool.execute<ResultSetHeader>(
      `INSERT INTO users (name, email, oauth_provider, oauth_id, role) VALUES (?, ?, ?, ?, ?)`,
      [data.name, data.email, data.oauthProvider, data.oauthId, data.role || 'OPERATOR']
    );
    return this.findById(Number(res.insertId));
  }

  async setResetToken(id: number, token: string, expires: Date) {
    await pool.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [token, expires, id]
    );
    return this.findById(id);
  }

  async resetPassword(id: number, hashedPassword: string) {
    await pool.execute(
      `UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL,
       failed_login_attempts = 0, locked_until = NULL WHERE id = ?`,
      [hashedPassword, id]
    );
    return this.findById(id);
  }

  async incrementFailedAttempts(id: number) {
    await pool.execute(
      'UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ?',
      [id]
    );
    return this.findById(id);
  }

  async lockAccount(id: number, until: Date) {
    await pool.execute('UPDATE users SET locked_until = ? WHERE id = ?', [until, id]);
    return this.findById(id);
  }

  async resetFailedAttempts(id: number) {
    await pool.execute(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?',
      [id]
    );
    return this.findById(id);
  }

  async deactivate(id: number) {
    await pool.execute('UPDATE users SET is_active = FALSE WHERE id = ?', [id]);
    return this.findById(id);
  }

  async findAll() {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name, email, role, is_active, created_at, oauth_provider FROM users ORDER BY id`
    );
    return rows.map((row) => ({
      id: row.id as number,
      name: row.name as string,
      email: row.email as string,
      role: row.role as string,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at as Date,
      oauthProvider: row.oauth_provider as string | null,
    }));
  }
}

export default new UserRepository();

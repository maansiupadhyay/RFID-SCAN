import pool from '../config/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

function mapUserFromRefreshJoin(row: RowDataPacket) {
  return {
    id: row.u_id as number,
    name: row.u_name as string,
    email: row.u_email as string,
    password: row.u_password as string | null,
    role: row.u_role as string,
    isActive: Boolean(row.u_is_active),
    oauthProvider: row.u_oauth_provider as string | null,
    oauthId: row.u_oauth_id as string | null,
    failedLoginAttempts: row.u_failed_login_attempts as number,
    lockedUntil: row.u_locked_until as Date | null,
    resetToken: row.u_reset_token as string | null,
    resetTokenExpires: row.u_reset_token_expires as Date | null,
    createdAt: row.u_created_at as Date,
    updatedAt: row.u_updated_at as Date,
  };
}

export class RefreshTokenRepository {
  async create(userId: number, token: string, expiresAt: Date) {
    const [res] = await pool.execute<ResultSetHeader>(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`,
      [userId, token, expiresAt]
    );
    return { id: Number(res.insertId), userId, token, expiresAt };
  }

  async findByToken(token: string) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT
         rt.id AS rt_id, rt.token AS rt_token, rt.user_id, rt.expires_at AS rt_expires_at, rt.created_at AS rt_created_at,
         u.id AS u_id, u.name AS u_name, u.email AS u_email, u.password AS u_password, u.role AS u_role,
         u.is_active AS u_is_active, u.oauth_provider AS u_oauth_provider, u.oauth_id AS u_oauth_id,
         u.failed_login_attempts AS u_failed_login_attempts, u.locked_until AS u_locked_until,
         u.reset_token AS u_reset_token, u.reset_token_expires AS u_reset_token_expires,
         u.created_at AS u_created_at, u.updated_at AS u_updated_at
       FROM refresh_tokens rt
       INNER JOIN users u ON rt.user_id = u.id
       WHERE rt.token = ?
       LIMIT 1`,
      [token]
    );
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.rt_id as number,
      token: row.rt_token as string,
      userId: row.user_id as number,
      expiresAt: row.rt_expires_at as Date,
      createdAt: row.rt_created_at as Date,
      user: mapUserFromRefreshJoin(row),
    };
  }

  async deleteByToken(token: string) {
    await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
  }

  async deleteAllForUser(userId: number) {
    await pool.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
  }

  async deleteExpired() {
    await pool.execute('DELETE FROM refresh_tokens WHERE expires_at < NOW(3)');
  }
}

export default new RefreshTokenRepository();

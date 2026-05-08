"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
function mapUserFromRefreshJoin(row) {
    return {
        id: row.u_id,
        name: row.u_name,
        email: row.u_email,
        password: row.u_password,
        role: row.u_role,
        isActive: Boolean(row.u_is_active),
        oauthProvider: row.u_oauth_provider,
        oauthId: row.u_oauth_id,
        failedLoginAttempts: row.u_failed_login_attempts,
        lockedUntil: row.u_locked_until,
        resetToken: row.u_reset_token,
        resetTokenExpires: row.u_reset_token_expires,
        createdAt: row.u_created_at,
        updatedAt: row.u_updated_at,
    };
}
class RefreshTokenRepository {
    async create(userId, token, expiresAt) {
        const [res] = await db_1.default.execute(`INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`, [userId, token, expiresAt]);
        return { id: Number(res.insertId), userId, token, expiresAt };
    }
    async findByToken(token) {
        const [rows] = await db_1.default.execute(`SELECT
         rt.id AS rt_id, rt.token AS rt_token, rt.user_id, rt.expires_at AS rt_expires_at, rt.created_at AS rt_created_at,
         u.id AS u_id, u.name AS u_name, u.email AS u_email, u.password AS u_password, u.role AS u_role,
         u.is_active AS u_is_active, u.oauth_provider AS u_oauth_provider, u.oauth_id AS u_oauth_id,
         u.failed_login_attempts AS u_failed_login_attempts, u.locked_until AS u_locked_until,
         u.reset_token AS u_reset_token, u.reset_token_expires AS u_reset_token_expires,
         u.created_at AS u_created_at, u.updated_at AS u_updated_at
       FROM refresh_tokens rt
       INNER JOIN users u ON rt.user_id = u.id
       WHERE rt.token = ?
       LIMIT 1`, [token]);
        const row = rows[0];
        if (!row)
            return null;
        return {
            id: row.rt_id,
            token: row.rt_token,
            userId: row.user_id,
            expiresAt: row.rt_expires_at,
            createdAt: row.rt_created_at,
            user: mapUserFromRefreshJoin(row),
        };
    }
    async deleteByToken(token) {
        await db_1.default.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
    }
    async deleteAllForUser(userId) {
        await db_1.default.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
    }
    async deleteExpired() {
        await db_1.default.execute('DELETE FROM refresh_tokens WHERE expires_at < NOW(3)');
    }
}
exports.RefreshTokenRepository = RefreshTokenRepository;
exports.default = new RefreshTokenRepository();
//# sourceMappingURL=refreshToken.repository.js.map
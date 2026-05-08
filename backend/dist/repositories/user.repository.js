"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
function mapUser(row) {
    if (!row)
        return null;
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        isActive: Boolean(row.is_active),
        oauthProvider: row.oauth_provider,
        oauthId: row.oauth_id,
        failedLoginAttempts: row.failed_login_attempts,
        lockedUntil: row.locked_until,
        resetToken: row.reset_token,
        resetTokenExpires: row.reset_token_expires,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
class UserRepository {
    async findByEmail(email) {
        const [rows] = await db_1.default.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        return mapUser(rows[0]);
    }
    async findById(id) {
        const [rows] = await db_1.default.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
        return mapUser(rows[0]);
    }
    async findByOAuth(provider, oauthId) {
        const [rows] = await db_1.default.execute('SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ? LIMIT 1', [provider, oauthId]);
        return mapUser(rows[0]);
    }
    async findByResetToken(token) {
        const [rows] = await db_1.default.execute('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW(3) LIMIT 1', [token]);
        return mapUser(rows[0]);
    }
    async create(data) {
        const [result] = await db_1.default.execute(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, [data.name, data.email, data.password ?? null, data.role || 'OPERATOR']);
        return this.findById(Number(result.insertId));
    }
    async createOAuthUser(data) {
        const [res] = await db_1.default.execute(`INSERT INTO users (name, email, oauth_provider, oauth_id, role) VALUES (?, ?, ?, ?, ?)`, [data.name, data.email, data.oauthProvider, data.oauthId, data.role || 'OPERATOR']);
        return this.findById(Number(res.insertId));
    }
    async setResetToken(id, token, expires) {
        await db_1.default.execute('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [token, expires, id]);
        return this.findById(id);
    }
    async resetPassword(id, hashedPassword) {
        await db_1.default.execute(`UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL,
       failed_login_attempts = 0, locked_until = NULL WHERE id = ?`, [hashedPassword, id]);
        return this.findById(id);
    }
    async incrementFailedAttempts(id) {
        await db_1.default.execute('UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ?', [id]);
        return this.findById(id);
    }
    async lockAccount(id, until) {
        await db_1.default.execute('UPDATE users SET locked_until = ? WHERE id = ?', [until, id]);
        return this.findById(id);
    }
    async resetFailedAttempts(id) {
        await db_1.default.execute('UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?', [id]);
        return this.findById(id);
    }
    async deactivate(id) {
        await db_1.default.execute('UPDATE users SET is_active = FALSE WHERE id = ?', [id]);
        return this.findById(id);
    }
    async findAll() {
        const [rows] = await db_1.default.execute(`SELECT id, name, email, role, is_active, created_at, oauth_provider FROM users ORDER BY id`);
        return rows.map((row) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role,
            isActive: Boolean(row.is_active),
            createdAt: row.created_at,
            oauthProvider: row.oauth_provider,
        }));
    }
}
exports.UserRepository = UserRepository;
exports.default = new UserRepository();
//# sourceMappingURL=user.repository.js.map
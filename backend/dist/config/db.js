"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const env_1 = require("./env");
function createPoolFromUrl(databaseUrl) {
    const u = new URL(databaseUrl);
    const database = u.pathname.replace(/^\//, '').split('?')[0];
    return (0, promise_1.createPool)({
        host: u.hostname,
        port: Number(u.port || 3306),
        user: decodeURIComponent(u.username),
        password: decodeURIComponent(u.password || ''),
        database,
        waitForConnections: true,
        connectionLimit: 10,
        enableKeepAlive: true,
    });
}
const pool = createPoolFromUrl(env_1.env.DATABASE_URL);
exports.default = pool;
//# sourceMappingURL=db.js.map
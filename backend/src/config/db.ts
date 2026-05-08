import { createPool, Pool } from 'mysql2/promise';
import { env } from './env';

function createPoolFromUrl(databaseUrl: string): Pool {
  const u = new URL(databaseUrl);
  const database = u.pathname.replace(/^\//, '').split('?')[0];
  return createPool({
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

const pool = createPoolFromUrl(env.DATABASE_URL);

export default pool;

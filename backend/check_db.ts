import './src/config/env';
import pool from './src/config/db';
import type { RowDataPacket } from 'mysql2';

async function check() {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM tools LIMIT 1');
  if (rows && rows.length > 0) {
    console.log('KEYS:', Object.keys(rows[0]));
    console.log('SAMPLE:', rows[0]);
  } else {
    console.log('No tools found');
  }
  await pool.end();
  process.exit(0);
}

check();

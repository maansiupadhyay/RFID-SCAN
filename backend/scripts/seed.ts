import '../src/config/env';
import pool from '../src/config/db';
import bcrypt from 'bcryptjs';
import type { ResultSetHeader } from 'mysql2';

async function main() {
  console.log('🌱 Seeding database...');

  await pool.execute('DELETE FROM refresh_tokens');
  await pool.execute('DELETE FROM inventory_scans');
  await pool.execute('DELETE FROM transactions');
  await pool.execute('DELETE FROM tools');
  await pool.execute('DELETE FROM users');

  const hashedPassword = await bcrypt.hash('password123', 12);

  const [adminRes] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'ADMIN')`,
    ['Admin User', 'admin@rfid.com', hashedPassword]
  );
  const adminId = adminRes.insertId;

  const [opRes] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'OPERATOR')`,
    ['Operator User', 'operator@rfid.com', hashedPassword]
  );
  const operatorId = opRes.insertId;

  console.log('✅ Users created');

  const toolsData = [
    { toolCode: 'RFID-0001', name: 'Drill Machine - Bosch', category: 'Power Tools', location: 'Warehouse A' },
    { toolCode: 'RFID-0002', name: 'Digital Multimeter - Fluke', category: 'Electronics', location: 'Main Lab' },
    { toolCode: 'RFID-0003', name: 'Angle Grinder - Makita', category: 'Power Tools', location: 'Warehouse A' },
    { toolCode: 'RFID-0004', name: 'Torque Wrench - Snap-on', category: 'Hand Tools', location: 'Tool Crib 1' },
    { toolCode: 'RFID-0005', name: 'Laser Level - Dewalt', category: 'Measurement', location: 'Zone B' },
    { toolCode: 'RFID-0006', name: 'Soldering Station - Weller', category: 'Electronics', location: 'Main Lab' },
    { toolCode: 'RFID-0007', name: 'Hydraulic Jack - 2 Ton', category: 'Power Tools', location: 'Service Bay' },
    { toolCode: 'RFID-0008', name: 'Safety Helmet - Industrial', category: 'Safety Gear', location: 'Tool Crib 1' },
    { toolCode: 'RFID-0009', name: 'Caliper - Mitutoyo', category: 'Measurement', location: 'Main Lab' },
    { toolCode: 'RFID-0010', name: 'Hammer Set - 3pc', category: 'Hand Tools', location: 'Warehouse A' },
    { toolCode: 'RFID-0011', name: 'Circular Saw', category: 'Power Tools', location: 'Warehouse A' },
    { toolCode: 'RFID-0012', name: 'Oscilloscope', category: 'Electronics', location: 'Main Lab' },
    { toolCode: 'RFID-0013', name: 'Screwdriver Set', category: 'Hand Tools', location: 'Tool Crib 1' },
    { toolCode: 'RFID-0014', name: 'Safety Harness', category: 'Safety Gear', location: 'Zone B' },
    { toolCode: 'RFID-0015', name: 'Micrometer', category: 'Measurement', location: 'Main Lab' },
  ];

  const toolIds: number[] = [];
  for (const t of toolsData) {
    const [ins] = await pool.execute<ResultSetHeader>(
      `INSERT INTO tools (tool_code, name, category, location, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'AVAILABLE', NOW(3), NOW(3))`,
      [t.toolCode, t.name, t.category, t.location]
    );
    toolIds.push(ins.insertId);
  }

  console.log('✅ Tools created');

  await pool.execute(
    `INSERT INTO transactions (tool_id, user_id, type, issued_to, remarks, created_at)
     VALUES (?, ?, 'ISSUE', 'John Doe', 'Project Alpha', NOW(3))`,
    [toolIds[0], adminId]
  );
  await pool.execute(`UPDATE tools SET status = 'ISSUED', updated_at = NOW(3) WHERE id = ?`, [toolIds[0]]);

  await pool.execute(
    `INSERT INTO transactions (tool_id, user_id, type, issued_to, remarks, created_at)
     VALUES (?, ?, 'ISSUE', 'Jane Smith', 'Circuit Repair', NOW(3))`,
    [toolIds[1], operatorId]
  );
  await pool.execute(`UPDATE tools SET status = 'ISSUED', updated_at = NOW(3) WHERE id = ?`, [toolIds[1]]);

  console.log('✅ Transactions created');

  await pool.execute(
    `INSERT INTO inventory_scans (
       user_id, scanned_ids, matched_tools, missing_tools, extra_tools,
       total_scanned, total_matched, total_missing, total_extra, created_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`,
    [
      adminId,
      JSON.stringify(['RFID-0001', 'RFID-0002', 'RFID-0004', 'RFID-9999']),
      JSON.stringify(['RFID-0001', 'RFID-0002', 'RFID-0004']),
      JSON.stringify(['RFID-0003', 'RFID-0005', 'RFID-0006', 'RFID-0007']),
      JSON.stringify(['RFID-9999']),
      4, 3, 4, 1,
    ]
  );

  console.log('✅ Sample scan created');
  console.log('✨ Seeding complete!');
  console.log('\n📌 Test credentials:');
  console.log('   Admin    → admin@rfid.com    / password123');
  console.log('   Operator → operator@rfid.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });

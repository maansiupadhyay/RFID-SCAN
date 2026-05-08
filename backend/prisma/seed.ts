import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clear existing data
  await prisma.inventoryScan.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@rfid.com', password: hashedPassword, role: 'ADMIN' },
  });

  const operator = await prisma.user.create({
    data: { name: 'Operator User', email: 'operator@rfid.com', password: hashedPassword, role: 'OPERATOR' },
  });

  console.log('✅ Users created');

  // 3. Create Tools
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

  const tools: any[] = [];
  for (const t of toolsData) {
    const tool = await prisma.tool.create({ data: t });
    tools.push(tool);
  }

  console.log('✅ Tools created');

  // 4. Issue first two tools
  await prisma.transaction.create({
    data: { toolId: tools[0].id, userId: admin.id, type: 'ISSUE', issuedTo: 'John Doe', remarks: 'Project Alpha' },
  });
  await prisma.tool.update({ where: { id: tools[0].id }, data: { status: 'ISSUED' } });

  await prisma.transaction.create({
    data: { toolId: tools[1].id, userId: operator.id, type: 'ISSUE', issuedTo: 'Jane Smith', remarks: 'Circuit Repair' },
  });
  await prisma.tool.update({ where: { id: tools[1].id }, data: { status: 'ISSUED' } });

  console.log('✅ Transactions created');

  // 5. Sample scan
  await prisma.inventoryScan.create({
    data: {
      userId: admin.id,
      scannedIds: JSON.stringify(['RFID-0001', 'RFID-0002', 'RFID-0004', 'RFID-9999']),
      matchedTools: JSON.stringify(['RFID-0001', 'RFID-0002', 'RFID-0004']),
      missingTools: JSON.stringify(['RFID-0003', 'RFID-0005', 'RFID-0006', 'RFID-0007']),
      extraTools: JSON.stringify(['RFID-9999']),
      totalScanned: 4,
      totalMatched: 3,
      totalMissing: 4,
      totalExtra: 1,
    },
  });

  console.log('✅ Sample scan created');
  console.log('✨ Seeding complete!');
  console.log('\n📌 Test credentials:');
  console.log('   Admin    → admin@rfid.com    / password123');
  console.log('   Operator → operator@rfid.com / password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

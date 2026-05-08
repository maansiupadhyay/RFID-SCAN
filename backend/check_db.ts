import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const result: any = await prisma.$queryRaw`SELECT * FROM tools LIMIT 1`;
  if (result && result.length > 0) {
    console.log('KEYS:', Object.keys(result[0]));
    console.log('SAMPLE:', result[0]);
  } else {
    console.log('No tools found');
  }
  process.exit(0);
}

check();

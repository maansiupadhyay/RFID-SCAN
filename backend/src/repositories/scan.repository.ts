import prisma from '../config/prisma';

export class ScanRepository {
  async create(data: {
    userId: number;
    scannedIds: any;
    matchedTools: any;
    missingTools: any;
    extraTools: any;
    totalScanned: number;
    totalMatched: number;
    totalMissing: number;
    totalExtra: number;
  }) {
    const scan = await prisma.inventoryScan.create({
      data: {
        userId: data.userId,
        scannedIds: JSON.stringify(data.scannedIds),
        matchedTools: JSON.stringify(data.matchedTools),
        missingTools: JSON.stringify(data.missingTools),
        extraTools: JSON.stringify(data.extraTools),
        totalScanned: data.totalScanned,
        totalMatched: data.totalMatched,
        totalMissing: data.totalMissing,
        totalExtra: data.totalExtra,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
    return this.parseScan(scan);
  }

  private parseScan(scan: any) {
    return {
      ...scan,
      scannedIds: JSON.parse(scan.scannedIds || '[]'),
      matchedTools: JSON.parse(scan.matchedTools || '[]'),
      missingTools: JSON.parse(scan.missingTools || '[]'),
      extraTools: JSON.parse(scan.extraTools || '[]'),
    };
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    orderBy?: any;
  }) {
    const scans = await prisma.inventoryScan.findMany({
      ...params,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
    return scans.map(this.parseScan);
  }

  async count() {
    return prisma.inventoryScan.count();
  }

  async findLatest() {
    const scan = await prisma.inventoryScan.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    if (!scan) return null;
    return this.parseScan(scan);
  }
}

export default new ScanRepository();

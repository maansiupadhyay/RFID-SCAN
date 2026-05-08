import prisma from '../config/prisma';

export class TransactionRepository {
  async create(data: {
    toolId: number;
    userId: number;
    type: string;
    issuedTo?: string;
    remarks?: string;
  }) {
    return prisma.transaction.create({
      data,
      include: {
        tool: true,
        user: { select: { name: true, email: true } },
      },
    });
  }

  async findAll(params: { skip?: number; take?: number; where?: any; orderBy?: any }) {
    return prisma.transaction.findMany({
      ...params,
      include: {
        tool: true,
        user: { select: { name: true, email: true } },
      },
    });
  }

  async count(where?: any) {
    return prisma.transaction.count({ where });
  }

  async findLatestByToolId(toolId: number) {
    return prisma.transaction.findFirst({
      where: { toolId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new TransactionRepository();

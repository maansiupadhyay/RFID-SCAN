import prisma from '../config/prisma';

export class RefreshTokenRepository {
  async create(userId: number, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteByToken(token: string) {
    return prisma.refreshToken.deleteMany({ where: { token } });
  }

  async deleteAllForUser(userId: number) {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  }

  async deleteExpired() {
    return prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}

export default new RefreshTokenRepository();

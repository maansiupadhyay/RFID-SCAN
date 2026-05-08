import prisma from '../config/prisma';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByOAuth(provider: string, oauthId: string) {
    return prisma.user.findFirst({ where: { oauthProvider: provider, oauthId } });
  }

  async findByResetToken(token: string) {
    return prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });
  }

  async create(data: { name: string; email: string; password?: string; role?: string }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password || null,
        role: data.role || 'OPERATOR',
      },
    });
  }

  async createOAuthUser(data: { name: string; email: string; oauthProvider: string; oauthId: string; role?: string }) {
    return prisma.user.create({ data: { ...data, role: data.role || 'OPERATOR' } });
  }

  async setResetToken(id: number, token: string, expires: Date) {
    return prisma.user.update({
      where: { id },
      data: { resetToken: token, resetTokenExpires: expires },
    });
  }

  async resetPassword(id: number, hashedPassword: string) {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpires: null, failedLoginAttempts: 0, lockedUntil: null },
    });
  }

  async incrementFailedAttempts(id: number) {
    return prisma.user.update({ where: { id }, data: { failedLoginAttempts: { increment: 1 } } });
  }

  async lockAccount(id: number, until: Date) {
    return prisma.user.update({ where: { id }, data: { lockedUntil: until } });
  }

  async resetFailedAttempts(id: number) {
    return prisma.user.update({ where: { id }, data: { failedLoginAttempts: 0, lockedUntil: null } });
  }

  async deactivate(id: number) {
    return prisma.user.update({ where: { id }, data: { isActive: false } });
  }

  async findAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, oauthProvider: true },
    });
  }
}

export default new UserRepository();

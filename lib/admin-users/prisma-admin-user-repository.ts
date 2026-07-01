import type { AdminUser as PrismaAdminUser } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import type { AdminUserRecord } from "@/lib/admin-users/admin-user-types";
import type { AdminUserRepository } from "@/lib/admin-users/admin-user-repository";

function toRecord(user: PrismaAdminUser): AdminUserRecord {
  return {
    id: user.id,
    email: user.email,
    passwordHash: user.passwordHash ?? "",
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export class PrismaAdminUserRepository implements AdminUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async list(): Promise<AdminUserRecord[]> {
    const users = await this.prisma.adminUser.findMany({
      orderBy: { createdAt: "asc" },
    });
    return users.map(toRecord);
  }

  async findByEmail(email: string): Promise<AdminUserRecord | null> {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    return user ? toRecord(user) : null;
  }

  async create(input: {
    email: string;
    passwordHash: string;
    role: AdminUserRecord["role"];
  }): Promise<AdminUserRecord> {
    const user = await this.prisma.adminUser.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
      },
    });
    return toRecord(user);
  }

  async count(): Promise<number> {
    return this.prisma.adminUser.count();
  }

  async upsertBootstrap(input: {
    email: string;
    passwordHash: string;
    role: AdminUserRecord["role"];
  }): Promise<void> {
    await this.prisma.adminUser.upsert({
      where: { email: input.email },
      create: {
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
      },
      update: {
        passwordHash: input.passwordHash,
        role: input.role,
      },
    });
  }
}

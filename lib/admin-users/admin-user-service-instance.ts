import { isDatabaseEnabled } from "@/lib/db/is-database-enabled";
import { getPrismaClient } from "@/lib/prisma/client";
import { InMemoryAdminUserRepository } from "@/lib/admin-users/in-memory-admin-user-repository";
import { PrismaAdminUserRepository } from "@/lib/admin-users/prisma-admin-user-repository";
import { AdminUserService } from "@/lib/admin-users/admin-user-service";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const adminUserService = getOrCreateGlobalSingleton("__rclubAdminUserService", () => {
  const repository = isDatabaseEnabled()
    ? new PrismaAdminUserRepository(getPrismaClient())
    : new InMemoryAdminUserRepository();

  return new AdminUserService(repository);
});

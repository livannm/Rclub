import { isDatabaseEnabled } from "@/lib/db/is-database-enabled";
import { getPrismaClient } from "@/lib/prisma/client";
import { InMemoryPrivatizationRepository } from "@/lib/privatizations/in-memory-privatization-repository";
import { PrismaPrivatizationRepository } from "@/lib/privatizations/prisma-privatization-repository";
import { PrivatizationService } from "@/lib/privatizations/privatization-service";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const privatizationService = getOrCreateGlobalSingleton(
  "__rclubPrivatizationService",
  () => {
    const repository = isDatabaseEnabled()
      ? new PrismaPrivatizationRepository(getPrismaClient())
      : new InMemoryPrivatizationRepository();

    return new PrivatizationService(repository);
  }
);

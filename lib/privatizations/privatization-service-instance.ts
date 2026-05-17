import { InMemoryPrivatizationRepository } from "@/lib/privatizations/in-memory-privatization-repository";
import { PrivatizationService } from "@/lib/privatizations/privatization-service";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const privatizationService = getOrCreateGlobalSingleton(
  "__rclubPrivatizationService",
  () => new PrivatizationService(new InMemoryPrivatizationRepository())
);

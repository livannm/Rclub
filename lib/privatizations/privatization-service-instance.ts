import { InMemoryPrivatizationRepository } from "@/lib/privatizations/in-memory-privatization-repository";
import { PrivatizationService } from "@/lib/privatizations/privatization-service";

const globalPrivatizationService = globalThis as typeof globalThis & {
  __rclubPrivatizationService?: PrivatizationService;
};

if (!globalPrivatizationService.__rclubPrivatizationService) {
  globalPrivatizationService.__rclubPrivatizationService = new PrivatizationService(
    new InMemoryPrivatizationRepository()
  );
}

export const privatizationService = globalPrivatizationService.__rclubPrivatizationService;

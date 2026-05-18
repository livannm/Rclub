import { isDatabaseEnabled } from "@/lib/db/is-database-enabled";
import { InMemoryEventRepository } from "@/lib/events/in-memory-event-repository";
import { PrismaEventRepository } from "@/lib/events/prisma-event-repository";
import { EventService } from "@/lib/events/events-service";
import { getPrismaClient } from "@/lib/prisma/client";
import { DEMO_EVENTS } from "@/lib/seed/demo-content";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const eventService = getOrCreateGlobalSingleton("__rclubEventService", () => {
  const repository = isDatabaseEnabled()
    ? new PrismaEventRepository(getPrismaClient())
    : new InMemoryEventRepository(DEMO_EVENTS);

  return new EventService(repository);
});

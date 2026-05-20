import { isDatabaseEnabled } from "@/lib/db/is-database-enabled";
import { InMemoryEventRepository } from "@/lib/events/in-memory-event-repository";
import { PrismaEventRepository } from "@/lib/events/prisma-event-repository";
import { EventService } from "@/lib/events/events-service";
import { getPrismaClient } from "@/lib/prisma/client";
import { DEMO_EVENTS } from "@/lib/seed/demo-content";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

/** Toujours Prisma quand DATABASE_URL est défini (pas de cache démo figé). */
export function getEventService(): EventService {
  if (isDatabaseEnabled()) {
    return new EventService(new PrismaEventRepository(getPrismaClient()));
  }

  return getOrCreateGlobalSingleton("__rclubEventServiceMemory", () =>
    new EventService(new InMemoryEventRepository(DEMO_EVENTS)),
  );
}

/** Compat — délègue à getEventService() à chaque appel. */
export const eventService: EventService = new Proxy({} as EventService, {
  get(_target, prop) {
    const service = getEventService();
    const value = service[prop as keyof EventService];
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(service);
    }
    return value;
  },
});

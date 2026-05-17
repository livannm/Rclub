import { InMemoryEventRepository } from "@/lib/events/in-memory-event-repository";
import { EventService } from "@/lib/events/events-service";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const eventService = getOrCreateGlobalSingleton(
  "__rclubEventService",
  () => new EventService(new InMemoryEventRepository())
);

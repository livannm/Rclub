import { InMemoryEventRepository } from "@/lib/events/in-memory-event-repository";
import { EventService } from "@/lib/events/events-service";

const globalEventsService = globalThis as typeof globalThis & {
  __rclubEventService?: EventService;
};

if (!globalEventsService.__rclubEventService) {
  globalEventsService.__rclubEventService = new EventService(new InMemoryEventRepository());
}

export const eventService = globalEventsService.__rclubEventService;

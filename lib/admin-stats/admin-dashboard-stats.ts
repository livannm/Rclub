import type { EventService } from "@/lib/events/events-service";
import type { GalleryService } from "@/lib/gallery/gallery-service";
import type { PrivatizationService } from "@/lib/privatizations/privatization-service";
import type { ReservationService } from "@/lib/reservations/reservation-service";

export type AdminDashboardStats = {
  events: {
    total: number;
    published: number;
    upcomingPublished: number;
  };
  requests: {
    reservationsTotal: number;
    reservationsNew: number;
    privatizationsTotal: number;
    privatizationsNew: number;
  };
  gallery: {
    photosTotal: number;
    eventsWithPhotos: number;
  };
};

type AdminDashboardStatsServices = {
  eventService: EventService;
  reservationService: ReservationService;
  privatizationService: PrivatizationService;
  galleryService: GalleryService;
};

export class AdminDashboardStatsService {
  constructor(private readonly services: AdminDashboardStatsServices) {}

  async getStats(nowIso = new Date().toISOString()): Promise<AdminDashboardStats> {
    const [events, reservations, privatizations] = await Promise.all([
      this.services.eventService.listAll(),
      this.services.reservationService.listAll(),
      this.services.privatizationService.listAll()
    ]);

    const photosByEvent = await Promise.all(
      events.map(async (event) => this.services.galleryService.getPhotosForEvent(event.id))
    );
    const now = new Date(nowIso).getTime();
    const publishedEvents = events.filter((event) => event.is_published);

    return {
      events: {
        total: events.length,
        published: publishedEvents.length,
        upcomingPublished: publishedEvents.filter(
          (event) => new Date(event.starts_at).getTime() >= now
        ).length
      },
      requests: {
        reservationsTotal: reservations.length,
        reservationsNew: reservations.filter((request) => request.status === "new").length,
        privatizationsTotal: privatizations.length,
        privatizationsNew: privatizations.filter((request) => request.status === "new").length
      },
      gallery: {
        photosTotal: photosByEvent.reduce((total, photos) => total + photos.length, 0),
        eventsWithPhotos: photosByEvent.filter((photos) => photos.length > 0).length
      }
    };
  }
}

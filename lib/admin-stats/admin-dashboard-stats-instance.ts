import { eventService } from "@/lib/events/events-service-instance";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { privatizationService } from "@/lib/privatizations/privatization-service-instance";
import { reservationService } from "@/lib/reservations/reservation-service-instance";
import { AdminDashboardStatsService } from "@/lib/admin-stats/admin-dashboard-stats";

// NOTE: pas de singleton ici — ce service est stateless (juste un orchestrateur
// au-dessus des autres services) et l'utilisation d'un singleton globalThis
// causait des erreurs après HMR quand le shape de la classe évoluait : l'ancienne
// instance restait en cache. Le coût d'instanciation est nul.
export const adminDashboardStatsService = new AdminDashboardStatsService({
  eventService,
  galleryService,
  privatizationService,
  reservationService
});

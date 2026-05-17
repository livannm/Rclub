import { eventService } from "@/lib/events/events-service-instance";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { privatizationService } from "@/lib/privatizations/privatization-service-instance";
import { reservationService } from "@/lib/reservations/reservation-service-instance";
import { AdminDashboardStatsService } from "@/lib/admin-stats/admin-dashboard-stats";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const adminDashboardStatsService = getOrCreateGlobalSingleton(
  "__rclubAdminDashboardStatsService",
  () =>
    new AdminDashboardStatsService({
      eventService,
      galleryService,
      privatizationService,
      reservationService
    })
);

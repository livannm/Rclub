import { InMemoryReservationRepository } from "@/lib/reservations/in-memory-reservation-repository";
import { ReservationService } from "@/lib/reservations/reservation-service";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const reservationService = getOrCreateGlobalSingleton(
  "__rclubReservationService",
  () => new ReservationService(new InMemoryReservationRepository())
);

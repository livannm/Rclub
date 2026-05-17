import { InMemoryReservationRepository } from "@/lib/reservations/in-memory-reservation-repository";
import { ReservationService } from "@/lib/reservations/reservation-service";

const globalReservationService = globalThis as typeof globalThis & {
  __rclubReservationService?: ReservationService;
};

if (!globalReservationService.__rclubReservationService) {
  globalReservationService.__rclubReservationService = new ReservationService(
    new InMemoryReservationRepository()
  );
}

export const reservationService = globalReservationService.__rclubReservationService;

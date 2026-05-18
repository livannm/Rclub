import { isDatabaseEnabled } from "@/lib/db/is-database-enabled";
import { getPrismaClient } from "@/lib/prisma/client";
import { InMemoryReservationRepository } from "@/lib/reservations/in-memory-reservation-repository";
import { PrismaReservationRepository } from "@/lib/reservations/prisma-reservation-repository";
import { ReservationService } from "@/lib/reservations/reservation-service";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const reservationService = getOrCreateGlobalSingleton("__rclubReservationService", () => {
  const repository = isDatabaseEnabled()
    ? new PrismaReservationRepository(getPrismaClient())
    : new InMemoryReservationRepository();

  return new ReservationService(repository);
});

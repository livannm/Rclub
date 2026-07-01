import { isDatabaseEnabled } from "@/lib/db/is-database-enabled";
import { getPrismaClient } from "@/lib/prisma/client";
import { InMemorySiteAssetRepository } from "@/lib/site-assets/in-memory-site-asset-repository";
import { PrismaSiteAssetRepository } from "@/lib/site-assets/prisma-site-asset-repository";
import { ReservationNotifyService } from "@/lib/reservation-notify/reservation-notify-service";
import { getOrCreateGlobalSingleton } from "@/lib/utils/global-singleton";

export const reservationNotifyService = getOrCreateGlobalSingleton(
  "__rclubReservationNotifyService",
  () => {
    const siteAssets = isDatabaseEnabled()
      ? new PrismaSiteAssetRepository(getPrismaClient())
      : new InMemorySiteAssetRepository();

    return new ReservationNotifyService(siteAssets);
  }
);

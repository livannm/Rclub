import { describe, expect, it } from "vitest";
import { InMemorySiteAssetRepository } from "@/lib/site-assets/in-memory-site-asset-repository";
import {
  ReservationNotifyService,
  ReservationNotifyServiceError
} from "@/lib/reservation-notify/reservation-notify-service";

describe("ReservationNotifyService", () => {
  it("starts with an empty list", async () => {
    const service = new ReservationNotifyService(new InMemorySiteAssetRepository());
    await expect(service.listEmails()).resolves.toEqual([]);
  });

  it("adds and normalizes emails", async () => {
    const service = new ReservationNotifyService(new InMemorySiteAssetRepository());

    await service.addEmail("  Team@Rclub.fr ");
    await expect(service.listEmails()).resolves.toEqual(["team@rclub.fr"]);
  });

  it("rejects duplicate emails", async () => {
    const service = new ReservationNotifyService(new InMemorySiteAssetRepository());
    await service.addEmail("team@rclub.fr");

    await expect(service.addEmail("TEAM@rclub.fr")).rejects.toBeInstanceOf(
      ReservationNotifyServiceError
    );
  });

  it("removes an email from the list", async () => {
    const service = new ReservationNotifyService(new InMemorySiteAssetRepository());
    await service.addEmail("a@rclub.fr");
    await service.addEmail("b@rclub.fr");

    await service.removeEmail("a@rclub.fr");
    await expect(service.listEmails()).resolves.toEqual(["b@rclub.fr"]);
  });

  it("prefers admin list over RESEND_CONTACT_TO", async () => {
    const service = new ReservationNotifyService(new InMemorySiteAssetRepository());
    await service.addEmail("admin@rclub.fr");

    await expect(
      service.resolveNotificationRecipients({ RESEND_CONTACT_TO: "fallback@rclub.fr" })
    ).resolves.toEqual(["admin@rclub.fr"]);
  });

  it("falls back to RESEND_CONTACT_TO when admin list is empty", async () => {
    const service = new ReservationNotifyService(new InMemorySiteAssetRepository());

    await expect(
      service.resolveNotificationRecipients({ RESEND_CONTACT_TO: "fallback@rclub.fr" })
    ).resolves.toEqual(["fallback@rclub.fr"]);
  });
});

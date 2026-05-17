import { describe, expect, it } from "vitest";
import { InMemoryReservationRepository } from "@/lib/reservations/in-memory-reservation-repository";
import { ReservationService } from "@/lib/reservations/reservation-service";

describe("ReservationService", () => {
  it("creates a reservation with default status new", async () => {
    const service = new ReservationService(new InMemoryReservationRepository());

    const request = await service.create({
      full_name: "Marie Curie",
      email: "marie@example.com",
      phone: "0604050607",
      guest_count: 6,
      source_locale: "fr",
      consent_rgpd: true
    });

    expect(request.status).toBe("new");
    expect(request.full_name).toBe("Marie Curie");
  });
});

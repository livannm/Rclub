import { describe, expect, it } from "vitest";
import { reservationSchema } from "@/lib/reservations/reservation-schema";

describe("reservationSchema", () => {
  it("accepts a valid reservation payload", () => {
    const parsed = reservationSchema.parse({
      full_name: "Jean Dupont",
      email: "jean@example.com",
      phone: "0601020304",
      guest_count: 4,
      date_requested: "2099-08-01",
      arrival_time: "23:00",
      table_type: "classique",
      message: "Table proche DJ",
      source_locale: "fr",
      consent_rgpd: true
    });

    expect(parsed.guest_count).toBe(4);
  });

  it("rejects payload without RGPD consent", () => {
    const result = reservationSchema.safeParse({
      full_name: "Jean Dupont",
      email: "jean@example.com",
      phone: "0601020304",
      guest_count: 4,
      arrival_time: "23:00",
      table_type: "vip",
      source_locale: "fr",
      consent_rgpd: false
    });

    expect(result.success).toBe(false);
  });

  it("rejects payload without table type", () => {
    const result = reservationSchema.safeParse({
      full_name: "Jean Dupont",
      email: "jean@example.com",
      phone: "0601020304",
      guest_count: 4,
      arrival_time: "23:00",
      source_locale: "fr",
      consent_rgpd: true
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Veuillez choisir un type de table.");
    }
  });

  it("rejects past booking dates", () => {
    const result = reservationSchema.safeParse({
      full_name: "Jean Dupont",
      email: "jean@example.com",
      phone: "0601020304",
      guest_count: 4,
      date_requested: "2020-01-01",
      arrival_time: "23:00",
      table_type: "classique",
      source_locale: "fr",
      consent_rgpd: true
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("antérieure");
    }
  });
});

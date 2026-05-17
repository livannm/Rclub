import { describe, expect, it } from "vitest";
import { privatizationSchema } from "@/lib/privatizations/privatization-schema";

describe("privatizationSchema", () => {
  it("accepts a valid privatization payload", () => {
    const parsed = privatizationSchema.parse({
      full_name: "Paul Martin",
      email: "paul@example.com",
      phone: "0601020304",
      guest_count: 80,
      event_date: "2099-10-10",
      budget_range: "10k - 20k EUR",
      message: "Besoin d'une privatisation complete.",
      source_locale: "fr",
      consent_rgpd: true
    });

    expect(parsed.guest_count).toBe(80);
  });

  it("rejects payload without RGPD consent", () => {
    const result = privatizationSchema.safeParse({
      full_name: "Paul Martin",
      email: "paul@example.com",
      phone: "0601020304",
      guest_count: 80,
      source_locale: "fr",
      consent_rgpd: false
    });

    expect(result.success).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { InMemoryPrivatizationRepository } from "@/lib/privatizations/in-memory-privatization-repository";
import { PrivatizationService } from "@/lib/privatizations/privatization-service";

describe("PrivatizationService", () => {
  it("creates privatization request with default new status", async () => {
    const service = new PrivatizationService(new InMemoryPrivatizationRepository());

    const request = await service.create({
      full_name: "Nora Dupont",
      email: "nora@example.com",
      phone: "0605060708",
      guest_count: 120,
      source_locale: "fr",
      consent_rgpd: true
    });

    expect(request.status).toBe("new");
    expect(request.full_name).toBe("Nora Dupont");
  });
});

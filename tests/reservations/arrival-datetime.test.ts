import { describe, expect, it } from "vitest";
import {
  formatArrivalDisplay,
  isArrivalInPast,
  resolveArrivalInstant,
} from "@/lib/reservations/arrival-datetime";

describe("resolveArrivalInstant", () => {
  it("keeps evening times on the same calendar day", () => {
    const instant = resolveArrivalInstant("2026-05-22", "23:30");
    const paris = instant.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
    expect(paris).toContain("23:30");
    expect(paris).toContain("22/05");
  });

  it("treats post-midnight times as the next calendar day", () => {
    const instant = resolveArrivalInstant("2026-05-22", "00:30");
    const paris = instant.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
    expect(paris).toContain("00:30");
    expect(paris).toContain("23/05");
  });

  it("handles Friday 03:00 as Saturday morning", () => {
    const instant = resolveArrivalInstant("2026-05-22", "03:00");
    const paris = instant.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    expect(paris.toLowerCase()).toMatch(/sam|sat/);
    expect(paris).toContain("03:00");
  });
});

describe("formatArrivalDisplay", () => {
  it("labels post-midnight arrivals with the next day", () => {
    const label = formatArrivalDisplay("2026-05-22", "00:30", "fr");
    expect(label).toContain("arrivée");
    expect(label).toContain("00h30");
  });
});

describe("isArrivalInPast", () => {
  it("uses arrival instant when time is provided", () => {
    expect(isArrivalInPast("2020-06-01", "23:00", new Date("2021-01-01"))).toBe(true);
  });
});

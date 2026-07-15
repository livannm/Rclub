import { describe, expect, it } from "vitest";
import {
  datetimeLocalParisToIso,
  daysUntilClubEvening,
  eventMatchesClubEveningDate,
  formatRequestedDate,
  getClubEveningDate,
  getClubEveningParts,
  getParisDateIso,
  getTodayParisIso,
  isoToDatetimeLocalParis,
  isDateBeforeTodayParis,
} from "@/lib/utils/club-date";

describe("club-date", () => {
  it("maps a post-midnight Paris start to the previous club evening", () => {
    // 2026-05-23T23:00:00.000Z = 2026-05-24 01:00 in Paris (CEST)
    expect(getClubEveningDate("2026-05-23T23:00:00.000Z")).toBe("2026-05-23");
    expect(getParisDateIso("2026-05-23T23:00:00.000Z")).toBe("2026-05-24");
  });

  it("keeps same-day evening events on the same club evening date", () => {
    // 2026-05-23T21:00:00.000Z = 2026-05-23 23:00 in Paris (CEST)
    expect(getClubEveningDate("2026-05-23T21:00:00.000Z")).toBe("2026-05-23");
  });

  it("matches events by club evening date", () => {
    expect(eventMatchesClubEveningDate("2026-05-23T23:00:00.000Z", "2026-05-23")).toBe(true);
    expect(eventMatchesClubEveningDate("2026-05-23T23:00:00.000Z", "2026-05-24")).toBe(false);
  });

  it("formats requested dates without timezone drift", () => {
    expect(formatRequestedDate("2026-05-23", "fr")).toContain("23");
    expect(formatRequestedDate("2026-05-23", "fr")).toContain("mai");
  });

  it("detects dates before today in Paris", () => {
    const now = new Date("2026-05-23T10:00:00.000Z");
    expect(isDateBeforeTodayParis("2026-05-22", now)).toBe(true);
    expect(isDateBeforeTodayParis("2026-05-23", now)).toBe(false);
    expect(isDateBeforeTodayParis("2026-05-24", now)).toBe(false);
    expect(getTodayParisIso(now)).toBe("2026-05-23");
  });

  it("extracts year and month from club evening date", () => {
    expect(getClubEveningParts("2026-05-23T23:00:00.000Z")).toEqual({
      year: 2026,
      month: 5,
      day: 23,
    });
  });

  it("round-trips datetime-local values as Europe/Paris", () => {
    const iso = "2026-05-23T19:00:00.000Z"; // 21:00 Paris (CEST)
    const local = isoToDatetimeLocalParis(iso);
    expect(local).toBe("2026-05-23T21:00");
    expect(datetimeLocalParisToIso(local)).toBe(iso);
  });

  it("counts days until club evening from Paris today", () => {
    const now = new Date("2026-05-22T10:00:00.000Z");
    expect(daysUntilClubEvening("2026-05-23T19:00:00.000Z", now)).toBe(1);
    expect(daysUntilClubEvening("2026-05-22T19:00:00.000Z", now)).toBe(0);
  });
});

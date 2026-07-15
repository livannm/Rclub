import { describe, expect, it } from "vitest";
import {
  eventMatchesClubEveningDate,
  formatRequestedDate,
  getClubEveningDate,
  getParisDateIso,
  getTodayParisIso,
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
});

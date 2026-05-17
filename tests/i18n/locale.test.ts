import { describe, expect, it } from "vitest";
import { defaultLocale, isSupportedLocale, resolveLocale } from "@/i18n/locales";

describe("locale resolution", () => {
  it("uses default locale when none is provided", () => {
    expect(resolveLocale(undefined)).toBe(defaultLocale);
  });

  it("keeps supported locale", () => {
    expect(resolveLocale("en")).toBe("en");
  });

  it("falls back to default for unsupported locale", () => {
    expect(resolveLocale("de")).toBe(defaultLocale);
    expect(isSupportedLocale("de")).toBe(false);
  });
});

import { afterEach, describe, expect, it } from "vitest";
import {
  clearMisconfiguredAuthUrlForVercel,
  isLocalhostAuthUrl,
} from "@/lib/auth/resolve-auth-url";

describe("resolve-auth-url", () => {
  const keys = ["VERCEL", "AUTH_URL", "NEXTAUTH_URL"] as const;

  afterEach(() => {
    for (const key of keys) {
      delete process.env[key];
    }
  });

  it("detects localhost auth URLs", () => {
    expect(isLocalhostAuthUrl("http://localhost:3000")).toBe(true);
    expect(isLocalhostAuthUrl("http://127.0.0.1:3000")).toBe(true);
    expect(isLocalhostAuthUrl("https://r-club.fr")).toBe(false);
  });

  it("clears localhost AUTH_URL on Vercel", () => {
    process.env.VERCEL = "1";
    process.env.AUTH_URL = "http://localhost:3000";
    process.env.NEXTAUTH_URL = "http://localhost:3000";

    clearMisconfiguredAuthUrlForVercel();

    expect(process.env.AUTH_URL).toBeUndefined();
    expect(process.env.NEXTAUTH_URL).toBeUndefined();
  });

  it("keeps production AUTH_URL on Vercel", () => {
    process.env.VERCEL = "1";
    process.env.AUTH_URL = "https://r-club.fr";

    clearMisconfiguredAuthUrlForVercel();

    expect(process.env.AUTH_URL).toBe("https://r-club.fr");
  });

  it("does nothing outside Vercel", () => {
    process.env.AUTH_URL = "http://localhost:3000";

    clearMisconfiguredAuthUrlForVercel();

    expect(process.env.AUTH_URL).toBe("http://localhost:3000");
  });
});

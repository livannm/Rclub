import { describe, expect, it } from "vitest";
import { homepageContentSchema } from "@/lib/homepage/homepage-content-schema";

const validPayload = {
  title_fr: "Bienvenue au Rclub",
  title_en: "Welcome to Rclub",
  description_fr: "Le meilleur son de Strasbourg.",
  description_en: "The best sound in Strasbourg."
};

describe("homepageContentSchema", () => {
  it("accepts a valid payload", () => {
    expect(homepageContentSchema.parse(validPayload)).toMatchObject(validPayload);
  });

  it("rejects missing required text", () => {
    const parsed = homepageContentSchema.safeParse({
      ...validPayload,
      description_fr: ""
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.path).toContain("description_fr");
    }
  });
});

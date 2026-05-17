import { describe, expect, it } from "vitest";
import { getLocalizedEventContent } from "@/lib/events/event-localized";

describe("event localization", () => {
  const event = {
    title_fr: "Soiree Or",
    title_en: "Golden Night",
    description_fr: "Description FR",
    description_en: "EN Description"
  };

  it("returns french content for fr locale", () => {
    expect(getLocalizedEventContent(event, "fr")).toEqual({
      title: "Soiree Or",
      description: "Description FR"
    });
  });

  it("returns english content for en locale", () => {
    expect(getLocalizedEventContent(event, "en")).toEqual({
      title: "Golden Night",
      description: "EN Description"
    });
  });
});

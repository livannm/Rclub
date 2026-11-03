import { describe, expect, it } from "vitest";
import {
  DEFAULT_CLUB_COORDS,
  DEFAULT_CLUB_PLACE_ID,
  DEFAULT_CLUB_PLACE_SEARCH_QUERY,
  getClubPlaceConfig,
} from "@/lib/site/club-place";
import { getClubContact } from "@/lib/site/contact";

describe("club place config", () => {
  it("provides default Rclub Strasbourg place identifiers", () => {
    const config = getClubPlaceConfig();

    expect(config.placeId).toBe(DEFAULT_CLUB_PLACE_ID);
    expect(config.coords).toEqual(DEFAULT_CLUB_COORDS);
    expect(config.searchQuery).toBe(DEFAULT_CLUB_PLACE_SEARCH_QUERY);
  });
});

describe("getClubContact maps urls", () => {
  it("builds directions and embed urls from the place id", () => {
    const contact = getClubContact();

    expect(contact.mapsUrl).toContain("query_place_id=");
    expect(contact.mapsUrl).toContain(encodeURIComponent(DEFAULT_CLUB_PLACE_SEARCH_QUERY));
    expect(contact.mapsEmbedUrl).toContain(`place_id:${DEFAULT_CLUB_PLACE_ID}`);
  });

  it("lists the mobile number and the landline with opening-hours restriction", () => {
    const contact = getClubContact();
    const landline = contact.phones.find((phone) => phone.kind === "landline");

    expect(landline).toEqual({
      display: "03 88 22 32 22",
      href: "tel:+33388223222",
      kind: "landline",
    });
    expect(contact.phones.some((phone) => phone.kind === "mobile")).toBe(true);
    expect(contact.phoneHref).not.toBe(landline?.href);
  });
});

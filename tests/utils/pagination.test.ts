import { describe, expect, it } from "vitest";
import { getPagination, parsePage, pageHref } from "@/lib/utils/pagination";

describe("pagination URL handling", () => {
  it.each([undefined, "0", "-2", "1.5", "2oops", "Infinity", "9007199254740992", ["2", "3"]])("normalizes invalid pages: %s", value => {
    expect(parsePage(value)).toBe(1);
  });
  it("preserves valid pages and clamps them to the last available page", () => {
    expect(parsePage("3")).toBe(3);
    expect(getPagination(12, 5, 100)).toMatchObject({ page: 3, offset: 10, totalPages: 3 });
    expect(getPagination(0, 5, 100)).toMatchObject({ page: 1, offset: 0, totalPages: 1 });
  });
  it("keeps active filters and omits the first page parameter", () => {
    expect(pageHref("/agenda", { past: "1", year: "2026", month: "5" }, 2)).toBe("/agenda?past=1&year=2026&month=5&page=2");
    expect(pageHref("/galerie", {}, 1)).toBe("/galerie");
  });
});

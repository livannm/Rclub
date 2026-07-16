import { describe, expect, it } from "vitest";
import {
  formatRichTextForDisplay,
  plainTextToRichHtml,
  sanitizeRichTextHtml,
  stripRichText,
  truncateRichText,
} from "@/lib/utils/rich-text";

describe("rich-text utils", () => {
  it("converts plain text paragraphs and line breaks to html", () => {
    expect(plainTextToRichHtml("Premier paragraphe\navec retour ligne")).toBe(
      "<p>Premier paragraphe<br>avec retour ligne</p>",
    );
    expect(plainTextToRichHtml("Premier\n\nDeuxieme")).toBe(
      "<p>Premier</p><p>Deuxieme</p>",
    );
  });

  it("sanitizes unsafe html while keeping basic formatting", () => {
    const html = sanitizeRichTextHtml(
      '<p>Hello <strong>world</strong></p><script>alert(1)</script><ul><li>One</li></ul>',
    );

    expect(html).toContain("<strong>world</strong>");
    expect(html).toContain("<li>One</li>");
    expect(html).not.toContain("<script>");
  });

  it("formats legacy plain text for display", () => {
    expect(formatRichTextForDisplay("Line one\n\nLine two")).toBe(
      "<p>Line one</p><p>Line two</p>",
    );
  });

  it("strips html to plain text", () => {
    expect(stripRichText("<p>Soiree <strong>premium</strong></p>")).toBe("Soiree premium");
  });

  it("truncates rich text excerpts", () => {
    expect(truncateRichText("<p>Short text</p>", 20)).toBe("Short text");
    expect(truncateRichText("<p>" + "a".repeat(30) + "</p>", 20)).toMatch(/…$/);
  });
});

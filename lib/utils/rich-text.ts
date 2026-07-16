import sanitizeHtml from "sanitize-html";
import { looksLikeHtml, plainTextToRichHtml } from "@/lib/utils/rich-text-format";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
    "h3",
    "h4",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

export { looksLikeHtml, plainTextToRichHtml } from "@/lib/utils/rich-text-format";

export function sanitizeRichTextHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return sanitizeHtml(trimmed, SANITIZE_OPTIONS).trim();
}

export function formatRichTextForDisplay(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (looksLikeHtml(trimmed)) {
    return sanitizeRichTextHtml(trimmed);
  }

  return plainTextToRichHtml(trimmed);
}

export function stripRichText(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (looksLikeHtml(trimmed)) {
    return sanitizeHtml(trimmed, {
      allowedTags: [],
      allowedAttributes: {},
    })
      .replace(/\s+/g, " ")
      .trim();
  }

  return trimmed.replace(/\s+/g, " ").trim();
}

export function truncateRichText(value: string, maxLength = 160) {
  const plain = stripRichText(value);
  if (plain.length <= maxLength) {
    return plain;
  }

  return `${plain.slice(0, maxLength - 1).trimEnd()}…`;
}

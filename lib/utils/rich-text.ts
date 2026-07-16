import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
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
] as const;

const ALLOWED_ATTR = ["href", "target", "rel"] as const;

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value.trim());
}

export function sanitizeRichTextHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return DOMPurify.sanitize(trimmed, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: [...ALLOWED_ATTR],
  }).trim();
}

export function plainTextToRichHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const paragraphs = trimmed
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return "";
  }

  return paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
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
    return DOMPurify.sanitize(trimmed, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
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

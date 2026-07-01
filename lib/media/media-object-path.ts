export function sanitizeMediaFilename(filename: string): string {
  const base = filename.split(/[/\\]/).pop()?.toLowerCase() ?? "fichier";
  const cleaned = base.replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "fichier";
}

function randomHex(bytes = 4): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function buildMediaObjectPath(folderPath: string[], filename: string): string {
  const safeName = sanitizeMediaFilename(filename);
  const unique = `${Date.now()}-${randomHex()}-${safeName}`;
  return [...folderPath, unique].join("/");
}

export function mediaFormatFromFilename(filename: string): string | undefined {
  const match = sanitizeMediaFilename(filename).match(/\.([a-z0-9]+)$/i);
  return match?.[1];
}

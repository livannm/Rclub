export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100 MB

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml"
] as const;

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime"
] as const;

const ALLOWED_TYPES = new Set<string>([...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]);

export type UploadValidationResult =
  | { ok: true; resourceType: "image" | "video" }
  | { ok: false; error: string };

export function validateUpload(input: {
  contentType: string;
  size: number;
}): UploadValidationResult {
  const contentType = input.contentType?.toLowerCase().trim();

  if (!contentType || !ALLOWED_TYPES.has(contentType)) {
    return {
      ok: false,
      error: "Type de fichier non supporté (images ou vidéos uniquement)."
    };
  }

  if (input.size <= 0) {
    return { ok: false, error: "Fichier vide." };
  }

  if (input.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: `Fichier trop volumineux (max ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} Mo).`
    };
  }

  const resourceType = (ALLOWED_VIDEO_TYPES as readonly string[]).includes(contentType)
    ? "video"
    : "image";

  return { ok: true, resourceType };
}

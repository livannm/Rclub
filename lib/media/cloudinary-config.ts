export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder: string;
}

type Env = Record<string, string | undefined>;

const PLACEHOLDER_VALUES = new Set([
  "your_cloud_name",
  "your_api_key",
  "your_api_secret"
]);

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (PLACEHOLDER_VALUES.has(trimmed)) return null;
  return trimmed;
}

/**
 * Returns a usable Cloudinary configuration only when all three credentials are
 * present and are not the `.env.example` placeholders. Returns `null` otherwise,
 * which makes the media layer transparently fall back to local disk storage in
 * development (mirroring the in-memory database fallback).
 */
export function getCloudinaryConfig(env: Env = process.env): CloudinaryConfig | null {
  const cloudName = clean(env.CLOUDINARY_CLOUD_NAME);
  const apiKey = clean(env.CLOUDINARY_API_KEY);
  const apiSecret = clean(env.CLOUDINARY_API_SECRET);

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder: clean(env.CLOUDINARY_FOLDER) ?? "rclub"
  };
}

export function isCloudStorageEnabled(env: Env = process.env): boolean {
  return getCloudinaryConfig(env) !== null;
}

import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { validateUpload } from "./upload-validation";
import type { MediaStorage, MediaUploadInput, UploadedMedia } from "./media-storage";

export interface LocalMediaStorageOptions {
  /** Absolute directory where files are written. Defaults to `public/media/uploads`. */
  uploadDir?: string;
  /** Public URL prefix that maps to `uploadDir`. Defaults to `/media/uploads`. */
  publicBase?: string;
}

function sanitizeFilename(filename: string): string {
  const base = path.basename(filename).toLowerCase();
  const cleaned = base.replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "fichier";
}

/**
 * Development fallback used when Cloudinary is not configured. Persists uploads
 * to the local `public/` folder so the upload flow works end-to-end without any
 * external credentials. Not suitable for serverless/production filesystems —
 * that is exactly why production should configure Cloudinary.
 */
export class LocalMediaStorage implements MediaStorage {
  readonly provider = "local" as const;
  private readonly uploadDir: string;
  private readonly publicBase: string;

  constructor(options: LocalMediaStorageOptions = {}) {
    this.uploadDir =
      options.uploadDir ?? path.join(process.cwd(), "public", "media", "uploads");
    this.publicBase = options.publicBase ?? "/media/uploads";
  }

  async upload(input: MediaUploadInput): Promise<UploadedMedia> {
    const validation = validateUpload({
      contentType: input.contentType,
      size: input.data.byteLength
    });
    const resourceType = validation.ok ? validation.resourceType : "image";

    await mkdir(this.uploadDir, { recursive: true });

    const safeName = sanitizeFilename(input.filename);
    const unique = `${Date.now()}-${randomBytes(4).toString("hex")}-${safeName}`;
    await writeFile(path.join(this.uploadDir, unique), input.data);

    return {
      url: `${this.publicBase}/${unique}`,
      provider: this.provider,
      resourceType,
      bytes: input.data.byteLength
    };
  }
}

import { randomBytes } from "node:crypto";
import path from "node:path";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import type { FirebaseStorageConfig } from "./firebase-config";
import {
  defaultDestinationForResourceType,
  mediaDestinationToPath
} from "./media-destination";
import { validateUpload } from "./upload-validation";
import type { MediaStorage, MediaUploadInput, UploadedMedia } from "./media-storage";

const APP_NAME = "rclub-media";

function sanitizeFilename(filename: string): string {
  const base = path.basename(filename).toLowerCase();
  const cleaned = base.replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "fichier";
}

function getOrCreateApp(config: FirebaseStorageConfig): FirebaseApp {
  const existing = getApps().find((app) => app.name === APP_NAME);
  if (existing) return getApp(APP_NAME);

  return initializeApp(
    {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    },
    APP_NAME
  );
}

export class FirebaseStorage implements MediaStorage {
  readonly provider = "firebase" as const;
  private readonly config: FirebaseStorageConfig;
  private app: FirebaseApp | null = null;

  constructor(config: FirebaseStorageConfig) {
    this.config = config;
  }

  // Lazily initialise the app so constructing the storage (e.g. in the factory)
  // never touches the SDK; that only happens on the first upload.
  private getApp(): FirebaseApp {
    if (!this.app) {
      this.app = getOrCreateApp(this.config);
    }
    return this.app;
  }

  async upload(input: MediaUploadInput): Promise<UploadedMedia> {
    const validation = validateUpload({
      contentType: input.contentType,
      size: input.data.byteLength
    });
    const resourceType = validation.ok ? validation.resourceType : "image";
    const folderPath =
      input.folderPath ??
      mediaDestinationToPath(defaultDestinationForResourceType(resourceType));

    const safeName = sanitizeFilename(input.filename);
    const unique = `${Date.now()}-${randomBytes(4).toString("hex")}-${safeName}`;
    const objectPath = [...folderPath, unique].join("/");

    const storage = getStorage(this.getApp());
    const objectRef = ref(storage, objectPath);

    // Buffer is a Uint8Array subclass; uploadBytes accepts it directly.
    const bytes = new Uint8Array(input.data);
    await uploadBytes(objectRef, bytes, { contentType: input.contentType });
    const url = await getDownloadURL(objectRef);

    const format = path.extname(safeName).replace(/^\./, "") || undefined;

    return {
      url,
      provider: this.provider,
      resourceType,
      bytes: input.data.byteLength,
      format,
      publicId: objectPath
    };
  }
}

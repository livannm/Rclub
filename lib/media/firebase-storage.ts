import path from "node:path";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import type { FirebaseStorageConfig } from "./firebase-config";
import {
  defaultDestinationForResourceType,
  mediaDestinationToPath
} from "./media-destination";
import {
  buildMediaObjectPath,
  mediaFormatFromFilename,
} from "./media-object-path";
import { validateUpload } from "./upload-validation";
import type { MediaStorage, MediaUploadInput, UploadedMedia } from "./media-storage";

const APP_NAME = "rclub-media";

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

    const objectPath = buildMediaObjectPath(folderPath, input.filename);

    const storage = getStorage(this.getApp());
    const objectRef = ref(storage, objectPath);

    const bytes = new Uint8Array(input.data);
    await uploadBytes(objectRef, bytes, { contentType: input.contentType });
    const url = await getDownloadURL(objectRef);

    return {
      url,
      provider: this.provider,
      resourceType,
      bytes: input.data.byteLength,
      format: mediaFormatFromFilename(input.filename),
      publicId: objectPath
    };
  }
}

import { getFirebaseStorageConfig, type FirebaseStorageConfig } from "./firebase-config";
import { FirebaseStorage } from "./firebase-storage";
import { LocalMediaStorage } from "./local-storage";
import type { MediaStorage } from "./media-storage";

export function createMediaStorage(config: FirebaseStorageConfig | null): MediaStorage {
  return config ? new FirebaseStorage(config) : new LocalMediaStorage();
}

const globalForMedia = globalThis as unknown as { mediaStorage?: MediaStorage };

export function getMediaStorage(): MediaStorage {
  const config = getFirebaseStorageConfig();

  // Re-read env on each request in dev so .env.local edits apply without restart.
  if (process.env.NODE_ENV === "development") {
    return createMediaStorage(config);
  }

  if (!globalForMedia.mediaStorage) {
    globalForMedia.mediaStorage = createMediaStorage(config);
  }
  return globalForMedia.mediaStorage;
}

import { getCloudinaryConfig, type CloudinaryConfig } from "./cloudinary-config";
import { CloudinaryStorage } from "./cloudinary-storage";
import { LocalMediaStorage } from "./local-storage";
import type { MediaStorage } from "./media-storage";

export function createMediaStorage(config: CloudinaryConfig | null): MediaStorage {
  return config ? new CloudinaryStorage(config) : new LocalMediaStorage();
}

const globalForMedia = globalThis as unknown as { mediaStorage?: MediaStorage };

export function getMediaStorage(): MediaStorage {
  if (!globalForMedia.mediaStorage) {
    globalForMedia.mediaStorage = createMediaStorage(getCloudinaryConfig());
  }
  return globalForMedia.mediaStorage;
}

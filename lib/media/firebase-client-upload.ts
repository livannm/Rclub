import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import type { FirebaseStorageConfig } from "@/lib/media/firebase-config";
import {
  defaultDestinationForResourceType,
  mediaDestinationToPath,
  type MediaDestination,
} from "@/lib/media/media-destination";
import {
  buildMediaObjectPath,
  mediaFormatFromFilename,
} from "@/lib/media/media-object-path";
import type { MediaResourceType } from "@/lib/media/media-storage";

const APP_NAME = "rclub-media-client";

function getClientFirebaseApp(config: FirebaseStorageConfig): FirebaseApp {
  const existing = getApps().find((app) => app.name === APP_NAME);
  if (existing) {
    return getApp(APP_NAME);
  }

  return initializeApp(
    {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    },
    APP_NAME,
  );
}

export async function uploadFileToFirebase(input: {
  file: File;
  config: FirebaseStorageConfig;
  destination?: MediaDestination;
  resourceType: MediaResourceType;
}): Promise<{ url: string; publicId: string; format?: string }> {
  const folderPath = input.destination
    ? mediaDestinationToPath(input.destination)
    : mediaDestinationToPath(defaultDestinationForResourceType(input.resourceType));

  const objectPath = buildMediaObjectPath(folderPath, input.file.name);
  const app = getClientFirebaseApp(input.config);
  const storage = getStorage(app);
  const objectRef = ref(storage, objectPath);

  await uploadBytes(objectRef, input.file, { contentType: input.file.type });
  const url = await getDownloadURL(objectRef);

  return {
    url,
    publicId: objectPath,
    format: mediaFormatFromFilename(input.file.name),
  };
}

import type { FirebaseStorageConfig } from "@/lib/media/firebase-config";
import { uploadFileToFirebase } from "@/lib/media/firebase-client-upload";
import {
  appendMediaDestination,
  type MediaDestination,
} from "@/lib/media/media-destination";
import type { MediaResourceType } from "@/lib/media/media-storage";
import { validateUpload } from "@/lib/media/upload-validation";

export type ClientUploadResult = {
  url: string;
  provider: "firebase" | "local";
  resourceType: MediaResourceType;
};

type UploadConfigResponse =
  | { mode: "firebase"; firebase: FirebaseStorageConfig }
  | { mode: "local" };

let configPromise: Promise<UploadConfigResponse> | null = null;

async function getUploadConfig(): Promise<UploadConfigResponse> {
  if (!configPromise) {
    configPromise = fetch("/api/admin/media/upload-config", {
      credentials: "same-origin",
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error("Impossible de charger la configuration média.");
      }
      return response.json() as Promise<UploadConfigResponse>;
    });
  }

  return configPromise;
}

async function uploadViaServerRoute(
  file: File,
  destination?: MediaDestination,
): Promise<ClientUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  if (destination) {
    appendMediaDestination(formData, destination);
  }

  const response = await fetch("/api/admin/media/upload", {
    method: "POST",
    body: formData,
  });
  const json = (await response.json()) as ClientUploadResult & { error?: string };

  if (!response.ok) {
    throw new Error(json.error ?? "Échec de l'upload.");
  }

  return json;
}

/** Upload from the browser: Firebase direct in prod, API route fallback in local dev. */
export async function uploadMediaFromClient(
  file: File,
  destination?: MediaDestination,
): Promise<ClientUploadResult> {
  const validation = validateUpload({
    contentType: file.type,
    size: file.size,
  });
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const config = await getUploadConfig();

  if (config.mode === "firebase") {
    const uploaded = await uploadFileToFirebase({
      file,
      config: config.firebase,
      destination,
      resourceType: validation.resourceType,
    });

    return {
      url: uploaded.url,
      provider: "firebase",
      resourceType: validation.resourceType,
    };
  }

  return uploadViaServerRoute(file, destination);
}

export function resetUploadConfigCache(): void {
  configPromise = null;
}

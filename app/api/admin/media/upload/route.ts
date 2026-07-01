import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getMediaStorage } from "@/lib/media/media-storage-instance";
import {
  defaultDestinationForResourceType,
  mediaDestinationToPath,
  parseMediaDestinationFromForm
} from "@/lib/media/media-destination";
import { validateUpload } from "@/lib/media/upload-validation";
import { formatMediaUploadError } from "@/lib/media/upload-error";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Requête multipart invalide." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
  }

  const validation = validateUpload({ contentType: file.type, size: file.size });
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const destination =
    parseMediaDestinationFromForm(formData) ??
    defaultDestinationForResourceType(validation.resourceType);
  const folderPath = mediaDestinationToPath(destination);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getMediaStorage();
    const result = await storage.upload({
      data: buffer,
      filename: file.name || "upload",
      contentType: file.type,
      folderPath
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[media/upload]", error);
    }
    return NextResponse.json({ error: formatMediaUploadError(error) }, { status: 502 });
  }
}

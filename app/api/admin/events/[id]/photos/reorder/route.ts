import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { galleryService } from "@/lib/gallery/gallery-service-instance";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { photo_id, sort_order } = body as Record<string, unknown>;

  if (typeof photo_id !== "string" || !photo_id) {
    return NextResponse.json({ error: "photo_id is required" }, { status: 400 });
  }

  if (typeof sort_order !== "number") {
    return NextResponse.json({ error: "sort_order must be a number" }, { status: 400 });
  }

  const updated = await galleryService.reorderPhoto(photo_id, sort_order);
  if (!updated) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { galleryService } from "@/lib/gallery/gallery-service-instance";

type RouteContext = { params: Promise<{ id: string; photoId: string }> };

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { photoId } = await params;
  const deleted = await galleryService.deletePhoto(photoId);

  if (!deleted) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}

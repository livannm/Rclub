import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { galleryService } from "@/lib/gallery/gallery-service-instance";
import { eventService } from "@/lib/events/events-service-instance";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: eventId } = await params;
  const photos = await galleryService.getPhotosForEvent(eventId);
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: eventId } = await params;

  const event = await eventService.findById(eventId);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
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

  const { image_url, alt_fr, alt_en, order } = body as Record<string, unknown>;

  if (typeof image_url !== "string" || !image_url) {
    return NextResponse.json({ error: "image_url is required" }, { status: 400 });
  }

  const photo = await galleryService.addPhoto({
    event_id: eventId,
    event_slug: event.slug,
    image_url,
    alt_fr: typeof alt_fr === "string" ? alt_fr : "",
    alt_en: typeof alt_en === "string" ? alt_en : "",
    order: typeof order === "number" ? order : 0
  });

  return NextResponse.json(photo, { status: 201 });
}

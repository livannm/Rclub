import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/lib/events/events-service-instance";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
  }

  try {
    const events = await eventService.findPublishedByDate(date);
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
  }
}

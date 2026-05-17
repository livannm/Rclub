import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { siteAssetService } from "@/lib/site-assets/site-asset-service-instance";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("url" in body) ||
    typeof (body as Record<string, unknown>).url !== "string" ||
    !(body as Record<string, unknown>).url
  ) {
    return NextResponse.json(
      { error: "Missing or invalid `url` field" },
      { status: 400 }
    );
  }

  const url = (body as { url: string }).url;
  await siteAssetService.updateHeroVideo(url);

  return NextResponse.json({ url });
}

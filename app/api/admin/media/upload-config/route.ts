import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getFirebaseStorageConfig } from "@/lib/media/firebase-config";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firebase = getFirebaseStorageConfig();
  if (firebase) {
    return NextResponse.json({ mode: "firebase", firebase });
  }

  return NextResponse.json({ mode: "local" });
}

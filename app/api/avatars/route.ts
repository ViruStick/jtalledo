import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/require-auth";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const avatarsDir = path.join(process.cwd(), "public", "avatars");
  const files = fs.readdirSync(avatarsDir);
  return NextResponse.json({ avatars: files });
}

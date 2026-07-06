import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const avatarsDir = path.join(process.cwd(), "public", "avatars");
  const files = fs.readdirSync(avatarsDir);
  return NextResponse.json({ avatars: files });
}

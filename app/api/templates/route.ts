import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/require-auth";
import { scanTemplates } from "@/lib/templates";
import { selectOptions } from "@/lib/select-options";

export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const subdir = request.nextUrl.searchParams.get("path") || undefined;
  const templates = scanTemplates(subdir);

  const enriched = templates.map((t) => {
    const markerOptions: Record<string, { label: string; fill: Record<string, string> }[]> = {};
    for (const marker of t.markers) {
      if (selectOptions[marker]) {
        markerOptions[marker] = selectOptions[marker];
      }
    }
    return { ...t, markerOptions: Object.keys(markerOptions).length > 0 ? markerOptions : undefined };
  });

  return NextResponse.json({ templates: enriched });
}

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    return NextResponse.json({
      user: {
        id: payload.id,
        username: payload.username,
        role: payload.role,
      },
    });
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

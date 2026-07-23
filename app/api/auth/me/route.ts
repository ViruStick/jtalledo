import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthError } from "@/lib/require-auth";
import { getUsers } from "@/lib/db";

export async function GET(request: NextRequest) {
  let payload;
  try {
    payload = requireAuth(request);
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const users = await getUsers();
    const user = users.find((u) => u.id === payload.id);

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  let payload;
  try {
    payload = requireAuth(request);
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { avatar } = await request.json();

    const { updateAvatar } = await import("@/lib/db");
    await updateAvatar(payload.id, avatar ?? null);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al actualizar avatar" }, { status: 400 });
  }
}

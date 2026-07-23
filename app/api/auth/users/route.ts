import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/require-auth";
import { getUsers, createUser, deleteUser, resetPassword, updateUser } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const users = await getUsers();
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { username, password, name, despachoFiscal } = await request.json();
    if (!username || !password || !name) {
      return NextResponse.json(
        { error: "Nombre, usuario y contraseña requeridos" },
        { status: 400 }
      );
    }
    const user = await createUser(username, password, name, despachoFiscal);
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al crear usuario";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireAdmin(request);
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id, password } = await request.json();
    if (!id || !password) {
      return NextResponse.json(
        { error: "ID y contraseña requeridos" },
        { status: 400 }
      );
    }
    await resetPassword(id, password);
    return NextResponse.json({ success: true });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Error al restablecer contraseña";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id, name, username, despachoFiscal } = await request.json();
    if (!id || !name || !username) {
      return NextResponse.json(
        { error: "ID, nombre y usuario requeridos" },
        { status: 400 }
      );
    }
    await updateUser(id, name, username, despachoFiscal);
    return NextResponse.json({ success: true });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Error al editar usuario";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    await deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Error al eliminar usuario";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

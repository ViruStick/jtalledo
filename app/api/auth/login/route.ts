import { NextResponse } from "next/server";
import { seedAdmin, findUserByUsername } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await seedAdmin();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }

    const user = await findUserByUsername(username);
    if (!user || !comparePassword(password, user.password)) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, username: user.username, role: user.role },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

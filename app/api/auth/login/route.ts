import { NextRequest, NextResponse } from "next/server";
import { seedAdmin, findUserByUsername, updateUserLoginMetadata } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";
import { getClientIp } from "@/lib/get-client-ip";
import {
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  clearUserRateLimit,
  RateLimitUnavailableError,
} from "@/lib/login-rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña requeridos" },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    const normalizedUser = String(username).trim().toLowerCase();

    // 1. Consulta previa: solo lectura, repara TTL -1 si existe
    const preCheck = await checkLoginRateLimit(ip, normalizedUser);
    if (preCheck.blocked) {
      const response = NextResponse.json(
        { error: "Demasiados intentos. Inténtalo nuevamente más tarde." },
        { status: 429 }
      );
      if (preCheck.retryAfter) {
        response.headers.set("Retry-After", String(preCheck.retryAfter));
      }
      return response;
    }

    await seedAdmin();

    const user = await findUserByUsername(username);

    // 2. Credenciales incorrectas → registrar fallo atómicamente
    if (!user || !comparePassword(password, user.password)) {
      const result = await recordFailedLoginAttempt(ip, normalizedUser);

      if (result.blocked) {
        const response = NextResponse.json(
          { error: "Demasiados intentos. Inténtalo nuevamente más tarde." },
          { status: 429 }
        );
        if (result.retryAfter) {
          response.headers.set("Retry-After", String(result.retryAfter));
        }
        return response;
      }

      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 3. Login exitoso: nunca incrementa contadores
    await clearUserRateLimit(normalizedUser);

    // 4. Guardar metadatos del acceso (fail-open)
    const loginMetadata = {
      lastLoginIp: ip ?? undefined,
      lastLoginAt: new Date().toISOString(),
      lastLoginUserAgent: request.headers.get("user-agent") ?? undefined,
    };
    try {
      await updateUserLoginMetadata(user.id, loginMetadata);
    } catch {
      console.error("No se pudo guardar el último acceso", { userId: user.id });
    }

    // 5. Generar JWT (sin metadatos)
    const token = generateToken({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    if (error instanceof RateLimitUnavailableError) {
      return NextResponse.json(
        { error: "Servicio temporalmente no disponible" },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

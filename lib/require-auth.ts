import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export interface AuthTokenPayload {
  id: string;
  name: string;
  username: string;
  role: "admin" | "user";
}

export function requireAuth(request: NextRequest): AuthTokenPayload {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    throw new AuthError("No autorizado", 401);
  }
  try {
    return verifyToken(token) as AuthTokenPayload;
  } catch {
    throw new AuthError("No autorizado", 401);
  }
}

export function requireAdmin(request: NextRequest): AuthTokenPayload {
  const payload = requireAuth(request);
  if (payload.role !== "admin") {
    throw new AuthError("No tienes permisos de administrador", 403);
  }
  return payload;
}

export class AuthError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

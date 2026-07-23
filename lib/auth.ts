import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === "") {
    throw new Error("JWT_SECRET no está configurado");
  }
  return secret;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(payload: {
  id: string;
  name: string;
  username: string;
  role: string;
}): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "24h" });
}

export function verifyToken(
  token: string
): { id: string; name: string; username: string; role: string } {
  return jwt.verify(token, getJwtSecret()) as {
    id: string;
    name: string;
    username: string;
    role: string;
  };
}

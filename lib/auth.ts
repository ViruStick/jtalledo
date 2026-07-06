import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

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
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(
  token: string
): { id: string; name: string; username: string; role: string } {
  return jwt.verify(token, JWT_SECRET) as {
    id: string;
    name: string;
    username: string;
    role: string;
  };
}

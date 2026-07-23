import { NextRequest } from "next/server";
import { isIP } from "node:net";

function normalizeIp(ip: string): string {
  let normalized = ip.trim();
  if (normalized.startsWith("::ffff:")) {
    normalized = normalized.slice(7);
  }
  return normalized;
}

export function getClientIp(request: NextRequest): string | null {
  // CF-Connecting-IP: solo confiable si el tráfico pasa por Cloudflare proxy
  const rawCfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (rawCfIp) {
    const normalized = normalizeIp(rawCfIp);
    if (isIP(normalized)) return normalized;
  }

  // X-Forwarded-For: primer valor; puede falsificarse sin proxy confiable
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp) {
      const normalized = normalizeIp(firstIp);
      if (isIP(normalized)) return normalized;
    }
  }

  // X-Real-IP: usada por proxies como NGINX
  const rawRealIp = request.headers.get("x-real-ip")?.trim();
  if (rawRealIp) {
    const normalized = normalizeIp(rawRealIp);
    if (isIP(normalized)) return normalized;
  }

  return null;
}

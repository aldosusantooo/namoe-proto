export const DEVICE_COOKIE = "nm_did";
export const DEVICE_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidDeviceId(value: string | undefined | null): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export function newDeviceId(): string {
  return globalThis.crypto.randomUUID();
}

/** Cookie attributes shared by the proxy, the /b route and /api/device. Not httpOnly: the client mirrors it. */
export function deviceCookieOptions() {
  return {
    maxAge: DEVICE_COOKIE_MAX_AGE,
    sameSite: "lax" as const,
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  };
}

/** Reads nm_did from a raw Cookie header. Returns null when missing or malformed. */
export function readDeviceIdFromCookieHeader(header: string | null | undefined): string | null {
  if (!header) return null;
  for (const pair of header.split(";")) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    if (pair.slice(0, eq).trim() !== DEVICE_COOKIE) continue;
    const value = decodeURIComponent(pair.slice(eq + 1).trim());
    return isValidDeviceId(value) ? value : null;
  }
  return null;
}

/** For route handlers and the proxy. */
export function readDeviceIdFromRequest(req: Request): string | null {
  return readDeviceIdFromCookieHeader(req.headers.get("cookie"));
}

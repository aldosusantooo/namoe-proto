import { cookies } from "next/headers";
import { DEVICE_COOKIE, deviceCookieOptions, isValidDeviceId, newDeviceId } from "./device";

/**
 * Device id for server components and server actions. The proxy sets the cookie on every page request,
 * so this normally reads it back. Render cannot set cookies, so a missing cookie yields a fresh id
 * that only becomes durable once /b or /api/device sets it.
 */
export async function getOrCreateDeviceId(): Promise<string> {
  const store = await cookies();
  const value = store.get(DEVICE_COOKIE)?.value;
  return isValidDeviceId(value) ? value : newDeviceId();
}

/**
 * Same as getOrCreateDeviceId, but inside a server action or route handler the cookie can be written,
 * so a brand-new id is made durable immediately.
 */
export async function ensureDeviceId(): Promise<string> {
  const store = await cookies();
  const value = store.get(DEVICE_COOKIE)?.value;
  if (isValidDeviceId(value)) return value;
  const id = newDeviceId();
  store.set(DEVICE_COOKIE, id, deviceCookieOptions());
  return id;
}

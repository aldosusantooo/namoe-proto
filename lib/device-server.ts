import { cookies } from "next/headers";
import { DEVICE_COOKIE, isValidDeviceId, newDeviceId } from "./device";

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

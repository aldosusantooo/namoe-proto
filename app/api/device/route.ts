import { NextResponse } from "next/server";
import { DEVICE_COOKIE, deviceCookieOptions, isValidDeviceId } from "@/lib/device";

/** Re-issues the device cookie from the id the browser kept in localStorage. */
export async function POST(request: Request) {
  let id: unknown;
  try {
    id = ((await request.json()) as { id?: unknown })?.id;
  } catch {
    id = undefined;
  }
  if (!isValidDeviceId(typeof id === "string" ? id : undefined)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DEVICE_COOKIE, id as string, deviceCookieOptions());
  return response;
}

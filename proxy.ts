import { NextResponse, type NextRequest } from "next/server";
import { DEVICE_COOKIE, deviceCookieOptions, isValidDeviceId, newDeviceId } from "@/lib/device";

/** Gives every visitor page request a device cookie. Route handlers (/b, /api/device) set it themselves. */
export function proxy(request: NextRequest) {
  const existing = request.cookies.get(DEVICE_COOKIE)?.value;
  if (isValidDeviceId(existing)) return NextResponse.next();
  const response = NextResponse.next();
  response.cookies.set(DEVICE_COOKIE, newDeviceId(), deviceCookieOptions());
  return response;
}

export const config = {
  matcher: ["/((?!_next/|api/|img/|b/|uploads/|icon\\.svg|favicon\\.ico).*)"],
};

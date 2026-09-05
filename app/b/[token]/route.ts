import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEVICE_COOKIE, deviceCookieOptions, newDeviceId, readDeviceIdFromRequest } from "@/lib/device";
import { getEvent } from "@/lib/event";
import { stampBooth } from "@/lib/stamping";

export const dynamic = "force-dynamic";

/** QR landing. Stamps the booth for this device and lands on the passport with a status flag. */
export async function GET(request: Request, ctx: RouteContext<"/b/[token]">) {
  const { token } = await ctx.params;
  const deviceId = readDeviceIdFromRequest(request) ?? newDeviceId();

  const redirect = (path: string) => {
    const res = NextResponse.redirect(new URL(path, request.url), 303);
    // Set on the redirect too, so a first-ever scan stamps the device that lands on /paspor.
    res.cookies.set(DEVICE_COOKIE, deviceId, deviceCookieOptions());
    return res;
  };

  const booth = await db.booth.findUnique({ where: { qrToken: token }, select: { code: true } });
  if (!booth) return redirect("/paspor?salah=1");

  const event = await getEvent();
  const result = await stampBooth(deviceId, booth.code, event.passportTarget);
  return redirect(result.added ? `/paspor?stempel=${booth.code}` : `/paspor?sudah=${booth.code}`);
}

import { describe, expect, it } from "vitest";
import { DEVICE_COOKIE, deviceCookieOptions, isValidDeviceId, newDeviceId, readDeviceIdFromCookieHeader, readDeviceIdFromRequest } from "../device";

describe("device id", () => {
  it("generates valid uuids", () => {
    const id = newDeviceId();
    expect(isValidDeviceId(id)).toBe(true);
    expect(isValidDeviceId("not-a-uuid")).toBe(false);
    expect(isValidDeviceId(undefined)).toBe(false);
  });
  it("reads the cookie from a header among others", () => {
    const id = newDeviceId();
    expect(readDeviceIdFromCookieHeader(`foo=1; ${DEVICE_COOKIE}=${id}; bar=2`)).toBe(id);
    expect(readDeviceIdFromCookieHeader(`${DEVICE_COOKIE}=garbage`)).toBeNull();
    expect(readDeviceIdFromCookieHeader(null)).toBeNull();
  });
  it("reads from a Request", () => {
    const id = newDeviceId();
    const req = new Request("http://x/", { headers: { cookie: `${DEVICE_COOKIE}=${id}` } });
    expect(readDeviceIdFromRequest(req)).toBe(id);
    expect(readDeviceIdFromRequest(new Request("http://x/"))).toBeNull();
  });
  it("uses 400 days, lax, not httpOnly", () => {
    const o = deviceCookieOptions();
    expect(o.maxAge).toBe(400 * 24 * 60 * 60);
    expect(o.sameSite).toBe("lax");
    expect(o.httpOnly).toBe(false);
    expect(o.path).toBe("/");
  });
});

"use client";

import { useEffect } from "react";
import { DEVICE_COOKIE, isValidDeviceId } from "@/lib/device";

function readCookie(name: string): string | null {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/** Mirrors the device cookie to localStorage and restores it when the cookie was lost. No UI. */
export function DeviceSync() {
  useEffect(() => {
    try {
      const cookie = readCookie(DEVICE_COOKIE);
      const stored = window.localStorage.getItem(DEVICE_COOKIE);
      if (isValidDeviceId(cookie)) {
        if (stored !== cookie) window.localStorage.setItem(DEVICE_COOKIE, cookie);
        return;
      }
      if (isValidDeviceId(stored)) {
        void fetch("/api/device", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id: stored }),
        });
      }
    } catch {
      // Storage can be unavailable in private modes; the cookie alone still works.
    }
  }, []);
  return null;
}

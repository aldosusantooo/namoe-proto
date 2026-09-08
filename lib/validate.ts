export type Clean<T> = { ok: true; value: T } | { ok: false; error: "bodyTooShort" | "bodyTooLong" };

export const BODY_MIN = 3;
export const BODY_MAX = 280;
export const NAME_MAX = 30;

function collapse(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

/** Trim, collapse whitespace, 3 to 280 chars. */
export function cleanBody(s: string): Clean<string> {
  const value = collapse(s ?? "");
  if (value.length < BODY_MIN) return { ok: false, error: "bodyTooShort" };
  if (value.length > BODY_MAX) return { ok: false, error: "bodyTooLong" };
  return { ok: true, value };
}

/** Trim, max 30 chars, empty becomes null. Never returns an empty string. */
export function cleanName(s: string | null | undefined): { ok: true; value: string | null } {
  const value = collapse(s ?? "").slice(0, NAME_MAX).trim();
  return { ok: true, value: value.length ? value : null };
}

export const INTRO_MAX = 600;
export const PROMO_MAX = 140;
export const FEED_MAX = 140;
export const REPLY_MAX = 600;
export const SLOT_LABEL_MAX = 80;

export type CleanError = Clean<never> extends { ok: false; error: infer E } ? E : never;
export type TextError = "bodyTooShort" | "bodyTooLong";

/** Optional free text: trimmed, collapsed, capped; empty becomes null. Over the cap is an error, not a cut. */
export function cleanOptionalText(s: string | null | undefined, max: number): { ok: true; value: string | null } | { ok: false; error: "bodyTooLong" } {
  const value = collapse(s ?? "");
  if (value.length > max) return { ok: false, error: "bodyTooLong" };
  return { ok: true, value: value.length ? value : null };
}

/** Required text with its own maximum (reply, feed line): 3 to `max` chars. */
export function cleanText(s: string, max: number): Clean<string> {
  const value = collapse(s ?? "");
  if (value.length < BODY_MIN) return { ok: false, error: "bodyTooShort" };
  if (value.length > max) return { ok: false, error: "bodyTooLong" };
  return { ok: true, value };
}

/** http(s) URL only. Returns the normalised href. */
export function cleanUrl(s: string | null | undefined): { ok: true; value: string } | { ok: false; error: "invalidUrl" } {
  const raw = (s ?? "").trim();
  if (!raw) return { ok: false, error: "invalidUrl" };
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return { ok: false, error: "invalidUrl" };
    return { ok: true, value: url.href };
  } catch {
    return { ok: false, error: "invalidUrl" };
  }
}

/** A public path this app serves (uploads) or an http(s) URL. */
export function cleanPhotoRef(s: string | null | undefined): { ok: true; value: string } | { ok: false; error: "invalidUrl" } {
  const raw = (s ?? "").trim();
  if (/^\/uploads\/[a-z0-9-]+\/[a-z0-9]+\.(jpg|png|webp|gif)$/.test(raw)) return { ok: true, value: raw };
  return cleanUrl(raw);
}

/** "14.00" or "9.30" style WIB clock; also accepts "14:00" and normalises to the dot. Empty becomes null. */
export function cleanTime(s: string | null | undefined): { ok: true; value: string | null } | { ok: false; error: "timeFormat" } {
  const raw = (s ?? "").trim();
  if (!raw) return { ok: true, value: null };
  const m = raw.match(/^(\d{1,2})[.:](\d{2})$/);
  if (!m) return { ok: false, error: "timeFormat" };
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return { ok: false, error: "timeFormat" };
  return { ok: true, value: `${String(h).padStart(2, "0")}.${m[2]}` };
}

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

/** No 0, O, 1 or I so the info desk never has to guess. */
export const REDEEM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const REDEEM_LENGTH = 6;

type RandomSource = { getRandomValues<T extends ArrayBufferView>(array: T): T };

export function generateRedeemCode(random: RandomSource = globalThis.crypto): string {
  const bytes = random.getRandomValues(new Uint8Array(REDEEM_LENGTH));
  let out = "";
  for (const b of bytes) out += REDEEM_ALPHABET[b % REDEEM_ALPHABET.length];
  return out;
}

/** Uppercases and strips whitespace and dashes. Returns null unless the result is 6 chars from the alphabet. */
export function normaliseRedeemCode(input: string): string | null {
  const cleaned = input.toUpperCase().replace(/[\s-]+/g, "");
  if (cleaned.length !== REDEEM_LENGTH) return null;
  for (const ch of cleaned) if (!REDEEM_ALPHABET.includes(ch)) return null;
  return cleaned;
}

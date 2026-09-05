export function boothNumber(code: string): number {
  return Number(code.replace(/^[A-Za-z]+/, ""));
}

export function sortCodes(codes: string[]): string[] {
  return [...codes].sort((a, b) => boothNumber(a) - boothNumber(b));
}

/** Lowest code, used on cards. */
export function primaryCode(codes: string[]): string | null {
  return sortCodes(codes)[0] ?? null;
}

/**
 * "A3", "A1 dan A2", "A11 sampai A14" for three or more consecutive, otherwise "A1, A3, A5".
 */
export function boothLabel(codes: string[]): string {
  const sorted = sortCodes(codes);
  if (sorted.length === 0) return "";
  if (sorted.length === 1) return sorted[0];
  if (sorted.length === 2) return `${sorted[0]} dan ${sorted[1]}`;
  const consecutive = sorted.every((c, i) => i === 0 || boothNumber(c) === boothNumber(sorted[i - 1]) + 1);
  if (consecutive) return `${sorted[0]} sampai ${sorted[sorted.length - 1]}`;
  return sorted.join(", ");
}

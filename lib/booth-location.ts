import { copy } from "./copy";

export type LocationKey = "front" | "middle" | "back" | "fnb";

/** Band 1 to 3 of the A blocks read as depan, tengah, belakang; the F&B arc is its own row. */
export function locationKey(booth: { zone: "A" | "FNB"; band: number }): LocationKey {
  if (booth.zone === "FNB") return "fnb";
  if (booth.band <= 1) return "front";
  if (booth.band === 2) return "middle";
  return "back";
}

/** One-line hint under the mini map, from the tenant's first booth. */
export function locationHint(booth: { zone: "A" | "FNB"; band: number }): string {
  return copy.tenant.location[locationKey(booth)];
}

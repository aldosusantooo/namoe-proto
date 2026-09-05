/** "Workshop melukis anak 10.30 dan 15.00" gives { label: "Workshop melukis anak", times: ["10.30", "15.00"] }. */
export function parseActivity(raw: string): { label: string; times: string[] } {
  const match = raw.match(/\s+(\d{1,2}\.\d{2}(?:\s+dan\s+\d{1,2}\.\d{2})*)$/);
  if (!match) return { label: raw.trim(), times: [] };
  const label = raw.slice(0, match.index).trim();
  const times = match[1].split(/\s+dan\s+/).map((t) => t.trim());
  return { label, times };
}

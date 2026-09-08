const TZ = "Asia/Jakarta";

const timeFmt = new Intl.DateTimeFormat("id-ID", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const dayFmt = new Intl.DateTimeFormat("id-ID", {
  timeZone: TZ,
  weekday: "long",
  day: "numeric",
  month: "short",
});

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((p) => p.type === type)?.value ?? "";
}

/** "14.00", WIB style with a dot, always in Asia/Jakarta regardless of process TZ. */
export function formatTime(date: Date): string {
  const parts = timeFmt.formatToParts(date);
  return `${part(parts, "hour").padStart(2, "0")}.${part(parts, "minute").padStart(2, "0")}`;
}

/** "Kamis, 22 Okt" in Asia/Jakarta. */
export function formatDay(date: Date): string {
  const parts = dayFmt.formatToParts(date);
  const month = part(parts, "month").replace(/\.$/, "");
  return `${part(parts, "weekday")}, ${part(parts, "day")} ${month}`;
}

/** "13.30 sampai 14.15" */
export function formatTimeRange(start: Date, end: Date): string {
  return `${formatTime(start)} sampai ${formatTime(end)}`;
}

export const DAY_LABELS = ["Kamis 22 Okt", "Jumat 23 Okt", "Sabtu 24 Okt", "Minggu 25 Okt"] as const;
/** Three-letter day prefix for a time column that mixes days ("Jum 13.00"). */
export const DAY_ABBREV = ["Kam", "Jum", "Sab", "Min"] as const;
export type EventDay = 1 | 2 | 3 | 4;
export const EVENT_DAYS: EventDay[] = [1, 2, 3, 4];

export function dayLabel(day: EventDay): string {
  return DAY_LABELS[day - 1];
}

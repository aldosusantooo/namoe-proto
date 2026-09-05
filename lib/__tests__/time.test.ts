import { describe, expect, it } from "vitest";
import { DAY_LABELS, dayLabel, formatDay, formatTime, formatTimeRange } from "../time";

// 2026-10-22 14:00 WIB is 07:00 UTC
const afternoon = new Date("2026-10-22T07:00:00Z");
// 2026-10-25 00:30 WIB is 2026-10-24 17:30 UTC, crossing the UTC date line
const lateNight = new Date("2026-10-24T17:30:00Z");

describe("formatTime", () => {
  it("renders WIB with a dot", () => {
    expect(formatTime(afternoon)).toBe("14.00");
  });
  it("pads single digit hours and ignores process TZ", () => {
    expect(formatTime(lateNight)).toBe("00.30");
    expect(formatTime(new Date("2026-10-22T02:05:00Z"))).toBe("09.05");
  });
  it("formats a range with sampai", () => {
    expect(formatTimeRange(afternoon, new Date("2026-10-22T07:45:00Z"))).toBe("14.00 sampai 14.45");
  });
});

describe("formatDay", () => {
  it("renders weekday, day and short month in Bahasa Indonesia", () => {
    expect(formatDay(afternoon)).toBe("Kamis, 22 Okt");
  });
  it("uses the Jakarta date, not the UTC date", () => {
    expect(formatDay(lateNight)).toBe("Minggu, 25 Okt");
  });
});

describe("day labels", () => {
  it("covers the four event days", () => {
    expect(DAY_LABELS).toHaveLength(4);
    expect(dayLabel(1)).toBe("Kamis 22 Okt");
    expect(dayLabel(4)).toBe("Minggu 25 Okt");
  });
});

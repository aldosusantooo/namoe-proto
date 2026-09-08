import { describe, expect, it } from "vitest";
import { formatAverage, jakartaDate, postsPerDay } from "../organizer-stats";

describe("formatAverage", () => {
  it("uses a decimal comma and drops a trailing zero", () => {
    expect(formatAverage(6, 4)).toBe("1,5");
    expect(formatAverage(8, 4)).toBe("2");
    expect(formatAverage(1, 3)).toBe("0,3");
  });
  it("is zero when nothing was counted", () => {
    expect(formatAverage(0, 0)).toBe("0");
  });
});

describe("postsPerDay", () => {
  it("buckets by Jakarta calendar day and keeps the rest apart", () => {
    const dates = [
      new Date("2026-10-22T03:00:00+07:00"),
      new Date("2026-10-21T23:30:00Z"), // 06.30 WIB on 22 Oct
      new Date("2026-10-25T21:00:00+07:00"),
      new Date("2026-09-08T10:00:00+07:00"),
    ];
    expect(jakartaDate(dates[1])).toBe("2026-10-22");
    expect(postsPerDay(dates)).toEqual({ 1: 2, 2: 0, 3: 0, 4: 1, other: 1 });
  });
});

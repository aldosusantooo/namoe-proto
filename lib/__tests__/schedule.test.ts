import { describe, expect, it } from "vitest";
import { groupByDay, parseDay, sessionsForDay } from "../schedule";

const s = (slug: string, day: number, iso: string) => ({ slug, day, startsAt: new Date(iso) });
const sessions = [
  s("kamis-1700", 1, "2026-10-22T10:00:00Z"),
  s("kamis-1300", 1, "2026-10-22T06:00:00Z"),
  s("sabtu-1100", 3, "2026-10-24T04:00:00Z"),
  s("kamis-1500", 1, "2026-10-22T08:00:00Z"),
];

describe("groupByDay", () => {
  it("returns every day key and sorts by start", () => {
    const g = groupByDay(sessions);
    expect(Object.keys(g)).toEqual(["1", "2", "3", "4"]);
    expect(g[1].map((x) => x.slug)).toEqual(["kamis-1300", "kamis-1500", "kamis-1700"]);
    expect(g[2]).toEqual([]);
    expect(g[3].map((x) => x.slug)).toEqual(["sabtu-1100"]);
  });
});

describe("sessionsForDay", () => {
  it("filters and sorts one day", () => {
    expect(sessionsForDay(sessions, 1)[0].slug).toBe("kamis-1300");
    expect(sessionsForDay(sessions, 4)).toEqual([]);
  });
});

describe("parseDay", () => {
  it("defaults to day 1 for missing or invalid input", () => {
    expect(parseDay(undefined)).toBe(1);
    expect(parseDay("9")).toBe(1);
    expect(parseDay("abc")).toBe(1);
    expect(parseDay("3")).toBe(3);
    expect(parseDay(["2"])).toBe(2);
  });
});

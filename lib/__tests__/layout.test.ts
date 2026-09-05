import { describe, expect, it } from "vitest";
import { BOOTH, CLUSTERS, FNB_GROUPS, generateBooths, unionRect } from "../layout";

const booths = generateBooths();
const at = (code: string) => booths.find((b) => b.code === code);

describe("generateBooths", () => {
  it("generates exactly 84 booths", () => {
    expect(booths).toHaveLength(84);
  });
  it("covers A1 to A84 exactly once", () => {
    const codes = booths.map((b) => b.code);
    expect(new Set(codes).size).toBe(84);
    for (let n = 1; n <= 84; n++) expect(codes).toContain(`A${n}`);
  });
  it("places the spot-check booths", () => {
    expect(at("A1")).toMatchObject({ x: 150, y: 140, zone: "A", band: 1 });
    expect(at("A6")).toMatchObject({ x: 230, y: 180 });
    expect(at("A7")).toMatchObject({ x: 306, y: 140 });
    expect(at("A10")).toMatchObject({ x: 346, y: 180 });
    expect(at("A70")).toMatchObject({ x: 694, y: 420, band: 3 });
    expect(at("A76")).toMatchObject({ x: 420, y: 540, zone: "FNB", band: 0 });
  });
  it("splits zones 70 to 14", () => {
    expect(booths.filter((b) => b.zone === "A")).toHaveLength(70);
    expect(booths.filter((b) => b.zone === "FNB")).toHaveLength(14);
  });
  it("has no overlapping rects", () => {
    for (let i = 0; i < booths.length; i++) {
      for (let j = i + 1; j < booths.length; j++) {
        const a = booths[i];
        const b = booths[j];
        const overlap = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
        expect(overlap, `${a.code} overlaps ${b.code}`).toBe(false);
      }
    }
  });
  it("keeps every booth inside the viewBox", () => {
    for (const b of booths) {
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.y).toBeGreaterThanOrEqual(0);
      expect(b.x + b.w).toBeLessThanOrEqual(1200);
      expect(b.y + b.h).toBeLessThanOrEqual(680);
      expect(b.w).toBe(BOOTH);
    }
  });
  it("matches the constants", () => {
    expect(CLUSTERS).toHaveLength(16);
    expect(FNB_GROUPS.map((g) => g.count)).toEqual([2, 3, 4, 3, 2]);
  });
});

describe("unionRect", () => {
  it("bounds a 2x2 cluster", () => {
    const u = unionRect(["A11", "A12", "A13", "A14"].map((c) => at(c)!));
    expect(u).toEqual({ x: 422, y: 140, w: 76, h: 76 });
  });
});

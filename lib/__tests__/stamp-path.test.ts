import { describe, expect, it } from "vitest";
import { BURST_PATH, STAMP_PATH, wavyPath } from "../stamp-path";

function points(d: string): Array<[number, number]> {
  return [...d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
}

/** Counts local maxima of the radius around the centre, which is the number of waves. */
function countWaves(d: string, cx: number, cy: number): number {
  const pts = points(d);
  // The last point repeats the first; drop it so the wrap-around does not double count.
  const radii = pts.slice(0, -1).map(([x, y]) => Math.hypot(x - cx, y - cy));
  let peaks = 0;
  for (let i = 0; i < radii.length; i++) {
    const prev = radii[(i - 1 + radii.length) % radii.length];
    const next = radii[(i + 1) % radii.length];
    if (radii[i] > prev && radii[i] >= next) peaks++;
  }
  return peaks;
}

describe("wavyPath", () => {
  it("starts with a move, ends with a close, and returns to its first point", () => {
    expect(STAMP_PATH.startsWith("M")).toBe(true);
    expect(STAMP_PATH.trim().endsWith("Z")).toBe(true);
    const pts = points(STAMP_PATH);
    expect(pts[0]).toEqual(pts[pts.length - 1]);
  });

  it("stamp outline has 12 waves within the 100 box", () => {
    expect(countWaves(STAMP_PATH, 50, 50)).toBe(12);
    for (const [x, y] of points(STAMP_PATH)) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(100);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(100);
    }
  });

  it("burst ring has 16 waves", () => {
    expect(countWaves(BURST_PATH, 64, 64)).toBe(16);
  });

  it("radius stays between r - amp and r + amp", () => {
    const d = wavyPath(0, 0, 40, 6, 2);
    for (const [x, y] of points(d)) {
      const r = Math.hypot(x, y);
      expect(r).toBeGreaterThanOrEqual(37.9);
      expect(r).toBeLessThanOrEqual(42.1);
    }
  });
});

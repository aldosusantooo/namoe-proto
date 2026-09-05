export const VIEWBOX = { w: 1200, h: 680 } as const;
export const BOOTH = 36;
export const GAP = 4;

// A clusters: row-major numbering, `cols` x 2 rows, starting at `first`
export const CLUSTERS = [
  // band 1
  { band: 1, first: 1, cols: 3, x: 150, y: 140 },
  { band: 1, first: 7, cols: 2, x: 306, y: 140 },
  { band: 1, first: 11, cols: 2, x: 422, y: 140 },
  { band: 1, first: 15, cols: 2, x: 538, y: 140 },
  { band: 1, first: 19, cols: 2, x: 654, y: 140 },
  { band: 1, first: 23, cols: 2, x: 770, y: 140 },
  // band 2
  { band: 2, first: 27, cols: 3, x: 150, y: 260 },
  { band: 2, first: 33, cols: 2, x: 306, y: 260 },
  { band: 2, first: 37, cols: 2, x: 422, y: 260 },
  { band: 2, first: 41, cols: 2, x: 538, y: 260 },
  { band: 2, first: 45, cols: 2, x: 654, y: 260 },
  // band 3
  { band: 3, first: 49, cols: 3, x: 150, y: 380 },
  { band: 3, first: 55, cols: 2, x: 306, y: 380 },
  { band: 3, first: 59, cols: 2, x: 422, y: 380 },
  { band: 3, first: 63, cols: 2, x: 538, y: 380 },
  { band: 3, first: 67, cols: 2, x: 654, y: 380 },
] as const;

// F&B arc: single row groups, slightly lower towards the centre
export const FNB_GROUPS = [
  { first: 71, count: 2, x: 150, y: 505 },
  { first: 73, count: 3, x: 270, y: 525 },
  { first: 76, count: 4, x: 420, y: 540 },
  { first: 80, count: 3, x: 610, y: 525 },
  { first: 83, count: 2, x: 770, y: 505 },
] as const;

export const FIXTURES = {
  stage: { x: 900, y: 250, w: 180, h: 110, label: "Panggung" },
  seating: { label: "Area duduk", y: 470, tables: [300, 360, 420, 480, 540, 600, 660], r: 10 },
  gate: { x: 40, y: 420, w: 44, h: 16, label: "Gerbang" },
  lobbies: [
    { x: 20, y: 110, label: "Lobi utara" },
    { x: 1060, y: 110, label: "Lobi selatan" },
    { x: 600, y: 100, label: "Lobi timur" },
  ],
  mallTop: { y: 30, h: 44, items: ["Paris Baguette", "Toilet", "Adidas", "Under Armour", "H&M"] },
  mallBottom: { y: 600, h: 44, items: ["The Coffee Academic", "Bistecca Milano", "Kinka", "Toilet", "Starbucks Reserve"] },
} as const;

export type BoothGeometry = {
  code: string;
  zone: "A" | "FNB";
  band: number;
  cluster: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

/** All 84 booth rects in viewBox units. A1 to A70 from CLUSTERS, A71 to A84 from FNB_GROUPS (band 0). */
export function generateBooths(): BoothGeometry[] {
  const out: BoothGeometry[] = [];
  const clusterIndexInBand: Record<number, number> = {};
  for (const c of CLUSTERS) {
    const idx = clusterIndexInBand[c.band] ?? 0;
    clusterIndexInBand[c.band] = idx + 1;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < c.cols; col++) {
        const n = c.first + row * c.cols + col;
        out.push({
          code: `A${n}`,
          zone: "A",
          band: c.band,
          cluster: idx,
          x: c.x + col * (BOOTH + GAP),
          y: c.y + row * (BOOTH + GAP),
          w: BOOTH,
          h: BOOTH,
        });
      }
    }
  }
  FNB_GROUPS.forEach((g, idx) => {
    for (let i = 0; i < g.count; i++) {
      out.push({
        code: `A${g.first + i}`,
        zone: "FNB",
        band: 0,
        cluster: idx,
        x: g.x + i * (BOOTH + GAP),
        y: g.y,
        w: BOOTH,
        h: BOOTH,
      });
    }
  });
  return out;
}

/** Bounding box of several rects, for the shared label over multi-unit tenants. */
export function unionRect(rects: Array<{ x: number; y: number; w: number; h: number }>) {
  const x1 = Math.min(...rects.map((r) => r.x));
  const y1 = Math.min(...rects.map((r) => r.y));
  const x2 = Math.max(...rects.map((r) => r.x + r.w));
  const y2 = Math.max(...rects.map((r) => r.y + r.h));
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

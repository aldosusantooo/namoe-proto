/**
 * Wavy badge outline used by the passport stamps and the "baru" burst ring.
 * Same loop as the design reference: a circle of radius `r` whose radius oscillates `waves` times by `amp`.
 */
export function wavyPath(cx: number, cy: number, r: number, waves: number, amp: number): string {
  const steps = waves * 8;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const rr = r + Math.cos(t * waves) * amp;
    const x = cx + Math.cos(t) * rr;
    const y = cy + Math.sin(t) * rr;
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return `${d}Z`;
}

export const STAMP_VIEWBOX = 100;
export const STAMP_WAVES = 12;
/** 12 waves, amplitude 3.5 on radius 42, in a 100 x 100 box. */
export const STAMP_PATH = wavyPath(50, 50, 42, STAMP_WAVES, 3.5);

export const BURST_VIEWBOX = 128;
export const BURST_WAVES = 16;
/** Dashed yellow ring around a fresh stamp: 16 waves, amplitude 5 on radius 58, in a 128 x 128 box. */
export const BURST_PATH = wavyPath(64, 64, 58, BURST_WAVES, 5);

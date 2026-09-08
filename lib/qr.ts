/**
 * Minimal QR code generator for the printable booth sheet. Byte mode, error correction level M,
 * versions 1 to 10 (up to 213 bytes), mask chosen by the standard penalty score.
 * Written for this project after the ISO 18004 tables; no runtime dependency. MIT, like the rest of the repo.
 */

export type QrMatrix = boolean[][];

/** Level M block structure per version: total codewords, EC codewords per block, number of blocks. */
const LEVEL_M: Array<{ total: number; ec: number; blocks: number }> = [
  { total: 0, ec: 0, blocks: 0 }, // version 0 placeholder
  { total: 26, ec: 10, blocks: 1 },
  { total: 44, ec: 16, blocks: 1 },
  { total: 70, ec: 26, blocks: 1 },
  { total: 100, ec: 18, blocks: 2 },
  { total: 134, ec: 24, blocks: 2 },
  { total: 172, ec: 16, blocks: 4 },
  { total: 196, ec: 18, blocks: 4 },
  { total: 242, ec: 22, blocks: 4 },
  { total: 292, ec: 22, blocks: 5 },
  { total: 346, ec: 26, blocks: 5 },
];

const ALIGNMENT: number[][] = [[], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];

const REMAINDER_BITS = [0, 0, 7, 7, 7, 7, 7, 0, 0, 0, 0];

export const QR_MAX_VERSION = 10;

export function qrSize(version: number) {
  return 17 + version * 4;
}

/** Data codewords available at level M for a version. */
export function qrDataCapacity(version: number) {
  const t = LEVEL_M[version];
  return t.total - t.ec * t.blocks;
}

/** Smallest version whose byte-mode capacity holds `bytes` (4 bit mode, 8 or 16 bit count). */
export function qrVersionFor(bytes: number): number {
  for (let v = 1; v <= QR_MAX_VERSION; v++) {
    const countBits = v < 10 ? 8 : 16;
    if (4 + countBits + bytes * 8 <= qrDataCapacity(v) * 8) return v;
  }
  throw new Error(`Text too long for a version ${QR_MAX_VERSION} QR code`);
}

// ---- Galois field and Reed-Solomon

function gfMul(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function rsDivisor(degree: number): number[] {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMul(result[j], root) ^ (j + 1 < degree ? result[j + 1] : 0);
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

function rsRemainder(data: number[], divisor: number[]): number[] {
  const result = new Array<number>(divisor.length).fill(0);
  for (const b of data) {
    const factor = b ^ (result.shift() as number);
    result.push(0);
    for (let i = 0; i < divisor.length; i++) result[i] ^= gfMul(divisor[i], factor);
  }
  return result;
}

// ---- Encoding

/** UTF-8 bytes of the text, then the byte-mode bit stream padded to the version's data capacity. */
export function qrDataCodewords(text: string, version: number): number[] {
  const bytes = [...new TextEncoder().encode(text)];
  const capacityBits = qrDataCapacity(version) * 8;
  const bits: number[] = [];
  const push = (value: number, count: number) => {
    for (let i = count - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, version < 10 ? 8 : 16);
  for (const b of bytes) push(b, 8);
  if (bits.length > capacityBits) throw new Error("Data exceeds capacity");
  push(0, Math.min(4, capacityBits - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);
  for (let pad = 0xec; bits.length < capacityBits; pad ^= 0xec ^ 0x11) push(pad, 8);
  const out: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    out.push(byte);
  }
  return out;
}

/** Splits data into blocks, appends EC codewords per block, interleaves both. */
export function qrInterleave(data: number[], version: number): number[] {
  const { total, ec, blocks: numBlocks } = LEVEL_M[version];
  const numShort = numBlocks - (total % numBlocks);
  const shortLen = Math.floor(total / numBlocks);
  const divisor = rsDivisor(ec);
  const blocks: number[][] = [];
  let k = 0;
  for (let b = 0; b < numBlocks; b++) {
    const dataLen = shortLen - ec + (b < numShort ? 0 : 1);
    const block = data.slice(k, k + dataLen);
    k += dataLen;
    const remainder = rsRemainder(block, divisor);
    if (b < numShort) block.push(0);
    blocks.push([...block, ...remainder]);
  }
  const result: number[] = [];
  for (let i = 0; i < blocks[0].length; i++) {
    for (let b = 0; b < numBlocks; b++) {
      if (i !== shortLen - ec || b >= numShort) result.push(blocks[b][i]);
    }
  }
  return result;
}

// ---- Matrix

type Grid = { size: number; modules: boolean[][]; isFunction: boolean[][] };

function newGrid(size: number): Grid {
  return {
    size,
    modules: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
    isFunction: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
  };
}

function setFn(g: Grid, x: number, y: number, dark: boolean) {
  g.modules[y][x] = dark;
  g.isFunction[y][x] = true;
}

function drawFinder(g: Grid, cx: number, cy: number) {
  for (let dy = -4; dy <= 4; dy++) {
    for (let dx = -4; dx <= 4; dx++) {
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      const x = cx + dx;
      const y = cy + dy;
      if (x >= 0 && x < g.size && y >= 0 && y < g.size) setFn(g, x, y, dist !== 2 && dist !== 4);
    }
  }
}

function drawAlignment(g: Grid, cx: number, cy: number) {
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setFn(g, cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
}

function formatBits(mask: number): number {
  const data = (0b00 << 3) | mask; // level M is 00
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  return ((data << 10) | rem) ^ 0x5412;
}

function drawFormat(g: Grid, mask: number) {
  const bits = formatBits(mask);
  const bit = (i: number) => ((bits >>> i) & 1) === 1;
  for (let i = 0; i <= 5; i++) setFn(g, 8, i, bit(i));
  setFn(g, 8, 7, bit(6));
  setFn(g, 8, 8, bit(7));
  setFn(g, 7, 8, bit(8));
  for (let i = 9; i < 15; i++) setFn(g, 14 - i, 8, bit(i));
  for (let i = 0; i < 8; i++) setFn(g, g.size - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i++) setFn(g, 8, g.size - 15 + i, bit(i));
  setFn(g, 8, g.size - 8, true);
}

function drawVersion(g: Grid, version: number) {
  if (version < 7) return;
  let rem = version;
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
  const bits = (version << 12) | rem;
  for (let i = 0; i < 18; i++) {
    const dark = ((bits >>> i) & 1) === 1;
    const a = g.size - 11 + (i % 3);
    const b = Math.floor(i / 3);
    setFn(g, a, b, dark);
    setFn(g, b, a, dark);
  }
}

function drawFunctionPatterns(g: Grid, version: number) {
  for (let i = 0; i < g.size; i++) {
    setFn(g, 6, i, i % 2 === 0);
    setFn(g, i, 6, i % 2 === 0);
  }
  drawFinder(g, 3, 3);
  drawFinder(g, g.size - 4, 3);
  drawFinder(g, 3, g.size - 4);
  const centres = ALIGNMENT[version];
  for (let i = 0; i < centres.length; i++) {
    for (let j = 0; j < centres.length; j++) {
      const skip = (i === 0 && j === 0) || (i === 0 && j === centres.length - 1) || (i === centres.length - 1 && j === 0);
      if (!skip) drawAlignment(g, centres[i], centres[j]);
    }
  }
  drawFormat(g, 0);
  drawVersion(g, version);
}

function drawCodewords(g: Grid, codewords: number[]) {
  let i = 0;
  const totalBits = codewords.length * 8;
  for (let right = g.size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < g.size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? g.size - 1 - vert : vert;
        if (!g.isFunction[y][x] && i < totalBits) {
          g.modules[y][x] = ((codewords[i >>> 3] >>> (7 - (i & 7))) & 1) === 1;
          i++;
        }
      }
    }
  }
}

function maskBit(mask: number, x: number, y: number): boolean {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5:
      return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6:
      return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    default:
      return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
  }
}

function applyMask(g: Grid, mask: number) {
  for (let y = 0; y < g.size; y++) for (let x = 0; x < g.size; x++) if (!g.isFunction[y][x] && maskBit(mask, x, y)) g.modules[y][x] = !g.modules[y][x];
}

function penalty(g: Grid): number {
  const { size, modules } = g;
  let score = 0;
  const lines: string[] = [];
  for (let y = 0; y < size; y++) lines.push(modules[y].map((m) => (m ? "1" : "0")).join(""));
  for (let x = 0; x < size; x++) lines.push(modules.map((row) => (row[x] ? "1" : "0")).join(""));
  for (const line of lines) {
    for (const run of line.match(/0+|1+/g) ?? []) if (run.length >= 5) score += 3 + (run.length - 5);
    for (const pat of ["10111010000", "00001011101"]) {
      let idx = line.indexOf(pat);
      while (idx !== -1) {
        score += 40;
        idx = line.indexOf(pat, idx + 1);
      }
    }
  }
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const c = modules[y][x];
      if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) score += 3;
    }
  }
  let dark = 0;
  for (const row of modules) for (const m of row) if (m) dark++;
  const total = size * size;
  const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
  score += k * 10;
  return score;
}

/** Encodes `text` and returns the module matrix (true = dark). */
export function qrEncode(text: string): QrMatrix {
  const version = qrVersionFor(new TextEncoder().encode(text).length);
  const codewords = qrInterleave(qrDataCodewords(text, version), version);
  const withRemainder = REMAINDER_BITS[version] ? [...codewords, 0] : codewords;
  const g = newGrid(qrSize(version));
  drawFunctionPatterns(g, version);
  drawCodewords(g, withRemainder);

  let best = 0;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(g, mask);
    drawFormat(g, mask);
    const score = penalty(g);
    if (score < bestScore) {
      bestScore = score;
      best = mask;
    }
    applyMask(g, mask);
  }
  applyMask(g, best);
  drawFormat(g, best);
  return g.modules;
}

/** One SVG path drawing every dark module as a unit square; scale with the viewBox. */
export function qrPath(modules: QrMatrix): string {
  const parts: string[] = [];
  for (let y = 0; y < modules.length; y++) {
    for (let x = 0; x < modules.length; x++) if (modules[y][x]) parts.push(`M${x} ${y}h1v1h-1z`);
  }
  return parts.join("");
}

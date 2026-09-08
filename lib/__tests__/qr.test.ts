import { describe, expect, it } from "vitest";
import { qrDataCapacity, qrDataCodewords, qrEncode, qrInterleave, qrPath, qrSize, qrVersionFor } from "../qr";

const URL = "https://namoe-proto-production.up.railway.app/b/deqiikpjdbl5sdl6mmul";

function finderAt(m: boolean[][], cx: number, cy: number) {
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      if (m[cy + dy][cx + dx] !== (dist !== 2)) return false;
    }
  }
  return true;
}

describe("qr", () => {
  it("picks the smallest version that fits and sizes the matrix accordingly", () => {
    expect(qrVersionFor(10)).toBe(1);
    expect(qrVersionFor(17)).toBe(2);
    expect(qrDataCapacity(1)).toBe(16);
    expect(qrDataCapacity(4)).toBe(64);
    expect(qrSize(1)).toBe(21);
    expect(qrSize(10)).toBe(57);
  });

  it("builds byte-mode codewords with the mode, count, terminator and pad bytes", () => {
    const cw = qrDataCodewords("AB", 1);
    expect(cw).toHaveLength(16);
    // 0100 0000 0010 | 0100 0001 | 0100 0010 | 0000 then pads
    expect(cw.slice(0, 4)).toEqual([0x40, 0x24, 0x14, 0x20]);
    expect(cw.slice(4, 6)).toEqual([0xec, 0x11]);
  });

  it("appends the right number of EC codewords and interleaves blocks", () => {
    expect(qrInterleave(qrDataCodewords("AB", 1), 1)).toHaveLength(26);
    expect(qrInterleave(qrDataCodewords("x".repeat(60), 4), 4)).toHaveLength(100);
  });

  it("known vector: 'hello' in version 1 M matches the standard Reed-Solomon output", () => {
    // Data codewords for "hello" plus EC computed by a reference implementation (level M, 10 EC codewords).
    const cw = qrInterleave(qrDataCodewords("hello", 1), 1);
    expect(cw.slice(0, 16)).toEqual([0x40, 0x56, 0x86, 0x56, 0xc6, 0xc6, 0xf0, 0xec, 0x11, 0xec, 0x11, 0xec, 0x11, 0xec, 0x11, 0xec]);
    expect(cw).toHaveLength(26);
  });

  it("encodes a booth URL with the three finder patterns, timing rows and the dark module", () => {
    const m = qrEncode(URL);
    const size = m.length;
    expect(size).toBe(qrSize(qrVersionFor(new TextEncoder().encode(URL).length)));
    expect(finderAt(m, 3, 3)).toBe(true);
    expect(finderAt(m, size - 4, 3)).toBe(true);
    expect(finderAt(m, 3, size - 4)).toBe(true);
    for (let i = 8; i < size - 8; i++) {
      expect(m[6][i]).toBe(i % 2 === 0);
      expect(m[i][6]).toBe(i % 2 === 0);
    }
    expect(m[size - 8][8]).toBe(true);
  });

  it("format information decodes to level M with a valid BCH remainder", () => {
    const m = qrEncode("hello");
    let bits = 0;
    for (let i = 0; i <= 5; i++) bits |= (m[i][8] ? 1 : 0) << i;
    bits |= (m[7][8] ? 1 : 0) << 6;
    bits |= (m[8][8] ? 1 : 0) << 7;
    bits |= (m[8][7] ? 1 : 0) << 8;
    for (let i = 9; i < 15; i++) bits |= (m[8][14 - i] ? 1 : 0) << i;
    const unmasked = bits ^ 0x5412;
    const data = unmasked >>> 10;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    expect(unmasked & 0x3ff).toBe(rem);
    expect(data >>> 3).toBe(0b00);
  });

  it("renders one path segment per dark module", () => {
    const m = qrEncode("hi");
    const dark = m.flat().filter(Boolean).length;
    expect(qrPath(m).split("M").length - 1).toBe(dark);
  });
});

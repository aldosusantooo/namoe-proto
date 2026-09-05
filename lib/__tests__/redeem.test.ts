import { describe, expect, it } from "vitest";
import { REDEEM_ALPHABET, generateRedeemCode, normaliseRedeemCode } from "../redeem";

describe("generateRedeemCode", () => {
  it("returns 6 chars from the alphabet over 1000 draws", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const code = generateRedeemCode();
      expect(code).toHaveLength(6);
      for (const ch of code) expect(REDEEM_ALPHABET).toContain(ch);
      seen.add(code);
    }
    expect(seen.size).toBeGreaterThan(990);
  });
  it("never contains 0, O, 1 or I", () => {
    expect(REDEEM_ALPHABET).toHaveLength(32);
    expect(REDEEM_ALPHABET).not.toMatch(/[0O1I]/);
  });
  it("uses the injected random source", () => {
    const fake = { getRandomValues: <T extends ArrayBufferView>(arr: T) => ((arr as unknown as Uint8Array).fill(0), arr) };
    expect(generateRedeemCode(fake)).toBe("AAAAAA");
  });
});

describe("normaliseRedeemCode", () => {
  it("accepts a clean code", () => {
    expect(normaliseRedeemCode("ABC234")).toBe("ABC234");
  });
  it("uppercases and strips spaces and dashes", () => {
    expect(normaliseRedeemCode(" abc-234 ")).toBe("ABC234");
    expect(normaliseRedeemCode("ab c2 34")).toBe("ABC234");
  });
  it("rejects wrong length and invalid characters", () => {
    expect(normaliseRedeemCode("ABC23")).toBeNull();
    expect(normaliseRedeemCode("ABC2345")).toBeNull();
    expect(normaliseRedeemCode("ABC0O1")).toBeNull();
    expect(normaliseRedeemCode("ABCII2")).toBeNull();
    expect(normaliseRedeemCode("")).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { cleanBody, cleanName } from "../validate";

describe("cleanBody", () => {
  it("trims and collapses whitespace", () => {
    expect(cleanBody("  halo   dunia \n ini ")).toEqual({ ok: true, value: "halo dunia ini" });
  });
  it("rejects short and long bodies", () => {
    expect(cleanBody("ab")).toEqual({ ok: false, error: "bodyTooShort" });
    expect(cleanBody("   a   ")).toEqual({ ok: false, error: "bodyTooShort" });
    expect(cleanBody("x".repeat(281))).toEqual({ ok: false, error: "bodyTooLong" });
    expect(cleanBody("x".repeat(280)).ok).toBe(true);
  });
});

describe("cleanName", () => {
  it("returns null for empty or whitespace names, never an empty string", () => {
    expect(cleanName("")).toEqual({ ok: true, value: null });
    expect(cleanName("   ")).toEqual({ ok: true, value: null });
    expect(cleanName(undefined)).toEqual({ ok: true, value: null });
  });
  it("trims and caps at 30 chars", () => {
    expect(cleanName("  Sari  ")).toEqual({ ok: true, value: "Sari" });
    expect(cleanName("a".repeat(40)).value).toHaveLength(30);
  });
});

import { describe, expect, it } from "vitest";
import { cleanOptionalText, cleanPhotoRef, cleanText, cleanTime, cleanUrl, INTRO_MAX } from "../validate";

describe("cleanOptionalText", () => {
  it("collapses whitespace and turns empty into null", () => {
    expect(cleanOptionalText("  halo   dunia ", 50)).toEqual({ ok: true, value: "halo dunia" });
    expect(cleanOptionalText("   ", 50)).toEqual({ ok: true, value: null });
    expect(cleanOptionalText(undefined, 50)).toEqual({ ok: true, value: null });
  });
  it("rejects over the cap instead of cutting", () => {
    expect(cleanOptionalText("a".repeat(INTRO_MAX + 1), INTRO_MAX)).toEqual({ ok: false, error: "bodyTooLong" });
  });
});

describe("cleanText", () => {
  it("needs at least 3 chars and at most max", () => {
    expect(cleanText("ok", 140).ok).toBe(false);
    expect(cleanText("oke sip", 140)).toEqual({ ok: true, value: "oke sip" });
    expect(cleanText("x".repeat(141), 140)).toEqual({ ok: false, error: "bodyTooLong" });
  });
});

describe("cleanUrl", () => {
  it("accepts http and https only", () => {
    expect(cleanUrl("https://shopee.co.id/gabag")).toEqual({ ok: true, value: "https://shopee.co.id/gabag" });
    expect(cleanUrl("javascript:alert(1)").ok).toBe(false);
    expect(cleanUrl("shopee.co.id").ok).toBe(false);
    expect(cleanUrl("").ok).toBe(false);
  });
});

describe("cleanPhotoRef", () => {
  it("accepts our own upload paths and remote URLs", () => {
    expect(cleanPhotoRef("/uploads/gabag-indonesia/ab12cd34.jpg").ok).toBe(true);
    expect(cleanPhotoRef("https://cdn.example.com/a.jpg").ok).toBe(true);
    expect(cleanPhotoRef("/uploads/../etc/passwd").ok).toBe(false);
    expect(cleanPhotoRef("/etc/passwd").ok).toBe(false);
  });
});

describe("cleanTime", () => {
  it("normalises to HH.MM and accepts a colon", () => {
    expect(cleanTime("14.00")).toEqual({ ok: true, value: "14.00" });
    expect(cleanTime("9:30")).toEqual({ ok: true, value: "09.30" });
    expect(cleanTime("")).toEqual({ ok: true, value: null });
  });
  it("rejects nonsense", () => {
    expect(cleanTime("siang").ok).toBe(false);
    expect(cleanTime("25.00").ok).toBe(false);
    expect(cleanTime("14.60").ok).toBe(false);
  });
});

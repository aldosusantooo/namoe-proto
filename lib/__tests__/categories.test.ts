import { describe, expect, it } from "vitest";
import { CATEGORIES, byKey, bySlug, catInkVar, catVar, isLightHue } from "../categories";

describe("categories", () => {
  it("has ten unique keys and slugs", () => {
    expect(CATEGORIES).toHaveLength(10);
    expect(new Set(CATEGORIES.map((c) => c.key)).size).toBe(10);
    expect(new Set(CATEGORIES.map((c) => c.slug)).size).toBe(10);
  });
  it("looks up by slug and key", () => {
    expect(bySlug("mainan-hobi")?.key).toBe("MAINAN_HOBI");
    expect(bySlug("nope")).toBeUndefined();
    expect(byKey("EDUKASI").label).toBe("Edukasi");
    expect(() => byKey("NOPE")).toThrow();
  });
  it("builds css variable references", () => {
    expect(catVar("PAKAIAN_IBU_ANAK")).toBe("var(--color-cat-pakaian-ibu-anak)");
    expect(catInkVar("MAKANAN_MINUMAN")).toBe("var(--color-cat-makanan-minuman-ink)");
  });
  it("knows the three light hues that take ink text, from the generated tokens", () => {
    expect(isLightHue("PERALATAN_DAPUR")).toBe(true);
    expect(isLightHue("MAINAN_HOBI")).toBe(true);
    expect(isLightHue("PERLENGKAPAN_RUMAH")).toBe(true);
    expect(isLightHue("EDUKASI")).toBe(false);
    expect(CATEGORIES.filter((c) => isLightHue(c.key))).toHaveLength(3);
  });
});

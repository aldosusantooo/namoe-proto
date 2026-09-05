import { describe, expect, it } from "vitest";
import { CATEGORIES, byKey, bySlug, cssVar, cssVarSoft } from "../categories";

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
    expect(cssVar("PAKAIAN_IBU_ANAK")).toBe("var(--color-cat-pakaian-ibu-anak)");
    expect(cssVarSoft("MAKANAN_MINUMAN")).toBe("var(--color-cat-makanan-minuman-soft)");
  });
});

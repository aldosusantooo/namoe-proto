export const CATEGORIES = [
  { key: "PAKAIAN_IBU_ANAK", slug: "pakaian-ibu-anak", label: "Pakaian ibu dan anak" },
  { key: "AKSESORI_ANAK", slug: "aksesori-anak", label: "Aksesori anak" },
  { key: "PERLENGKAPAN_RUMAH", slug: "perlengkapan-rumah", label: "Perlengkapan rumah" },
  { key: "DEKORASI_RUMAH", slug: "dekorasi-rumah", label: "Dekorasi rumah" },
  { key: "MAINAN_HOBI", slug: "mainan-hobi", label: "Mainan dan hobi" },
  { key: "ELEKTRONIK", slug: "elektronik", label: "Elektronik" },
  { key: "PERLENGKAPAN_IBU", slug: "perlengkapan-ibu", label: "Perlengkapan ibu" },
  { key: "PERALATAN_DAPUR", slug: "peralatan-dapur", label: "Peralatan dapur" },
  { key: "EDUKASI", slug: "edukasi", label: "Edukasi" },
  { key: "MAKANAN_MINUMAN", slug: "makanan-minuman", label: "Makanan dan minuman" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];
export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
export type CategoryInfo = (typeof CATEGORIES)[number];

export function bySlug(slug: string | undefined | null): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function byKey(key: string): CategoryInfo {
  const found = CATEGORIES.find((c) => c.key === key);
  if (!found) throw new Error(`Unknown category ${key}`);
  return found;
}

/** `var(--color-cat-<slug>)`; the colour itself lives only in tokens.css. */
export function cssVar(key: CategoryKey): string {
  return `var(--color-cat-${byKey(key).slug})`;
}

export function cssVarSoft(key: CategoryKey): string {
  return `var(--color-cat-${byKey(key).slug}-soft)`;
}

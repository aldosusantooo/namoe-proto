// Category glyphs, one per Category slug. Path data lives in lib/glyph-paths.ts so the /img route shares it.
import type { CSSProperties } from "react";
import { byKey, type CategoryKey, type CategorySlug } from "@/lib/categories";
import { GLYPH_PATHS, GLYPH_VIEWBOX } from "@/lib/glyph-paths";

export type GlyphProps = { size?: number; className?: string; style?: CSSProperties };

/** Glyph by slug. Renders aria-hidden and paints with currentColor. */
export function Glyph({ slug, size = 20, className, style }: GlyphProps & { slug: CategorySlug }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`0 0 ${GLYPH_VIEWBOX} ${GLYPH_VIEWBOX}`}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: GLYPH_PATHS[slug] }}
    />
  );
}

/** Glyph by Prisma Category key. */
export function CategoryGlyph({ category, ...rest }: GlyphProps & { category: CategoryKey }) {
  return <Glyph slug={byKey(category).slug} {...rest} />;
}

export function GlyphPakaianIbuAnak(props: GlyphProps) {
  return <Glyph slug="pakaian-ibu-anak" {...props} />;
}

export function GlyphAksesoriAnak(props: GlyphProps) {
  return <Glyph slug="aksesori-anak" {...props} />;
}

export function GlyphPerlengkapanRumah(props: GlyphProps) {
  return <Glyph slug="perlengkapan-rumah" {...props} />;
}

export function GlyphDekorasiRumah(props: GlyphProps) {
  return <Glyph slug="dekorasi-rumah" {...props} />;
}

export function GlyphMainanHobi(props: GlyphProps) {
  return <Glyph slug="mainan-hobi" {...props} />;
}

export function GlyphElektronik(props: GlyphProps) {
  return <Glyph slug="elektronik" {...props} />;
}

export function GlyphPerlengkapanIbu(props: GlyphProps) {
  return <Glyph slug="perlengkapan-ibu" {...props} />;
}

export function GlyphPeralatanDapur(props: GlyphProps) {
  return <Glyph slug="peralatan-dapur" {...props} />;
}

export function GlyphEdukasi(props: GlyphProps) {
  return <Glyph slug="edukasi" {...props} />;
}

export function GlyphMakananMinuman(props: GlyphProps) {
  return <Glyph slug="makanan-minuman" {...props} />;
}

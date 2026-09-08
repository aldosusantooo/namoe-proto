import { byKey, type CategoryKey } from "@/lib/categories";
import { Glyph } from "./icons/Glyphs";

export type PlaceholderVariant = "thumb" | "card" | "hero";

type Props = {
  name: string;
  category: CategoryKey;
  /** thumb: glyph only, centred. card: glyph top-right, name bottom-left. hero: 358 x 250 box, name in the left 60%. */
  variant?: PlaceholderVariant;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Inline placeholder art for tenants without a photo: category colour, dot texture, category glyph, brand name.
 * The /img/[slug] route serves the same design as an SVG file for <img> consumers.
 */
export function PlaceholderArt({ name, category, variant = "card", className = "", style }: Props) {
  const info = byKey(category);
  const ink = `var(--color-cat-${info.slug}-ink)`;
  return (
    <div
      aria-hidden="true"
      className={`relative block h-full w-full overflow-hidden ${className}`}
      style={{ background: `var(--color-cat-${info.slug})`, color: ink, ...style }}
    >
      <div className="texture-dots absolute inset-0" />
      {variant === "thumb" ? (
        <Glyph slug={info.slug} className="absolute inset-[14%] h-auto w-auto" style={{ width: "72%", height: "72%" }} />
      ) : variant === "hero" ? (
        <Glyph
          slug={info.slug}
          className="absolute"
          style={{ right: "2%", top: "12%", width: "46%", height: "70%", opacity: "var(--ph-glyph-opacity)" }}
        />
      ) : (
        <Glyph slug={info.slug} className="absolute" style={{ right: "-6%", top: "-8%", width: "64%", height: "64%", opacity: "var(--ph-glyph-opacity)" }} />
      )}
      {variant === "thumb" ? null : (
        <span
          className={`absolute font-display font-semibold leading-[1.05] ${
            variant === "hero" ? "bottom-5 left-5 right-[40%] text-[34px]" : "bottom-2.5 left-2.5 right-2.5 text-[20px]"
          }`}
        >
          {name}
        </span>
      )}
    </div>
  );
}

/** URL of the served placeholder, with the tenant's updatedAt so a rename busts the immutable cache. */
export function placeholderUrl(slug: string, variant: PlaceholderVariant, updatedAt: Date | string | number) {
  const t = typeof updatedAt === "number" ? updatedAt : new Date(updatedAt).getTime();
  return `/img/${slug}?v=${variant}&t=${Math.floor(t / 1000)}`;
}

/** Image source priority for a tenant: logo, first photo, generated placeholder. */
export function tenantImage(
  t: { slug: string; logoUrl: string | null; photos: string[]; updatedAt: Date | string | number },
  variant: PlaceholderVariant = "card",
) {
  return t.logoUrl ?? t.photos[0] ?? placeholderUrl(t.slug, variant, t.updatedAt);
}

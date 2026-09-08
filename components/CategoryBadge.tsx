import { byKey, catInkVar, catVar, type CategoryKey } from "@/lib/categories";
import { Glyph } from "./icons/Glyphs";

type Props = { category: CategoryKey; size?: "md" | "sm"; className?: string };

/** Saturated category pill: category fill, ink or white text, glyph before the label. `sm` drops the glyph. */
export function CategoryBadge({ category, size = "md", className = "" }: Props) {
  const info = byKey(category);
  const sizing = size === "sm" ? "min-h-6 px-2 text-caption" : "min-h-7 gap-1.5 px-3 py-0.5 text-small";
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-pill font-display font-semibold ${sizing} ${className}`}
      style={{ background: catVar(info.key), color: catInkVar(info.key) }}
    >
      {size === "md" ? <Glyph slug={info.slug} size={16} /> : null}
      {info.label}
    </span>
  );
}

/** Cream sticker pill with a 2px edge, used for booth codes and the "Logo" tag. */
export function BoothPill({ children, size = "md", className = "" }: { children: React.ReactNode; size?: "md" | "sm"; className?: string }) {
  const sizing = size === "sm" ? "min-h-6 px-2 text-caption" : "min-h-7 gap-1.5 px-3 text-small";
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-pill border-2 border-edge bg-cream font-display font-semibold text-ink ${sizing} ${className}`}>
      {children}
    </span>
  );
}

/** Generic pill: navy by default, or any token background with matching ink. Outline variant for counts. */
export function Pill({
  children,
  tone = "navy",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "navy" | "yellow" | "green" | "coral" | "outline";
  className?: string;
}) {
  const tones = {
    navy: "bg-navy text-paper",
    yellow: "bg-yellow text-ink",
    green: "bg-green text-paper",
    coral: "bg-coral text-paper",
    outline: "border-2 border-navy text-navy",
  };
  return (
    <span className={`inline-flex min-h-7 items-center gap-1.5 whitespace-nowrap rounded-pill px-3 py-0.5 font-display text-small font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

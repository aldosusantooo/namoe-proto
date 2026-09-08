import Link from "next/link";
import { type CategoryInfo } from "@/lib/categories";
import { Glyph } from "./icons/Glyphs";

type Props = {
  href: string;
  active?: boolean;
  /** Category chip: glyph 20 in the category colour; active state fills with the category colour. */
  category?: CategoryInfo;
  children: React.ReactNode;
};

/** Filter chip, 44 high. "Semua" active is navy; a category active is its own colour with matching ink. */
export function Chip({ href, active = false, category, children }: Props) {
  const style = active && category
    ? { background: `var(--color-cat-${category.slug})`, color: `var(--color-cat-${category.slug}-ink)`, borderColor: "transparent" }
    : undefined;
  const tone = active
    ? category
      ? ""
      : "border-navy bg-navy text-paper"
    : "border-edge bg-paper text-ink";
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={`inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-pill border-2 pl-3 pr-4 font-display text-body font-semibold ${tone}`}
      style={style}
    >
      {category ? (
        <Glyph slug={category.slug} size={20} style={active ? undefined : { color: `var(--color-cat-${category.slug})` }} />
      ) : null}
      {children}
    </Link>
  );
}

/** Same chip shape as a plain anchor or span for link rows (Instagram, TikTok, marketplace). */
export function LinkChip({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-pill border-2 border-edge bg-paper pl-3 pr-4 font-display text-body font-semibold text-ink"
    >
      {icon}
      {children}
    </a>
  );
}

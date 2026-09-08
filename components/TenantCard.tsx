import Link from "next/link";
import type { Category } from "@prisma/client";
import { primaryCode } from "@/lib/booth-label";
import { byKey } from "@/lib/categories";
import { Card } from "./Card";
import { Glyph } from "./icons/Glyphs";
import { tenantImage } from "./PlaceholderArt";

export type TenantCardData = {
  slug: string;
  name: string;
  category: Category;
  logoUrl: string | null;
  photos: string[];
  updatedAt: Date;
  booths: { code: string }[];
};

/** Directory card: square image with the booth code sticker, name, then glyph plus category label. */
export function TenantCard({ tenant, trailing }: { tenant: TenantCardData; trailing?: React.ReactNode }) {
  const code = primaryCode(tenant.booths.map((b) => b.code));
  const info = byKey(tenant.category);
  return (
    <Card as="article" className="relative flex h-full flex-col">
      <Link href={`/tenant/${tenant.slug}`} className="flex flex-1 flex-col no-underline">
        <span className="relative block aspect-square w-full">
          <img src={tenantImage(tenant)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          {code ? (
            <span className="absolute left-2 top-2 rounded-[8px] bg-cream px-2 py-0.5 font-display text-small font-semibold text-ink shadow-sticker-code">
              {code}
            </span>
          ) : null}
        </span>
        <span className="flex flex-1 flex-col gap-1.5 px-3 pb-3 pt-2.5">
          <span className="line-clamp-2 font-display text-[17px] font-semibold leading-[1.2] text-ink">{tenant.name}</span>
          <span className="flex items-start gap-1.5 text-[13px] font-bold leading-[1.25] text-ink-soft">
            <Glyph slug={info.slug} size={16} className="mt-px shrink-0" style={{ color: `var(--color-cat-${info.slug})` }} />
            <span>{info.label}</span>
          </span>
        </span>
      </Link>
      {trailing}
    </Card>
  );
}

import Link from "next/link";
import type { Category } from "@prisma/client";
import { primaryCode } from "@/lib/booth-label";
import { copy } from "@/lib/copy";
import { CategoryBadge } from "./CategoryBadge";

export type TenantCardData = {
  slug: string;
  name: string;
  category: Category;
  logoUrl: string | null;
  photos: string[];
  booths: { code: string }[];
};

export function tenantImage(t: { slug: string; logoUrl: string | null; photos: string[] }) {
  return t.logoUrl ?? t.photos[0] ?? `/img/${t.slug}?logo=1`;
}

export function TenantCard({ tenant }: { tenant: TenantCardData }) {
  const code = primaryCode(tenant.booths.map((b) => b.code));
  return (
    <Link
      href={`/tenant/${tenant.slug}`}
      className="flex flex-col overflow-hidden rounded-lg bg-surface shadow-card transition-transform duration-[var(--duration-fast)] active:scale-[0.98]"
    >
      <img src={tenantImage(tenant)} alt="" loading="lazy" className="aspect-square w-full bg-surface-alt object-cover" />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 font-display text-h3 leading-snug text-fg">{tenant.name}</h3>
        <CategoryBadge category={tenant.category} className="self-start" />
        {code ? (
          <span className="mt-auto self-start rounded-pill bg-primary-soft px-2.5 py-1 font-display text-small font-semibold text-navy">
            {copy.directory.booth(code)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

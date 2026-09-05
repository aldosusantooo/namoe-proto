import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { CategoryChips } from "@/components/CategoryChips";
import { Empty } from "@/components/Empty";
import { SearchBox } from "@/components/SearchBox";
import { TenantCard } from "@/components/TenantCard";
import { bySlug } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";

export const metadata = { title: copy.nav.tenants };

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function TenantDirectoryPage({ searchParams }: PageProps<"/tenant">) {
  const params = await searchParams;
  const category = bySlug(first(params.kategori));
  const q = (first(params.q) ?? "").trim();

  const where: Prisma.TenantWhereInput = {
    ...(category ? { category: category.key } : {}),
    ...(q
      ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { intro: { contains: q, mode: "insensitive" } }] }
      : {}),
  };

  const tenants = await db.tenant.findMany({
    where,
    orderBy: { name: "asc" },
    select: { slug: true, name: true, category: true, logoUrl: true, photos: true, booths: { select: { code: true } } },
  });

  const mapHref = category ? `/peta?kategori=${category.slug}` : "/peta";

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-30 -mx-[var(--page-gutter)] flex flex-col gap-3 bg-bg px-[var(--page-gutter)] pb-3 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-display text-fg">{copy.nav.tenants}</h1>
          <Link href={mapHref} className="flex min-h-[var(--tap-min)] items-center text-small font-bold text-link">
            {copy.directory.seeOnMap}
          </Link>
        </div>
        <SearchBox basePath="/tenant" />
        <CategoryChips basePath="/tenant" active={category} extraParams={{ q }} />
      </div>

      <p className="text-small text-fg-muted">{copy.home.tenantsCount(tenants.length)}</p>

      {tenants.length ? (
        <ul className="grid grid-cols-2 gap-3">
          {tenants.map((t) => (
            <li key={t.slug}>
              <TenantCard tenant={t} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty>{copy.directory.empty}</Empty>
      )}
    </div>
  );
}

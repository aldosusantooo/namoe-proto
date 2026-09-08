import type { Prisma } from "@prisma/client";
import { CategoryChips } from "@/components/CategoryChips";
import { DirectoryHeader } from "@/components/DirectoryHeader";
import { SavedChip, TenantGrid } from "@/components/TenantGrid";
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
  const savedMode = first(params.simpan) === "1";

  // Name, intro, or a booth code ("A37" or "a3" as a prefix).
  const where: Prisma.TenantWhereInput = {
    ...(category ? { category: category.key } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { intro: { contains: q, mode: "insensitive" } },
            { booths: { some: { code: { startsWith: q.toUpperCase() } } } },
          ],
        }
      : {}),
  };

  const tenants = await db.tenant.findMany({
    where,
    orderBy: { name: "asc" },
    select: { slug: true, name: true, category: true, logoUrl: true, photos: true, updatedAt: true, booths: { select: { code: true } } },
  });

  const mapHref = category ? `/peta?kategori=${category.slug}` : "/peta";
  const savedHref = q ? `/tenant?simpan=1&q=${encodeURIComponent(q)}` : "/tenant?simpan=1";
  const countLine = category ? copy.directory.countIn(tenants.length, category.label) : copy.directory.count(tenants.length);

  return (
    <div className="flex flex-col gap-4">
      <DirectoryHeader mapHref={mapHref} initialOpen={q.length > 0} />
      <CategoryChips basePath="/tenant" active={category} extraParams={{ q }} leading={<SavedChip active={savedMode} href={savedHref} />} allInactive={savedMode} />
      <TenantGrid tenants={tenants.map((t) => ({ ...t, updatedAt: t.updatedAt.getTime() }))} savedMode={savedMode} countLine={countLine} />
    </div>
  );
}

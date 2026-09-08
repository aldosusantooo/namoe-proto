import { Button } from "@/components/Button";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CategoryChips } from "@/components/CategoryChips";
import { FloorMap } from "@/components/FloorMap";
import { TabTenant } from "@/components/icons/TabIcons";
import { PageHeader } from "@/components/PageHeader";
import { bySlug } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { loadMapBooths } from "@/lib/map-data";

export const metadata = { title: copy.map.title };

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function MapPage({ searchParams }: PageProps<"/peta">) {
  const params = await searchParams;
  const category = bySlug(first(params.kategori));
  const boothParam = (first(params.booth) ?? "").toUpperCase().trim();
  const booths = await loadMapBooths();

  // ?booth=A11 highlights every unit of that booth's tenant, not only the one code.
  const target = booths.find((b) => b.code === boothParam);
  const highlightCodes = target
    ? target.tenant
      ? booths.filter((b) => b.tenant?.slug === target.tenant?.slug).map((b) => b.code)
      : [target.code]
    : [];

  const inCategory = category ? booths.filter((b) => b.tenant?.category === category.key).length : 0;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={copy.map.title}
        action={
          category ? (
            <CategoryBadge category={category.key} />
          ) : (
            <Button href="/tenant" variant="ghost" sm>
              <TabTenant size={20} />
              {copy.nav.tenants}
            </Button>
          )
        }
      />
      <CategoryChips basePath="/peta" active={category} />
      <FloorMap booths={booths} activeCategory={category?.key} highlightCodes={highlightCodes} />
      {category ? <p className="-mt-1 text-small text-ink-soft">{copy.map.filterActive(inCategory, category.label)}</p> : null}
    </div>
  );
}

import { CategoryChips } from "@/components/CategoryChips";
import { FloorMap } from "@/components/FloorMap";
import { MapLegend } from "@/components/MapLegend";
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

  return (
    <div className="flex flex-col gap-4 pt-6">
      <h1 className="font-display text-display text-fg">{copy.map.title}</h1>
      <CategoryChips basePath="/peta" active={category} />
      <FloorMap booths={booths} activeCategory={category?.key} highlightCodes={highlightCodes} />
      <MapLegend />
    </div>
  );
}

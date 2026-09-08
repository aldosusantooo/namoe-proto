import { CATEGORIES, type CategoryInfo } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { Chip } from "./Chip";

type Props = { basePath: string; active?: CategoryInfo; extraParams?: Record<string, string | undefined>; leading?: React.ReactNode };

function href(basePath: string, slug: string | undefined, extra: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (slug) params.set("kategori", slug);
  for (const [k, v] of Object.entries(extra)) if (v) params.set(k, v);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/**
 * "Semua" then the ten categories in a horizontally scrolling row with a right-edge fade.
 * The active category is rendered first after "Semua" so a filtered state is visible without scrolling.
 * URL state via ?kategori=. Doubles as the map legend.
 */
export function CategoryChips({ basePath, active, extraParams = {}, leading }: Props) {
  const ordered = active ? [active, ...CATEGORIES.filter((c) => c.key !== active.key)] : [...CATEGORIES];
  return (
    <div
      className="-mx-[var(--page-gutter)] flex gap-2 overflow-x-auto px-[var(--page-gutter)] pb-1.5 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ maskImage: "linear-gradient(90deg, #000 calc(100% - 40px), transparent)", WebkitMaskImage: "linear-gradient(90deg, #000 calc(100% - 40px), transparent)" }}
    >
      {leading}
      <Chip href={href(basePath, undefined, extraParams)} active={!active}>
        {copy.directory.all}
      </Chip>
      {ordered.map((c) => (
        <Chip key={c.key} href={href(basePath, c.slug, extraParams)} active={active?.key === c.key} category={c}>
          {c.label}
        </Chip>
      ))}
    </div>
  );
}

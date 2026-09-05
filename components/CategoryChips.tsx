import { CATEGORIES, type CategoryInfo } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { Chip } from "./Chip";
import { ScrollActiveIntoView } from "./ScrollActiveIntoView";

type Props = { basePath: string; active?: CategoryInfo; extraParams?: Record<string, string | undefined> };

function href(basePath: string, slug: string | undefined, extra: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (slug) params.set("kategori", slug);
  for (const [k, v] of Object.entries(extra)) if (v) params.set(k, v);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** "Semua" then the ten categories, horizontally scrolling. URL state via ?kategori=. */
export function CategoryChips({ basePath, active, extraParams = {} }: Props) {
  return (
    <ScrollActiveIntoView className="-mx-[var(--page-gutter)] flex gap-2 overflow-x-auto px-[var(--page-gutter)] pb-1 [scrollbar-width:none]">
      <Chip href={href(basePath, undefined, extraParams)} active={!active}>
        {copy.directory.all}
      </Chip>
      {CATEGORIES.map((c) => (
        <Chip
          key={c.key}
          href={href(basePath, c.slug, extraParams)}
          active={active?.key === c.key}
          color={`var(--color-cat-${c.slug})`}
        >
          {c.label}
        </Chip>
      ))}
    </ScrollActiveIntoView>
  );
}

import { CATEGORIES } from "@/lib/categories";
import { copy } from "@/lib/copy";

export function MapLegend() {
  return (
    <section aria-label={copy.map.legend}>
      <h2 className="mb-2 text-caption font-bold uppercase tracking-wide text-fg-muted">{copy.map.legend}</h2>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
        {CATEGORIES.map((c) => (
          <li key={c.key} className="flex items-center gap-2 text-small text-fg">
            <span aria-hidden="true" className="size-3 shrink-0 rounded-full" style={{ background: `var(--color-cat-${c.slug})` }} />
            {c.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

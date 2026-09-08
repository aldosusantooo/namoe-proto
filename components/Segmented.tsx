import Link from "next/link";

export type SegmentedItem = { key: string; label: string; href: string };

/** Two-way view switch: cream-deep track, paper active pill with a 2px edge shadow. Links, so it works without JS. */
export function Segmented({ items, active }: { items: SegmentedItem[]; active: string }) {
  return (
    <div role="tablist" className="grid gap-1 rounded-pill bg-cream-deep p-1" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((t) => {
        const on = t.key === active;
        return (
          <Link
            key={t.key}
            href={t.href}
            scroll={false}
            role="tab"
            aria-selected={on}
            className={`flex min-h-11 items-center justify-center rounded-pill font-display text-body font-semibold ${
              on ? "bg-paper text-ink shadow-[0_2px_0_0_var(--color-edge)]" : "text-ink-soft"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}

import { byKey, cssVar, cssVarSoft, type CategoryKey } from "@/lib/categories";

export function CategoryBadge({ category, className = "" }: { category: CategoryKey; className?: string }) {
  const info = byKey(category);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-caption font-bold text-fg ${className}`}
      style={{ background: cssVarSoft(category) }}
    >
      <span aria-hidden="true" className="size-2 rounded-full" style={{ background: cssVar(category) }} />
      {info.label}
    </span>
  );
}

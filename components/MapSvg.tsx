import type { CSSProperties } from "react";
import { cssVar, type CategoryKey } from "@/lib/categories";
import { FIXTURES, VIEWBOX, unionRect } from "@/lib/layout";

export type MapBooth = {
  code: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tenant: { slug: string; name: string; category: CategoryKey } | null;
};

type Props = {
  booths: MapBooth[];
  /** Booths of other categories drop to --map-dim-opacity. */
  activeCategory?: CategoryKey;
  /** Booths drawn with the highlight stroke and a marker. */
  highlightCodes?: string[];
  /** When set, every booth outside this list is dimmed (MiniMap use). */
  emphasisCodes?: string[];
  /** Draw one tenant label across multi-unit booths (large view only). */
  labels?: boolean;
  /** Add 44x44 hit rects and pointer cursors. */
  interactive?: boolean;
  onBoothClick?: (code: string) => void;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

const HIT = 44;
const DIM = "var(--map-dim-opacity)";

function shortName(name: string) {
  return name.length > 16 ? `${name.slice(0, 15).trimEnd()}.` : name;
}

/** Pure SVG floor plan. No hooks, so it renders on the server (MiniMap) and inside the client FloorMap. */
export function MapSvg({
  booths,
  activeCategory,
  highlightCodes = [],
  emphasisCodes,
  labels = false,
  interactive = false,
  onBoothClick,
  className,
  style,
  title,
}: Props) {
  const highlight = new Set(highlightCodes);
  const emphasis = emphasisCodes ? new Set(emphasisCodes) : null;

  const opacityOf = (b: MapBooth) => {
    if (emphasis) return emphasis.has(b.code) ? 1 : DIM;
    if (activeCategory) return b.tenant?.category === activeCategory ? 1 : DIM;
    return 1;
  };

  const byTenant = new Map<string, MapBooth[]>();
  for (const b of booths) {
    if (!b.tenant) continue;
    const list = byTenant.get(b.tenant.slug) ?? [];
    list.push(b);
    byTenant.set(b.tenant.slug, list);
  }

  const mallItem = (items: readonly string[], y: number, h: number) => {
    const x0 = 100;
    const total = 1000;
    const gap = 8;
    const w = (total - gap * (items.length - 1)) / items.length;
    return items.map((label, i) => {
      const x = x0 + i * (w + gap);
      return (
        <g key={`${label}-${i}`}>
          <rect x={x} y={y} width={w} height={h} rx="8" fill="var(--map-fixture)" />
          <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="12" fill="var(--map-fixture-text)">
            {label}
          </text>
        </g>
      );
    });
  };

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      className={className}
      style={style}
      role="img"
      aria-label={title}
      fontFamily="var(--font-display)"
    >
      {title ? <title>{title}</title> : null}

      {mallItem(FIXTURES.mallTop.items, FIXTURES.mallTop.y, FIXTURES.mallTop.h)}
      {mallItem(FIXTURES.mallBottom.items, FIXTURES.mallBottom.y, FIXTURES.mallBottom.h)}

      {FIXTURES.lobbies.map((l) => (
        <text key={l.label} x={l.x} y={l.y} fontSize="12" fill="var(--map-fixture-text)" textAnchor={l.x > 600 ? "start" : "start"}>
          {l.label}
        </text>
      ))}

      <g>
        <rect x={FIXTURES.stage.x} y={FIXTURES.stage.y} width={FIXTURES.stage.w} height={FIXTURES.stage.h} rx="12" fill="var(--map-stage)" />
        <text x={FIXTURES.stage.x + FIXTURES.stage.w / 2} y={FIXTURES.stage.y + FIXTURES.stage.h / 2 + 6} textAnchor="middle" fontSize="18" fontWeight="600" fill="#fff">
          {FIXTURES.stage.label}
        </text>
      </g>

      <g>
        {FIXTURES.seating.tables.map((cx) => (
          <circle key={cx} cx={cx} cy={FIXTURES.seating.y} r={FIXTURES.seating.r} fill="none" stroke="var(--map-seating)" strokeWidth="2" />
        ))}
        <text x={FIXTURES.seating.tables[0] - 24} y={FIXTURES.seating.y + 4} textAnchor="end" fontSize="12" fill="var(--map-fixture-text)">
          {FIXTURES.seating.label}
        </text>
      </g>

      <g>
        <rect x={FIXTURES.gate.x} y={FIXTURES.gate.y} width={FIXTURES.gate.w} height={FIXTURES.gate.h} rx="4" fill="var(--color-fg)" />
        <text x={FIXTURES.gate.x + FIXTURES.gate.w / 2} y={FIXTURES.gate.y + FIXTURES.gate.h + 16} textAnchor="middle" fontSize="12" fill="var(--map-fixture-text)">
          {FIXTURES.gate.label}
        </text>
      </g>

      {booths.map((b) => {
        const filled = Boolean(b.tenant);
        const hi = highlight.has(b.code);
        const cx = b.x + b.w / 2;
        const cy = b.y + b.h / 2;
        return (
          <g
            key={b.code}
            data-code={b.code}
            opacity={opacityOf(b)}
            onClick={interactive && onBoothClick ? () => onBoothClick(b.code) : undefined}
            style={interactive ? { cursor: "pointer" } : undefined}
          >
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="6"
              fill={filled && b.tenant ? cssVar(b.tenant.category) : "var(--map-booth-empty)"}
              stroke={hi ? "var(--map-highlight)" : filled ? "none" : "var(--map-booth-empty-stroke)"}
              strokeWidth={hi ? 3 : 1}
            />
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={filled ? "var(--map-booth-text)" : "var(--map-booth-text-empty)"}
              style={{ pointerEvents: "none" }}
            >
              {b.code}
            </text>
            {hi ? <path d={`M ${cx - 7} ${b.y - 14} L ${cx + 7} ${b.y - 14} L ${cx} ${b.y - 3} Z`} fill="var(--map-highlight)" /> : null}
            {interactive ? (
              <rect x={cx - HIT / 2} y={cy - HIT / 2} width={HIT} height={HIT} fill="transparent" aria-label={b.code} />
            ) : null}
          </g>
        );
      })}

      {labels
        ? [...byTenant.entries()]
            .filter(([, units]) => units.length > 1)
            .map(([slug, units]) => {
              const u = unionRect(units);
              const name = shortName(units[0].tenant!.name);
              const w = Math.min(u.w - 6, Math.max(40, name.length * 6 + 12));
              return (
                <g key={slug} style={{ pointerEvents: "none" }} opacity={opacityOf(units[0])}>
                  <rect x={u.x + u.w / 2 - w / 2} y={u.y + u.h - 16} width={w} height={14} rx="7" fill="#fff" opacity="0.92" />
                  <text x={u.x + u.w / 2} y={u.y + u.h - 6} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--color-ink)">
                    {name}
                  </text>
                </g>
              );
            })
        : null}
    </svg>
  );
}

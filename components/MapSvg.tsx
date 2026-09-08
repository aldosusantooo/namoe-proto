import type { CSSProperties } from "react";
import { byKey, catInkVar, catVar, type CategoryKey } from "@/lib/categories";
import { BOOTH, FIXTURES, VIEWBOX, unionRect } from "@/lib/layout";

export type MapBooth = {
  code: string;
  x: number;
  y: number;
  w: number;
  h: number;
  band: number;
  zone: "A" | "FNB";
  tenant: { slug: string; name: string; category: CategoryKey; logoUrl: string | null } | null;
};

type Props = {
  booths: MapBooth[];
  /** Booths of other categories drop to --map-dim-opacity. */
  activeCategory?: CategoryKey;
  /** Booths drawn with the highlight stroke and the ink marker above. */
  highlightCodes?: string[];
  /** When set, every booth outside this list is dimmed (MiniMap use). */
  emphasisCodes?: string[];
  /** Zoomed view: booth codes inside the rects and one label pill per tenant group. Off in the fit view. */
  zoomed?: boolean;
  /** Draw fixture labels (mall tenants, lobbies, gate, seating). Off on the MiniMap. */
  fixtureText?: boolean;
  /** Add 44 x 44 hit rects and pointer cursors. */
  interactive?: boolean;
  onBoothClick?: (code: string) => void;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

const HIT = 44;
const DIM = "var(--map-dim-opacity)";
const LABEL_W = 80;
const LABEL_H = 18;

function shortName(name: string) {
  return name.length > 12 ? `${name.slice(0, 11).trimEnd()}.` : name;
}

/** Pure SVG floor plan. No hooks, so it renders on the server (MiniMap) and inside the client FloorMap. */
export function MapSvg({
  booths,
  activeCategory,
  highlightCodes = [],
  emphasisCodes,
  zoomed = false,
  fixtureText = true,
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
          {fixtureText ? (
            <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--map-fixture-text)">
              {label}
            </text>
          ) : null}
        </g>
      );
    });
  };

  const label = (text: string, x: number, y: number, anchor: "start" | "middle" | "end" = "start") =>
    fixtureText ? (
      <text x={x} y={y} fontSize="13" textAnchor={anchor} fill="var(--map-fixture-text)">
        {text}
      </text>
    ) : null;

  return (
    <svg viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`} className={className} style={style} role="img" aria-label={title} fontFamily="var(--font-display)">
      {title ? <title>{title}</title> : null}

      {mallItem(FIXTURES.mallTop.items, FIXTURES.mallTop.y, FIXTURES.mallTop.h)}
      {mallItem(FIXTURES.mallBottom.items, FIXTURES.mallBottom.y, FIXTURES.mallBottom.h)}

      {FIXTURES.lobbies.map((l) => (
        <g key={l.label}>{label(l.label, l.x, l.y)}</g>
      ))}

      <g>
        <rect x={FIXTURES.stage.x} y={FIXTURES.stage.y} width={FIXTURES.stage.w} height={FIXTURES.stage.h} rx="14" fill="var(--map-stage)" />
        <text x={FIXTURES.stage.x + FIXTURES.stage.w / 2} y={FIXTURES.stage.y + FIXTURES.stage.h / 2 + 7} textAnchor="middle" fontSize="20" fontWeight="600" fill="var(--color-paper)">
          {FIXTURES.stage.label}
        </text>
      </g>

      <g>
        {FIXTURES.seating.tables.map((cx) => (
          <circle key={cx} cx={cx} cy={FIXTURES.seating.y} r={FIXTURES.seating.r} fill="none" stroke="var(--map-seating)" strokeWidth="2" />
        ))}
        {label(FIXTURES.seating.label, FIXTURES.seating.tables[0] - 24, FIXTURES.seating.y + 4, "end")}
      </g>

      <g>
        <rect x={FIXTURES.gate.x} y={FIXTURES.gate.y} width={FIXTURES.gate.w} height={FIXTURES.gate.h} rx="4" fill="var(--color-ink)" />
        {label(FIXTURES.gate.label, FIXTURES.gate.x + FIXTURES.gate.w / 2, FIXTURES.gate.y + FIXTURES.gate.h + 16, "middle")}
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
              rx="var(--map-booth-radius)"
              fill={b.tenant ? catVar(b.tenant.category) : "var(--map-booth-empty)"}
              stroke={hi ? "var(--map-highlight)" : filled ? "none" : "var(--map-booth-empty-stroke)"}
              style={{ strokeWidth: hi ? "var(--map-highlight-width)" : 2 }}
            />
            {zoomed ? (
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill={b.tenant ? catInkVar(b.tenant.category) : "var(--map-booth-text-empty)"}
                style={{ pointerEvents: "none" }}
              >
                {b.code}
              </text>
            ) : null}
            {interactive ? <rect x={cx - HIT / 2} y={cy - HIT / 2} width={HIT} height={HIT} fill="transparent" aria-label={b.tenant ? `${b.code}, ${b.tenant.name}` : b.code} /> : null}
          </g>
        );
      })}

      {zoomed
        ? [...byTenant.entries()].map(([slug, units]) => {
            const u = unionRect(units);
            const tenant = units[0].tenant!;
            // Above the group when it starts on a cluster's top row or spans both rows, below it otherwise.
            const top = (u.y - 140) % 120 === 0 || u.h > BOOTH;
            const ly = top ? u.y - LABEL_H - 4 : u.y + u.h + 4;
            const lx = u.x + u.w / 2 - LABEL_W / 2;
            return (
              <g key={slug} style={{ pointerEvents: "none" }} opacity={opacityOf(units[0])}>
                <rect x={lx} y={ly} width={LABEL_W} height={LABEL_H} rx={LABEL_H / 2} fill="var(--map-label-fill)" stroke="var(--color-edge)" strokeWidth="1.5" />
                <text x={lx + LABEL_W / 2} y={ly + 13} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--color-ink)">
                  {shortName(tenant.name)}
                </text>
              </g>
            );
          })
        : null}

      {booths
        .filter((b) => highlight.has(b.code))
        .map((b) => {
          const cx = b.x + b.w / 2;
          return <path key={`m-${b.code}`} d={`M${cx - 9} ${b.y - 6} h18 l-9 9 z`} fill="var(--map-highlight)" style={{ pointerEvents: "none" }} />;
        })}
    </svg>
  );
}

export function categoryLabel(key: CategoryKey) {
  return byKey(key).label;
}

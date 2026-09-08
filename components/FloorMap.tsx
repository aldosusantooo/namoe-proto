"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { boothLabel } from "@/lib/booth-label";
import type { CategoryKey } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { VIEWBOX } from "@/lib/layout";
import { Button } from "./Button";
import { Card } from "./Card";
import { CategoryBadge } from "./CategoryBadge";
import { IconChevronRight, IconClose, IconFitScreen, IconZoomIn, IconZoomOut } from "./icons/UiIcons";
import { MapSvg, type MapBooth } from "./MapSvg";
import { PlaceholderArt } from "./PlaceholderArt";

type Props = { booths: MapBooth[]; activeCategory?: CategoryKey; highlightCodes?: string[] };

const ZOOMED_HEIGHT = 420;
const FALLBACK_SCALE = 1.25;

/** Reads --map-zoom-scale from the document so the value stays in tokens.css. */
function readZoomScale(): number {
  if (typeof document === "undefined") return FALLBACK_SCALE;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--map-zoom-scale").trim();
  const n = Number(raw);
  return Number.isFinite(n) && n > 1 ? n : FALLBACK_SCALE;
}

/**
 * Interactive floor plan. Fit view shows colour only; zoom renders the SVG at `--map-zoom-scale` px per unit
 * (36 units become 45px booths) with codes and tenant labels, panning in both axes inside the card.
 * Selecting a booth opens an inline sheet under the card. `?booth=` preselects.
 */
export function FloorMap({ booths, activeCategory, highlightCodes = [] }: Props) {
  const preselected = highlightCodes[0] ?? null;
  const [selected, setSelected] = useState<string | null>(preselected);
  const [level, setLevel] = useState(0); // 0 = fit, 1 = zoomed, 2 = zoomed further
  const [scale, setScale] = useState(FALLBACK_SCALE);
  const scroller = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  const zoomed = level > 0;
  const unit = level === 0 ? 0 : level === 1 ? scale : scale * 1.4;

  const selectedBooth = selected ? booths.find((b) => b.code === selected) ?? null : null;
  const selectedUnits = selectedBooth?.tenant
    ? booths.filter((b) => b.tenant?.slug === selectedBooth.tenant?.slug).map((b) => b.code)
    : selectedBooth
      ? [selectedBooth.code]
      : [];

  const centreOn = useCallback(
    (code: string | null, px: number) => {
      const el = scroller.current;
      if (!el || !code || px === 0) return;
      const target = booths.find((b) => b.code === code);
      if (!target) return;
      el.scrollTo({
        left: Math.max(0, (target.x + target.w / 2) * px - el.clientWidth / 2),
        top: Math.max(0, (target.y + target.h / 2) * px - el.clientHeight / 2),
      });
    },
    [booths],
  );

  // After a zoom change, centre the selected booth (or the map centre when nothing is selected).
  useLayoutEffect(() => {
    if (!zoomed) return;
    if (selected) centreOn(selected, unit);
    else {
      const el = scroller.current;
      if (el) el.scrollTo({ left: (VIEWBOX.w * unit - el.clientWidth) / 2, top: (VIEWBOX.h * unit - el.clientHeight) / 2 });
    }
  }, [zoomed, unit, selected, centreOn]);

  // ?booth= on load: the sheet is under the card; make sure it is on screen.
  useEffect(() => {
    if (preselected && sheet.current) sheet.current.scrollIntoView({ block: "nearest" });
  }, [preselected]);

  function onBoothClick(code: string) {
    setSelected((cur) => (cur === code ? null : code));
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className="relative">
        <div
          ref={scroller}
          className="overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ touchAction: "pan-x pan-y", height: zoomed ? ZOOMED_HEIGHT : undefined, WebkitOverflowScrolling: "touch" }}
        >
          <MapSvg
            booths={booths}
            activeCategory={activeCategory}
            highlightCodes={selectedUnits}
            zoomed={zoomed}
            interactive
            onBoothClick={onBoothClick}
            title={copy.map.ariaLabel}
            style={zoomed ? { width: VIEWBOX.w * unit, height: VIEWBOX.h * unit, display: "block", maxWidth: "none" } : { width: "100%", height: "auto", display: "block" }}
          />
        </div>
        <div className="absolute bottom-2.5 right-2.5 flex flex-col gap-1.5">
          <MapControl
            label={copy.map.zoomIn}
            disabled={level >= 2}
            onClick={() => {
              setScale(readZoomScale());
              setLevel((l) => Math.min(2, l + 1));
            }}
          >
            <IconZoomIn size={22} />
          </MapControl>
          <MapControl label={copy.map.zoomOut} disabled={level === 0} onClick={() => setLevel((l) => Math.max(0, l - 1))}>
            <IconZoomOut size={22} />
          </MapControl>
          {zoomed ? (
            <MapControl label={copy.map.fit} onClick={() => setLevel(0)}>
              <IconFitScreen size={22} />
            </MapControl>
          ) : null}
        </div>
      </Card>

      <p className="text-small text-ink-soft">{copy.map.hint}</p>

      {selectedBooth ? (
        <div ref={sheet}>
          <Card className="flex items-center gap-3 p-3" role="region" aria-label={selectedBooth.tenant?.name ?? copy.map.empty}>
            <div className="size-[var(--thumb-size)] shrink-0 overflow-hidden rounded-md">
              {selectedBooth.tenant?.logoUrl ? (
                <img src={selectedBooth.tenant.logoUrl} alt="" className="h-full w-full object-cover" />
              ) : selectedBooth.tenant ? (
                <PlaceholderArt name={selectedBooth.tenant.name} category={selectedBooth.tenant.category} variant="thumb" />
              ) : (
                <div className="h-full w-full border-2 border-dashed border-line-strong bg-cream-deep" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-h3 text-ink">{selectedBooth.tenant?.name ?? copy.map.empty}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-small text-ink-soft">
                {selectedBooth.tenant ? <CategoryBadge category={selectedBooth.tenant.category} size="sm" /> : null}
                <span>{boothLabel(selectedUnits)}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button variant="ghost" icon sm aria-label={copy.map.close} onClick={() => setSelected(null)}>
                <IconClose size={22} />
              </Button>
              {selectedBooth.tenant ? (
                <Button href={`/tenant/${selectedBooth.tenant.slug}`} variant="ghost" icon aria-label={copy.map.openTenant}>
                  <IconChevronRight size={24} />
                </Button>
              ) : null}
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function MapControl({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-[12px] border-2 border-edge bg-paper text-ink shadow-[0_2px_0_0_var(--color-edge)] active:translate-y-0.5 active:shadow-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

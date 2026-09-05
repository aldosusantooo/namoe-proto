"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { boothLabel } from "@/lib/booth-label";
import type { CategoryKey } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { VIEWBOX } from "@/lib/layout";
import { CategoryBadge } from "./CategoryBadge";
import { MapSvg, type MapBooth } from "./MapSvg";

type Props = { booths: MapBooth[]; activeCategory?: CategoryKey; highlightCodes?: string[] };

export function FloorMap({ booths, activeCategory, highlightCodes = [] }: Props) {
  const hasHighlight = highlightCodes.length > 0;
  const [large, setLarge] = useState(hasHighlight);
  const [selected, setSelected] = useState<string | null>(hasHighlight ? highlightCodes[0] : null);
  const scroller = useRef<HTMLDivElement>(null);

  // Bring the highlighted booth into view whenever the map is shown at full size.
  useEffect(() => {
    const el = scroller.current;
    if (!el || !large || !hasHighlight) return;
    const target = booths.find((b) => b.code === highlightCodes[0]);
    if (!target) return;
    const scale = VIEWBOX.w / VIEWBOX.w;
    el.scrollTo({
      left: Math.max(0, (target.x + target.w / 2) * scale - el.clientWidth / 2),
      top: Math.max(0, (target.y + target.h / 2) * scale - el.clientHeight / 2),
    });
  }, [large, hasHighlight, highlightCodes, booths]);

  const selectedBooth = selected ? booths.find((b) => b.code === selected) ?? null : null;
  const selectedUnits = selectedBooth?.tenant
    ? booths.filter((b) => b.tenant?.slug === selectedBooth.tenant?.slug).map((b) => b.code)
    : selectedBooth
      ? [selectedBooth.code]
      : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-small text-fg-soft">{copy.map.hint}</p>
        <button
          type="button"
          onClick={() => setLarge((v) => !v)}
          className="inline-flex min-h-[var(--tap-min)] shrink-0 items-center rounded-pill border border-border bg-surface px-4 text-small font-bold text-fg"
        >
          {large ? copy.map.shrink : copy.map.enlarge}
        </button>
      </div>

      <div
        ref={scroller}
        className="overflow-auto rounded-lg bg-surface shadow-card"
        style={{ touchAction: "pan-x pan-y", maxHeight: large ? "70vh" : undefined }}
      >
        <MapSvg
          booths={booths}
          activeCategory={activeCategory}
          highlightCodes={highlightCodes}
          labels={large}
          interactive
          onBoothClick={setSelected}
          title={copy.map.title}
          style={{ width: large ? VIEWBOX.w : "100%", display: "block", minWidth: large ? VIEWBOX.w : undefined }}
        />
      </div>

      {selectedBooth ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={selectedBooth.tenant?.name ?? copy.map.empty}
          className="fixed inset-x-0 z-50 mx-auto max-w-[var(--page-max)] px-[var(--page-gutter)]"
          style={{ bottom: "calc(var(--nav-height) + var(--safe-bottom) + 8px)" }}
        >
          <div className="rounded-lg border border-border bg-surface p-4 shadow-card-raised">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <p className="font-display text-h2 text-fg">{selectedBooth.tenant?.name ?? copy.map.empty}</p>
                {selectedBooth.tenant ? <CategoryBadge category={selectedBooth.tenant.category} className="self-start" /> : null}
                <p className="text-small text-fg-soft">{copy.tenant.booth(boothLabel(selectedUnits))}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex size-[var(--tap-min)] shrink-0 items-center justify-center rounded-full bg-surface-alt text-fg"
                aria-label={copy.map.close}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            {selectedBooth.tenant ? (
              <Link
                href={`/tenant/${selectedBooth.tenant.slug}`}
                className="mt-3 inline-flex min-h-[var(--tap-min)] w-full items-center justify-center rounded-pill bg-primary px-5 font-bold text-on-primary"
              >
                {copy.map.openTenant}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

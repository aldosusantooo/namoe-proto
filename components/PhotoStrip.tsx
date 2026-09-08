"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";
import { Button } from "./Button";
import { IconClose } from "./icons/UiIcons";

type Props = { photos: string[]; name: string };

/** Horizontal strip of 160px tiles aligned to the page gutter. Tapping one opens it full width in a plain overlay. */
export function PhotoStrip({ photos, name }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!photos.length) return null;
  return (
    <>
      <ul className="-mx-[var(--page-gutter)] flex gap-2.5 overflow-x-auto px-[var(--page-gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={copy.tenant.photosTitle}>
        {photos.slice(0, 5).map((src, i) => (
          <li key={`${src}-${i}`} className="shrink-0">
            <button type="button" onClick={() => setOpen(i)} className="block size-40 overflow-hidden rounded-md border-2 border-edge bg-cream-deep" aria-label={copy.tenant.photoAlt(name, i + 1)}>
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
      {open !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.tenant.photoAlt(name, open + 1)}
          className="fixed inset-0 z-50 flex flex-col bg-ink/90"
          onClick={() => setOpen(null)}
        >
          <div className="flex justify-end p-3">
            <Button variant="ghost" icon aria-label={copy.common.close} onClick={() => setOpen(null)}>
              <IconClose size={24} />
            </Button>
          </div>
          <img src={photos[open]} alt={copy.tenant.photoAlt(name, open + 1)} className="max-h-[80vh] w-full object-contain" />
        </div>
      ) : null}
    </>
  );
}

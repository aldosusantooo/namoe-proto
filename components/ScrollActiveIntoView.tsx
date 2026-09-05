"use client";

import { useEffect, useRef } from "react";

/** Wraps a horizontal chip row and scrolls the [aria-current] chip into view on mount. */
export function ScrollActiveIntoView({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = ref.current;
    const active = row?.querySelector<HTMLElement>("[aria-current]");
    if (!row || !active) return;
    const left = active.offsetLeft - row.clientWidth / 2 + active.offsetWidth / 2;
    row.scrollTo({ left: Math.max(0, left) });
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

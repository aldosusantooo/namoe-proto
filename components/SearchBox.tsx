"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { copy } from "@/lib/copy";

/** Search input bound to ?q=. Debounced replace while typing, push on submit. */
export function SearchBox({ basePath }: { basePath: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("q") ?? "";
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const input = useRef<HTMLInputElement>(null);

  // Keep the field in step with back/forward navigation without stealing focus mid-typing.
  useEffect(() => {
    const el = input.current;
    if (el && document.activeElement !== el && el.value !== current) el.value = current;
  }, [current]);

  function hrefFor(q: string) {
    const next = new URLSearchParams(params.toString());
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    const qs = next.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function onChange(q: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => router.replace(hrefFor(q), { scroll: false }), 300);
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (timer.current) clearTimeout(timer.current);
        router.push(hrefFor(input.current?.value ?? ""), { scroll: false });
      }}
      className="relative"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref={input}
        type="search"
        name="q"
        defaultValue={current}
        onChange={(e) => onChange(e.target.value)}
        placeholder={copy.directory.search}
        aria-label={copy.directory.search}
        autoComplete="off"
        className="h-12 w-full rounded-pill border border-border bg-surface pl-12 pr-4 text-body text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
      />
    </form>
  );
}

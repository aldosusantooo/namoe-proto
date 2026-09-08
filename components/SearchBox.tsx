"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { copy } from "@/lib/copy";
import { IconSearch } from "./icons/UiIcons";

type Props = { basePath: string; autoFocus?: boolean };

/** 48px pill search bound to ?q=. Debounced replace while typing, push on submit. Matches names and booth codes. */
export function SearchBox({ basePath, autoFocus = false }: Props) {
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

  useEffect(() => {
    if (autoFocus) input.current?.focus();
  }, [autoFocus]);

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
      <IconSearch size={22} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink" />
      <input
        ref={input}
        type="search"
        name="q"
        defaultValue={current}
        onChange={(e) => onChange(e.target.value)}
        placeholder={copy.directory.search}
        aria-label={copy.directory.search}
        autoComplete="off"
        enterKeyHint="search"
        className="h-12 w-full rounded-pill border-2 border-edge bg-paper pl-12 pr-4 text-body text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
      />
    </form>
  );
}

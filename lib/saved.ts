"use client";

import { useCallback, useSyncExternalStore } from "react";

export const SAVED_KEY = "nm_saved";
const EVENT = "nm_saved_change";

/** Parses the stored list; anything malformed reads as empty. */
export function parseSaved(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/** Adds or removes a slug and returns the new list. Pure, so it is unit tested. */
export function toggleSaved(list: string[], slug: string): string[] {
  return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
}

function read(): string {
  try {
    return window.localStorage.getItem(SAVED_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/**
 * Device-local "Simpan" list in localStorage under nm_saved. Reads through useSyncExternalStore so the
 * server snapshot is empty and the client snapshot is the raw string (stable between renders).
 */
export function useSaved(): { saved: string[]; hydrated: boolean; toggle: (slug: string) => void; isSaved: (slug: string) => boolean } {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  const saved = parseSaved(raw || null);
  const toggle = useCallback((slug: string) => {
    try {
      const next = toggleSaved(parseSaved(window.localStorage.getItem(SAVED_KEY)), slug);
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable: the tap does nothing, the page still works
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { saved, hydrated: raw !== "", toggle, isSaved: (slug) => saved.includes(slug) };
}

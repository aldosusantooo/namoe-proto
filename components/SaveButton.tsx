"use client";

import { copy } from "@/lib/copy";
import { useSaved } from "@/lib/saved";
import { IconHeart, IconHeartFilled } from "./icons/UiIcons";

type Props = { slug: string; size?: "sm" | "md"; className?: string };

/** Heart toggle for the device-local Simpan list. 44px on cards, 48px on the tenant page. */
export function SaveButton({ slug, size = "sm", className = "" }: Props) {
  const { isSaved, toggle } = useSaved();
  const on = isSaved(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(slug);
      }}
      aria-pressed={on}
      aria-label={on ? copy.tenant.unsave : copy.tenant.save}
      className={`inline-flex items-center justify-center rounded-full border-2 border-edge bg-paper shadow-[0_2px_0_0_var(--color-edge)] active:translate-y-0.5 active:shadow-none ${
        size === "sm" ? "size-11" : "size-12"
      } ${on ? "text-coral" : "text-ink"} ${className}`}
    >
      {on ? <IconHeartFilled size={size === "sm" ? 22 : 24} /> : <IconHeart size={size === "sm" ? 22 : 24} />}
    </button>
  );
}

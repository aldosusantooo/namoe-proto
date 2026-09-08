"use client";

import { useRouter } from "next/navigation";
import { copy } from "@/lib/copy";
import { Button } from "./Button";
import { IconBack } from "./icons/UiIcons";

type Props = { fallback: string; className?: string };

/**
 * Ghost icon button that goes back in history when the referrer is same-origin, otherwise to the parent route.
 * Server-rendered as a link to the parent route so it works before hydration and without JS.
 */
export function BackButton({ fallback, className }: Props) {
  const router = useRouter();
  return (
    <Button
      href={fallback}
      variant="ghost"
      icon
      aria-label={copy.common.back}
      className={className}
      onClick={(e) => {
        if (typeof document === "undefined") return;
        const ref = document.referrer;
        if (ref && window.history.length > 1) {
          try {
            if (new URL(ref).origin === window.location.origin) {
              e.preventDefault();
              router.back();
            }
          } catch {
            // malformed referrer: fall through to the parent route
          }
        }
      }}
    >
      <IconBack size={24} />
    </Button>
  );
}

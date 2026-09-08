"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ActionResult } from "@/actions/tenant";
import { copy } from "@/lib/copy";
import { FEED_MAX } from "@/lib/validate";
import { Button } from "../Button";
import { Card } from "../Card";
import { IconClose } from "../icons/UiIcons";
import { Notice } from "../Notice";
import type { StatefulAction } from "./TenantDashboard";

type Props = { postFeed: StatefulAction; tenantName: string; variant?: "ghost" | "primary"; label?: string };

/**
 * "Tulis kabar": one line up to 140 characters plus a photo by URL or upload. Used on the tenant dashboard
 * (posts carry the tenant badge) and, with a visitor action, on /feed.
 */
export function FeedComposer({ postFeed, variant = "ghost", label }: Props) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ActionResult, FormData>(postFeed, null);
  const [count, setCount] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const lastOk = useRef<ActionResult>(null);

  useEffect(() => {
    if (state?.ok && state !== lastOk.current) {
      lastOk.current = state;
      setOpen(false);
      setCount(0);
      setFileName(null);
    }
  }, [state]);

  if (!open) {
    return (
      <div className="flex flex-col gap-2">
        {state?.ok && state.message ? <Notice tone="ok">{state.message}</Notice> : null}
        <Button variant={variant} block onClick={() => setOpen(true)}>
          {label ?? copy.tenantEdit.feedWrite}
        </Button>
      </div>
    );
  }

  return (
    <Card pad>
      <form action={action} className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <p className="flex-1 font-display text-h3 text-ink">{label ?? copy.tenantEdit.feedWrite}</p>
          <Button variant="ghost" icon sm aria-label={copy.common.close} onClick={() => setOpen(false)}>
            <IconClose size={22} />
          </Button>
        </div>
        <textarea
          name="body"
          required
          autoFocus
          rows={2}
          maxLength={FEED_MAX}
          onInput={(e) => setCount(e.currentTarget.value.length)}
          placeholder={copy.tenantEdit.feedPlaceholder}
          aria-label={copy.tenantEdit.feedPlaceholder}
          className="min-h-20 w-full resize-y rounded-md border-2 border-edge bg-paper px-3.5 py-2.5 text-body leading-[1.45] text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
        />
        <span className="text-right text-caption text-ink-muted" aria-live="polite">
          {copy.tenantEdit.introCounter(count, FEED_MAX)}
        </span>
        <input
          name="url"
          type="url"
          inputMode="url"
          placeholder={copy.feed.photoUrl}
          aria-label={copy.feed.photoUrl}
          className="h-12 w-full rounded-pill border-2 border-edge bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
        />
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-pill border-2 border-edge bg-paper px-4 font-display text-[15px] font-semibold text-navy shadow-btn-ghost">
          {fileName ?? copy.feed.photoUpload}
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => setFileName(e.currentTarget.files?.[0]?.name ?? null)}
          />
        </label>
        {state && !state.ok ? <Notice tone="warn">{state.error}</Notice> : null}
        <Button type="submit" variant="primary" block disabled={pending}>
          {copy.qa.send}
        </Button>
      </form>
    </Card>
  );
}

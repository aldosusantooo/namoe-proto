"use client";

import { useActionState, useRef, useState } from "react";
import type { ActionResult } from "@/actions/tenant";
import { copy } from "@/lib/copy";
import { FEED_MAX, NAME_MAX } from "@/lib/validate";
import { Button } from "../Button";
import { Card } from "../Card";
import { IconClose } from "../icons/UiIcons";
import { Notice } from "../Notice";
import type { StatefulAction } from "./TenantDashboard";

const NAME_KEY = "nm_name";

type FormProps = {
  postFeed: StatefulAction;
  title: string;
  /** Visitor posts carry an optional display name; tenant posts do not. */
  withName?: boolean;
  onClose: () => void;
  onPosted: (message?: string) => void;
};

/** The open composer card: one line up to 140 characters, optional name, photo by URL or upload. */
export function FeedComposerForm({ postFeed, title, withName = false, onClose, onPosted }: FormProps) {
  const [count, setCount] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const name = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState<ActionResult, FormData>(async (prev, formData) => {
    const result = await postFeed(prev, formData);
    if (result?.ok) {
      try {
        const v = name.current?.value.trim();
        if (v) window.localStorage.setItem(NAME_KEY, v);
      } catch {
        // storage unavailable
      }
      onPosted(result.message);
    }
    return result;
  }, null);

  return (
    <Card pad>
      <form action={action} className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <p className="flex-1 font-display text-h3 text-ink">{title}</p>
          <Button variant="ghost" icon sm aria-label={copy.common.close} onClick={onClose}>
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
          placeholder={withName ? copy.feed.placeholder : copy.tenantEdit.feedPlaceholder}
          aria-label={withName ? copy.feed.placeholder : copy.tenantEdit.feedPlaceholder}
          className="min-h-20 w-full resize-y rounded-md border-2 border-edge bg-paper px-3.5 py-2.5 text-body leading-[1.45] text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
        />
        <span className="text-right text-caption text-ink-muted" aria-live="polite">
          {copy.tenantEdit.introCounter(count, FEED_MAX)}
        </span>
        {withName ? (
          <input
            ref={name}
            name="displayName"
            type="text"
            maxLength={NAME_MAX}
            autoComplete="nickname"
            defaultValue={readName()}
            placeholder={copy.qa.name}
            aria-label={copy.qa.name}
            className="h-12 w-full rounded-pill border-2 border-edge bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
          />
        ) : null}
        <input
          name="url"
          type="url"
          inputMode="url"
          placeholder={copy.feed.photoUrl}
          aria-label={copy.feed.photoUrl}
          className="h-12 w-full rounded-pill border-2 border-edge bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
        />
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-pill border-2 border-edge bg-paper px-4 font-display text-[15px] font-semibold text-navy shadow-btn-ghost">
          <span className="truncate">{fileName ?? copy.feed.photoUpload}</span>
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

function readName(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

type Props = { postFeed: StatefulAction; label?: string; variant?: "ghost" | "primary" };

/** Dashboard entry: a ghost "Tulis kabar" button that opens the composer in place. */
export function FeedComposer({ postFeed, label = copy.tenantEdit.feedWrite, variant = "ghost" }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  if (open) {
    return (
      <FeedComposerForm
        postFeed={postFeed}
        title={label}
        onClose={() => setOpen(false)}
        onPosted={(m) => {
          setMessage(m ?? null);
          setOpen(false);
        }}
      />
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {message ? <Notice tone="ok">{message}</Notice> : null}
      <Button variant={variant} block onClick={() => setOpen(true)}>
        {label}
      </Button>
    </div>
  );
}

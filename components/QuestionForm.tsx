"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { PostState } from "@/actions/qa";
import { copy } from "@/lib/copy";
import { BODY_MAX, NAME_MAX } from "@/lib/validate";
import { Button } from "./Button";
import { IconClose } from "./icons/UiIcons";

const NAME_KEY = "nm_name";
const COUNTER_FROM = 200;

type Props = {
  /** Server action with the (prev, formData) signature. */
  action: (prev: PostState, formData: FormData) => Promise<PostState>;
  /** Hidden fields the action needs (sessionSlug, kind, tenantSlug). */
  fields: Record<string, string>;
  placeholder: string;
  /**
   * bar: a compose bar pinned above the tab bar; tapping the field opens the sheet.
   * button: an inline primary button that opens the same pinned sheet.
   */
  trigger?: "bar" | "button";
  buttonLabel?: string;
  /** Distance from the viewport bottom. Defaults to the visitor tab bar height. */
  bottom?: string;
};

/**
 * Compose bar for the session board and the Tanya tenant board. The bar stays pinned; the sheet with the
 * textarea and the optional name expands above it. Page content needs bottom padding of
 * var(--compose-height) + var(--nav-height) + 16px so the last row never sits under the bar.
 */
export function QuestionForm({ action, fields, placeholder, trigger = "bar", buttonLabel, bottom = "calc(var(--nav-height) + var(--safe-bottom))" }: Props) {
  const [state, formAction, pending] = useActionState<PostState, FormData>(action, null);
  const [open, setOpen] = useState(false);
  const body = useRef<HTMLTextAreaElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(0);
  const lastOk = useRef<string | null>(null);

  // Remembered display name for the next post. Read on open, never rendered on the server.
  useEffect(() => {
    if (!open) return;
    try {
      const saved = window.localStorage.getItem(NAME_KEY);
      if (saved && name.current && !name.current.value) name.current.value = saved;
    } catch {
      // storage unavailable
    }
    body.current?.focus();
  }, [open]);

  // Collapse and clear after a successful post; the list refreshes through revalidatePath.
  useEffect(() => {
    if (state?.ok && state.id !== lastOk.current) {
      lastOk.current = state.id;
      if (body.current) body.current.value = "";
      setCount(0);
      setOpen(false);
    }
  }, [state]);

  function rememberName() {
    try {
      const v = name.current?.value.trim() ?? "";
      if (v) window.localStorage.setItem(NAME_KEY, v);
      else window.localStorage.removeItem(NAME_KEY);
    } catch {
      // storage unavailable
    }
  }

  const hidden = Object.entries(fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />);

  if (trigger === "button" && !open) {
    return (
      <Button variant="primary" block onClick={() => setOpen(true)}>
        {buttonLabel ?? copy.tenant.askWrite}
      </Button>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={rememberName}
      className="fixed inset-x-0 z-40 mx-auto max-w-[var(--page-max)] border-t-2 border-edge bg-cream"
      style={{ bottom }}
    >
      {open ? (
        <div className="flex flex-col gap-2 px-3 pt-3">
          <div className="flex items-start gap-2">
            <textarea
              ref={body}
              name="body"
              rows={3}
              maxLength={BODY_MAX}
              required
              onInput={(e) => setCount(e.currentTarget.value.length)}
              placeholder={placeholder}
              aria-label={placeholder}
              className="min-h-24 w-full flex-1 resize-none rounded-md border-2 border-edge bg-paper px-3.5 py-2.5 text-body leading-[1.45] text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
            />
            <Button variant="ghost" icon sm aria-label={copy.common.close} onClick={() => setOpen(false)}>
              <IconClose size={22} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={name}
              name="displayName"
              type="text"
              maxLength={NAME_MAX}
              autoComplete="nickname"
              placeholder={copy.qa.name}
              aria-label={copy.qa.name}
              className="h-11 min-w-0 flex-1 rounded-pill border-2 border-edge bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
            />
            <span className="min-w-0 shrink-0 text-caption text-ink-muted" aria-live="polite">
              {count >= COUNTER_FROM ? copy.qa.counter(count, BODY_MAX) : ""}
            </span>
          </div>
          {state && !state.ok ? (
            <p role="alert" className="text-small font-bold text-coral">
              {state.error}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="flex items-center gap-2 px-3 py-2.5" style={{ minHeight: "var(--compose-height)" }}>
        {hidden}
        {open ? null : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-12 flex-1 items-center rounded-pill border-2 border-edge bg-paper px-4 text-left text-body text-ink-muted"
          >
            {placeholder}
          </button>
        )}
        <Button type="submit" variant="primary" disabled={pending || !open} block={open}>
          {copy.qa.send}
        </Button>
      </div>
    </form>
  );
}

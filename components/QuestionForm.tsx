"use client";

import { useActionState, useEffect, useRef } from "react";
import { postQuestion, type PostState } from "@/actions/qa";
import { copy } from "@/lib/copy";
import { BODY_MAX, NAME_MAX } from "@/lib/validate";

const NAME_KEY = "nm_name";
const COUNTER_FROM = 200;

type Props = { sessionSlug: string; kind: "QUESTION" | "THANKS" };

export function QuestionForm({ sessionSlug, kind }: Props) {
  const [state, action, pending] = useActionState<PostState, FormData>(postQuestion, null);
  const form = useRef<HTMLFormElement>(null);
  const body = useRef<HTMLTextAreaElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  // Remembered display name for the next post. Read once, never rendered on the server.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(NAME_KEY);
      if (saved && name.current && !name.current.value) name.current.value = saved;
    } catch {
      // storage unavailable
    }
  }, []);

  // Clear the composer after a successful post; the list refreshes through revalidatePath.
  useEffect(() => {
    if (state?.ok && body.current) {
      body.current.value = "";
      if (counter.current) counter.current.textContent = "";
    }
  }, [state]);

  function onBodyInput() {
    const n = body.current?.value.length ?? 0;
    if (counter.current) counter.current.textContent = n >= COUNTER_FROM ? copy.qa.counter(n, BODY_MAX) : "";
  }

  function onSubmit() {
    try {
      const v = name.current?.value.trim() ?? "";
      if (v) window.localStorage.setItem(NAME_KEY, v);
      else window.localStorage.removeItem(NAME_KEY);
    } catch {
      // storage unavailable
    }
  }

  const placeholder = kind === "THANKS" ? copy.qa.thanksPlaceholder : copy.qa.placeholder;

  return (
    <form ref={form} action={action} onSubmit={onSubmit} className="flex flex-col gap-3 rounded-lg bg-surface p-4 shadow-card">
      <input type="hidden" name="sessionSlug" value={sessionSlug} />
      <input type="hidden" name="kind" value={kind} />
      <div>
        <textarea
          ref={body}
          name="body"
          rows={3}
          maxLength={BODY_MAX}
          required
          onInput={onBodyInput}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-body text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
        />
        <span ref={counter} className="block min-h-4 text-right text-caption text-fg-muted" aria-live="polite" />
      </div>
      <div className="flex gap-2">
        <input
          ref={name}
          name="displayName"
          type="text"
          maxLength={NAME_MAX}
          autoComplete="nickname"
          placeholder={copy.qa.name}
          aria-label={copy.qa.name}
          className="h-[var(--tap-min)] min-w-0 flex-1 rounded-md border border-border bg-bg px-3 text-body text-fg placeholder:text-fg-muted focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-[var(--tap-min)] shrink-0 items-center justify-center rounded-pill bg-primary px-5 font-bold text-on-primary disabled:opacity-60"
        >
          {copy.qa.send}
        </button>
      </div>
      {state && !state.ok ? (
        <p role="alert" className="text-small font-semibold text-danger">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

"use client";

import { startTransition, useOptimistic } from "react";
import { toggleUpvote } from "@/actions/qa";
import { copy } from "@/lib/copy";

type Props = { questionId: string; count: number; upvoted: boolean };

export function UpvoteButton({ questionId, count, upvoted }: Props) {
  const [state, setOptimistic] = useOptimistic({ count, upvoted }, (_, next: { count: number; upvoted: boolean }) => next);

  function onClick() {
    startTransition(async () => {
      setOptimistic({ upvoted: !state.upvoted, count: state.count + (state.upvoted ? -1 : 1) });
      await toggleUpvote(questionId);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={state.upvoted}
      aria-label={copy.qa.upvote}
      className={`flex min-h-[var(--tap-min)] min-w-[var(--tap-min)] flex-col items-center justify-center rounded-md border px-2 font-display text-h3 leading-none transition-colors duration-[var(--duration-fast)] ${
        state.upvoted ? "border-primary bg-primary text-on-primary" : "border-border bg-surface text-fg"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 14 6-6 6 6" />
      </svg>
      <span>{state.count}</span>
    </button>
  );
}

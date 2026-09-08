"use client";

import { startTransition, useOptimistic } from "react";
import { toggleUpvote } from "@/actions/qa";
import { copy } from "@/lib/copy";
import { IconUpvote } from "./icons/UiIcons";

type Props = { questionId: string; count: number; upvoted: boolean };

/** 48 x 52 pill: arrow over the count. Voted state fills navy. One vote per device, toggled. */
export function UpvoteButton({ questionId, count, upvoted }: Props) {
  const [state, setOptimistic] = useOptimistic({ count, upvoted }, (_, next: { count: number; upvoted: boolean }) => next);

  function onClick() {
    startTransition(async () => {
      setOptimistic({ upvoted: !state.upvoted, count: Math.max(0, state.count + (state.upvoted ? -1 : 1)) });
      await toggleUpvote(questionId);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={state.upvoted}
      aria-label={copy.qa.upvote}
      className={`flex w-12 min-h-13 shrink-0 flex-col items-center justify-center gap-px rounded-[14px] border-2 font-display text-body font-semibold leading-none transition-[transform,background-color] duration-[var(--duration-fast)] active:translate-y-0.5 ${
        state.upvoted ? "border-navy bg-navy text-paper shadow-[0_2px_0_0_var(--color-navy-deep)]" : "border-edge bg-paper text-navy shadow-[0_2px_0_0_var(--color-edge)]"
      }`}
    >
      <IconUpvote size={20} />
      <span>{state.count}</span>
    </button>
  );
}

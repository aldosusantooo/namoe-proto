"use client";

import { useState } from "react";
import { copy } from "@/lib/copy";
import { Card } from "./Card";
import { IconCheck, IconChevronDown } from "./icons/UiIcons";
import { UpvoteButton } from "./UpvoteButton";

export type QuestionRow = {
  id: string;
  body: string;
  displayName: string | null;
  createdAt: Date;
  upvoteCount: number;
  answered: boolean;
  upvoted: boolean;
};

/** One board row: question text, byline (name or Anonim), optional trailing control. No timestamp anywhere. */
export function QuestionRowView({ q, trailing, children }: { q: Pick<QuestionRow, "body" | "displayName">; trailing?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 px-4 py-3.5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-body font-semibold leading-[1.4] text-ink">{q.body}</p>
          <p className="mt-1.5 text-small text-ink-soft">{q.displayName ?? copy.qa.anon}</p>
        </div>
        {trailing}
      </div>
      {children}
    </div>
  );
}

type Props = { items: QuestionRow[]; answered?: QuestionRow[]; voting: boolean };

/**
 * Ranked open questions in one Card, then a collapsed "N pertanyaan sudah dijawab" row that expands the
 * answered list below it. Client state only for the toggle; default collapsed.
 */
export function QuestionList({ items, answered = [], voting }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <ul className="divide-y-2 divide-line">
        {items.map((q) => (
          <li key={q.id}>
            <QuestionRowView q={q} trailing={voting ? <UpvoteButton questionId={q.id} count={q.upvoteCount} upvoted={q.upvoted} /> : undefined} />
          </li>
        ))}
      </ul>
      {answered.length ? (
        <div className={items.length ? "border-t-2 border-line" : ""}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left text-[15px] font-bold text-ink-soft"
          >
            <span className="flex items-center gap-1.5">
              <IconCheck size={22} className="text-green" />
              {copy.qa.answered(answered.length)}
            </span>
            <IconChevronDown size={22} className={`transition-transform duration-[var(--duration-base)] ${open ? "rotate-180" : ""}`} />
          </button>
          {open ? (
            <ul className="divide-y-2 divide-line border-t-2 border-line bg-cream">
              {answered.map((q) => (
                <li key={q.id}>
                  <QuestionRowView q={q} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

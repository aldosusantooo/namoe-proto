import { copy } from "@/lib/copy";
import { formatDay, formatTime } from "@/lib/time";
import { Card } from "./Card";
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

function Meta({ q }: { q: QuestionRow }) {
  return (
    <p className="mt-1 text-caption text-fg-muted">
      {q.displayName ?? copy.qa.anon}, {formatDay(q.createdAt)} {formatTime(q.createdAt)}
    </p>
  );
}

export function QuestionList({ items, voting }: { items: QuestionRow[]; voting: boolean }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((q) => (
        <li key={q.id}>
          <Card className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-body text-fg">{q.body}</p>
              <Meta q={q} />
            </div>
            {voting ? <UpvoteButton questionId={q.id} count={q.upvoteCount} upvoted={q.upvoted} /> : null}
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function AnsweredList({ items }: { items: QuestionRow[] }) {
  if (!items.length) return null;
  return (
    <details className="rounded-lg border border-border bg-surface-alt">
      <summary className="flex min-h-[var(--tap-min)] cursor-pointer items-center px-4 font-bold text-fg-soft">
        {copy.qa.answeredCount(items.length)}
      </summary>
      <ul className="flex flex-col gap-3 p-3 pt-0">
        {items.map((q) => (
          <li key={q.id}>
            <Card className="shadow-none">
              <span className="mb-1 inline-block rounded-pill bg-success-soft px-2.5 py-0.5 text-caption font-bold text-fg">
                {copy.qa.answered}
              </span>
              <p className="text-body text-fg">{q.body}</p>
              <Meta q={q} />
            </Card>
          </li>
        ))}
      </ul>
    </details>
  );
}

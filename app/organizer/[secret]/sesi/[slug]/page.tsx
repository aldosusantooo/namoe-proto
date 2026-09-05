import { notFound } from "next/navigation";
import { setAnswered, setHidden } from "@/actions/organizer";
import { Card } from "@/components/Card";
import { Empty } from "@/components/Empty";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";
import { rankQuestions, splitAnswered } from "@/lib/ranking";
import { formatDay, formatTime, formatTimeRange } from "@/lib/time";

type Row = {
  id: string;
  body: string;
  displayName: string | null;
  createdAt: Date;
  upvoteCount: number;
  answered: boolean;
  answeredAt: Date | null;
  hidden: boolean;
};

function Row({ q, secret }: { q: Row; secret: string }) {
  const btn = "inline-flex min-h-[var(--tap-min)] items-center rounded-pill border border-border bg-surface px-4 text-small font-bold text-fg";
  return (
    <Card className={`flex flex-col gap-3 md:flex-row md:items-start ${q.hidden ? "opacity-60" : ""}`}>
      <div className="flex w-16 shrink-0 flex-col items-center rounded-md bg-surface-alt py-2 font-display text-h2 text-fg">
        {q.upvoteCount}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body text-fg">{q.body}</p>
        <p className="mt-1 text-caption text-fg-muted">
          {q.displayName ?? copy.qa.anon}, {formatDay(q.createdAt)} {formatTime(q.createdAt)}
          {q.hidden ? ` , ${copy.organizer.hiddenTag}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <form action={setAnswered.bind(null, secret, q.id, !q.answered)}>
          <button type="submit" className={`${btn} ${q.answered ? "" : "border-success bg-success-soft"}`}>
            {q.answered ? copy.organizer.unmarkAnswered : copy.organizer.markAnswered}
          </button>
        </form>
        <form action={setHidden.bind(null, secret, q.id, !q.hidden)}>
          <button type="submit" className={btn}>
            {q.hidden ? copy.organizer.show : copy.organizer.hide}
          </button>
        </form>
      </div>
    </Card>
  );
}

export default async function OrganizerSessionPage({ params }: PageProps<"/organizer/[secret]/sesi/[slug]">) {
  const { secret, slug } = await params;
  requireOrganizer(secret);

  const session = await db.session.findUnique({
    where: { slug },
    include: {
      speakers: { include: { speaker: { select: { name: true } } } },
      questions: { where: { kind: "QUESTION" }, select: { id: true, body: true, displayName: true, createdAt: true, upvoteCount: true, answered: true, answeredAt: true, hidden: true } },
    },
  });
  if (!session) notFound();

  const { open, answered } = splitAnswered(session.questions);
  const ranked = rankQuestions(open);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-caption font-bold uppercase tracking-wide text-primary">
          {formatDay(session.startsAt)}, {formatTimeRange(session.startsAt, session.endsAt)}
        </p>
        <h1 className="mt-1 font-display text-display text-fg">{session.title}</h1>
        <p className="text-body text-fg-soft">{session.speakers.map((s) => s.speaker.name).join(", ")}</p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-h1 text-fg">{copy.organizer.openQuestions}</h2>
        {ranked.length ? ranked.map((q) => <Row key={q.id} q={q} secret={secret} />) : <Empty>{copy.qa.emptyQuestions}</Empty>}
      </section>

      {answered.length ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-h1 text-fg">{copy.organizer.answeredQuestions}</h2>
          {answered.map((q) => <Row key={q.id} q={q} secret={secret} />)}
        </section>
      ) : null}
    </div>
  );
}

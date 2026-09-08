import { notFound } from "next/navigation";
import { setAnswered, setHidden } from "@/actions/organizer";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Empty } from "@/components/Empty";
import { Pill } from "@/components/CategoryBadge";
import { OrganizerShell } from "@/components/OrganizerShell";
import { QuestionRowView } from "@/components/QuestionList";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";
import { rankQuestions, splitAnswered } from "@/lib/ranking";
import { DAY_LABELS, formatTimeRange, type EventDay } from "@/lib/time";

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

/** Same row as the visitor board, plus the vote count and the two moderation actions. */
function ModerationRow({ q, secret }: { q: Row; secret: string }) {
  return (
    <div className={q.hidden ? "opacity-60" : ""}>
      <QuestionRowView
        q={q}
        trailing={
          <span className="flex w-12 shrink-0 flex-col items-center justify-center rounded-[14px] border-2 border-edge bg-paper py-1.5 font-display text-body font-semibold text-navy" aria-label={copy.organizer.upvotesCount(q.upvoteCount)}>
            {q.upvoteCount}
          </span>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <form action={setAnswered.bind(null, secret, q.id, !q.answered)}>
            <Button type="submit" variant={q.answered ? "ghost" : "primary"} sm>
              {q.answered ? copy.organizer.unmarkAnswered : copy.organizer.markAnswered}
            </Button>
          </form>
          <form action={setHidden.bind(null, secret, q.id, !q.hidden)}>
            <Button type="submit" variant="ghost" sm>
              {q.hidden ? copy.organizer.show : copy.organizer.hide}
            </Button>
          </form>
          {q.hidden ? <Pill tone="outline">{copy.organizer.hiddenTag}</Pill> : null}
        </div>
      </QuestionRowView>
    </div>
  );
}

export default async function OrganizerSessionPage({ params }: PageProps<"/organizer/[secret]/sesi/[slug]">) {
  const { secret, slug } = await params;
  requireOrganizer(secret);

  const session = await db.session.findUnique({
    where: { slug },
    include: {
      speakers: { include: { speaker: { select: { name: true } } } },
      questions: {
        where: { kind: "QUESTION" },
        select: { id: true, body: true, displayName: true, createdAt: true, upvoteCount: true, answered: true, answeredAt: true, hidden: true },
      },
    },
  });
  if (!session) notFound();

  const { open, answered } = splitAnswered(session.questions);
  const ranked = rankQuestions(open);
  const meta = `${DAY_LABELS[(session.day as EventDay) - 1]}, ${formatTimeRange(session.startsAt, session.endsAt)}. ${session.speakers.map((s) => s.speaker.name).join(", ")}`;

  return (
    <OrganizerShell
      secret={secret}
      active="questions"
      title={session.title}
      hint={meta}
      action={
        <Button href={`/sesi/${slug}`} variant="ghost" sm>
          {copy.common.open}
        </Button>
      }
    >
      <div className="grid max-w-[760px] gap-6">
        <section className="flex flex-col gap-2.5">
          <h2 className="font-display text-h2 text-ink">{copy.organizer.openQuestions}</h2>
          {ranked.length ? (
            <Card>
              <ul className="divide-y-2 divide-line">
                {ranked.map((q) => (
                  <li key={q.id}>
                    <ModerationRow q={q} secret={secret} />
                  </li>
                ))}
              </ul>
            </Card>
          ) : (
            <Empty kind="questions" title={copy.qa.emptyTitle} body={copy.qa.emptyBody} />
          )}
        </section>

        {answered.length ? (
          <section className="flex flex-col gap-2.5">
            <h2 className="font-display text-h2 text-ink">{copy.organizer.answeredQuestions}</h2>
            <Card>
              <ul className="divide-y-2 divide-line">
                {answered.map((q) => (
                  <li key={q.id}>
                    <ModerationRow q={q} secret={secret} />
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        ) : null}
      </div>
    </OrganizerShell>
  );
}

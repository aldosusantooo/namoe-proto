import Link from "next/link";
import { notFound } from "next/navigation";
import { Empty } from "@/components/Empty";
import { QuestionForm } from "@/components/QuestionForm";
import { AnsweredList, QuestionList, type QuestionRow } from "@/components/QuestionList";
import { speakerNames } from "@/components/ScheduleList";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { getOrCreateDeviceId } from "@/lib/device-server";
import { rankQuestions, splitAnswered } from "@/lib/ranking";
import { formatDay, formatTimeRange } from "@/lib/time";

export async function generateMetadata({ params }: PageProps<"/sesi/[slug]">) {
  const { slug } = await params;
  const session = await db.session.findUnique({ where: { slug }, select: { title: true } });
  return { title: session?.title ?? copy.qa.sessionNotFound };
}

export default async function SessionPage({ params, searchParams }: PageProps<"/sesi/[slug]">) {
  const { slug } = await params;
  const { tab } = await searchParams;
  const kind = tab === "ucapan" ? "THANKS" : "QUESTION";
  const deviceId = await getOrCreateDeviceId();

  const session = await db.session.findUnique({
    where: { slug },
    include: {
      speakers: { include: { speaker: { select: { name: true } } } },
      questions: {
        where: { hidden: false, kind },
        select: { id: true, body: true, displayName: true, createdAt: true, upvoteCount: true, answered: true, answeredAt: true, upvotes: { where: { deviceId }, select: { deviceId: true } } },
      },
    },
  });
  if (!session) notFound();

  const rows: (QuestionRow & { answeredAt: Date | null })[] = session.questions.map((q) => ({
    id: q.id,
    body: q.body,
    displayName: q.displayName,
    createdAt: q.createdAt,
    upvoteCount: q.upvoteCount,
    answered: q.answered,
    answeredAt: q.answeredAt,
    upvoted: q.upvotes.length > 0,
  }));

  const isThanks = kind === "THANKS";
  const { open, answered } = splitAnswered(rows);
  const list = isThanks ? [...rows].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) : rankQuestions(open);

  const tabs = [
    { key: "QUESTION", label: copy.qa.tabQuestions, href: `/sesi/${slug}` },
    { key: "THANKS", label: copy.qa.tabThanks, href: `/sesi/${slug}?tab=ucapan` },
  ] as const;

  return (
    <div className="flex flex-col gap-5 pt-6">
      <header>
        <p className="text-caption font-bold uppercase tracking-wide text-primary">
          {formatDay(session.startsAt)}, {formatTimeRange(session.startsAt, session.endsAt)}
        </p>
        <h1 className="mt-1 font-display text-display leading-tight text-fg">{session.title}</h1>
        <p className="mt-1 text-body text-fg-soft">{speakerNames(session)}</p>
        {session.description ? <p className="mt-3 text-body text-fg-soft">{session.description}</p> : null}
      </header>

      <div role="tablist" className="grid grid-cols-2 gap-1 rounded-md bg-surface-alt p-1">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            scroll={false}
            role="tab"
            aria-selected={t.key === kind}
            className={`flex min-h-[var(--tap-min)] items-center justify-center rounded-sm text-small ${
              t.key === kind ? "bg-surface font-bold text-fg shadow-card" : "text-fg-soft"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <QuestionForm key={kind} sessionSlug={slug} kind={kind} />

      {list.length ? (
        <QuestionList items={list} voting={!isThanks} />
      ) : (
        <Empty>{isThanks ? copy.qa.emptyThanks : copy.qa.emptyQuestions}</Empty>
      )}

      {!isThanks ? <AnsweredList items={answered} /> : null}
    </div>
  );
}

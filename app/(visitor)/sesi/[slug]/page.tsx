import { notFound } from "next/navigation";
import { postQuestion } from "@/actions/qa";
import { Avatar } from "@/components/Avatar";
import { Empty } from "@/components/Empty";
import { Eyebrow, PageHeader } from "@/components/PageHeader";
import { QuestionForm } from "@/components/QuestionForm";
import { QuestionList, type QuestionRow } from "@/components/QuestionList";
import { Segmented } from "@/components/Segmented";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { getOrCreateDeviceId } from "@/lib/device-server";
import { rankQuestions, splitAnswered } from "@/lib/ranking";
import { speakerLine } from "@/lib/speaker";
import { DAY_LABELS, formatTimeRange, type EventDay } from "@/lib/time";

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
      speakers: { include: { speaker: { select: { name: true, handle: true, bio: true, photoUrl: true, slug: true } } } },
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
  const speakers = session.speakers.map((s) => s.speaker);

  return (
    <div className="flex flex-col gap-4 pb-[calc(var(--compose-height)+var(--nav-height)+16px)]">
      <PageHeader back="/jadwal">
        <Eyebrow className="min-w-0 flex-1 leading-snug">
          {DAY_LABELS[(session.day as EventDay) - 1]}, {formatTimeRange(session.startsAt, session.endsAt)}
        </Eyebrow>
      </PageHeader>
      <h1 className="font-display text-h1 text-ink">{session.title}</h1>

      <ul className="flex flex-col gap-2.5">
        {speakers.map((s) => (
          <li key={s.slug} className="flex items-center gap-3">
            <Avatar name={s.name} photoUrl={s.photoUrl} size={48} />
            <div className="min-w-0">
              <p className="font-bold text-ink">{s.name}</p>
              <p className="text-small text-ink-soft">{speakerLine(s)}</p>
            </div>
          </li>
        ))}
      </ul>

      <Segmented
        active={kind}
        items={[
          { key: "QUESTION", label: copy.qa.tabQuestions, href: `/sesi/${slug}` },
          { key: "THANKS", label: copy.qa.tabThanks, href: `/sesi/${slug}?tab=ucapan` },
        ]}
      />

      {list.length || answered.length ? (
        <QuestionList items={list} answered={isThanks ? [] : answered} voting={!isThanks} />
      ) : (
        <Empty kind="questions" title={isThanks ? copy.qa.emptyThanksTitle : copy.qa.emptyTitle} body={isThanks ? copy.qa.emptyThanksBody : copy.qa.emptyBody} />
      )}
      {!isThanks ? <p className="text-small text-ink-soft">{copy.qa.helper}</p> : null}

      <QuestionForm key={kind} action={postQuestion} fields={{ sessionSlug: slug, kind }} placeholder={isThanks ? copy.qa.thanksPlaceholder : copy.qa.placeholder} />
    </div>
  );
}

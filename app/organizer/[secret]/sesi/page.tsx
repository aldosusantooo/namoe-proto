import { OrganizerSessionDays } from "@/components/OrganizerSessionDays";
import { OrganizerShell } from "@/components/OrganizerShell";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";

export const metadata = { title: copy.organizer.questions };

export default async function OrganizerSessionsPage({ params }: PageProps<"/organizer/[secret]/sesi">) {
  const { secret } = await params;
  requireOrganizer(secret);
  const sessions = await db.session.findMany({
    select: { slug: true, title: true, day: true, startsAt: true, questions: { where: { kind: "QUESTION", hidden: false }, select: { answered: true } } },
  });
  const rows = sessions.map((s) => ({
    slug: s.slug,
    title: s.title,
    day: s.day,
    startsAt: s.startsAt,
    questions: s.questions.length,
    unanswered: s.questions.filter((q) => !q.answered).length,
  }));
  return (
    <OrganizerShell secret={secret} active="questions" title={copy.organizer.questions} hint={copy.organizer.questionsHint}>
      <div className="max-w-[760px]">
        <OrganizerSessionDays secret={secret} sessions={rows} />
      </div>
    </OrganizerShell>
  );
}

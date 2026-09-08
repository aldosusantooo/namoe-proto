import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { PageHeader, SectionHeader } from "@/components/PageHeader";
import { ScheduleList } from "@/components/ScheduleList";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { speakerHandle } from "@/lib/speaker";

export async function generateMetadata({ params }: PageProps<"/pembicara/[slug]">) {
  const { slug } = await params;
  const speaker = await db.speaker.findUnique({ where: { slug }, select: { name: true } });
  return { title: speaker?.name ?? copy.speaker.notFound };
}

/** Speaker page: photo or navy-hued avatar, handle, bio, and their sessions as a ScheduleList. */
export default async function SpeakerPage({ params }: PageProps<"/pembicara/[slug]">) {
  const { slug } = await params;
  const speaker = await db.speaker.findUnique({
    where: { slug },
    include: {
      sessions: {
        include: { session: { include: { speakers: { include: { speaker: { select: { name: true, slug: true, photoUrl: true } } } } } } },
      },
    },
  });
  if (!speaker) notFound();
  const sessions = speaker.sessions.map((s) => s.session).sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={copy.qa.speakers} back="/jadwal" />
      <header className="flex items-center gap-4">
        <Avatar name={speaker.name} photoUrl={speaker.photoUrl} size={72} />
        <div className="min-w-0">
          <h2 className="font-display text-h1 text-ink">{speaker.name}</h2>
          <p className="text-small text-ink-soft">{speakerHandle(speaker)}</p>
        </div>
      </header>
      <p className="text-body text-ink">{speaker.bio}</p>
      <section className="flex flex-col gap-2.5">
        <SectionHeader title={copy.speaker.sessions} />
        <ScheduleList sessions={sessions} />
      </section>
    </div>
  );
}

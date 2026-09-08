import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Empty } from "@/components/Empty";
import { MascotBiru, MascotMerah, MascotOranye } from "@/components/icons/Mascots";
import { Lockup } from "@/components/Lockup";
import { Eyebrow, SectionHeader } from "@/components/PageHeader";
import { ScheduleList } from "@/components/ScheduleList";
import { Tile } from "@/components/Tile";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { getOrCreateDeviceId } from "@/lib/device-server";
import { getEvent } from "@/lib/event";
import { speakerHandle } from "@/lib/speaker";
import { DAY_LABELS, formatTime, type EventDay } from "@/lib/time";

export default async function HomePage() {
  const deviceId = await getOrCreateDeviceId();

  const [event, sessions, tenantCount, passport] = await Promise.all([
    getEvent(),
    db.session.findMany({
      orderBy: [{ day: "asc" }, { startsAt: "asc" }],
      include: { speakers: { include: { speaker: { select: { name: true, slug: true, handle: true, photoUrl: true } } } } },
    }),
    db.tenant.count(),
    db.passport.findUnique({ where: { deviceId }, select: { completedAt: true, _count: { select: { stamps: true } } } }),
  ]);

  const [headline, ...rest] = sessions;
  const next = rest.slice(0, 3);
  const stamps = passport?._count.stamps ?? 0;
  const passportSub = passport && stamps >= event.passportTarget ? copy.home.passportComplete : copy.home.passportProgress(stamps, event.passportTarget);
  const speaker = headline?.speakers[0]?.speaker;

  return (
    <div className="flex flex-col gap-4">
      <header className="texture-check edge-wavy-bottom relative -mx-[var(--page-gutter)] -mt-4 bg-blue px-5 pb-[46px] pt-[22px] text-paper">
        <div aria-hidden="true" className="absolute right-3.5 top-3.5 flex gap-1.5">
          <MascotBiru size={44} />
          <MascotMerah size={44} />
          <MascotOranye size={44} />
        </div>
        <h1>
          <Lockup />
          <span className="mt-1.5 block font-display text-body font-semibold text-paper/95">{copy.home.subtitle}</span>
        </h1>
        <p className="mt-[18px] font-display text-lead font-semibold leading-[1.3]">{copy.home.dates}</p>
        <p className="text-[15px] opacity-90">{event.venue}</p>
      </header>

      {headline ? (
        <Card as="section">
          <div className="flex items-center justify-between gap-3 bg-yellow px-4 py-2">
            <Eyebrow tone="ink">{copy.home.openingTalk}</Eyebrow>
            <span className="text-small font-extrabold text-ink">
              {DAY_LABELS[(headline.day as EventDay) - 1]}, {formatTime(headline.startsAt)}
            </span>
          </div>
          <div className="flex flex-col gap-2.5 px-4 pb-4 pt-3.5">
            <h2 className="font-display text-h2 text-ink">{headline.title}</h2>
            {speaker ? (
              <div className="flex items-center gap-3">
                <Avatar name={speaker.name} photoUrl={speaker.photoUrl} size={40} />
                <div className="min-w-0">
                  <p className="font-bold text-ink">{speaker.name}</p>
                  <p className="text-small text-ink-soft">{speakerHandle(speaker)}</p>
                </div>
              </div>
            ) : null}
            {headline.description ? <p className="text-body text-ink-soft">{headline.description}</p> : null}
            <Button href={`/sesi/${headline.slug}`} variant="primary" block>
              {copy.home.askSpeaker}
            </Button>
          </div>
        </Card>
      ) : null}

      <nav aria-label="Bagian aplikasi" className="grid grid-cols-2 gap-3">
        <Tile href="/tenant" tone="blue" icon="tenant" title={copy.nav.tenants} subtitle={copy.home.tenantsCount(tenantCount)} />
        <Tile href="/peta" tone="green" icon="peta" title={copy.nav.map} subtitle={copy.home.mapHint} />
        <Tile href="/jadwal" tone="yellow" icon="jadwal" title={copy.nav.schedule} subtitle={copy.home.sessionsCount(sessions.length)} />
        <Tile href="/paspor" tone="coral" icon="paspor" title={copy.nav.passport} subtitle={passportSub} />
      </nav>

      <section className="flex flex-col gap-2.5">
        <SectionHeader
          title={copy.home.nextTalks}
          action={
            <>
              <Eyebrow href="/jadwal">{copy.home.allSchedule}</Eyebrow>
              <Eyebrow href="/feed">{copy.nav.feed}</Eyebrow>
            </>
          }
        />
        {next.length ? <ScheduleList sessions={next} relativeToDay={(headline?.day ?? 1) as EventDay} /> : <Empty kind="search" title={copy.home.noSessions} />}
      </section>
    </div>
  );
}

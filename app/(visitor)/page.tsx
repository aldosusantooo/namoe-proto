import Link from "next/link";
import { Card } from "@/components/Card";
import { DayTabs } from "@/components/DayTabs";
import { Empty } from "@/components/Empty";
import { ScheduleList, speakerNames } from "@/components/ScheduleList";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { getOrCreateDeviceId } from "@/lib/device-server";
import { getEvent } from "@/lib/event";
import { parseDay, sessionsForDay } from "@/lib/schedule";
import { dayLabel, formatTimeRange } from "@/lib/time";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const day = parseDay(params.hari);
  const deviceId = await getOrCreateDeviceId();

  const [event, sessions, tenantCount, passport] = await Promise.all([
    getEvent(),
    db.session.findMany({ include: { speakers: { include: { speaker: { select: { name: true } } } } } }),
    db.tenant.count(),
    db.passport.findUnique({ where: { deviceId }, select: { _count: { select: { stamps: true } } } }),
  ]);

  const today = sessionsForDay(sessions, day);
  const headline = today[0];
  const stamps = passport?._count.stamps ?? 0;

  const tiles = [
    { href: "/tenant", label: copy.nav.tenants, sub: copy.home.tenantsCount(tenantCount), bg: "var(--color-blue-soft)" },
    { href: "/peta", label: copy.nav.map, sub: copy.home.mapHint, bg: "var(--color-green-soft)" },
    {
      href: "/paspor",
      label: copy.nav.passport,
      sub: passport ? copy.passport.progress(stamps, event.passportTarget) : copy.home.startPassport,
      bg: "var(--color-coral-soft)",
    },
    { href: "/jadwal", label: copy.nav.schedule, sub: copy.home.sessionsCount(sessions.length), bg: "var(--color-yellow-soft)" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="pt-8">
        <h1 className="font-display text-display-lg text-navy">{event.name}</h1>
        <p className="mt-1 text-small font-semibold uppercase tracking-wide text-fg-muted">{event.tagline}</p>
        <p className="mt-3 text-body text-fg">{copy.home.dates}</p>
        <p className="text-body text-fg-soft">{event.venue}</p>
      </header>

      {headline ? (
        <Card as="section" className="border-t-4 border-primary">
          <p className="text-caption font-bold uppercase tracking-wide text-primary">{dayLabel(day)}</p>
          <h2 className="mt-1 font-display text-h1 text-fg">{headline.title}</h2>
          <p className="mt-1 text-body text-fg-soft">{speakerNames(headline)}</p>
          <p className="mt-1 font-display text-lead text-navy">{formatTimeRange(headline.startsAt, headline.endsAt)}</p>
          {headline.description ? <p className="mt-3 text-body text-fg-soft">{headline.description}</p> : null}
          <Link
            href={`/sesi/${headline.slug}`}
            className="mt-4 inline-flex min-h-[var(--tap-min)] items-center justify-center rounded-pill bg-primary px-5 font-bold text-on-primary"
          >
            {copy.home.askSpeaker}
          </Link>
        </Card>
      ) : null}

      <section className="grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="flex min-h-24 flex-col justify-between rounded-lg p-4 shadow-card transition-transform duration-[var(--duration-fast)] active:scale-[0.98]"
            style={{ background: t.bg }}
          >
            <span className="font-display text-h2 text-fg">{t.label}</span>
            <span className="text-small text-fg-soft">{t.sub}</span>
          </Link>
        ))}
      </section>

      <section id="jadwal" className="flex flex-col gap-3">
        <h2 className="font-display text-h1 text-fg">{copy.home.scheduleTitle}</h2>
        <DayTabs basePath="/" active={day} anchor="jadwal" />
        {today.length ? <ScheduleList sessions={today} /> : <Empty>{copy.home.noSessions}</Empty>}
      </section>
    </div>
  );
}

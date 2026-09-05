import Link from "next/link";
import { Card } from "@/components/Card";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";
import { groupByDay } from "@/lib/schedule";
import { DAY_LABELS, EVENT_DAYS, formatTime } from "@/lib/time";

export const metadata = { title: copy.organizer.title };

export default async function OrganizerHomePage({ params }: PageProps<"/organizer/[secret]">) {
  const { secret } = await params;
  requireOrganizer(secret);

  const [tenants, questions, passportsStarted, passportsDone, sessions] = await Promise.all([
    db.tenant.count(),
    db.question.count({ where: { kind: "QUESTION" } }),
    db.passport.count(),
    db.passport.count({ where: { completedAt: { not: null } } }),
    db.session.findMany({ include: { _count: { select: { questions: { where: { kind: "QUESTION" } } } } } }),
  ]);
  const byDay = groupByDay(sessions);

  const stats = [
    [copy.organizer.stats.tenants, tenants],
    [copy.organizer.stats.questions, questions],
    [copy.organizer.stats.passportsStarted, passportsStarted],
    [copy.organizer.stats.passportsDone, passportsDone],
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-display text-fg">{copy.organizer.title}</h1>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <li key={label}>
            <Card>
              <p className="text-caption font-bold uppercase tracking-wide text-fg-muted">{label}</p>
              <p className="mt-1 font-display text-display text-fg">{value}</p>
            </Card>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3">
        <Link href={`/organizer/${secret}/tukar`} className="inline-flex min-h-[var(--tap-min)] items-center rounded-pill bg-primary px-5 font-bold text-on-primary">
          {copy.organizer.redeem}
        </Link>
        <Link href={`/organizer/${secret}/booth`} className="inline-flex min-h-[var(--tap-min)] items-center rounded-pill border border-border bg-surface px-5 font-bold text-fg">
          {copy.organizer.boothLinks}
        </Link>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-h1 text-fg">{copy.organizer.sessions}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {EVENT_DAYS.map((day) => (
            <Card key={day} as="section">
              <h3 className="font-display text-h3 text-navy">{DAY_LABELS[day - 1]}</h3>
              <ul className="mt-2 divide-y divide-border">
                {byDay[day].map((s) => (
                  <li key={s.slug}>
                    <Link href={`/organizer/${secret}/sesi/${s.slug}`} className="flex min-h-[var(--tap-min)] items-center gap-3 py-2">
                      <span className="w-12 shrink-0 font-display text-fg-soft">{formatTime(s.startsAt)}</span>
                      <span className="flex-1 text-body text-fg">{s.title}</span>
                      <span className="shrink-0 text-small text-fg-muted">{copy.organizer.questionsCount(s._count.questions)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

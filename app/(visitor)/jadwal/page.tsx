import { PageHeader } from "@/components/PageHeader";
import { ScheduleList } from "@/components/ScheduleList";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { groupByDay } from "@/lib/schedule";
import { DAY_LABELS, EVENT_DAYS } from "@/lib/time";

export const metadata = { title: copy.nav.schedule };

export default async function SchedulePage() {
  const sessions = await db.session.findMany({
    include: { speakers: { include: { speaker: { select: { name: true, photoUrl: true } } } } },
  });
  const byDay = groupByDay(sessions);
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={copy.nav.schedule} />
      {EVENT_DAYS.map((day) =>
        byDay[day].length ? (
          <section key={day} className="flex flex-col gap-2.5">
            <h2 className="font-display text-h2 text-ink">{DAY_LABELS[day - 1]}</h2>
            <ScheduleList sessions={byDay[day]} />
          </section>
        ) : null,
      )}
    </div>
  );
}

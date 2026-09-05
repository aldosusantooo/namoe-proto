import { ScheduleList } from "@/components/ScheduleList";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { groupByDay } from "@/lib/schedule";
import { DAY_LABELS, EVENT_DAYS } from "@/lib/time";

export const metadata = { title: copy.nav.schedule };

export default async function SchedulePage() {
  const sessions = await db.session.findMany({ include: { speakers: { include: { speaker: { select: { name: true } } } } } });
  const byDay = groupByDay(sessions);
  return (
    <div className="flex flex-col gap-6 pt-6">
      <h1 className="font-display text-display text-fg">{copy.home.scheduleTitle}</h1>
      {EVENT_DAYS.map((day) => (
        <section key={day} className="flex flex-col gap-2">
          <h2 className="font-display text-h2 text-navy">{DAY_LABELS[day - 1]}</h2>
          <ScheduleList sessions={byDay[day]} />
        </section>
      ))}
    </div>
  );
}

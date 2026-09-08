import Link from "next/link";
import { copy } from "@/lib/copy";
import { groupByDay } from "@/lib/schedule";
import { DAY_LABELS, EVENT_DAYS, formatTime } from "@/lib/time";
import { Card } from "./Card";
import { IconChevronRight } from "./icons/UiIcons";

export type OrganizerSessionRow = {
  slug: string;
  title: string;
  day: number;
  startsAt: Date;
  /** Open questions (not hidden). */
  questions: number;
  /** Open and not yet answered. */
  unanswered: number;
};

/** One card per event day, rows link to the moderation page; the count turns coral when there is work to do. */
export function OrganizerSessionDays({ secret, sessions }: { secret: string; sessions: OrganizerSessionRow[] }) {
  const byDay = groupByDay(sessions);
  return (
    <div className="grid gap-3.5">
      {EVENT_DAYS.map((day) => (
        <Card key={day} as="section">
          <h3 className="border-b-2 border-line bg-cream px-4 py-3 font-display text-[17px] font-semibold text-ink">{DAY_LABELS[day - 1]}</h3>
          <ul className="divide-y-2 divide-line">
            {byDay[day].map((s) => (
              <li key={s.slug}>
                <Link href={`/organizer/${secret}/sesi/${s.slug}`} className="grid min-h-11 grid-cols-[52px_1fr_auto_24px] items-center gap-3 px-4 py-2.5 text-[15px] text-ink no-underline">
                  <span className="font-display text-body font-semibold text-navy">{formatTime(s.startsAt)}</span>
                  <span className="min-w-0">{s.title}</span>
                  <span className={`whitespace-nowrap font-extrabold ${s.unanswered > 0 ? "text-coral" : "text-ink-soft"}`}>
                    {s.questions > 0 ? copy.organizer.questionsCount(s.questions) : "0"}
                  </span>
                  <IconChevronRight size={24} className="text-ink-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

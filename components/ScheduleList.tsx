import Link from "next/link";
import { formatTime } from "@/lib/time";

export type ScheduleSession = {
  slug: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  speakers: { speaker: { name: string } }[];
};

export function speakerNames(s: { speakers: { speaker: { name: string } }[] }) {
  return s.speakers.map((x) => x.speaker.name).join(", ");
}

export function ScheduleList({ sessions }: { sessions: ScheduleSession[] }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg bg-surface shadow-card">
      {sessions.map((s) => (
        <li key={s.slug}>
          <Link href={`/sesi/${s.slug}`} className="flex min-h-[var(--tap-min)] items-center gap-4 px-4 py-3">
            <span className="w-14 shrink-0 font-display text-h3 text-navy">{formatTime(s.startsAt)}</span>
            <span className="flex-1">
              <span className="block text-body font-bold text-fg">{s.title}</span>
              <span className="block text-small text-fg-soft">{speakerNames(s)}</span>
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-fg-muted" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  );
}

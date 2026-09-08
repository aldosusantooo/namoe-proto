import Link from "next/link";
import { DAY_ABBREV, formatTime, type EventDay } from "@/lib/time";
import { Avatar } from "./Avatar";
import { Card } from "./Card";
import { IconChevronRight } from "./icons/UiIcons";

export type ScheduleSession = {
  slug: string;
  title: string;
  day: number;
  startsAt: Date;
  endsAt: Date;
  speakers: { speaker: { name: string; slug?: string; photoUrl?: string | null } }[];
};

export function speakerNames(s: { speakers: { speaker: { name: string } }[] }) {
  return s.speakers.map((x) => x.speaker.name).join(", ");
}

type RowProps = {
  /** Time column text: "15.00", "Jum 13.00", or a booth code. */
  lead: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  href?: string;
  /** Replaces the chevron. */
  trailing?: React.ReactNode;
  leadClassName?: string;
  className?: string;
};

/** One list row: lead column in Fredoka navy, title Nunito 800, optional sub line, chevron or custom trailing. */
export function SchedRow({ lead, title, sub, href, trailing, leadClassName = "", className = "" }: RowProps) {
  const inner = (
    <>
      <span className={`min-w-14 shrink-0 font-display text-[20px] font-semibold leading-[1.1] text-navy tabular-nums ${leadClassName}`}>{lead}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-extrabold leading-[1.3] text-ink">{title}</span>
        {sub ? <span className="mt-1.5 flex items-center gap-2 text-small text-ink-soft">{sub}</span> : null}
      </span>
      {trailing !== undefined ? (
        <span className="flex shrink-0 items-center self-center">{trailing}</span>
      ) : href ? (
        <IconChevronRight size={22} className="shrink-0 self-center text-ink-muted" />
      ) : null}
    </>
  );
  const cls = `flex min-h-16 items-start gap-3.5 px-4 py-3.5 no-underline ${className}`;
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** Card holding rows with a 2px line between them. */
export function RowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <Card className={`flex flex-col divide-y-2 divide-line ${className}`}>{children}</Card>;
}

type ListProps = {
  sessions: ScheduleSession[];
  /** When set, sessions on another day get a three-letter day prefix in the time column ("Jum 13.00"). */
  relativeToDay?: EventDay;
};

/**
 * Talk schedule rows: time, title, speaker avatar and name, chevron to the session board.
 * The row is one stretched link; the speaker line is its own link to the speaker page (no nested anchors).
 */
export function ScheduleList({ sessions, relativeToDay }: ListProps) {
  return (
    <RowCard>
      {sessions.map((s) => {
        const prefix = relativeToDay !== undefined && s.day !== relativeToDay ? `${DAY_ABBREV[(s.day as EventDay) - 1]} ` : "";
        const first = s.speakers[0]?.speaker;
        return (
          <div key={s.slug} className="relative flex min-h-16 items-start gap-3.5 px-4 py-3.5">
            <span className="min-w-14 shrink-0 font-display text-[20px] font-semibold leading-[1.1] text-navy tabular-nums">
              {prefix}
              {formatTime(s.startsAt)}
            </span>
            <span className="min-w-0 flex-1">
              <Link href={`/sesi/${s.slug}`} className="block text-body font-extrabold leading-[1.3] text-ink no-underline after:absolute after:inset-0 after:content-['']">
                {s.title}
              </Link>
              {first ? (
                first.slug ? (
                  <Link href={`/pembicara/${first.slug}`} className="relative z-10 mt-1 inline-flex min-h-8 items-center gap-2 text-small text-ink-soft no-underline">
                    <Avatar name={first.name} photoUrl={first.photoUrl} size={24} />
                    <span className="min-w-0 truncate">{speakerNames(s)}</span>
                  </Link>
                ) : (
                  <span className="mt-1.5 flex items-center gap-2 text-small text-ink-soft">
                    <Avatar name={first.name} photoUrl={first.photoUrl} size={24} />
                    <span className="min-w-0 truncate">{speakerNames(s)}</span>
                  </span>
                )
              ) : null}
            </span>
            <IconChevronRight size={22} className="shrink-0 self-center text-ink-muted" />
          </div>
        );
      })}
    </RowCard>
  );
}

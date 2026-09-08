import Link from "next/link";
import { DAY_LABELS, EVENT_DAYS, type EventDay } from "@/lib/time";

type Props = { basePath: string; active: EventDay; anchor?: string };

/**
 * Four day tabs as links carrying ?hari=. Default day 1 has no query so the canonical URL stays clean.
 * Not rendered on Beranda any more; kept for any future filter that needs a strong day switch.
 */
export function DayTabs({ basePath, active, anchor }: Props) {
  return (
    <div role="tablist" className="grid grid-cols-4 gap-1 rounded-pill bg-cream-deep p-1">
      {EVENT_DAYS.map((day) => {
        const [name, ...rest] = DAY_LABELS[day - 1].split(" ");
        const href = `${basePath}${day === 1 ? "" : `?hari=${day}`}${anchor ? `#${anchor}` : ""}`;
        const isActive = day === active;
        return (
          <Link
            key={day}
            href={href}
            scroll={false}
            role="tab"
            aria-selected={isActive}
            className={`flex min-h-13 flex-col items-center justify-center rounded-pill px-1 text-center leading-tight ${
              isActive ? "bg-navy text-paper shadow-[0_2px_0_0_var(--color-navy-deep)]" : "text-ink-soft"
            }`}
          >
            <span className="font-display text-[15px] font-semibold">{name}</span>
            <span className="mt-0.5 text-caption font-bold">{rest.join(" ")}</span>
          </Link>
        );
      })}
    </div>
  );
}

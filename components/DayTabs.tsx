import Link from "next/link";
import { DAY_LABELS, EVENT_DAYS, type EventDay } from "@/lib/time";

type Props = { basePath: string; active: EventDay; anchor?: string };

/** Four day tabs as links carrying ?hari=. Default day 1 has no query so the canonical URL stays clean. */
export function DayTabs({ basePath, active, anchor }: Props) {
  return (
    <div role="tablist" className="grid grid-cols-4 gap-1 rounded-md bg-surface-alt p-1">
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
            className={`flex min-h-[var(--tap-min)] flex-col items-center justify-center rounded-sm px-1 py-1.5 text-center leading-tight ${
              isActive ? "bg-surface font-bold text-fg shadow-card" : "text-fg-soft"
            }`}
          >
            <span className="text-small">{name}</span>
            <span className="text-caption">{rest.join(" ")}</span>
          </Link>
        );
      })}
    </div>
  );
}

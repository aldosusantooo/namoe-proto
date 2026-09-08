import Link from "next/link";
import { copy } from "@/lib/copy";
import { IconChat, IconGift, IconGrid, IconQr } from "./icons/UiIcons";
import { TabTenant } from "./icons/TabIcons";
import { Lockup } from "./Lockup";

export type OrganizerSection = "summary" | "questions" | "tenants" | "redeem" | "booths";

const LINKS: Array<{ key: OrganizerSection; label: string; path: string; icon: React.ReactNode }> = [
  { key: "summary", label: copy.organizer.summary, path: "", icon: <IconGrid size={22} /> },
  { key: "questions", label: copy.organizer.questions, path: "/sesi", icon: <IconChat size={22} /> },
  { key: "tenants", label: copy.organizer.tenants, path: "/tenant", icon: <TabTenant size={22} /> },
  { key: "redeem", label: copy.organizer.redeem, path: "/tukar", icon: <IconGift size={22} /> },
  { key: "booths", label: copy.organizer.boothLinks, path: "/booth", icon: <IconQr size={22} /> },
];

type Props = {
  secret: string;
  active: OrganizerSection;
  title: string;
  hint?: string;
  /** Primary action top-right, usually a Button ghost sm. */
  action?: React.ReactNode;
  children: React.ReactNode;
};

/** Desktop shell: navy sidebar with the lockup and five links, cream main column. No tab bar. */
export function OrganizerShell({ secret, active, title, hint, action, children }: Props) {
  return (
    <div className="mx-auto grid min-h-screen max-w-[var(--dashboard-max)] grid-cols-[var(--dashboard-side)_1fr]">
      <aside className="flex flex-col gap-1.5 bg-navy px-4 py-[22px] text-paper print:hidden">
        <div className="px-2.5 pb-3.5">
          <Lockup variant="sidebar" />
          <span className="mt-1 block text-caption font-semibold opacity-80">{copy.organizer.title}</span>
        </div>
        <nav aria-label={copy.organizer.title} className="flex flex-col gap-1.5">
          {LINKS.map((l) => {
            const on = l.key === active;
            return (
              <Link
                key={l.key}
                href={`/organizer/${secret}${l.path}`}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2.5 rounded-[12px] px-3 font-display text-body font-semibold ${
                  on ? "bg-yellow text-ink" : "text-paper/85"
                }`}
              >
                {l.icon}
                {l.label}
              </Link>
            );
          })}
        </nav>
        <p className="mt-auto px-3 text-caption leading-snug opacity-75">
          Namoe Market, {copy.home.dates}
          <br />
          {copy.home.venue}
        </p>
      </aside>
      <main className="flex min-w-0 flex-col gap-[22px] px-8 pb-10 pt-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-ink">{title}</h1>
            {hint ? <p className="mt-1 text-body text-ink-soft">{hint}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {children}
      </main>
    </div>
  );
}

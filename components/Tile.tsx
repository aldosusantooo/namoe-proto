import Link from "next/link";
import { TAB_ICONS, type TabIconKey } from "./icons/TabIcons";

export type TileTone = "blue" | "green" | "yellow" | "coral";

const TONE: Record<TileTone, string> = {
  blue: "bg-blue text-paper active:bg-blue-deep",
  green: "bg-green text-paper active:bg-green-deep",
  yellow: "bg-yellow text-ink active:bg-yellow-deep",
  coral: "bg-coral text-paper active:bg-coral-deep",
};

type Props = { href: string; tone: TileTone; icon: TabIconKey; title: string; subtitle: string };

/** Saturated entry tile on Beranda: filled tab icon top-left, title 22, subtitle 14. No edge, no shadow. */
export function Tile({ href, tone, icon, title, subtitle }: Props) {
  const Icon = TAB_ICONS[icon].active;
  return (
    <Link
      href={href}
      className={`flex min-h-28 flex-col justify-between rounded-lg px-3.5 pb-3 pt-3.5 no-underline transition-colors duration-[var(--duration-fast)] ${TONE[tone]}`}
    >
      <Icon size={30} />
      <span className="flex flex-col gap-1">
        <span className="font-display text-[22px] font-semibold leading-none">{title}</span>
        <span className="text-small font-bold opacity-95">{subtitle}</span>
      </span>
    </Link>
  );
}

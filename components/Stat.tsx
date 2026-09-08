import { Card } from "./Card";

type Props = {
  value: number | string;
  label: string;
  /** Always present: the number alone means nothing to Theo. */
  context: string;
  /** 0 to 1. Adds the 8px progress bar used on the passport tiles. */
  progress?: number;
};

/** Organizer stat tile: number Fredoka 600 40 navy, label 800, context line, optional progress bar. */
export function Stat({ value, label, context, progress }: Props) {
  return (
    <Card className="flex flex-col gap-1 px-[18px] py-4">
      <span className="font-display text-[40px] font-semibold leading-none text-navy tabular-nums">{value}</span>
      <span className="text-[15px] font-extrabold text-ink">{label}</span>
      <span className="text-caption leading-snug text-ink-soft">{context}</span>
      {progress !== undefined ? (
        <span className="mt-2 block h-2 overflow-hidden rounded-pill bg-cream-deep" aria-hidden="true">
          <span className="block h-full rounded-pill bg-green" style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }} />
        </span>
      ) : null}
    </Card>
  );
}

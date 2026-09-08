import { copy } from "@/lib/copy";
import { Card } from "./Card";
import { Stamp, type StampData } from "./Stamp";

export type StampSlot = StampData;

type Props = {
  stamps: StampData[];
  target: number;
  /** Booth code from ?stempel= on this render; that stamp gets the "baru" treatment. Never persisted. */
  freshCode?: string | null;
};

/**
 * The passport booklet: cream card with the grid texture, `target` wavy stamp slots (3 + 2 at 390 with 88px
 * stamps), then the progress line and one sentence under it. Extra stamps past the target still show.
 */
export function StampGrid({ stamps, target, freshCode }: Props) {
  const count = stamps.length;
  const slots = Math.max(target, count);
  const done = count >= target;
  const title = count === 0 ? copy.passport.collect(target) : done ? copy.passport.done(target) : copy.passport.left(target - count);
  const body = count === 0 ? copy.passport.collectBody(target) : done ? copy.passport.keepGoing : copy.passport.leftBody(target);
  return (
    <Card as="section" className="texture-grid bg-cream px-3.5 pb-4 pt-[18px]" aria-label={copy.passport.stampsLabel}>
      <ul className="flex flex-wrap items-center justify-center px-1 py-1.5" style={{ gap: "var(--stamp-gap-y) var(--stamp-gap-x)" }}>
        {Array.from({ length: slots }, (_, i) => {
          const s = stamps[i] ?? null;
          return (
            <li key={i} className="flex">
              <Stamp slot={i + 1} stamp={s} fresh={Boolean(s && freshCode && s.code === freshCode)} />
            </li>
          );
        })}
      </ul>
      <div className="mt-4 text-center">
        <p className="font-display text-h2 text-ink">{title}</p>
        <p className="mt-1 text-body text-ink-soft">{body}</p>
      </div>
    </Card>
  );
}

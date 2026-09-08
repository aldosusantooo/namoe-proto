import { byKey, isLightHue, type CategoryKey } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { Glyph } from "./icons/Glyphs";
import { StampBurst, StampShape } from "./icons/StampShape";

export type StampData = { code: string; category: CategoryKey | null };

type Props = {
  /** 1-based slot number, shown on empty slots. */
  slot: number;
  stamp?: StampData | null;
  /** The stamp that matches ?stempel= on this render: tilted, with the yellow burst and the press animation. */
  fresh?: boolean;
};

/** One wavy passport stamp at var(--stamp-size). Empty slots are dashed cream; pressed stamps carry the category colour. */
export function Stamp({ slot, stamp, fresh = false }: Props) {
  const size = "var(--stamp-size)";
  if (!stamp) {
    return (
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} aria-label={copy.passport.slot(slot)}>
        <StampShape fill="var(--stamp-empty)" stroke="var(--stamp-empty-stroke)" strokeWidth={2.5} dashed className="absolute inset-0 h-full w-full" />
        <span className="relative font-display text-[22px] font-semibold leading-none text-ink-muted opacity-70">{slot}</span>
      </div>
    );
  }
  const info = stamp.category ? byKey(stamp.category) : null;
  const fill = info ? `var(--color-cat-${info.slug})` : "var(--color-navy)";
  const ink = info ? `var(--color-cat-${info.slug}-ink)` : "var(--color-paper)";
  const light = info ? isLightHue(info.key) : false;
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{
        width: size,
        height: size,
        color: ink,
        transform: fresh ? "rotate(var(--stamp-tilt)) scale(1.08)" : undefined,
        animation: fresh ? "stamp-press var(--duration-stamp) var(--ease-soft) both" : undefined,
      }}
      aria-label={stamp.code}
    >
      {fresh ? <StampBurst className="absolute -inset-3.5 h-[calc(100%+28px)] w-[calc(100%+28px)]" /> : null}
      <StampShape fill={fill} className="absolute inset-0 h-full w-full">
        <circle
          cx="50"
          cy="50"
          r="33"
          fill="none"
          stroke={light ? "var(--color-ink)" : "var(--color-paper)"}
          strokeOpacity={light ? 0.35 : 0.55}
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </StampShape>
      <span className="relative flex flex-col items-center leading-none">
        {info ? <Glyph slug={info.slug} size={34} /> : <span className="block h-[34px]" />}
        <b className="font-display text-small font-semibold">{stamp.code}</b>
      </span>
    </div>
  );
}

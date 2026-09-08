import { copy } from "@/lib/copy";
import { IconGift } from "./icons/UiIcons";
import { Eyebrow } from "./PageHeader";

type Props = { code: string; prizeCopy: string; redeemedAt: Date | null };

/** The prize ticket: coral, cream code at 56px, dashed perforation, tear notches at the sides, prize line below. */
export function RedeemCard({ code, prizeCopy, redeemedAt }: Props) {
  return (
    <section
      className="relative overflow-hidden rounded-lg px-[18px] pb-[18px] pt-5 text-paper"
      style={{ background: "var(--ticket-bg)" }}
      aria-label={copy.passport.complete}
    >
      <span aria-hidden="true" className="absolute -left-[13px] top-[calc(50%-13px)] size-[26px] rounded-full bg-cream" />
      <span aria-hidden="true" className="absolute -right-[13px] top-[calc(50%-13px)] size-[26px] rounded-full bg-cream" />
      <Eyebrow tone="cream">{redeemedAt ? copy.passport.redeemed : copy.passport.complete}</Eyebrow>
      <p
        className={`my-1 font-display text-code tracking-[0.08em] tabular-nums ${redeemedAt ? "line-through opacity-70" : ""}`}
        style={{ color: "var(--ticket-ink)" }}
      >
        {code}
      </p>
      {redeemedAt ? null : <p className="font-bold">{copy.passport.show}</p>}
      <div className="-mx-[18px] mt-4 flex items-center gap-3 border-t-[3px] border-dashed border-paper/50 px-[18px] pt-3.5">
        <IconGift size={30} className="shrink-0" />
        <div>
          <p className="text-small font-extrabold opacity-90">{copy.passport.prize}</p>
          <p className="font-display text-h3">{prizeCopy}</p>
        </div>
      </div>
    </section>
  );
}

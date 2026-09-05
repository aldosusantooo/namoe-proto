import { copy } from "@/lib/copy";
import { formatDay, formatTime } from "@/lib/time";
import { Card } from "./Card";

type Props = { code: string; prizeCopy: string; redeemedAt: Date | null };

export function RedeemCard({ code, prizeCopy, redeemedAt }: Props) {
  return (
    <Card as="section" className="border-t-4 border-success text-center">
      {redeemedAt ? (
        <>
          <p className="font-display text-h1 text-fg">{copy.passport.redeemed}</p>
          <p className="mt-1 text-small text-fg-soft">
            {copy.passport.redeemedAt(`${formatDay(redeemedAt)} ${formatTime(redeemedAt)}`)}
          </p>
          <p className="mt-3 font-display text-h2 tracking-[0.2em] text-fg-muted line-through">{code}</p>
        </>
      ) : (
        <>
          <p className="font-display text-h1 text-fg">{copy.passport.complete}</p>
          <p className="mt-3 font-display text-display-lg tracking-[0.25em] text-navy">{code}</p>
          <p className="mt-2 text-body text-fg-soft">{copy.passport.showCode}</p>
        </>
      )}
      <div className="mt-4 rounded-md bg-success-soft p-3 text-left">
        <p className="text-caption font-bold uppercase tracking-wide text-fg-soft">{copy.passport.prize}</p>
        <p className="mt-0.5 text-body text-fg">{prizeCopy}</p>
      </div>
    </Card>
  );
}

import { markRedeemed } from "@/actions/organizer";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Notice } from "@/components/Notice";
import { OrganizerShell } from "@/components/OrganizerShell";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";
import { normaliseRedeemCode } from "@/lib/redeem";
import { formatDay, formatTime } from "@/lib/time";

export const metadata = { title: copy.organizer.redeem };

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

const when = (d: Date) => `${formatDay(d)} ${formatTime(d)}`;

export default async function OrganizerRedeemPage({ params, searchParams }: PageProps<"/organizer/[secret]/tukar">) {
  const { secret } = await params;
  requireOrganizer(secret);
  const raw = first((await searchParams).kode) ?? "";
  const code = raw ? normaliseRedeemCode(raw) : null;
  const passport = code
    ? await db.passport.findUnique({ where: { redeemCode: code }, include: { _count: { select: { stamps: true } } } })
    : null;

  return (
    <OrganizerShell secret={secret} active="redeem" title={copy.organizer.redeem} hint={copy.organizer.redeemHint}>
      <div className="flex max-w-[520px] flex-col gap-4">
        <form method="get" className="flex gap-2">
          <input
            type="text"
            name="kode"
            defaultValue={raw}
            placeholder={copy.organizer.codeLabel}
            aria-label={copy.organizer.codeLabel}
            autoCapitalize="characters"
            autoComplete="off"
            maxLength={8}
            className="h-12 min-w-0 flex-1 rounded-[12px] border-2 border-edge bg-paper px-3.5 font-display text-[22px] tracking-[0.1em] text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
          />
          <Button type="submit" variant="primary">
            {copy.organizer.check}
          </Button>
        </form>

        {raw && !passport ? <Notice tone="warn">{copy.organizer.notFound}</Notice> : null}

        {passport && code ? (
          <Card as="section" pad className="flex flex-col gap-4">
            {passport.redeemedAt ? (
              <Notice tone="warn">{copy.organizer.alreadyRedeemed}</Notice>
            ) : (
              <Notice tone="ok">{copy.organizer.codeValid(passport._count.stamps)}</Notice>
            )}
            <p className="font-display text-code tracking-[0.1em] text-navy tabular-nums">{code}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-body">
              <dt className="text-ink-muted">{copy.organizer.stats.passportsDone}</dt>
              <dd className="text-ink">{copy.organizer.stampCount(passport._count.stamps)}</dd>
              <dt className="text-ink-muted">{copy.organizer.completedAt}</dt>
              <dd className="text-ink">{passport.completedAt ? when(passport.completedAt) : "-"}</dd>
              <dt className="text-ink-muted">{copy.organizer.redeemedAt}</dt>
              <dd className="text-ink">{passport.redeemedAt ? when(passport.redeemedAt) : copy.organizer.notRedeemed}</dd>
            </dl>
            {passport.redeemedAt ? null : (
              <form action={markRedeemed.bind(null, secret, passport.id)}>
                <Button type="submit" variant="coral">
                  {copy.organizer.markRedeemed}
                </Button>
              </form>
            )}
          </Card>
        ) : null}
      </div>
    </OrganizerShell>
  );
}

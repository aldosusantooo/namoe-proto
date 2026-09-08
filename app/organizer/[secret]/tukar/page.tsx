import { markRedeemed } from "@/actions/organizer";
import { Card } from "@/components/Card";
import { Notice } from "@/components/Notice";
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
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="font-display text-display text-fg">{copy.organizer.redeem}</h1>

      <form method="get" className="flex gap-2">
        <input
          type="text"
          name="kode"
          defaultValue={raw}
          placeholder={copy.organizer.codeLabel}
          aria-label={copy.organizer.codeLabel}
          autoCapitalize="characters"
          autoComplete="off"
          className="h-12 min-w-0 flex-1 rounded-md border border-border bg-surface px-4 font-display text-h2 uppercase tracking-[0.15em] text-fg focus:border-primary focus:outline-none"
        />
        <button type="submit" className="inline-flex h-12 items-center rounded-pill bg-primary px-5 font-bold text-on-primary">
          {copy.organizer.check}
        </button>
      </form>

      {raw && !passport ? <Notice tone="warn">{copy.organizer.notFound}</Notice> : null}

      {passport && code ? (
        <Card as="section" className="flex flex-col gap-4">
          <p className="font-display text-display-lg tracking-[0.25em] text-navy">{code}</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-body">
            <dt className="text-fg-muted">{copy.organizer.stats.passportsDone}</dt>
            <dd className="text-fg">{copy.organizer.stampCount(passport._count.stamps)}</dd>
            <dt className="text-fg-muted">{copy.organizer.completedAt}</dt>
            <dd className="text-fg">{passport.completedAt ? when(passport.completedAt) : "-"}</dd>
            <dt className="text-fg-muted">{copy.organizer.redeemedAt}</dt>
            <dd className="text-fg">{passport.redeemedAt ? when(passport.redeemedAt) : copy.organizer.notRedeemed}</dd>
          </dl>
          {passport.redeemedAt ? (
            <Notice tone="warn">{copy.organizer.alreadyRedeemed}</Notice>
          ) : (
            <form action={markRedeemed.bind(null, secret, passport.id)}>
              <button type="submit" className="inline-flex min-h-[var(--tap-min)] items-center rounded-pill bg-success px-5 font-bold text-white">
                {copy.organizer.markRedeemed}
              </button>
            </form>
          )}
        </Card>
      ) : null}
    </div>
  );
}

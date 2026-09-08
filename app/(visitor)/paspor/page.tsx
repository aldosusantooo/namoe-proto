import Link from "next/link";
import { Card } from "@/components/Card";
import { Empty } from "@/components/Empty";
import { Notice } from "@/components/Notice";
import { RedeemCard } from "@/components/RedeemCard";
import { StampGrid } from "@/components/StampGrid";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { getOrCreateDeviceId } from "@/lib/device-server";
import { getEvent } from "@/lib/event";
import { progress } from "@/lib/passport";
import { formatDay, formatTime } from "@/lib/time";

export const metadata = { title: copy.passport.title };

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function PassportPage({ searchParams }: PageProps<"/paspor">) {
  const params = await searchParams;
  const deviceId = await getOrCreateDeviceId();
  const [event, passport] = await Promise.all([
    getEvent(),
    db.passport.upsert({
      where: { deviceId },
      create: { deviceId },
      update: {},
      include: {
        stamps: {
          orderBy: { createdAt: "asc" },
          include: { booth: { select: { code: true, tenant: { select: { slug: true, name: true, category: true } } } } },
        },
      },
    }),
  ]);

  const stamps = passport.stamps.map((s) => ({ code: s.boothCode, category: s.booth.tenant?.category ?? null }));
  const p = progress(stamps.length, event.passportTarget);
  const stamped = first(params.stempel);
  const already = first(params.sudah);
  const unknown = first(params.salah);

  return (
    <div className="flex flex-col gap-5 pt-6">
      <header>
        <h1 className="font-display text-display text-fg">{copy.passport.title}</h1>
        <p className="mt-1 text-body text-fg-soft">{copy.passport.collect(event.passportTarget)}</p>
      </header>

      {stamped ? <Notice tone="ok">{copy.passport.newStampEmpty(stamped)}</Notice> : null}
      {already ? <Notice tone="warn">{copy.passport.already(already)}</Notice> : null}
      {unknown ? <Notice tone="warn">{copy.passport.unknown}</Notice> : null}

      {p.done && passport.redeemCode ? (
        <RedeemCard code={passport.redeemCode} prizeCopy={event.prizeCopy} redeemedAt={passport.redeemedAt} />
      ) : null}

      <Card as="section" className="flex flex-col items-center gap-4 py-6 texture-grid">
        <StampGrid stamps={stamps} target={event.passportTarget} />
        <p className="font-display text-h2 text-fg">{copy.passport.progress(Math.min(p.count, p.target), p.target)}</p>
        {!p.done ? <p className="text-center text-small text-fg-soft">{copy.passport.howBody}</p> : null}
      </Card>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-h1 text-fg">{copy.passport.visited}</h2>
        {passport.stamps.length ? (
          <ul className="divide-y divide-border overflow-hidden rounded-lg bg-surface shadow-card">
            {passport.stamps.map((s) => {
              const inner = (
                <>
                  <span className="w-12 shrink-0 font-display text-h3 text-navy">{s.boothCode}</span>
                  <span className="flex-1">
                    <span className="block text-body font-bold text-fg">{s.booth.tenant?.name ?? copy.map.empty}</span>
                    <span className="block text-small text-fg-soft">
                      {formatDay(s.createdAt)} {formatTime(s.createdAt)}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={s.boothCode}>
                  {s.booth.tenant ? (
                    <Link href={`/tenant/${s.booth.tenant.slug}`} className="flex min-h-[var(--tap-min)] items-center gap-4 px-4 py-3">
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex min-h-[var(--tap-min)] items-center gap-4 px-4 py-3">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty kind="stamps" title={copy.passport.how} body={copy.passport.howBody} />
        )}
      </section>
    </div>
  );
}

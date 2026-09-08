import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Pill } from "@/components/CategoryBadge";
import { MascotBiru, MascotHijau, MascotMerah, MascotOranye, MascotPink } from "@/components/icons/Mascots";
import { TabTenant } from "@/components/icons/TabIcons";
import { IconCheck } from "@/components/icons/UiIcons";
import { Notice } from "@/components/Notice";
import { PageHeader, SectionHeader } from "@/components/PageHeader";
import { RedeemCard } from "@/components/RedeemCard";
import { RowCard, SchedRow } from "@/components/ScheduleList";
import { StampGrid } from "@/components/StampGrid";
import { byKey } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { getOrCreateDeviceId } from "@/lib/device-server";
import { getEvent } from "@/lib/event";
import { progress } from "@/lib/passport";

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
  const stamped = first(params.stempel)?.toUpperCase();
  const already = first(params.sudah)?.toUpperCase();
  const unknown = first(params.salah);
  const stampedTenant = stamped ? passport.stamps.find((s) => s.boothCode === stamped)?.booth.tenant?.name : undefined;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={copy.passport.title}
        action={
          p.done ? (
            <Pill tone="green">
              <IconCheck size={16} />
              {copy.passport.completePill}
            </Pill>
          ) : (
            <Pill tone="outline">{copy.passport.progressShort(p.count, p.target)}</Pill>
          )
        }
      />

      {stamped ? <Notice tone="ok">{stampedTenant ? copy.passport.newStamp(stampedTenant, stamped) : copy.passport.newStampEmpty(stamped)}</Notice> : null}
      {already ? <Notice tone="warn">{copy.passport.already(already)}</Notice> : null}
      {unknown ? <Notice tone="warn">{copy.passport.unknown}</Notice> : null}

      {p.done && passport.redeemCode ? (
        <>
          <div aria-hidden="true" className="-mb-2.5 -mt-1 flex justify-center gap-1">
            <MascotBiru size={56} />
            <MascotMerah size={56} className="mt-2.5" />
            <MascotHijau size={56} />
            <MascotPink size={56} className="mt-2.5" />
            <MascotOranye size={56} />
          </div>
          <RedeemCard code={passport.redeemCode} prizeCopy={event.prizeCopy} redeemedAt={passport.redeemedAt} />
        </>
      ) : null}

      <StampGrid stamps={stamps} target={event.passportTarget} freshCode={stamped} />

      {p.count === 0 ? (
        <>
          <Card pad className="flex items-center gap-3.5">
            <MascotHijau size={64} className="shrink-0" />
            <div>
              <p className="font-bold text-ink">{copy.passport.how}</p>
              <p className="text-small text-ink-soft">{copy.passport.howBody}</p>
            </div>
          </Card>
          <Button href="/tenant" variant="primary" block>
            <TabTenant size={22} />
            {copy.passport.seeBooths}
          </Button>
        </>
      ) : (
        <section className="flex flex-col gap-2.5">
          <SectionHeader title={copy.passport.visited} />
          <RowCard>
            {passport.stamps.map((s) => (
              <SchedRow
                key={s.boothCode}
                href={s.booth.tenant ? `/tenant/${s.booth.tenant.slug}` : undefined}
                lead={s.boothCode}
                leadClassName="text-[16px] self-center"
                title={s.booth.tenant?.name ?? copy.map.empty}
                sub={s.booth.tenant ? byKey(s.booth.tenant.category).label : undefined}
                className="items-center"
              />
            ))}
          </RowCard>
        </section>
      )}
    </div>
  );
}

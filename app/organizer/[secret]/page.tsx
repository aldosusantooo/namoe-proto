import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { IconQr } from "@/components/icons/UiIcons";
import { OrganizerSessionDays } from "@/components/OrganizerSessionDays";
import { OrganizerShell } from "@/components/OrganizerShell";
import { OrganizerTenantList } from "@/components/OrganizerTenantList";
import { Stat } from "@/components/Stat";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";
import { loadSummary } from "@/lib/organizer-stats";

export const metadata = { title: copy.organizer.summary };

const TENANT_PREVIEW = 6;

export default async function OrganizerHomePage({ params }: PageProps<"/organizer/[secret]">) {
  const { secret } = await params;
  requireOrganizer(secret);

  const [summary, sessions, tenants, tenantTotal] = await Promise.all([
    loadSummary(),
    db.session.findMany({
      select: {
        slug: true,
        title: true,
        day: true,
        startsAt: true,
        questions: { where: { kind: "QUESTION", hidden: false }, select: { answered: true } },
      },
    }),
    db.tenant.findMany({
      orderBy: { name: "asc" },
      take: TENANT_PREVIEW,
      select: { slug: true, name: true, category: true, logoUrl: true, editToken: true, booths: { select: { code: true } } },
    }),
    db.tenant.count(),
  ]);

  const rows = sessions.map((s) => ({
    slug: s.slug,
    title: s.title,
    day: s.day,
    startsAt: s.startsAt,
    questions: s.questions.length,
    unanswered: s.questions.filter((q) => !q.answered).length,
  }));

  return (
    <OrganizerShell
      secret={secret}
      active="summary"
      title={copy.organizer.summary}
      hint={copy.organizer.summaryHint}
      action={
        <Button href={`/organizer/${secret}/booth`} variant="ghost" sm>
          <IconQr size={20} />
          {copy.organizer.printQr}
        </Button>
      }
    >
      <div className="grid grid-cols-4 gap-3.5">
        <Stat value={summary.tenants} label={copy.organizer.stats.tenants} context={copy.organizer.stats.tenantsContext(summary.booths, summary.boothsEmpty)} />
        <Stat
          value={summary.questions}
          label={copy.organizer.stats.questions}
          context={copy.organizer.stats.questionsContext(summary.sessionsWithQuestions, summary.sessionsTotal, summary.questionsAnswered)}
        />
        <Stat
          value={summary.passports}
          label={copy.organizer.stats.passportsStarted}
          context={copy.organizer.stats.passportsStartedContext(summary.avgStamps)}
          progress={summary.passports ? summary.stamps / (summary.passports * 5) : 0}
        />
        <Stat
          value={summary.passportsDone}
          label={copy.organizer.stats.passportsDone}
          context={copy.organizer.stats.passportsDoneContext(summary.redeemed)}
          progress={summary.passports ? summary.passportsDone / summary.passports : 0}
        />
      </div>

      <div className="grid grid-cols-[1fr_340px] items-start gap-5">
        <section>
          <div className="mb-2.5 flex items-center gap-2.5">
            <h2 className="flex-1 font-display text-h2 text-ink">{copy.organizer.sessions}</h2>
            <span className="text-small text-ink-soft">{copy.organizer.sessionsHint}</span>
          </div>
          <OrganizerSessionDays secret={secret} sessions={rows} />
        </section>
        <div className="flex flex-col gap-[18px]">
          <Card as="section" className="p-[18px]">
            <h2 className="font-display text-h2 text-ink">{copy.organizer.redeem}</h2>
            <p className="mt-1 text-small text-ink-soft">{copy.organizer.redeemHint}</p>
            <form method="get" action={`/organizer/${secret}/tukar`} className="mt-3 flex gap-2">
              <input
                type="text"
                name="kode"
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
          </Card>
          <OrganizerTenantList secret={secret} tenants={tenants} total={tenantTotal} />
        </div>
      </div>
    </OrganizerShell>
  );
}

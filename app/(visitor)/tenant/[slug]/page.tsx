import { notFound } from "next/navigation";
import { postTenantQuestion } from "@/actions/tenant-board";
import { after } from "next/server";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { QuestionForm } from "@/components/QuestionForm";
import { Card } from "@/components/Card";
import { BoothPill, CategoryBadge } from "@/components/CategoryBadge";
import { LinkChip } from "@/components/Chip";
import { Empty } from "@/components/Empty";
import { IconGift, IconInstagram, IconMarketplace, IconPin, IconTiktok } from "@/components/icons/UiIcons";
import { MiniMap } from "@/components/MiniMap";
import { Eyebrow, SectionHeader } from "@/components/PageHeader";
import { PhotoStrip } from "@/components/PhotoStrip";
import { PlaceholderArt } from "@/components/PlaceholderArt";
import { RowCard, SchedRow } from "@/components/ScheduleList";
import { TenantBoard } from "@/components/TenantBoard";
import { boothLabel, primaryCode, sortCodes } from "@/lib/booth-label";
import { locationHint } from "@/lib/booth-location";
import { catVar } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { loadMapBooths } from "@/lib/map-data";
import { marketplaceLabel, socialUrl } from "@/lib/social";
import { DAY_LABELS, type EventDay } from "@/lib/time";

export async function generateMetadata({ params }: PageProps<"/tenant/[slug]">) {
  const { slug } = await params;
  const tenant = await db.tenant.findUnique({ where: { slug }, select: { name: true } });
  return { title: tenant?.name ?? copy.tenant.notFound };
}

export default async function TenantPage({ params }: PageProps<"/tenant/[slug]">) {
  const { slug } = await params;
  const tenant = await db.tenant.findUnique({
    where: { slug },
    include: {
      booths: { select: { code: true } },
      slots: { orderBy: { order: "asc" } },
      posts: { where: { hidden: false }, orderBy: [{ pinned: "desc" }, { createdAt: "desc" }] },
    },
  });
  if (!tenant) notFound();
  const mapBooths = await loadMapBooths();

  after(async () => {
    await db.tenant.update({ where: { id: tenant.id }, data: { viewCount: { increment: 1 } } });
  });

  const codes = sortCodes(tenant.booths.map((b) => b.code));
  const primary = primaryCode(codes);
  const firstBooth = mapBooths.find((b) => b.code === primary);
  const promoVisible = Boolean(tenant.promo) && tenant.promoVisible;

  const links: { href: string; label: string; icon: React.ReactNode }[] = [];
  if (tenant.instagram) links.push({ href: socialUrl("instagram", tenant.instagram), label: copy.tenant.instagram, icon: <IconInstagram size={22} /> });
  if (tenant.tiktok) links.push({ href: socialUrl("tiktok", tenant.tiktok), label: copy.tenant.tiktok, icon: <IconTiktok size={22} /> });
  if (tenant.marketplace) links.push({ href: tenant.marketplace, label: marketplaceLabel(tenant.marketplace), icon: <IconMarketplace size={22} /> });

  return (
    <article className="flex flex-col gap-4">
      <div className="relative -mx-[var(--page-gutter)] -mt-4">
        <div className="edge-wavy-bottom h-[var(--hero-art-height)] overflow-hidden">
          {tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <PlaceholderArt name={tenant.name} category={tenant.category} variant="hero" />
          )}
        </div>
        <BackButton fallback="/tenant" className="absolute left-3 top-3" />
      </div>

      <div className="-mt-1.5 flex flex-col gap-2.5">
        <header className="flex min-h-12 items-center gap-2.5">
          <h1 className="min-w-0 flex-1 font-display text-h1 text-ink">{tenant.name}</h1>
          {codes.length ? (
            <BoothPill>
              <IconPin size={16} />
              {codes.join(", ")}
            </BoothPill>
          ) : null}
        </header>
        <div>
          <CategoryBadge category={tenant.category} />
        </div>
      </div>

      <PhotoStrip photos={tenant.photos} name={tenant.name} />

      <p className="text-body text-ink">{tenant.intro}</p>

      {promoVisible ? (
        <section className="flex items-center gap-3 rounded-lg bg-yellow px-4 py-3.5 text-ink">
          <IconGift size={30} className="shrink-0" />
          <div>
            <Eyebrow tone="ink">{copy.tenant.promo}</Eyebrow>
            <p className="font-display text-h3">{tenant.promo}</p>
          </div>
        </section>
      ) : null}

      {codes.length && primary ? (
        <Card as="section">
          <MiniMap booths={mapBooths} codes={codes} title={copy.tenant.boothLine(boothLabel(codes))} />
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-body font-extrabold text-ink">{copy.tenant.boothLine(boothLabel(codes))}</p>
              {firstBooth ? <p className="text-small text-ink-soft">{locationHint(firstBooth)}</p> : null}
            </div>
            <Button href={`/peta?booth=${primary}`} variant="ghost" sm>
              {copy.tenant.openMap}
            </Button>
          </div>
        </Card>
      ) : null}

      {tenant.slots.length ? (
        <section className="flex flex-col gap-2.5">
          <SectionHeader title={copy.tenant.atBooth} />
          <RowCard>
            {tenant.slots.map((s) => (
              <SchedRow
                key={s.id}
                lead={s.time ?? copy.tenant.allDay}
                leadClassName={s.time ? "" : "text-[16px]"}
                title={s.label}
                sub={s.day ? DAY_LABELS[(s.day as EventDay) - 1] : copy.tenant.everyDay}
              />
            ))}
          </RowCard>
        </section>
      ) : null}

      {links.length ? (
        <ul className="flex flex-wrap gap-2">
          {links.map((l) => (
            <li key={l.href}>
              <LinkChip href={l.href} icon={l.icon}>
                {l.label}
              </LinkChip>
            </li>
          ))}
        </ul>
      ) : null}

      <section className="flex flex-col gap-2.5">
        <SectionHeader title={copy.tenant.ask} />
        {tenant.posts.length ? (
          <TenantBoard posts={tenant.posts} accent={catVar(tenant.category)} />
        ) : (
          <Empty kind="questions" title={copy.tenant.askEmptyTitle} body={copy.tenant.askEmptyBody} />
        )}
        <QuestionForm trigger="button" action={postTenantQuestion} fields={{ tenantSlug: tenant.slug }} placeholder={copy.tenant.askPlaceholder} buttonLabel={copy.tenant.askWrite} />
      </section>
    </article>
  );
}

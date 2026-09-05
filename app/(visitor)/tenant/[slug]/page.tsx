import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { Card } from "@/components/Card";
import { CategoryBadge } from "@/components/CategoryBadge";
import { boothLabel, primaryCode } from "@/lib/booth-label";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { formatDay } from "@/lib/time";

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

  after(async () => {
    await db.tenant.update({ where: { id: tenant.id }, data: { viewCount: { increment: 1 } } });
  });

  const codes = tenant.booths.map((b) => b.code);
  const primary = primaryCode(codes);
  const socials: { label: string; href: string }[] = [];
  if (tenant.instagram) socials.push({ label: copy.tenant.instagram, href: `https://instagram.com/${tenant.instagram}` });
  if (tenant.tiktok) socials.push({ label: copy.tenant.tiktok, href: `https://www.tiktok.com/@${tenant.tiktok}` });
  if (tenant.marketplace) socials.push({ label: copy.tenant.shop, href: tenant.marketplace });

  return (
    <article className="flex flex-col gap-6 pt-6">
      <header className="flex items-center gap-4">
        <img
          src={tenant.logoUrl ?? `/img/${tenant.slug}?logo=1`}
          alt=""
          loading="lazy"
          className="size-16 shrink-0 rounded-full bg-surface-alt object-cover"
        />
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-display leading-tight text-fg">{tenant.name}</h1>
          <CategoryBadge category={tenant.category} className="self-start" />
        </div>
      </header>

      {tenant.photos.length ? (
        <ul className="-mx-[var(--page-gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--page-gutter)] [scrollbar-width:none]">
          {tenant.photos.slice(0, 5).map((src, i) => (
            <li key={src} className="w-[72%] shrink-0 snap-start">
              <img src={src} alt={`${tenant.name} ${i + 1}`} loading="lazy" className="aspect-square w-full rounded-lg bg-surface-alt object-cover" />
            </li>
          ))}
        </ul>
      ) : null}

      <p className="text-lead text-fg">{tenant.intro}</p>

      {tenant.promo ? (
        <Card as="section" className="bg-accent-soft shadow-none">
          <h2 className="text-caption font-bold uppercase tracking-wide text-accent">{copy.tenant.promo}</h2>
          <p className="mt-1 font-display text-h2 text-fg">{tenant.promo}</p>
        </Card>
      ) : null}

      {codes.length ? (
        <Card as="section" className="flex flex-col gap-3">
          <div id="minimap-slot" className="aspect-[1200/680] w-full rounded-md bg-surface-alt" />
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-h2 text-fg">{copy.tenant.booth(boothLabel(codes))}</p>
            <Link href={`/peta?booth=${primary}`} className="flex min-h-[var(--tap-min)] items-center text-small font-bold text-link">
              {copy.tenant.seeOnMap}
            </Link>
          </div>
        </Card>
      ) : null}

      {tenant.slots.length ? (
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-h1 text-fg">{copy.tenant.atBooth}</h2>
          <ul className="divide-y divide-border overflow-hidden rounded-lg bg-surface shadow-card">
            {tenant.slots.map((s) => (
              <li key={s.id} className="flex items-baseline gap-4 px-4 py-3">
                <span className="w-24 shrink-0 font-display text-h3 text-navy">{s.time ?? copy.tenant.allDay}</span>
                <span className="text-body text-fg">{s.label}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {socials.length ? (
        <ul className="flex flex-wrap gap-2">
          {socials.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[var(--tap-min)] items-center rounded-pill border border-border bg-surface px-4 text-small font-bold text-fg"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-h1 text-fg">{copy.tenant.ask}</h2>
        {tenant.posts.length ? (
          <ul className="flex flex-col gap-3">
            {tenant.posts.map((p) => (
              <li key={p.id}>
                <Card>
                  {p.pinned ? (
                    <p className="mb-1 text-caption font-bold uppercase tracking-wide text-primary">{copy.tenant.pinned}</p>
                  ) : null}
                  <p className="text-body text-fg">{p.body}</p>
                  <p className="mt-1 text-caption text-fg-muted">
                    {p.displayName ?? copy.tenant.anon}, {formatDay(p.createdAt)}
                  </p>
                  {p.reply ? (
                    <div className="mt-3 rounded-md bg-primary-soft p-3">
                      <p className="text-caption font-bold text-navy">{copy.tenant.reply}</p>
                      <p className="mt-0.5 text-body text-fg">{p.reply}</p>
                    </div>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="rounded-lg border border-dashed border-line-strong bg-surface-alt p-4">
          <textarea
            disabled
            rows={2}
            aria-label={copy.tenant.ask}
            className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-body text-fg-muted"
            placeholder={copy.tenant.askSoon}
          />
          <p className="mt-2 text-small text-fg-muted">{copy.tenant.askSoon}</p>
        </div>
      </section>
    </article>
  );
}

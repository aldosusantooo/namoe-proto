import Link from "next/link";
import { setFeedPostHidden } from "@/actions/organizer";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { FeedCard } from "@/components/FeedCard";
import { IconChevronRight } from "@/components/icons/UiIcons";
import { OrganizerShell } from "@/components/OrganizerShell";
import { Eyebrow } from "@/components/PageHeader";
import { PlaceholderArt } from "@/components/PlaceholderArt";
import { sortCodes } from "@/lib/booth-label";
import { byKey } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";
import { postsPerDay } from "@/lib/organizer-stats";
import { DAY_LABELS, EVENT_DAYS } from "@/lib/time";

export const metadata = { title: copy.organizer.tenants };

export default async function OrganizerTenantsPage({ params }: PageProps<"/organizer/[secret]/tenant">) {
  const { secret } = await params;
  requireOrganizer(secret);
  const [tenants, visitorPosts, allFeed] = await Promise.all([
    db.tenant.findMany({
      orderBy: { name: "asc" },
      select: {
        slug: true,
        name: true,
        category: true,
        logoUrl: true,
        editToken: true,
        viewCount: true,
        booths: { select: { code: true } },
        _count: { select: { posts: true, feedPosts: true } },
      },
    }),
    db.feedPost.findMany({
      where: { authorTenantId: null },
      orderBy: { createdAt: "desc" },
      select: { id: true, body: true, photoUrl: true, displayName: true, hidden: true },
    }),
    db.feedPost.findMany({ select: { createdAt: true } }),
  ]);
  const perDay = postsPerDay(allFeed.map((p) => p.createdAt));

  return (
    <OrganizerShell secret={secret} active="tenants" title={copy.organizer.tenants} hint={copy.organizer.tenantsHint}>
      <div className="grid grid-cols-[1fr_340px] items-start gap-5">
        <Card>
          <ul className="divide-y-2 divide-line">
            {tenants.map((t) => {
              const codes = sortCodes(t.booths.map((b) => b.code));
              return (
                <li key={t.slug} className="grid grid-cols-[40px_1fr_auto_auto_auto_24px] items-center gap-3 px-4 py-2 text-small">
                  <span className="size-10 overflow-hidden rounded-[10px]">
                    {t.logoUrl ? <img src={t.logoUrl} alt="" className="h-full w-full object-cover" /> : <PlaceholderArt name={t.name} category={t.category} variant="thumb" />}
                  </span>
                  <span className="min-w-0">
                    <Link href={`/organizer/${secret}/tenant/${t.slug}`} className="block truncate font-bold text-ink">
                      {t.name}
                    </Link>
                    <span className="block truncate text-ink-soft">
                      {byKey(t.category).label}, {codes.join(", ")}
                    </span>
                  </span>
                  <span className="whitespace-nowrap text-right text-ink-soft">
                    <span className="block font-extrabold text-ink">{copy.organizer.views(t.viewCount)}</span>
                    <span className="block">
                      {copy.organizer.posts(t._count.posts)}, {copy.organizer.feedPosts(t._count.feedPosts)}
                    </span>
                  </span>
                  <Eyebrow href={`/t/${t.editToken}/edit`}>{copy.organizer.editLink}</Eyebrow>
                  <Eyebrow href={`/organizer/${secret}/booth/cetak?booth=${codes[0] ?? ""}`}>{copy.organizer.qr}</Eyebrow>
                  <Link href={`/organizer/${secret}/tenant/${t.slug}`} aria-label={t.name} className="text-ink-muted">
                    <IconChevronRight size={24} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="flex flex-col gap-[18px]">
          <Card as="section">
            <h2 className="border-b-2 border-line bg-cream px-4 py-3 font-display text-[17px] font-semibold text-ink">{copy.organizer.postsPerDay}</h2>
            <ul className="divide-y-2 divide-line">
              {EVENT_DAYS.map((day) => (
                <li key={day} className="flex items-center justify-between px-4 py-2 text-small">
                  <span className="text-ink">{DAY_LABELS[day - 1]}</span>
                  <span className="font-extrabold text-ink">{copy.organizer.feedPosts(perDay[day])}</span>
                </li>
              ))}
              <li className="flex items-center justify-between px-4 py-2 text-small">
                <span className="text-ink-soft">{copy.organizer.outsideEvent}</span>
                <span className="font-extrabold text-ink-soft">{copy.organizer.feedPosts(perDay.other)}</span>
              </li>
            </ul>
          </Card>

          <section className="flex flex-col gap-2.5">
            <h2 className="font-display text-h2 text-ink">
              {copy.organizer.visitorFeed} <span className="text-ink-soft">{visitorPosts.length}</span>
            </h2>
            {visitorPosts.map((p) => (
              <div key={p.id} className={p.hidden ? "opacity-60" : ""}>
                <FeedCard
                  post={{ ...p, authorTenant: null }}
                  trailing={
                    <form action={setFeedPostHidden.bind(null, secret, p.id, !p.hidden)}>
                      <Button type="submit" variant="ghost" sm>
                        {p.hidden ? copy.organizer.show : copy.organizer.hide}
                      </Button>
                    </form>
                  }
                />
              </div>
            ))}
          </section>
        </div>
      </div>
    </OrganizerShell>
  );
}

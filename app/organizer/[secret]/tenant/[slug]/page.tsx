import { notFound } from "next/navigation";
import { setFeedPostHidden, setTenantPostHidden } from "@/actions/organizer";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Pill } from "@/components/CategoryBadge";
import { Empty } from "@/components/Empty";
import { FeedCard } from "@/components/FeedCard";
import { IconExternalLink, IconPin } from "@/components/icons/UiIcons";
import { OrganizerShell } from "@/components/OrganizerShell";
import { QuestionRowView } from "@/components/QuestionList";
import { sortCodes } from "@/lib/booth-label";
import { byKey } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";

export default async function OrganizerTenantPage({ params }: PageProps<"/organizer/[secret]/tenant/[slug]">) {
  const { secret, slug } = await params;
  requireOrganizer(secret);
  const tenant = await db.tenant.findUnique({
    where: { slug },
    include: {
      booths: { select: { code: true } },
      posts: { orderBy: [{ pinned: "desc" }, { createdAt: "desc" }] },
      feedPosts: { orderBy: { createdAt: "desc" }, select: { id: true, body: true, photoUrl: true, displayName: true, hidden: true } },
    },
  });
  if (!tenant) notFound();
  const codes = sortCodes(tenant.booths.map((b) => b.code));
  const meta = `${byKey(tenant.category).label}, ${codes.join(", ")}. ${copy.organizer.views(tenant.viewCount)}.`;

  return (
    <OrganizerShell
      secret={secret}
      active="tenants"
      title={tenant.name}
      hint={meta}
      action={
        <div className="flex gap-2">
          <Button href={`/t/${tenant.editToken}/edit`} variant="ghost" sm>
            {copy.organizer.editLink}
          </Button>
          <Button href={`/tenant/${tenant.slug}`} variant="ghost" sm>
            <IconExternalLink size={20} />
            {copy.common.open}
          </Button>
        </div>
      }
    >
      <div className="grid max-w-[760px] gap-6">
        <section className="flex flex-col gap-2.5">
          <h2 className="font-display text-h2 text-ink">
            {copy.tenant.ask} <span className="text-ink-soft">{tenant.posts.length}</span>
          </h2>
          {tenant.posts.length ? (
            <Card>
              <ul className="divide-y-2 divide-line">
                {tenant.posts.map((p) => (
                  <li key={p.id} className={p.hidden ? "opacity-60" : ""}>
                    <QuestionRowView
                      q={p}
                      trailing={
                        p.pinned ? (
                          <Pill tone="yellow">
                            <IconPin size={16} />
                            {copy.tenant.pinned}
                          </Pill>
                        ) : p.hidden ? (
                          <Pill tone="outline">{copy.organizer.hiddenTag}</Pill>
                        ) : undefined
                      }
                    >
                      {p.reply ? (
                        <div className="rounded-md bg-cream px-3 py-2.5">
                          <p className="text-small font-extrabold text-ink-soft">{copy.tenant.reply}</p>
                          <p className="text-body text-ink">{p.reply}</p>
                        </div>
                      ) : null}
                      <form action={setTenantPostHidden.bind(null, secret, p.id, !p.hidden)}>
                        <Button type="submit" variant="ghost" sm>
                          {p.hidden ? copy.organizer.show : copy.organizer.hide}
                        </Button>
                      </form>
                    </QuestionRowView>
                  </li>
                ))}
              </ul>
            </Card>
          ) : (
            <Empty kind="questions" title={copy.tenantEdit.postsEmptyTitle} body={copy.tenantEdit.postsEmptyBody} />
          )}
        </section>

        <section className="flex flex-col gap-2.5">
          <h2 className="font-display text-h2 text-ink">
            {copy.feed.title} <span className="text-ink-soft">{tenant.feedPosts.length}</span>
          </h2>
          {tenant.feedPosts.length ? (
            <ul className="grid gap-3 md:grid-cols-2">
              {tenant.feedPosts.map((p) => (
                <li key={p.id} className={p.hidden ? "opacity-60" : ""}>
                  <FeedCard
                    post={{ ...p, authorTenant: { slug: tenant.slug, name: tenant.name, category: tenant.category } }}
                    trailing={
                      <form action={setFeedPostHidden.bind(null, secret, p.id, !p.hidden)}>
                        <Button type="submit" variant="ghost" sm>
                          {p.hidden ? copy.organizer.show : copy.organizer.hide}
                        </Button>
                      </form>
                    }
                  />
                </li>
              ))}
            </ul>
          ) : (
            <Empty kind="feed" title={copy.tenantEdit.feedEmptyTitle} body={copy.tenantEdit.feedEmptyBody} />
          )}
        </section>
      </div>
    </OrganizerShell>
  );
}

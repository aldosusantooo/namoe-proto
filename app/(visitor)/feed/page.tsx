import { postFeedAsVisitor } from "@/actions/feed";
import { Empty } from "@/components/Empty";
import { FeedCard } from "@/components/FeedCard";
import { FeedHeader } from "@/components/FeedHeader";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";

export const metadata = { title: copy.feed.title };

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function FeedPage({ searchParams }: PageProps<"/feed">) {
  const openComposer = first((await searchParams).tulis) === "1";
  const posts = await db.feedPost.findMany({
    where: { hidden: false },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, body: true, photoUrl: true, displayName: true, authorTenant: { select: { slug: true, name: true, category: true } } },
  });

  return (
    <div className="flex flex-col gap-4">
      <FeedHeader postFeed={postFeedAsVisitor} initialOpen={openComposer} />
      {posts.length ? (
        <ul className="flex flex-col gap-3">
          {posts.map((p) => (
            <li key={p.id}>
              <FeedCard post={p} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty kind="feed" title={copy.feed.emptyTitle} body={copy.feed.emptyBody} />
      )}
    </div>
  );
}

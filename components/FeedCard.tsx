import type { Category } from "@prisma/client";
import { copy } from "@/lib/copy";
import { Card } from "./Card";
import { CategoryBadge } from "./CategoryBadge";

export type FeedItem = {
  id: string;
  body: string;
  photoUrl: string | null;
  displayName: string | null;
  authorTenant: { slug: string; name: string; category: Category } | null;
};

/** One feed post: photo at 4:3 when present, one line of text, byline with the tenant badge or the visitor's name. */
export function FeedCard({ post, trailing }: { post: FeedItem; trailing?: React.ReactNode }) {
  return (
    <Card as="article">
      {post.photoUrl ? <img src={post.photoUrl} alt="" loading="lazy" className="aspect-[4/3] w-full bg-cream-deep object-cover" /> : null}
      <div className="flex flex-col gap-2 px-3.5 pb-3 pt-3">
        <p className="text-body leading-[1.4] text-ink">{post.body}</p>
        <div className="flex flex-wrap items-center gap-2 text-small text-ink-soft">
          {post.authorTenant ? (
            <>
              <CategoryBadge category={post.authorTenant.category} size="sm" />
              <a href={`/tenant/${post.authorTenant.slug}`} className="font-bold text-ink">
                {post.authorTenant.name}
              </a>
            </>
          ) : (
            <span>{post.displayName ?? copy.qa.anon}</span>
          )}
          {trailing ? <span className="ml-auto flex items-center gap-2">{trailing}</span> : null}
        </div>
      </div>
    </Card>
  );
}

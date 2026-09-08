import Link from "next/link";
import { copy } from "@/lib/copy";
import { Button } from "./Button";
import { CategoryBadge } from "./CategoryBadge";
import { Empty } from "./Empty";
import type { FeedItem } from "./FeedCard";
import { MascotOranye } from "./icons/Mascots";
import { IconZoomIn } from "./icons/UiIcons";
import { Eyebrow, SectionHeader } from "./PageHeader";

const WRITE_HREF = "/feed?tulis=1";

/**
 * Beranda Feed strip: the three newest visible posts as 160px cards in a gutter-bleed scroll row
 * (built like PhotoStrip), then a dashed "Tulis kabar" card. Each card deep-links to its post on /feed.
 */
export function FeedStrip({ posts }: { posts: FeedItem[] }) {
  return (
    <section className="flex flex-col gap-2.5">
      <SectionHeader title={copy.home.feed} action={<Eyebrow href="/feed">{copy.home.feedAll}</Eyebrow>} />
      {posts.length ? (
        <ul
          className="-mx-[var(--page-gutter)] flex gap-2.5 overflow-x-auto px-[var(--page-gutter)] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ maskImage: "linear-gradient(90deg, #000 calc(100% - 40px), transparent)", WebkitMaskImage: "linear-gradient(90deg, #000 calc(100% - 40px), transparent)" }}
        >
          {posts.map((p) => (
            <li key={p.id} className="w-40 shrink-0">
              <Link href={`/feed#post-${p.id}`} className="flex flex-col gap-1.5 no-underline">
                <span className="flex size-40 items-center justify-center overflow-hidden rounded-md border-2 border-edge bg-cream-deep">
                  {p.photoUrl ? <img src={p.photoUrl} alt="" loading="lazy" className="h-full w-full object-cover" /> : <MascotOranye size={64} />}
                </span>
                <span className="line-clamp-2 text-small font-bold leading-[1.35] text-ink">{p.body}</span>
                <span className="flex min-w-0 items-center gap-1.5 text-caption leading-[1.3] text-ink-soft">
                  {p.authorTenant ? (
                    <>
                      <CategoryBadge category={p.authorTenant.category} size="sm" />
                      <span className="truncate">{p.authorTenant.name}</span>
                    </>
                  ) : (
                    <span className="truncate">{p.displayName ?? copy.feed.anon}</span>
                  )}
                </span>
              </Link>
            </li>
          ))}
          <li className="w-40 shrink-0">
            <Link
              href={WRITE_HREF}
              className="flex size-40 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-line-strong bg-cream-deep font-display text-small font-semibold text-navy no-underline"
            >
              <IconZoomIn size={26} />
              {copy.home.feedWrite}
            </Link>
          </li>
        </ul>
      ) : (
        <>
          <Empty kind="feed" title={copy.feed.emptyTitle} body={copy.feed.emptyBody} />
          <Button href={WRITE_HREF} variant="ghost" block>
            {copy.home.feedWrite}
          </Button>
        </>
      )}
    </section>
  );
}

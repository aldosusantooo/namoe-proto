import { copy } from "@/lib/copy";
import { Card } from "./Card";
import { Pill } from "./CategoryBadge";
import { IconPin } from "./icons/UiIcons";
import { QuestionRowView } from "./QuestionList";

export type TenantPostRow = {
  id: string;
  body: string;
  displayName: string | null;
  reply: string | null;
  pinned: boolean;
};

type Props = { posts: TenantPostRow[]; accent: string };

/** Tanya tenant posts on the public tenant page: pinned first, replies in a cream inset. Hidden posts never arrive here. */
export function TenantBoard({ posts, accent }: Props) {
  if (!posts.length) return null;
  return (
    <Card>
      <ul className="divide-y-2 divide-line">
        {posts.map((p) => (
          <li key={p.id}>
            <QuestionRowView
              q={p}
              trailing={
                p.pinned ? (
                  <Pill tone="yellow" className="shrink-0">
                    <IconPin size={16} />
                    {copy.tenant.pinned}
                  </Pill>
                ) : undefined
              }
            >
              {p.reply ? (
                <div className="rounded-md bg-cream px-3 py-2.5" style={{ borderLeft: `4px solid ${accent}` }}>
                  <p className="text-small font-extrabold text-ink-soft">{copy.tenant.reply}</p>
                  <p className="text-body text-ink">{p.reply}</p>
                </div>
              ) : null}
            </QuestionRowView>
          </li>
        ))}
      </ul>
    </Card>
  );
}

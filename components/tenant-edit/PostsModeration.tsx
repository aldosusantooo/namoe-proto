"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ActionResult } from "@/actions/tenant";
import { copy } from "@/lib/copy";
import { REPLY_MAX } from "@/lib/validate";
import { Button } from "../Button";
import { Card } from "../Card";
import { Pill } from "../CategoryBadge";
import { IconPin } from "../icons/UiIcons";
import { Notice } from "../Notice";
import { QuestionRowView } from "../QuestionList";
import type { DashboardTenant, PlainAction, StatefulAction } from "./TenantDashboard";

type Props = { posts: DashboardTenant["posts"]; accent: string; replyPost: StatefulAction; togglePin: PlainAction; toggleHide: PlainAction };

/** Tanya tenant posts for the tenant: reply inline, pin one, hide the rest. */
export function PostsModeration({ posts, accent, replyPost, togglePin, toggleHide }: Props) {
  const [replying, setReplying] = useState<string | null>(null);
  const [state, action, pending] = useActionState<ActionResult, FormData>(replyPost, null);
  const lastOk = useRef<ActionResult>(null);

  useEffect(() => {
    if (state?.ok && state !== lastOk.current) {
      lastOk.current = state;
      setReplying(null);
    }
  }, [state]);

  return (
    <Card>
      <ul className="divide-y-2 divide-line">
        {posts.map((p) => (
          <li key={p.id} className={p.hidden ? "opacity-60" : ""}>
            <QuestionRowView
              q={p}
              trailing={
                p.pinned ? (
                  <Pill tone="yellow" className="shrink-0">
                    <IconPin size={16} />
                    {copy.tenant.pinned}
                  </Pill>
                ) : p.hidden ? (
                  <Pill tone="outline" className="shrink-0">
                    {copy.feed.hiddenTag}
                  </Pill>
                ) : undefined
              }
            >
              {p.reply ? (
                <div className="rounded-md bg-cream px-3 py-2.5" style={{ borderLeft: `4px solid ${accent}` }}>
                  <p className="text-small font-extrabold text-ink-soft">{copy.tenantEdit.yourReply}</p>
                  <p className="text-body text-ink">{p.reply}</p>
                </div>
              ) : null}

              {replying === p.id ? (
                <form action={action} className="flex flex-col gap-2">
                  <input type="hidden" name="postId" value={p.id} />
                  <textarea
                    name="reply"
                    required
                    autoFocus
                    rows={3}
                    maxLength={REPLY_MAX}
                    defaultValue={p.reply ?? ""}
                    placeholder={copy.tenantEdit.replyPlaceholder}
                    aria-label={copy.tenantEdit.replyPlaceholder}
                    className="min-h-24 w-full resize-y rounded-md border-2 border-edge bg-paper px-3.5 py-2.5 text-body leading-[1.45] text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" sm onClick={() => setReplying(null)}>
                      {copy.common.cancel}
                    </Button>
                    <Button type="submit" variant="primary" sm disabled={pending}>
                      {copy.tenantEdit.sendReply}
                    </Button>
                  </div>
                  {state && !state.ok ? <Notice tone="warn">{state.error}</Notice> : null}
                </form>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {p.reply ? (
                    <>
                      <form action={togglePin}>
                        <input type="hidden" name="postId" value={p.id} />
                        <Button type="submit" variant={p.pinned ? "ghost" : "primary"} sm disabled={p.hidden}>
                          {p.pinned ? copy.tenantEdit.unpin : copy.tenantEdit.pin}
                        </Button>
                      </form>
                      <Button variant="ghost" sm onClick={() => setReplying(p.id)}>
                        {copy.tenantEdit.reply}
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" sm onClick={() => setReplying(p.id)} disabled={p.hidden}>
                      {copy.tenantEdit.reply}
                    </Button>
                  )}
                  <form action={toggleHide}>
                    <input type="hidden" name="postId" value={p.id} />
                    <Button type="submit" variant="ghost" sm>
                      {p.hidden ? copy.tenantEdit.unhide : copy.tenantEdit.hide}
                    </Button>
                  </form>
                </div>
              )}
            </QuestionRowView>
          </li>
        ))}
      </ul>
    </Card>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { ensureDeviceId } from "@/lib/device-server";
import { cleanBody, cleanName } from "@/lib/validate";

export type PostState = { ok: true; id: string } | { ok: false; error: string } | null;

/** Creates a question or thanks note on a session. Empty names are stored as null. */
export async function postQuestion(_prev: PostState, formData: FormData): Promise<PostState> {
  const sessionSlug = String(formData.get("sessionSlug") ?? "");
  const kind = formData.get("kind") === "THANKS" ? "THANKS" : "QUESTION";
  const body = cleanBody(String(formData.get("body") ?? ""));
  if (!body.ok) return { ok: false, error: copy.errors[body.error] };
  const name = cleanName(String(formData.get("displayName") ?? ""));

  const session = await db.session.findUnique({ where: { slug: sessionSlug }, select: { id: true } });
  if (!session) return { ok: false, error: copy.errors.generic };

  const deviceId = await ensureDeviceId();
  const created = await db.question.create({
    data: { sessionId: session.id, kind, body: body.value, displayName: name.value, deviceId },
    select: { id: true },
  });
  revalidatePath(`/sesi/${sessionSlug}`);
  return { ok: true, id: created.id };
}

/** One upvote per device per question, toggled. Insert or delete and the counter move in one transaction. */
export async function toggleUpvote(questionId: string): Promise<{ upvoted: boolean; count: number }> {
  const deviceId = await ensureDeviceId();
  const result = await db.$transaction(async (tx) => {
    const key = { questionId, deviceId };
    const existing = await tx.upvote.findUnique({ where: { questionId_deviceId: key } });
    if (existing) {
      await tx.upvote.delete({ where: { questionId_deviceId: key } });
      const q = await tx.question.update({ where: { id: questionId }, data: { upvoteCount: { decrement: 1 } }, select: { upvoteCount: true, session: { select: { slug: true } } } });
      return { upvoted: false, count: Math.max(0, q.upvoteCount), slug: q.session.slug };
    }
    await tx.upvote.create({ data: key });
    const q = await tx.question.update({ where: { id: questionId }, data: { upvoteCount: { increment: 1 } }, select: { upvoteCount: true, session: { select: { slug: true } } } });
    return { upvoted: true, count: q.upvoteCount, slug: q.session.slug };
  });
  revalidatePath(`/sesi/${result.slug}`);
  return { upvoted: result.upvoted, count: result.count };
}

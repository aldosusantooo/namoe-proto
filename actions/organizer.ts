"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isOrganizerSecret } from "@/lib/organizer";

function check(secret: string) {
  if (!isOrganizerSecret(secret)) throw new Error("Forbidden");
}

export async function setAnswered(secret: string, questionId: string, answered: boolean) {
  check(secret);
  const q = await db.question.update({
    where: { id: questionId },
    data: { answered, answeredAt: answered ? new Date() : null },
    select: { session: { select: { slug: true } } },
  });
  revalidatePath(`/sesi/${q.session.slug}`);
  revalidatePath(`/organizer/${secret}/sesi/${q.session.slug}`);
}

export async function setHidden(secret: string, questionId: string, hidden: boolean) {
  check(secret);
  const q = await db.question.update({
    where: { id: questionId },
    data: { hidden },
    select: { session: { select: { slug: true } } },
  });
  revalidatePath(`/sesi/${q.session.slug}`);
  revalidatePath(`/organizer/${secret}/sesi/${q.session.slug}`);
}

export async function markRedeemed(secret: string, passportId: string): Promise<void> {
  check(secret);
  await db.passport.updateMany({ where: { id: passportId, redeemedAt: null }, data: { redeemedAt: new Date() } });
  revalidatePath("/paspor");
  revalidatePath(`/organizer/${secret}/tukar`);
}

/** Tanya tenant moderation: hide or show a post from the organizer panel. A hidden post also loses its pin. */
export async function setTenantPostHidden(secret: string, postId: string, hidden: boolean): Promise<void> {
  check(secret);
  const post = await db.tenantPost.update({
    where: { id: postId },
    data: hidden ? { hidden, pinned: false } : { hidden },
    select: { tenant: { select: { slug: true, editToken: true } } },
  });
  revalidatePath(`/tenant/${post.tenant.slug}`);
  revalidatePath(`/t/${post.tenant.editToken}/edit`);
  revalidatePath(`/organizer/${secret}/tenant`, "layout");
}

/** Feed moderation: hide or show a visitor or tenant post. */
export async function setFeedPostHidden(secret: string, postId: string, hidden: boolean): Promise<void> {
  check(secret);
  await db.feedPost.update({ where: { id: postId }, data: { hidden } });
  revalidatePath("/feed");
  revalidatePath(`/organizer/${secret}/tenant`, "layout");
}

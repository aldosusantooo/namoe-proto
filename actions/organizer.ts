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

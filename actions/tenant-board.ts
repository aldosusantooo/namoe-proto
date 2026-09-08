"use server";

import { revalidatePath } from "next/cache";
import type { PostState } from "@/actions/qa";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { ensureDeviceId } from "@/lib/device-server";
import { cleanBody, cleanName } from "@/lib/validate";

/** Visitor question on a tenant's Tanya tenant board, anonymous or named. Same shape as postQuestion. */
export async function postTenantQuestion(_prev: PostState, formData: FormData): Promise<PostState> {
  const tenantSlug = String(formData.get("tenantSlug") ?? "");
  const body = cleanBody(String(formData.get("body") ?? ""));
  if (!body.ok) return { ok: false, error: copy.errors[body.error] };
  const name = cleanName(String(formData.get("displayName") ?? ""));

  const tenant = await db.tenant.findUnique({ where: { slug: tenantSlug }, select: { id: true, editToken: true } });
  if (!tenant) return { ok: false, error: copy.errors.generic };

  const deviceId = await ensureDeviceId();
  const created = await db.tenantPost.create({
    data: { tenantId: tenant.id, body: body.value, displayName: name.value, deviceId },
    select: { id: true },
  });
  revalidatePath(`/tenant/${tenantSlug}`);
  revalidatePath(`/t/${tenant.editToken}/edit`);
  return { ok: true, id: created.id };
}

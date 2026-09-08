"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/actions/tenant";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { ensureDeviceId } from "@/lib/device-server";
import { storeUpload } from "@/lib/upload";
import { cleanName, cleanPhotoRef, cleanText, FEED_MAX } from "@/lib/validate";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "");

/** Visitor feed post: one line up to 140 chars, optional name, photo by URL or upload. No login. */
export async function postFeedAsVisitor(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const body = cleanText(str(formData, "body"), FEED_MAX);
  if (!body.ok) return { ok: false, error: body.error === "bodyTooLong" ? copy.tenantEdit.feedPlaceholder : copy.errors[body.error] };
  const name = cleanName(str(formData, "displayName"));

  let photoUrl: string | null = null;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const stored = await storeUpload("feed", file);
    if (!stored.ok) return { ok: false, error: copy.errors[stored.error] };
    photoUrl = stored.path;
  } else if (str(formData, "url").trim()) {
    const url = cleanPhotoRef(str(formData, "url"));
    if (!url.ok) return { ok: false, error: copy.errors.invalidUrl };
    photoUrl = url.value;
  }

  const deviceId = await ensureDeviceId();
  await db.feedPost.create({ data: { body: body.value, photoUrl, displayName: name.value, deviceId } });
  revalidatePath("/feed");
  return { ok: true, message: copy.feed.sent };
}

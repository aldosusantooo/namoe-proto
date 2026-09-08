"use server";

import { revalidatePath } from "next/cache";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { socialHandle } from "@/lib/social";
import { storeUpload } from "@/lib/upload";
import { cleanOptionalText, cleanPhotoRef, cleanText, cleanTime, cleanUrl, FEED_MAX, INTRO_MAX, PROMO_MAX, REPLY_MAX, SLOT_LABEL_MAX } from "@/lib/validate";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string } | null;

const MAX_PHOTOS = 5;

async function tenantByToken(token: string) {
  const tenant = await db.tenant.findUnique({ where: { editToken: token }, select: { id: true, slug: true, photos: true, logoUrl: true } });
  if (!tenant) throw new Error("Unknown tenant token");
  return tenant;
}

function revalidateTenant(slug: string, token: string) {
  revalidatePath(`/tenant/${slug}`);
  revalidatePath("/tenant");
  revalidatePath("/peta");
  revalidatePath(`/t/${token}/edit`);
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "");

/** Intro, promo (text and visibility) and the three links, saved together from the pinned bar. */
export async function saveProfile(token: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const tenant = await tenantByToken(token);
  const intro = cleanOptionalText(str(formData, "intro"), INTRO_MAX);
  if (!intro.ok) return { ok: false, error: copy.tenantEdit.introCounter(str(formData, "intro").length, INTRO_MAX) };
  const promo = cleanOptionalText(str(formData, "promo"), PROMO_MAX);
  if (!promo.ok) return { ok: false, error: copy.errors.bodyTooLong };
  const marketplaceRaw = str(formData, "marketplace").trim();
  const marketplace = marketplaceRaw ? cleanUrl(marketplaceRaw) : null;
  if (marketplace && !marketplace.ok) return { ok: false, error: copy.errors.invalidUrl };

  await db.tenant.update({
    where: { id: tenant.id },
    data: {
      intro: intro.value ?? "",
      promo: promo.value,
      promoVisible: formData.get("promoVisible") === "1",
      instagram: socialHandle(str(formData, "instagram")),
      tiktok: socialHandle(str(formData, "tiktok")),
      marketplace: marketplace ? marketplace.value : null,
    },
  });
  revalidateTenant(tenant.slug, token);
  return { ok: true, message: copy.tenantEdit.saved };
}

async function attachImage(token: string, target: string, path: string): Promise<ActionResult> {
  const tenant = await tenantByToken(token);
  if (target === "logo") {
    await db.tenant.update({ where: { id: tenant.id }, data: { logoUrl: path } });
  } else {
    if (tenant.photos.length >= MAX_PHOTOS) return { ok: false, error: copy.errors.photosFull };
    await db.tenant.update({ where: { id: tenant.id }, data: { photos: [...tenant.photos, path] } });
  }
  revalidateTenant(tenant.slug, token);
  return { ok: true };
}

/** Paste a photo URL. `target` is "photo" or "logo". */
export async function addPhotoUrl(token: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const url = cleanPhotoRef(str(formData, "url"));
  if (!url.ok) return { ok: false, error: copy.errors.invalidUrl };
  return attachImage(token, str(formData, "target"), url.value);
}

/** Upload from the gallery: image types only, 5 MB, stored under public/uploads/<slug>/. */
export async function uploadPhoto(token: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const tenant = await tenantByToken(token);
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: copy.errors.fileType };
  const stored = await storeUpload(tenant.slug, file);
  if (!stored.ok) return { ok: false, error: copy.errors[stored.error] };
  return attachImage(token, str(formData, "target"), stored.path);
}

/** Removes photo at `index`, or the logo when `target` is "logo". */
export async function removePhoto(token: string, formData: FormData): Promise<void> {
  const tenant = await tenantByToken(token);
  if (str(formData, "target") === "logo") {
    await db.tenant.update({ where: { id: tenant.id }, data: { logoUrl: null } });
  } else {
    const index = Number(str(formData, "index"));
    if (Number.isInteger(index) && index >= 0 && index < tenant.photos.length) {
      await db.tenant.update({ where: { id: tenant.id }, data: { photos: tenant.photos.filter((_, i) => i !== index) } });
    }
  }
  revalidateTenant(tenant.slug, token);
}

export async function addSlot(token: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const tenant = await tenantByToken(token);
  const label = cleanText(str(formData, "label"), SLOT_LABEL_MAX);
  if (!label.ok) return { ok: false, error: copy.errors[label.error] };
  const time = cleanTime(str(formData, "time"));
  if (!time.ok) return { ok: false, error: copy.errors.timeFormat };
  const count = await db.tenantSlot.count({ where: { tenantId: tenant.id } });
  await db.tenantSlot.create({ data: { tenantId: tenant.id, label: label.value, time: time.value, order: count } });
  revalidateTenant(tenant.slug, token);
  return { ok: true };
}

export async function removeSlot(token: string, formData: FormData): Promise<void> {
  const tenant = await tenantByToken(token);
  await db.tenantSlot.deleteMany({ where: { id: str(formData, "id"), tenantId: tenant.id } });
  revalidateTenant(tenant.slug, token);
}

export async function replyPost(token: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const tenant = await tenantByToken(token);
  const reply = cleanText(str(formData, "reply"), REPLY_MAX);
  if (!reply.ok) return { ok: false, error: copy.errors[reply.error] };
  await db.tenantPost.updateMany({ where: { id: str(formData, "postId"), tenantId: tenant.id }, data: { reply: reply.value, repliedAt: new Date() } });
  revalidateTenant(tenant.slug, token);
  return { ok: true };
}

/** One pinned post per tenant, enforced in a single transaction: unpin all, pin this (or unpin when it was pinned). */
export async function togglePin(token: string, formData: FormData): Promise<void> {
  const tenant = await tenantByToken(token);
  const postId = str(formData, "postId");
  await db.$transaction(async (tx) => {
    const post = await tx.tenantPost.findFirst({ where: { id: postId, tenantId: tenant.id }, select: { pinned: true } });
    if (!post) return;
    await tx.tenantPost.updateMany({ where: { tenantId: tenant.id, pinned: true }, data: { pinned: false } });
    if (!post.pinned) await tx.tenantPost.update({ where: { id: postId }, data: { pinned: true } });
  });
  revalidateTenant(tenant.slug, token);
}

export async function toggleHide(token: string, formData: FormData): Promise<void> {
  const tenant = await tenantByToken(token);
  const postId = str(formData, "postId");
  const post = await db.tenantPost.findFirst({ where: { id: postId, tenantId: tenant.id }, select: { hidden: true } });
  if (!post) return;
  await db.tenantPost.update({ where: { id: postId }, data: { hidden: !post.hidden, pinned: false } });
  revalidateTenant(tenant.slug, token);
}

/** Feed post as the tenant: one line up to 140 chars, photo by URL or upload (optional). */
export async function postFeedAsTenant(token: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const tenant = await tenantByToken(token);
  const body = cleanText(str(formData, "body"), FEED_MAX);
  if (!body.ok) return { ok: false, error: body.error === "bodyTooLong" ? copy.tenantEdit.feedPlaceholder : copy.errors[body.error] };
  let photoUrl: string | null = null;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const stored = await storeUpload(tenant.slug, file);
    if (!stored.ok) return { ok: false, error: copy.errors[stored.error] };
    photoUrl = stored.path;
  } else if (str(formData, "url").trim()) {
    const url = cleanPhotoRef(str(formData, "url"));
    if (!url.ok) return { ok: false, error: copy.errors.invalidUrl };
    photoUrl = url.value;
  }
  await db.feedPost.create({ data: { body: body.value, photoUrl, authorTenantId: tenant.id } });
  revalidatePath("/feed");
  revalidatePath(`/t/${token}/edit`);
  return { ok: true, message: copy.tenantEdit.feedSent };
}

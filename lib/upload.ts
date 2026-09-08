import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

/** Allowed image types and the extension each is stored with. The client filename is never trusted. */
export const UPLOAD_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type UploadCheck = { ok: true; ext: string } | { ok: false; error: "fileType" | "fileTooLarge" };

/** Pure check, unit tested: mime must be an image type we know, size must be under the limit. */
export function checkUpload(mime: string, size: number): UploadCheck {
  const ext = UPLOAD_TYPES[mime.toLowerCase()];
  if (!ext) return { ok: false, error: "fileType" };
  if (size <= 0 || size > UPLOAD_MAX_BYTES) return { ok: false, error: "fileTooLarge" };
  return { ok: true, ext };
}

export function uploadFileName(ext: string, random: () => string = () => randomBytes(8).toString("hex")): string {
  return `${random()}.${ext}`;
}

/**
 * Writes an uploaded image under public/uploads/<slug>/ and returns its public path.
 * Prototype storage: the disk on Railway is ephemeral, so files vanish on the next deploy.
 */
export async function storeUpload(slug: string, file: File): Promise<{ ok: true; path: string } | { ok: false; error: "fileType" | "fileTooLarge" }> {
  const check = checkUpload(file.type, file.size);
  if (!check.ok) return check;
  const safeSlug = slug.replace(/[^a-z0-9-]/g, "");
  const dir = resolve(process.cwd(), "public", "uploads", safeSlug);
  await mkdir(dir, { recursive: true });
  const name = uploadFileName(check.ext);
  await writeFile(resolve(dir, name), Buffer.from(await file.arrayBuffer()));
  return { ok: true, path: `/uploads/${safeSlug}/${name}` };
}

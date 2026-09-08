import { copy } from "./copy";

/** Accepts a handle ("gabag.indonesia", "@gabag") or a full URL and returns the profile URL. */
export function socialUrl(network: "instagram" | "tiktok", value: string): string {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, "").replace(/^.*\.com\//i, "").replace(/\/+$/, "");
  return network === "instagram" ? `https://instagram.com/${handle}` : `https://www.tiktok.com/@${handle}`;
}

/** Stores a handle from whatever the tenant typed: URL, @handle or bare handle. Empty becomes null. */
export function socialHandle(value: string | null | undefined): string | null {
  const v = (value ?? "").trim();
  if (!v) return null;
  const path = v.replace(/^https?:\/\/(www\.)?[^/]+\//i, "");
  const handle = path.split(/[/?#]/)[0].replace(/^@/, "").trim();
  return handle || null;
}

/** "Shopee", "Tokopedia" or the generic label, from the URL host. */
export function marketplaceLabel(url: string): string {
  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    host = url.toLowerCase();
  }
  if (host.includes("shopee")) return copy.tenant.shopee;
  if (host.includes("tokopedia")) return copy.tenant.tokopedia;
  return copy.tenant.shop;
}

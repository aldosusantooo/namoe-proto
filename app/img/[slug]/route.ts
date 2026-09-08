import type { NextRequest } from "next/server";
import { byKey } from "@/lib/categories";
import { db } from "@/lib/db";
import { GLYPH_PATHS, GLYPH_VIEWBOX } from "@/lib/glyph-paths";
import { renderPlaceholderSvg, type PlaceholderVariant } from "@/lib/placeholder-svg";

export const dynamic = "force-dynamic";

/**
 * Placeholder art for tenants without a photo, served as SVG for <img> consumers.
 * `?v=card` (default, 600 x 600), `?v=hero` (1200 x 750), `?v=thumb` (200 x 200). `?logo=1` maps to thumb.
 * Colours come from lib/tokens.generated.json, never from a hand-typed map. `?t=` is the tenant's updatedAt,
 * added by the app so a rename busts the immutable cache. `?n=` from the old seed is ignored.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/img/[slug]">) {
  const { slug } = await ctx.params;
  const tenant = await db.tenant.findUnique({ where: { slug }, select: { name: true, category: true } });
  if (!tenant) return new Response("Not found", { status: 404 });

  const url = new URL(request.url);
  const raw = url.searchParams.has("logo") ? "thumb" : url.searchParams.get("v") ?? "card";
  const variant: PlaceholderVariant = raw === "hero" || raw === "thumb" ? raw : "card";
  const info = byKey(tenant.category);

  const svg = renderPlaceholderSvg({
    name: tenant.name,
    slug: info.slug,
    variant,
    glyph: GLYPH_PATHS[info.slug],
    glyphViewBox: GLYPH_VIEWBOX,
  });

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=86400, immutable",
    },
  });
}

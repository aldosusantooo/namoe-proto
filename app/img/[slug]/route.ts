import type { NextRequest } from "next/server";

const HUES = ["#4B7FD6", "#E2574C", "#2BB673", "#F5C445", "#F3A7C0", "#F7B15C", "#6E63D9", "#3AAFA9", "#8FC1EE"];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function initials(slug: string) {
  const parts = slug.split("-").filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0].toUpperCase());
  return letters.join("") || "N";
}

function escape(s: string) {
  return s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c] ?? c);
}

/**
 * Placeholder photos and logos for seeded tenants.
 * `/img/<slug>?n=1..5` gives a product photo; `/img/<slug>?logo=1` gives a round logo mark.
 * Deterministic per slug so the same tenant always gets the same colour.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/img/[slug]">) {
  const { slug } = await ctx.params;
  const url = new URL(request.url);
  const n = Number(url.searchParams.get("n") ?? "1");
  const isLogo = url.searchParams.has("logo");
  const base = hash(slug);
  const hue = HUES[base % HUES.length];
  const hue2 = HUES[(base + n + 3) % HUES.length];
  const text = escape(initials(slug));

  const svg = isLogo
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
<rect width="200" height="200" rx="100" fill="${hue}"/>
<text x="100" y="118" text-anchor="middle" font-family="Fredoka, Nunito, system-ui, sans-serif" font-weight="600" font-size="72" fill="#fff">${text}</text>
</svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
<rect width="600" height="600" fill="${hue2}"/>
<circle cx="${140 + ((base >> 3) % 320)}" cy="${160 + ((base >> 7) % 280)}" r="${120 + (n * 23) % 90}" fill="${hue}" opacity="0.9"/>
<rect x="60" y="440" width="480" height="100" rx="28" fill="#FFF6E6" opacity="0.92"/>
<text x="300" y="505" text-anchor="middle" font-family="Fredoka, Nunito, system-ui, sans-serif" font-weight="600" font-size="40" fill="#1E2A44">${text} ${n}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=86400, immutable",
    },
  });
}

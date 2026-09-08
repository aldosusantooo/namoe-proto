import tokens from "./tokens.generated.json";

export type PlaceholderVariant = "thumb" | "card" | "hero";

export const PLACEHOLDER_SIZES: Record<PlaceholderVariant, { w: number; h: number }> = {
  thumb: { w: 200, h: 200 },
  card: { w: 600, h: 600 },
  hero: { w: 1200, h: 750 },
};

const DOT_STEP = 32;
const DOT_R = 4;
const DOT_OPACITY = 0.28;
const GLYPH_OPACITY = 0.92;
const NAME_INSET = 40;
const MAX_LINES = 3;

export function escapeXml(s: string) {
  return s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

/** Greedy word wrap at `max` characters, at most `lines` lines; a word longer than `max` is cut. */
export function wrapName(name: string, max: number, lines = MAX_LINES): string[] {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let cur = "";
  for (const word of words) {
    const w = word.length > max ? word.slice(0, max) : word;
    if (!cur) cur = w;
    else if (`${cur} ${w}`.length <= max) cur = `${cur} ${w}`;
    else {
      out.push(cur);
      cur = w;
    }
  }
  if (cur) out.push(cur);
  return out.slice(0, lines);
}

type Input = { name: string; slug: string; variant: PlaceholderVariant; glyph: string; glyphViewBox: number };

/**
 * Same design as components/PlaceholderArt.tsx, emitted as a standalone SVG document:
 * category colour rect, white dot pattern, glyph bleeding off the top-right, name bottom-left in Fredoka.
 */
export function renderPlaceholderSvg({ name, slug, variant, glyph, glyphViewBox }: Input): string {
  const { w, h } = PLACEHOLDER_SIZES[variant];
  const cat = (tokens.categories as Record<string, { hex: string; ink: string }>)[slug];
  if (!cat) throw new Error(`No colour for category ${slug} in tokens.generated.json`);
  const short = Math.min(w, h);

  let glyphMarkup: string;
  if (variant === "thumb") {
    const g = short * 0.72;
    const s = g / glyphViewBox;
    glyphMarkup = `<g transform="translate(${fmt((w - g) / 2)} ${fmt((h - g) / 2)}) scale(${fmt(s)})" color="${cat.ink}">${glyph}</g>`;
  } else {
    const g = short * 0.64;
    const s = g / glyphViewBox;
    const x = w * 1.06 - g;
    const y = -0.06 * short;
    glyphMarkup = `<g transform="translate(${fmt(x)} ${fmt(y)}) scale(${fmt(s)})" color="${cat.ink}" opacity="${GLYPH_OPACITY}">${glyph}</g>`;
  }

  let nameMarkup = "";
  if (variant !== "thumb") {
    const fontSize = Math.round(short * 0.12);
    const lineHeight = Math.round(fontSize * 1.05);
    const lines = wrapName(name, variant === "hero" ? 20 : 14);
    const baseline = h - NAME_INSET;
    nameMarkup = lines
      .map((line, i) => {
        const y = baseline - (lines.length - 1 - i) * lineHeight;
        return `<text x="${NAME_INSET}" y="${y}" font-family="Fredoka, Nunito, system-ui, sans-serif" font-weight="600" font-size="${fontSize}" fill="${cat.ink}">${escapeXml(line)}</text>`;
      })
      .join("");
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`,
    `<defs><pattern id="dots" width="${DOT_STEP}" height="${DOT_STEP}" patternUnits="userSpaceOnUse"><circle cx="${DOT_STEP / 2}" cy="${DOT_STEP / 2}" r="${DOT_R}" fill="rgba(255,255,255,${DOT_OPACITY})"/></pattern></defs>`,
    `<rect width="${w}" height="${h}" fill="${cat.hex}"/>`,
    `<rect width="${w}" height="${h}" fill="url(#dots)"/>`,
    glyphMarkup,
    nameMarkup,
    `</svg>`,
  ].join("\n");
}

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

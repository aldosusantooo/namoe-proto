/**
 * Reads docs/tokens.css (the single colour source) and writes lib/tokens.generated.json.
 * Consumers that cannot read CSS variables at runtime (the /img/[slug] SVG route, the printable QR sheet)
 * import that JSON instead of hand-copying hex values. Runs on `pnpm build` (prebuild) and `postinstall`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "docs/tokens.css");
const target = resolve(root, "lib/tokens.generated.json");

const css = readFileSync(source, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** Every `--name: value;` declaration, last one wins. */
const declarations = new Map<string, string>();
for (const match of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
  declarations.set(match[1], match[2].trim());
}

const HEX = /^#[0-9a-f]{6}$/i;

/** Follows var() chains until a hex literal appears. */
function resolveHex(name: string, seen: string[] = []): string {
  const value = declarations.get(name);
  if (!value) throw new Error(`Token ${name} is not defined in docs/tokens.css`);
  if (HEX.test(value)) return value.toUpperCase();
  const ref = value.match(/^var\((--[a-z0-9-]+)\)$/i);
  if (!ref) throw new Error(`Token ${name} has a value that is not a hex or a var(): ${value}`);
  if (seen.includes(ref[1])) throw new Error(`Token ${name} refers to itself through ${seen.join(" > ")}`);
  return resolveHex(ref[1], [...seen, name]);
}

const categorySlugs = [...declarations.keys()]
  .map((k) => k.match(/^--color-cat-([a-z-]+?)(?:-soft|-ink)?$/))
  .filter((m): m is RegExpMatchArray => Boolean(m))
  .map((m) => m[1])
  .filter((slug, i, all) => all.indexOf(slug) === i)
  .sort();

const categories: Record<string, { hex: string; ink: string }> = {};
for (const slug of categorySlugs) {
  categories[slug] = { hex: resolveHex(`--color-cat-${slug}`), ink: resolveHex(`--color-cat-${slug}-ink`) };
}

const BASE = ["cream", "cream-deep", "paper", "line", "line-strong", "edge", "ink", "ink-soft", "ink-muted", "navy", "navy-deep", "blue", "coral", "green", "yellow", "pink", "orange"];
const base: Record<string, string> = {};
for (const name of BASE) base[name] = resolveHex(`--color-${name}`);

const out = { generatedFrom: "docs/tokens.css", base, categories };
writeFileSync(target, `${JSON.stringify(out, null, 2)}\n`);
console.log(`Wrote ${target}: ${Object.keys(categories).length} categories, ${Object.keys(base).length} base colours`);

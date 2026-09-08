import { describe, expect, it } from "vitest";
import { GLYPH_PATHS, GLYPH_VIEWBOX } from "../glyph-paths";
import { renderPlaceholderSvg, wrapName } from "../placeholder-svg";
import tokens from "../tokens.generated.json";

const base = { glyph: GLYPH_PATHS["perlengkapan-ibu"], glyphViewBox: GLYPH_VIEWBOX };

describe("wrapName", () => {
  it("wraps greedily at the limit", () => {
    expect(wrapName("GabaG Indonesia", 14)).toEqual(["GabaG", "Indonesia"]);
    expect(wrapName("GabaG Indonesia", 20)).toEqual(["GabaG Indonesia"]);
  });
  it("caps at three lines and cuts long words", () => {
    expect(wrapName("Satu dua tiga empat lima enam tujuh delapan", 8)).toHaveLength(3);
    expect(wrapName("Supercalifragilistic", 10)).toEqual(["Supercalif"]);
  });
});

describe("renderPlaceholderSvg", () => {
  it("card: colour rect, dot pattern, glyph and wrapped name in the category ink", () => {
    const svg = renderPlaceholderSvg({ ...base, name: "GabaG Indonesia", slug: "perlengkapan-ibu", variant: "card" });
    expect(svg).toContain('viewBox="0 0 600 600"');
    expect(svg).toContain(`fill="${tokens.categories["perlengkapan-ibu"].hex}"`);
    expect(svg).toContain('<pattern id="dots"');
    expect(svg).toContain('opacity="0.92"');
    expect(svg.match(/<text /g)).toHaveLength(2);
    expect(svg).toContain(">GabaG</text>");
    expect(svg).toContain('y="560"');
  });

  it("hero keeps the name on one line at 20 characters and uses the wide box", () => {
    const svg = renderPlaceholderSvg({ ...base, name: "GabaG Indonesia", slug: "perlengkapan-ibu", variant: "hero" });
    expect(svg).toContain('viewBox="0 0 1200 750"');
    expect(svg.match(/<text /g)).toHaveLength(1);
    expect(svg).toContain('y="710"');
  });

  it("thumb has no name and a centred glyph", () => {
    const svg = renderPlaceholderSvg({ ...base, name: "Oxone", slug: "peralatan-dapur", variant: "thumb" });
    expect(svg).toContain('viewBox="0 0 200 200"');
    expect(svg).not.toContain("<text");
    expect(svg).toContain(`color="${tokens.categories["peralatan-dapur"].ink}"`);
  });

  it("escapes names for XML", () => {
    const svg = renderPlaceholderSvg({ ...base, name: "Kanva Home & Living", slug: "dekorasi-rumah", variant: "card" });
    expect(svg).toContain("&amp;");
    expect(svg).not.toContain("Home & Living");
  });
});

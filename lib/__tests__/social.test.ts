import { describe, expect, it } from "vitest";
import { marketplaceLabel, socialHandle, socialUrl } from "../social";

describe("socialUrl", () => {
  it("builds profile URLs from handles with or without @", () => {
    expect(socialUrl("instagram", "gabag.indonesia")).toBe("https://instagram.com/gabag.indonesia");
    expect(socialUrl("instagram", "@gabag")).toBe("https://instagram.com/gabag");
    expect(socialUrl("tiktok", "gabag")).toBe("https://www.tiktok.com/@gabag");
  });
  it("passes full URLs through", () => {
    expect(socialUrl("instagram", "https://www.instagram.com/gabag/")).toBe("https://www.instagram.com/gabag/");
  });
});

describe("socialHandle", () => {
  it("extracts the handle from URLs, @handles and bare handles", () => {
    expect(socialHandle("https://www.instagram.com/gabag.indonesia/?hl=id")).toBe("gabag.indonesia");
    expect(socialHandle("https://www.tiktok.com/@gabag")).toBe("gabag");
    expect(socialHandle("@gabag")).toBe("gabag");
    expect(socialHandle("gabag")).toBe("gabag");
  });
  it("returns null for empty input", () => {
    expect(socialHandle("")).toBeNull();
    expect(socialHandle("  ")).toBeNull();
    expect(socialHandle(null)).toBeNull();
  });
});

describe("marketplaceLabel", () => {
  it("names Shopee and Tokopedia from the host and falls back otherwise", () => {
    expect(marketplaceLabel("https://shopee.co.id/gabag")).toBe("Shopee");
    expect(marketplaceLabel("https://www.tokopedia.com/gabag")).toBe("Tokopedia");
    expect(marketplaceLabel("https://gabag.co.id/shop")).toBe("Toko online");
    expect(marketplaceLabel("not a url")).toBe("Toko online");
  });
});

import { describe, expect, it } from "vitest";
import { locationHint, locationKey } from "../booth-location";
import { generateBooths } from "../layout";

describe("locationKey", () => {
  it("maps the three A bands to depan, tengah, belakang", () => {
    expect(locationKey({ zone: "A", band: 1 })).toBe("front");
    expect(locationKey({ zone: "A", band: 2 })).toBe("middle");
    expect(locationKey({ zone: "A", band: 3 })).toBe("back");
  });

  it("puts every F&B booth on the food row regardless of band", () => {
    expect(locationKey({ zone: "FNB", band: 0 })).toBe("fnb");
  });

  it("agrees with the generated geometry for known booths", () => {
    const by = new Map(generateBooths().map((b) => [b.code, b]));
    expect(locationKey(by.get("A1")!)).toBe("front");
    expect(locationKey(by.get("A37")!)).toBe("middle");
    expect(locationKey(by.get("A70")!)).toBe("back");
    expect(locationKey(by.get("A77")!)).toBe("fnb");
  });

  it("renders sentence-case Indonesian without exclamation marks", () => {
    for (const booth of [{ zone: "A" as const, band: 1 }, { zone: "A" as const, band: 2 }, { zone: "A" as const, band: 3 }, { zone: "FNB" as const, band: 0 }]) {
      const hint = locationHint(booth);
      expect(hint).toMatch(/^[A-Z]/);
      expect(hint).not.toContain("!");
    }
  });
});

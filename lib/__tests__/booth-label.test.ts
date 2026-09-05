import { describe, expect, it } from "vitest";
import { boothLabel, primaryCode } from "../booth-label";

describe("boothLabel", () => {
  it("single code", () => {
    expect(boothLabel(["A3"])).toBe("A3");
  });
  it("two codes with dan", () => {
    expect(boothLabel(["A1", "A2"])).toBe("A1 dan A2");
  });
  it("three or more consecutive codes with sampai", () => {
    expect(boothLabel(["A11", "A12", "A13", "A14"])).toBe("A11 sampai A14");
    expect(boothLabel(["A27", "A28", "A29"])).toBe("A27 sampai A29");
  });
  it("non-consecutive codes as a comma list", () => {
    expect(boothLabel(["A1", "A3", "A5"])).toBe("A1, A3, A5");
  });
  it("sorts numerically, not lexically", () => {
    expect(boothLabel(["A14", "A11", "A13", "A12"])).toBe("A11 sampai A14");
    expect(boothLabel(["A70", "A9"])).toBe("A9 dan A70");
  });
  it("empty input", () => {
    expect(boothLabel([])).toBe("");
  });
});

describe("primaryCode", () => {
  it("returns the lowest code", () => {
    expect(primaryCode(["A14", "A11", "A13"])).toBe("A11");
    expect(primaryCode([])).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { parseSaved, toggleSaved } from "../saved";

describe("saved list", () => {
  it("parses a stored array and ignores junk", () => {
    expect(parseSaved('["a","b"]')).toEqual(["a", "b"]);
    expect(parseSaved('["a", 3, null]')).toEqual(["a"]);
    expect(parseSaved("{bad")).toEqual([]);
    expect(parseSaved(null)).toEqual([]);
  });
  it("toggles a slug in and out without mutating the input", () => {
    const list = ["a"];
    expect(toggleSaved(list, "b")).toEqual(["a", "b"]);
    expect(toggleSaved(list, "a")).toEqual([]);
    expect(list).toEqual(["a"]);
  });
});

import { describe, expect, it } from "vitest";
import { formatAverage } from "../organizer-stats";

describe("formatAverage", () => {
  it("uses a decimal comma and drops a trailing zero", () => {
    expect(formatAverage(6, 4)).toBe("1,5");
    expect(formatAverage(8, 4)).toBe("2");
    expect(formatAverage(1, 3)).toBe("0,3");
  });
  it("is zero when nothing was counted", () => {
    expect(formatAverage(0, 0)).toBe("0");
  });
});

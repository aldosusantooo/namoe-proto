import { describe, expect, it } from "vitest";
import { applyStamp, progress } from "../passport";

describe("applyStamp", () => {
  it("adds the first stamp", () => {
    expect(applyStamp([], "A12", 5)).toEqual({ stamps: ["A12"], added: true, completed: false, justCompleted: false });
  });
  it("ignores a duplicate stamp and does not mutate input", () => {
    const existing = ["A12", "A3"];
    const r = applyStamp(existing, "A12", 5);
    expect(r.added).toBe(false);
    expect(r.justCompleted).toBe(false);
    expect(r.stamps).toEqual(["A12", "A3"]);
    expect(existing).toEqual(["A12", "A3"]);
  });
  it("marks justCompleted only on the stamp that reaches the target", () => {
    const r = applyStamp(["A1", "A2", "A3", "A4"], "A5", 5);
    expect(r).toEqual({ stamps: ["A1", "A2", "A3", "A4", "A5"], added: true, completed: true, justCompleted: true });
  });
  it("keeps counting beyond the target without re-completing", () => {
    const r = applyStamp(["A1", "A2", "A3", "A4", "A5"], "A6", 5);
    expect(r.added).toBe(true);
    expect(r.completed).toBe(true);
    expect(r.justCompleted).toBe(false);
    expect(r.stamps).toHaveLength(6);
  });
  it("reports completed for a duplicate on a full passport", () => {
    const r = applyStamp(["A1", "A2", "A3", "A4", "A5"], "A1", 5);
    expect(r.completed).toBe(true);
    expect(r.added).toBe(false);
  });
});

describe("progress", () => {
  it("never goes negative", () => {
    expect(progress(2, 5)).toEqual({ count: 2, target: 5, remaining: 3, done: false });
    expect(progress(7, 5)).toEqual({ count: 7, target: 5, remaining: 0, done: true });
  });
});

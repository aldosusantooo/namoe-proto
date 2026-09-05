import { describe, expect, it } from "vitest";
import { rankQuestions, splitAnswered } from "../ranking";

const t = (min: number) => new Date(Date.UTC(2026, 9, 22, 6, min));
const q = (id: string, upvoteCount: number, displayName: string | null, min: number) => ({
  id,
  upvoteCount,
  displayName,
  createdAt: t(min),
});

describe("rankQuestions", () => {
  it("sorts by upvotes desc", () => {
    const out = rankQuestions([q("a", 1, null, 0), q("b", 5, null, 0), q("c", 3, null, 0)]);
    expect(out.map((x) => x.id)).toEqual(["b", "c", "a"]);
  });
  it("puts named before anonymous at equal upvotes", () => {
    const out = rankQuestions([q("anon", 2, null, 0), q("named", 2, "Sari", 0)]);
    expect(out.map((x) => x.id)).toEqual(["named", "anon"]);
  });
  it("treats whitespace-only names as anonymous", () => {
    const out = rankQuestions([q("blank", 2, "   ", 5), q("named", 2, "Sari", 0)]);
    expect(out.map((x) => x.id)).toEqual(["named", "blank"]);
  });
  it("puts newest first at equal upvotes and naming", () => {
    const out = rankQuestions([q("old", 0, null, 0), q("new", 0, null, 10)]);
    expect(out.map((x) => x.id)).toEqual(["new", "old"]);
  });
  it("combines the three rules", () => {
    const out = rankQuestions([
      q("anon-old-3", 3, null, 0),
      q("named-new-1", 1, "Budi", 20),
      q("named-old-3", 3, "Ani", 0),
      q("anon-new-3", 3, null, 10),
      q("named-new-3", 3, "Cici", 10),
    ]);
    expect(out.map((x) => x.id)).toEqual(["named-new-3", "named-old-3", "anon-new-3", "anon-old-3", "named-new-1"]);
  });
  it("is stable and does not mutate input", () => {
    const input = [q("a", 1, null, 0), q("b", 1, null, 0), q("c", 1, null, 0)];
    const copy = [...input];
    const out = rankQuestions(input);
    expect(out.map((x) => x.id)).toEqual(["a", "b", "c"]);
    expect(input).toEqual(copy);
    expect(out).not.toBe(input);
  });
  it("handles empty input", () => {
    expect(rankQuestions([])).toEqual([]);
  });
});

describe("splitAnswered", () => {
  it("separates answered items and sorts them by answeredAt desc", () => {
    const items = [
      { id: "open1", answered: false, answeredAt: null },
      { id: "ans-old", answered: true, answeredAt: t(1) },
      { id: "open2", answered: false, answeredAt: null },
      { id: "ans-new", answered: true, answeredAt: t(9) },
    ];
    const { open, answered } = splitAnswered(items);
    expect(open.map((x) => x.id)).toEqual(["open1", "open2"]);
    expect(answered.map((x) => x.id)).toEqual(["ans-new", "ans-old"]);
  });
});

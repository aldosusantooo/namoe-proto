type Rankable = { upvoteCount: number; displayName: string | null; createdAt: Date };

export function isNamed(displayName: string | null | undefined): boolean {
  return typeof displayName === "string" && displayName.trim().length > 0;
}

/**
 * Upvotes desc, then named before anonymous, then newest first. Stable, does not mutate input.
 */
export function rankQuestions<T extends Rankable>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      if (b.item.upvoteCount !== a.item.upvoteCount) return b.item.upvoteCount - a.item.upvoteCount;
      const namedA = isNamed(a.item.displayName) ? 1 : 0;
      const namedB = isNamed(b.item.displayName) ? 1 : 0;
      if (namedA !== namedB) return namedB - namedA;
      const timeDiff = b.item.createdAt.getTime() - a.item.createdAt.getTime();
      if (timeDiff !== 0) return timeDiff;
      return a.index - b.index;
    })
    .map(({ item }) => item);
}

type Answerable = { answered: boolean; answeredAt: Date | null };

/** Open questions keep input order; answered ones are sorted by answeredAt desc. */
export function splitAnswered<T extends Answerable>(items: T[]): { open: T[]; answered: T[] } {
  const open = items.filter((i) => !i.answered);
  const answered = items
    .filter((i) => i.answered)
    .sort((a, b) => (b.answeredAt?.getTime() ?? 0) - (a.answeredAt?.getTime() ?? 0));
  return { open, answered };
}

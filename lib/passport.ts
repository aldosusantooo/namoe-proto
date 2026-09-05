export type StampResult = {
  stamps: string[];
  added: boolean;
  completed: boolean;
  justCompleted: boolean;
};

/** Adds a booth code to a stamp list once. `justCompleted` is true only on the stamp that reaches the target. */
export function applyStamp(existing: string[], code: string, target: number): StampResult {
  if (existing.includes(code)) {
    return { stamps: [...existing], added: false, completed: existing.length >= target, justCompleted: false };
  }
  const stamps = [...existing, code];
  return {
    stamps,
    added: true,
    completed: stamps.length >= target,
    justCompleted: stamps.length === target,
  };
}

export function progress(count: number, target: number) {
  return { count, target, remaining: Math.max(0, target - count), done: count >= target };
}

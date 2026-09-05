import type { EventDay } from "./time";

type SessionLike = { day: number; startsAt: Date };

function byStart<T extends SessionLike>(a: T, b: T) {
  return a.startsAt.getTime() - b.startsAt.getTime();
}

/** Sessions of each event day, sorted by start time. Every day key is present even when empty. */
export function groupByDay<T extends SessionLike>(sessions: T[]): Record<EventDay, T[]> {
  const out: Record<EventDay, T[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const s of sessions) {
    if (s.day >= 1 && s.day <= 4) out[s.day as EventDay].push(s);
  }
  for (const day of [1, 2, 3, 4] as EventDay[]) out[day].sort(byStart);
  return out;
}

/** Sorted sessions for one day. */
export function sessionsForDay<T extends SessionLike>(sessions: T[], day: EventDay): T[] {
  return sessions.filter((s) => s.day === day).sort(byStart);
}

/** Parses `?hari=` into an event day, defaulting to day 1. */
export function parseDay(value: string | string[] | undefined): EventDay {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return n === 2 || n === 3 || n === 4 ? n : 1;
}

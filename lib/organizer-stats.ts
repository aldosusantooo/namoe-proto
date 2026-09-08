import { db } from "./db";
import type { EventDay } from "./time";

const EVENT_DATES: Record<EventDay, string> = { 1: "2026-10-22", 2: "2026-10-23", 3: "2026-10-24", 4: "2026-10-25" };

/** Jakarta calendar date (YYYY-MM-DD) of an instant. */
export function jakartaDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

/** Feed posts per event day (Asia/Jakarta), plus everything outside the four days. */
export function postsPerDay(dates: Date[]): Record<EventDay, number> & { other: number } {
  const out = { 1: 0, 2: 0, 3: 0, 4: 0, other: 0 } as Record<EventDay, number> & { other: number };
  for (const d of dates) {
    const key = jakartaDate(d);
    const day = (Object.keys(EVENT_DATES) as unknown as EventDay[]).find((k) => EVENT_DATES[Number(k) as EventDay] === key);
    if (day) out[Number(day) as EventDay]++;
    else out.other++;
  }
  return out;
}

/** Formats a ratio the Indonesian way with one decimal: 1.5 becomes "1,5". */
export function formatAverage(total: number, count: number): string {
  if (count === 0) return "0";
  return (total / count).toFixed(1).replace(".", ",").replace(/,0$/, "");
}

/** Counts for the Ringkasan tiles. One round trip per number, all in parallel. */
export async function loadSummary() {
  const [tenants, booths, boothsFilled, questions, questionsAnswered, sessionsTotal, sessionsWithQuestions, passports, passportsDone, redeemed, stamps] =
    await Promise.all([
      db.tenant.count(),
      db.booth.count(),
      db.booth.count({ where: { tenantId: { not: null } } }),
      db.question.count({ where: { kind: "QUESTION", hidden: false } }),
      db.question.count({ where: { kind: "QUESTION", hidden: false, answered: true } }),
      db.session.count(),
      db.question.groupBy({ by: ["sessionId"], where: { kind: "QUESTION", hidden: false } }).then((g) => g.length),
      db.passport.count(),
      db.passport.count({ where: { completedAt: { not: null } } }),
      db.passport.count({ where: { redeemedAt: { not: null } } }),
      db.stamp.count(),
    ]);
  return {
    tenants,
    booths,
    boothsEmpty: booths - boothsFilled,
    questions,
    questionsAnswered,
    sessionsTotal,
    sessionsWithQuestions,
    passports,
    passportsDone,
    redeemed,
    stamps,
    avgStamps: formatAverage(stamps, passports),
  };
}

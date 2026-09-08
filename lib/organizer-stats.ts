import { db } from "./db";

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

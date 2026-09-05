// Seed entry point. Filled in at checkpoint 4; until then it only honours --if-empty
// so the Railway start command (prisma migrate deploy && db:seed --if-empty && start) keeps working.
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const ifEmpty = process.argv.includes("--if-empty");
  const tenants = await db.tenant.count();
  if (ifEmpty && tenants > 0) {
    console.log(`Seed skipped, ${tenants} tenants already present.`);
    return;
  }
  console.log("Seed data not written yet. Nothing to do.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

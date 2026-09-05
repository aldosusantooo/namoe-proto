import { Prisma } from "@prisma/client";
import { db } from "./db";
import { applyStamp, type StampResult } from "./passport";
import { generateRedeemCode } from "./redeem";

const MAX_ATTEMPTS = 5;

function isUniqueViolation(err: unknown) {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

/**
 * Stamps one booth on one device's passport in a single transaction.
 * Retries when the fresh redeem code collides with an existing one.
 */
export async function stampBooth(deviceId: string, code: string, target: number): Promise<StampResult> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await db.$transaction(async (tx) => {
        const passport = await tx.passport.upsert({
          where: { deviceId },
          create: { deviceId },
          update: {},
          select: { id: true, completedAt: true, stamps: { select: { boothCode: true } } },
        });
        const result = applyStamp(
          passport.stamps.map((s) => s.boothCode),
          code,
          target,
        );
        if (result.added) {
          await tx.stamp.create({ data: { passportId: passport.id, boothCode: code } });
        }
        if (result.justCompleted && !passport.completedAt) {
          await tx.passport.update({
            where: { id: passport.id },
            data: { completedAt: new Date(), redeemCode: generateRedeemCode() },
          });
        }
        return result;
      });
    } catch (err) {
      if (isUniqueViolation(err) && attempt < MAX_ATTEMPTS) continue;
      throw err;
    }
  }
}

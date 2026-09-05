import { db } from "./db";

/** The Event singleton, id 1. */
export function getEvent() {
  return db.event.findUniqueOrThrow({ where: { id: 1 } });
}

import { notFound } from "next/navigation";

/** True only when the URL segment equals ORGANIZER_SECRET and the secret is configured. */
export function isOrganizerSecret(secret: string | undefined): boolean {
  const expected = process.env.ORGANIZER_SECRET;
  return Boolean(expected) && secret === expected;
}

/** 404 for anyone without the secret. Used by the organizer layout, pages and server actions. */
export function requireOrganizer(secret: string | undefined): void {
  if (!isOrganizerSecret(secret)) notFound();
}

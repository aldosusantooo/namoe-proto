import { requireOrganizer } from "@/lib/organizer";

// Every page here reads the database. Render at request time so `next build` never needs a database connection
// (Railway builds cannot reach the private Postgres network).
export const dynamic = "force-dynamic";

/** Gate only: each page renders its own OrganizerShell so the sidebar knows which section is active. */
export default async function OrganizerLayout({ children, params }: LayoutProps<"/organizer/[secret]">) {
  const { secret } = await params;
  requireOrganizer(secret);
  return <>{children}</>;
}

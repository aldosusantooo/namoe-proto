import Link from "next/link";
import { copy } from "@/lib/copy";
import { requireOrganizer } from "@/lib/organizer";

// Every page here reads the database. Render at request time so `next build` never needs a database connection
// (Railway builds cannot reach the private Postgres network).
export const dynamic = "force-dynamic";

export default async function OrganizerLayout({ children, params }: LayoutProps<"/organizer/[secret]">) {
  const { secret } = await params;
  requireOrganizer(secret);
  return (
    <main className="mx-auto min-h-screen max-w-[var(--dashboard-max)] px-6 py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-small font-semibold text-fg-soft">
        <Link href={`/organizer/${secret}`} className="text-fg">
          {copy.organizer.title}
        </Link>
        <Link href={`/organizer/${secret}/tukar`}>{copy.organizer.redeem}</Link>
        <Link href={`/organizer/${secret}/booth`}>{copy.organizer.boothLinks}</Link>
      </nav>
      {children}
    </main>
  );
}

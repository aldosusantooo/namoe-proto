import { DeviceSync } from "@/components/DeviceSync";
import { Nav } from "@/components/Nav";

// Every page here reads the database. Render at request time so `next build` never needs a database connection
// (Railway builds cannot reach the private Postgres network).
export const dynamic = "force-dynamic";

export default function VisitorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="mx-auto min-h-screen max-w-[var(--page-max)] px-[var(--page-gutter)] pb-[calc(var(--nav-height)+var(--safe-bottom)+24px)]">
        {children}
      </main>
      <Nav />
      <DeviceSync />
    </>
  );
}

import { Nav } from "@/components/Nav";

export default function VisitorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="mx-auto min-h-screen max-w-[var(--page-max)] px-[var(--page-gutter)] pb-[calc(var(--nav-height)+var(--safe-bottom)+24px)]">
        {children}
      </main>
      <Nav />
    </>
  );
}

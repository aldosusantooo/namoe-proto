// Tenant dashboard: phone-first, no visitor tab bar. The page renders its own pinned save bar.
export const dynamic = "force-dynamic";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-[var(--page-max)] px-[var(--page-gutter)] pb-[calc(var(--compose-height)+var(--safe-bottom)+32px)] pt-4">
      {children}
    </main>
  );
}

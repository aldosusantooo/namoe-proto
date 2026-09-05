import { copy } from "@/lib/copy";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-[var(--dashboard-max)] px-6 py-8">
      <p className="text-small font-semibold text-fg-muted">{copy.organizer.title}</p>
      {children}
    </main>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line-strong bg-surface-alt px-5 py-8 text-center text-body text-fg-soft">
      {children}
    </div>
  );
}

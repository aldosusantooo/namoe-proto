type Props = { title: string; subtitle?: string; children?: React.ReactNode };

export function PageHeader({ title, subtitle, children }: Props) {
  return (
    <header className="pt-6 pb-4">
      <h1 className="font-display text-display text-fg">{title}</h1>
      {subtitle ? <p className="mt-1 text-body text-fg-soft">{subtitle}</p> : null}
      {children}
    </header>
  );
}

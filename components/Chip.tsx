import Link from "next/link";

type Props = {
  href: string;
  active?: boolean;
  color?: string;
  children: React.ReactNode;
};

export function Chip({ href, active = false, color, children }: Props) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={`inline-flex h-10 min-h-[var(--tap-min)] shrink-0 items-center gap-2 rounded-pill border px-4 text-small font-semibold transition-colors duration-[var(--duration-fast)] ${
        active ? "border-fg bg-fg text-surface" : "border-border bg-surface text-fg-soft"
      }`}
    >
      {color ? <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: color }} /> : null}
      {children}
    </Link>
  );
}

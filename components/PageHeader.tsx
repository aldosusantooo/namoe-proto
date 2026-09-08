import { BackButton } from "./BackButton";

type Props = {
  title?: string;
  /** Parent route for the back button. Rendering it means this page is not a tab. */
  back?: string;
  /** Trailing slot: a pill, an eyebrow, or a ghost sm button. */
  action?: React.ReactNode;
  /** Replaces the title node when the header carries something other than an h1 (for example a Fredoka eyebrow). */
  children?: React.ReactNode;
  className?: string;
};

/** One row, min 48 high: optional back button, growing title, optional trailing action. No subtitles, no eyebrows above. */
export function PageHeader({ title, back, action, children, className = "" }: Props) {
  return (
    <header className={`flex min-h-12 items-center gap-2.5 ${className}`}>
      {back ? <BackButton fallback={back} /> : null}
      {children ?? <h1 className="min-w-0 flex-1 font-display text-h1 text-ink">{title}</h1>}
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </header>
  );
}

/** Section heading row: h2 left, optional trailing eyebrow link or pill right. */
export function SectionHeader({ title, action, as = "h2" }: { title: string; action?: React.ReactNode; as?: "h2" | "h3" }) {
  const Tag = as;
  return (
    <div className="flex min-h-8 items-center gap-2.5">
      <Tag className="min-w-0 flex-1 font-display text-h2 text-ink">{title}</Tag>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}

/** Fredoka 600 14 navy, sentence case. As a link when `href` is set. */
export function Eyebrow({ children, href, className = "", tone = "navy" }: { children: React.ReactNode; href?: string; className?: string; tone?: "navy" | "ink" | "cream" }) {
  const color = tone === "navy" ? "text-navy" : tone === "ink" ? "text-ink" : "text-cream";
  const cls = `font-display text-eyebrow ${color} ${className}`;
  if (href) {
    return (
      <a href={href} className={`${cls} inline-flex min-h-11 items-center`}>
        {children}
      </a>
    );
  }
  return <span className={cls}>{children}</span>;
}

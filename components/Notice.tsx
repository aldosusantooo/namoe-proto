import { IconCheck, IconClose } from "./icons/UiIcons";

type Props = { tone: "ok" | "warn"; icon?: React.ReactNode; children: React.ReactNode; className?: string };

/** Server-rendered status message, usually driven by query params. ok is green, warn is yellow. */
export function Notice({ tone, icon, children, className = "" }: Props) {
  const tones = {
    ok: "border-success-line bg-success-soft text-success-ink",
    warn: "border-yellow bg-yellow-soft text-ink",
  };
  const fallback = tone === "ok" ? <IconCheck size={24} /> : <IconClose size={24} />;
  return (
    <p role="status" className={`flex items-center gap-3 rounded-md border-2 px-3.5 py-3 text-body font-bold ${tones[tone]} ${className}`}>
      <span className="shrink-0">{icon ?? fallback}</span>
      <span>{children}</span>
    </p>
  );
}

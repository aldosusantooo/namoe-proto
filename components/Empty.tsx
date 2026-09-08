import { Mascot, type MascotKey } from "./icons/Mascots";

const ART: Record<"search" | "questions" | "stamps" | "feed", MascotKey> = {
  search: "green",
  questions: "pink",
  stamps: "blue",
  feed: "orange",
};

type Props = { kind: keyof typeof ART; title: string; body?: string; className?: string };

/** Dashed cream box with a 64px mascot on the left, a Fredoka title and one line of body. */
export function Empty({ kind, title, body, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-3.5 rounded-lg border-2 border-dashed border-line-strong bg-cream px-4 py-3.5 ${className}`}>
      <Mascot name={ART[kind]} size={64} className="shrink-0" />
      <div className="min-w-0">
        <p className="font-display text-[17px] font-semibold text-ink">{title}</p>
        {body ? <p className="text-small text-ink-soft">{body}</p> : null}
      </div>
    </div>
  );
}

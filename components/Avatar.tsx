/** Speaker avatar: photo when there is one, otherwise initials on a brand hue picked from the name. */

const HUES = [
  { bg: "var(--color-coral)", fg: "var(--color-paper)" },
  { bg: "var(--color-pink)", fg: "var(--color-ink)" },
  { bg: "var(--color-green)", fg: "var(--color-paper)" },
  { bg: "var(--color-blue)", fg: "var(--color-paper)" },
  { bg: "var(--color-orange)", fg: "var(--color-ink)" },
];

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length >= 2 ? [parts[0][0], parts[parts.length - 1][0]] : [parts[0]?.[0] ?? "", parts[0]?.[1] ?? ""];
  return letters.join("").toUpperCase();
}

function hueFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return HUES[h % HUES.length];
}

type Props = { name: string; photoUrl?: string | null; size?: number; className?: string };

export function Avatar({ name, photoUrl, size = 40, className = "" }: Props) {
  const hue = hueFor(name);
  const font = Math.round(size * 0.4);
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        loading="lazy"
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-semibold leading-none ${className}`}
      style={{ width: size, height: size, background: hue.bg, color: hue.fg, fontSize: font }}
    >
      {initials(name)}
    </span>
  );
}

// The five blob mascots (approximations of Theo's originals; same file names and viewBox when the originals land).
// Art only: empty states, the hero corner, the passport. Never UI chrome.
import type { CSSProperties } from "react";

export type MascotProps = { size?: number; className?: string; style?: CSSProperties };

export function MascotBiru({ size = 64, className, style }: MascotProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className={className} style={style}>
      <path fill="var(--color-blue)" d="M52 6c8 0 14 10 22 30s20 40 16 50c-3 8-30 10-40 10S10 94 8 86C4 74 20 48 30 30S44 6 52 6z"/><g><circle cx="40" cy="44" r="10" fill="var(--color-paper)"/><circle cx="43" cy="46" r="5" fill="var(--color-ink)"/><circle cx="62" cy="40" r="10" fill="var(--color-paper)"/><circle cx="65" cy="42" r="5" fill="var(--color-ink)"/></g>
    </svg>
  );
}

export function MascotHijau({ size = 64, className, style }: MascotProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className={className} style={style}>
      <circle cx="50" cy="52" r="44" fill="var(--color-green)"/><g><circle cx="38" cy="44" r="10" fill="var(--color-paper)"/><circle cx="40" cy="46" r="5" fill="var(--color-ink)"/><circle cx="62" cy="44" r="10" fill="var(--color-paper)"/><circle cx="64" cy="46" r="5" fill="var(--color-ink)"/></g>
    </svg>
  );
}

export function MascotPink({ size = 64, className, style }: MascotProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className={className} style={style}>
      <rect x="20" y="4" width="60" height="92" rx="30" fill="var(--color-pink)"/><g><circle cx="40" cy="36" r="9" fill="var(--color-paper)"/><circle cx="41" cy="38" r="4.5" fill="var(--color-ink)"/><circle cx="60" cy="36" r="9" fill="var(--color-paper)"/><circle cx="61" cy="38" r="4.5" fill="var(--color-ink)"/></g>
    </svg>
  );
}

export function MascotMerah({ size = 64, className, style }: MascotProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className={className} style={style}>
      <g fill="var(--color-coral)"><circle cx="50" cy="26" r="22"/><circle cx="26" cy="50" r="22"/><circle cx="74" cy="50" r="22"/><circle cx="50" cy="74" r="22"/><circle cx="50" cy="50" r="24"/></g><g><circle cx="41" cy="44" r="9" fill="var(--color-paper)"/><circle cx="42" cy="46" r="4.5" fill="var(--color-ink)"/><circle cx="60" cy="44" r="9" fill="var(--color-paper)"/><circle cx="61" cy="46" r="4.5" fill="var(--color-ink)"/></g>
    </svg>
  );
}

export function MascotOranye({ size = 64, className, style }: MascotProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className={className} style={style}>
      <rect x="8" y="10" width="84" height="84" rx="26" fill="var(--color-orange)"/><g><circle cx="38" cy="42" r="10" fill="var(--color-paper)"/><circle cx="36" cy="40" r="5" fill="var(--color-ink)"/><circle cx="62" cy="42" r="10" fill="var(--color-paper)"/><circle cx="60" cy="40" r="5" fill="var(--color-ink)"/></g>
    </svg>
  );
}

export const MASCOTS = {
  blue: MascotBiru,
  green: MascotHijau,
  pink: MascotPink,
  red: MascotMerah,
  orange: MascotOranye,
} as const;

export type MascotKey = keyof typeof MASCOTS;

export function Mascot({ name, ...rest }: MascotProps & { name: MascotKey }) {
  const Art = MASCOTS[name];
  return <Art {...rest} />;
}

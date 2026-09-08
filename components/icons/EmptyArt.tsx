// Empty-state art, 160 x 120: a mascot plus a prop. `size` is the rendered width; height keeps the 4:3 box.
import type { CSSProperties } from "react";

export type EmptyArtProps = { size?: number; className?: string; style?: CSSProperties };

export function EmptyNoResults({ size = 160, className, style }: EmptyArtProps) {
  return (
    <svg aria-hidden="true" width={size} height={Math.round((size * 120) / 160)} viewBox="0 0 160 120" className={className} style={style}>
      <g transform="translate(20 14)"><circle cx="50" cy="52" r="44" fill="var(--color-green)"/><g><circle cx="38" cy="44" r="10" fill="var(--color-paper)"/><circle cx="40" cy="46" r="5" fill="var(--color-ink)"/><circle cx="62" cy="44" r="10" fill="var(--color-paper)"/><circle cx="64" cy="46" r="5" fill="var(--color-ink)"/></g></g>
      <g transform="translate(104 44)" fill="none" stroke="var(--color-ink)" strokeWidth="5" strokeLinecap="round"><circle cx="18" cy="18" r="15"/><path d="m29 29 14 14"/></g>
    </svg>
  );
}

export function EmptyNoQuestions({ size = 160, className, style }: EmptyArtProps) {
  return (
    <svg aria-hidden="true" width={size} height={Math.round((size * 120) / 160)} viewBox="0 0 160 120" className={className} style={style}>
      <g transform="translate(24 12)"><rect x="20" y="4" width="60" height="92" rx="30" fill="var(--color-pink)"/><g><circle cx="40" cy="36" r="9" fill="var(--color-paper)"/><circle cx="41" cy="38" r="4.5" fill="var(--color-ink)"/><circle cx="60" cy="36" r="9" fill="var(--color-paper)"/><circle cx="61" cy="38" r="4.5" fill="var(--color-ink)"/></g></g>
      <g transform="translate(96 26)"><path d="M6 6a6 6 0 0 1 6-6h34a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6H22l-12 10V34H12a6 6 0 0 1-6-6z" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="4"/><circle cx="20" cy="17" r="3" fill="var(--color-ink)"/><circle cx="30" cy="17" r="3" fill="var(--color-ink)"/><circle cx="40" cy="17" r="3" fill="var(--color-ink)"/></g>
    </svg>
  );
}

export function EmptyNoStamps({ size = 160, className, style }: EmptyArtProps) {
  return (
    <svg aria-hidden="true" width={size} height={Math.round((size * 120) / 160)} viewBox="0 0 160 120" className={className} style={style}>
      <g transform="translate(14 14)"><path fill="var(--color-blue)" d="M52 6c8 0 14 10 22 30s20 40 16 50c-3 8-30 10-40 10S10 94 8 86C4 74 20 48 30 30S44 6 52 6z"/><g><circle cx="40" cy="44" r="10" fill="var(--color-paper)"/><circle cx="43" cy="46" r="5" fill="var(--color-ink)"/><circle cx="62" cy="40" r="10" fill="var(--color-paper)"/><circle cx="65" cy="42" r="5" fill="var(--color-ink)"/></g></g>
      <g transform="translate(98 30) scale(0.56)"><path d="M95.5 50.0 L94.4 52.9 L91.6 55.5 L88.8 57.7 L87.2 60.0 L87.4 62.7 L88.8 66.1 L89.9 69.7 L89.4 72.8 L87.0 74.7 L83.3 75.6 L79.7 76.1 L77.2 77.2 L76.1 79.7 L75.6 83.3 L74.7 87.0 L72.8 89.4 L69.7 89.9 L66.1 88.8 L62.7 87.4 L60.0 87.2 L57.7 88.8 L55.5 91.6 L52.9 94.4 L50.0 95.5 L47.1 94.4 L44.5 91.6 L42.3 88.8 L40.0 87.2 L37.3 87.4 L33.9 88.8 L30.3 89.9 L27.3 89.4 L25.3 87.0 L24.4 83.3 L23.9 79.7 L22.8 77.2 L20.3 76.1 L16.7 75.6 L13.0 74.7 L10.6 72.8 L10.1 69.7 L11.2 66.1 L12.6 62.7 L12.8 60.0 L11.2 57.7 L8.4 55.5 L5.6 52.9 L4.5 50.0 L5.6 47.1 L8.4 44.5 L11.2 42.3 L12.8 40.0 L12.6 37.3 L11.2 33.9 L10.1 30.3 L10.6 27.2 L13.0 25.3 L16.7 24.4 L20.3 23.9 L22.8 22.8 L23.9 20.3 L24.4 16.7 L25.3 13.0 L27.2 10.6 L30.3 10.1 L33.9 11.2 L37.3 12.6 L40.0 12.8 L42.3 11.2 L44.5 8.4 L47.1 5.6 L50.0 4.5 L52.9 5.6 L55.5 8.4 L57.7 11.2 L60.0 12.8 L62.7 12.6 L66.1 11.2 L69.7 10.1 L72.8 10.6 L74.7 13.0 L75.6 16.7 L76.1 20.3 L77.2 22.8 L79.7 23.9 L83.3 24.4 L87.0 25.3 L89.4 27.2 L89.9 30.3 L88.8 33.9 L87.4 37.3 L87.2 40.0 L88.8 42.3 L91.6 44.5 L94.4 47.1 L95.5 50.0 Z" fill="var(--stamp-empty)" stroke="var(--stamp-empty-stroke)" strokeWidth="4" strokeDasharray="7 6"/></g>
    </svg>
  );
}

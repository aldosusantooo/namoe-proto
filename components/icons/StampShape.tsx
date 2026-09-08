import type { CSSProperties } from "react";
import { BURST_PATH, BURST_VIEWBOX, STAMP_PATH, STAMP_VIEWBOX } from "@/lib/stamp-path";

type ShapeProps = { className?: string; style?: CSSProperties };

/**
 * The wavy stamp outline (12 waves) as a full-size background SVG. Fill and stroke come from the parent
 * through props so Stamp.tsx can paint it with a category colour or the empty cream.
 */
export function StampShape({
  fill,
  stroke,
  strokeWidth = 0,
  dashed = false,
  className,
  style,
  children,
}: ShapeProps & { fill: string; stroke?: string; strokeWidth?: number; dashed?: boolean; children?: React.ReactNode }) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${STAMP_VIEWBOX} ${STAMP_VIEWBOX}`} className={className} style={style}>
      <path
        d={STAMP_PATH}
        fill={fill}
        stroke={stroke}
        strokeWidth={stroke ? strokeWidth : undefined}
        strokeDasharray={dashed ? "6 5" : undefined}
      />
      {children}
    </svg>
  );
}

/** Dashed yellow ring (16 waves) drawn around the stamp that was just earned. */
export function StampBurst({ className, style }: ShapeProps) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${BURST_VIEWBOX} ${BURST_VIEWBOX}`} className={className} style={style}>
      <path d={BURST_PATH} fill="none" stroke="var(--stamp-burst)" strokeWidth="5" strokeDasharray="10 9" />
    </svg>
  );
}

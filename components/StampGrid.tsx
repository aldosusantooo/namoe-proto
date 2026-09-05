import { cssVar, type CategoryKey } from "@/lib/categories";

export type StampSlot = { code: string; category: CategoryKey | null };

/** `target` slots. Filled slots show the booth code on a category-coloured circle, empty ones a dashed ring. */
export function StampGrid({ stamps, target }: { stamps: StampSlot[]; target: number }) {
  const slots = Array.from({ length: target }, (_, i) => stamps[i] ?? null);
  return (
    <ul className="flex flex-wrap justify-center gap-3" aria-label="Stempel">
      {slots.map((slot, i) => (
        <li
          key={i}
          className="flex items-center justify-center rounded-full font-display text-h3 text-white"
          style={{
            width: "var(--stamp-size)",
            height: "var(--stamp-size)",
            background: slot ? (slot.category ? cssVar(slot.category) : "var(--color-fg)") : "var(--stamp-empty)",
            border: slot ? "none" : "2px dashed var(--stamp-empty-stroke)",
            transform: slot ? `rotate(${((i * 7) % 11) - 5}deg)` : undefined,
          }}
        >
          {slot ? slot.code : ""}
        </li>
      ))}
    </ul>
  );
}

import Link from "next/link";
import { copy } from "@/lib/copy";

export default function SessionNotFound() {
  return (
    <div className="flex flex-col gap-4 pt-8">
      <h1 className="font-display text-display text-fg">{copy.qa.sessionNotFound}</h1>
      <Link href="/jadwal" className="inline-flex min-h-[var(--tap-min)] items-center font-bold text-link">
        {copy.qa.backToSchedule}
      </Link>
    </div>
  );
}

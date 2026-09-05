import Link from "next/link";
import { Empty } from "@/components/Empty";
import { copy } from "@/lib/copy";

export default function TenantNotFound() {
  return (
    <div className="flex flex-col gap-4 pt-8">
      <h1 className="font-display text-display text-fg">{copy.tenant.notFound}</h1>
      <Empty>{copy.tenant.notFoundHint}</Empty>
      <Link href="/tenant" className="inline-flex min-h-[var(--tap-min)] items-center font-bold text-link">
        {copy.tenant.backToDirectory}
      </Link>
    </div>
  );
}

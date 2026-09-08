import { MascotPink } from "@/components/icons/Mascots";
import { PageHeader } from "@/components/PageHeader";
import { copy } from "@/lib/copy";

export default function TenantEditNotFound() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={copy.tenantEdit.title} />
      <div className="flex items-center gap-3.5 rounded-lg border-2 border-dashed border-line-strong bg-cream px-4 py-3.5">
        <MascotPink size={64} className="shrink-0" />
        <div>
          <p className="font-display text-[17px] font-semibold text-ink">{copy.tenantEdit.notFoundTitle}</p>
          <p className="text-small text-ink-soft">{copy.tenantEdit.notFoundBody}</p>
        </div>
      </div>
    </div>
  );
}

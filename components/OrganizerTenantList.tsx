import type { Category } from "@prisma/client";
import { sortCodes } from "@/lib/booth-label";
import { byKey } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { Card } from "./Card";
import { Eyebrow } from "./PageHeader";
import { PlaceholderArt } from "./PlaceholderArt";

export type OrganizerTenantRow = {
  slug: string;
  name: string;
  category: Category;
  logoUrl: string | null;
  editToken: string;
  booths: { code: string }[];
};

type Props = { secret: string; tenants: OrganizerTenantRow[]; total?: number; title?: string };

/** Organizer tenant list: 40px thumb, name, category and codes, the two links Theo needs most. */
export function OrganizerTenantList({ secret, tenants, total, title = copy.organizer.tenants }: Props) {
  return (
    <Card>
      <h2 className="flex items-center justify-between border-b-2 border-line bg-cream px-4 py-3 font-display text-[17px] font-semibold text-ink">
        {title}
        {total !== undefined && total > tenants.length ? <Eyebrow href={`/organizer/${secret}/tenant`}>{copy.organizer.allTenants(total)}</Eyebrow> : null}
      </h2>
      <ul className="divide-y-2 divide-line">
        {tenants.map((t) => {
          const codes = sortCodes(t.booths.map((b) => b.code));
          return (
            <li key={t.slug} className="grid grid-cols-[40px_1fr_auto_auto] items-center gap-3 px-4 py-2 text-small">
              <span className="size-10 overflow-hidden rounded-[10px]">
                {t.logoUrl ? <img src={t.logoUrl} alt="" className="h-full w-full object-cover" /> : <PlaceholderArt name={t.name} category={t.category} variant="thumb" />}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-bold text-ink">{t.name}</span>
                <span className="block truncate text-ink-soft">
                  {byKey(t.category).label}, {codes.join(", ")}
                </span>
              </span>
              <Eyebrow href={`/t/${t.editToken}/edit`}>{copy.organizer.editLink}</Eyebrow>
              <Eyebrow href={`/organizer/${secret}/booth#${codes[0] ?? ""}`}>{copy.organizer.qr}</Eyebrow>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

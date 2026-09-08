"use client";

import type { Category } from "@prisma/client";
import { copy } from "@/lib/copy";
import { useSaved } from "@/lib/saved";
import { Chip } from "./Chip";
import { Empty } from "./Empty";
import { SaveButton } from "./SaveButton";
import { TenantCard } from "./TenantCard";

export type GridTenant = {
  slug: string;
  name: string;
  category: Category;
  logoUrl: string | null;
  photos: string[];
  /** Epoch milliseconds, serialisable across the server boundary. */
  updatedAt: number;
  booths: { code: string }[];
};

type Props = {
  tenants: GridTenant[];
  /** ?simpan=1: show only the saved tenants. */
  savedMode: boolean;
  /** Count line for the normal mode, rendered by the server. */
  countLine: string;
};

/** Directory grid with the heart on each card. In saved mode the list is filtered on the device. */
export function TenantGrid({ tenants, savedMode, countLine }: Props) {
  const { saved, hydrated } = useSaved();
  const list = savedMode ? tenants.filter((t) => saved.includes(t.slug)) : tenants;
  return (
    <>
      <p className="-mt-1 text-small text-ink-soft">{savedMode ? (hydrated ? copy.directory.savedCount(list.length) : "") : countLine}</p>
      {list.length ? (
        <ul className="grid grid-cols-2 gap-3">
          {list.map((t) => (
            <li key={t.slug}>
              <TenantCard tenant={{ ...t, updatedAt: new Date(t.updatedAt) }} trailing={<SaveButton slug={t.slug} className="absolute right-2 top-2" />} />
            </li>
          ))}
        </ul>
      ) : savedMode ? (
        hydrated ? <Empty kind="search" title={copy.directory.savedEmptyTitle} body={copy.directory.savedEmptyBody} /> : null
      ) : (
        <Empty kind="search" title={copy.directory.emptyTitle} body={copy.directory.emptyBody} />
      )}
    </>
  );
}

/** "Tersimpan" filter chip, rendered only when the device has saved at least one tenant. */
export function SavedChip({ active, href }: { active: boolean; href: string }) {
  const { saved, hydrated } = useSaved();
  if (!hydrated || (!saved.length && !active)) return null;
  return (
    <Chip href={href} active={active}>
      {copy.directory.saved}
    </Chip>
  );
}

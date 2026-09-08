"use client";

import { useState } from "react";
import { copy } from "@/lib/copy";
import { Button } from "./Button";
import { TabPeta } from "./icons/TabIcons";
import { IconClose, IconSearch } from "./icons/UiIcons";
import { SearchBox } from "./SearchBox";

type Props = { mapHref: string; initialOpen: boolean };

/**
 * One-row header for /tenant: title, search icon button, "Peta" ghost button. Tapping search expands the
 * SearchBox under the header and swaps the icon for a close; the header shows the search open when ?q= is set.
 */
export function DirectoryHeader({ mapHref, initialOpen }: Props) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div className="flex flex-col gap-3">
      <header className="flex min-h-12 items-center gap-2.5">
        <h1 className="min-w-0 flex-1 font-display text-h1 text-ink">{copy.nav.tenants}</h1>
        <Button variant="ghost" icon aria-label={open ? copy.common.close : copy.common.search} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <IconClose size={24} /> : <IconSearch size={24} />}
        </Button>
        <Button href={mapHref} variant="ghost" sm>
          <TabPeta size={20} />
          {copy.nav.map}
        </Button>
      </header>
      {open ? <SearchBox basePath="/tenant" autoFocus={!initialOpen} /> : null}
    </div>
  );
}

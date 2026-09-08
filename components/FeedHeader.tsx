"use client";

import { useState } from "react";
import { copy } from "@/lib/copy";
import { Button } from "./Button";
import { Notice } from "./Notice";
import { FeedComposerForm } from "./tenant-edit/FeedComposer";
import type { StatefulAction } from "./tenant-edit/TenantDashboard";

/** /feed header: title plus a primary sm "Tulis kabar"; the composer card opens under the header row, or on load with ?tulis=1. */
export function FeedHeader({ postFeed, initialOpen = false }: { postFeed: StatefulAction; initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [message, setMessage] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <header className="flex min-h-12 items-center gap-2.5">
        <h1 className="min-w-0 flex-1 font-display text-h1 text-ink">{copy.feed.title}</h1>
        {open ? null : (
          <Button variant="primary" sm onClick={() => setOpen(true)}>
            {copy.feed.write}
          </Button>
        )}
      </header>
      {message && !open ? <Notice tone="ok">{message}</Notice> : null}
      {open ? (
        <FeedComposerForm
          postFeed={postFeed}
          title={copy.feed.write}
          withName
          onClose={() => setOpen(false)}
          onPosted={(m) => {
            setMessage(m ?? null);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

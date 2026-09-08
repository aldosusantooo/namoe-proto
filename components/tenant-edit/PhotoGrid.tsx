"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ActionResult } from "@/actions/tenant";
import { copy } from "@/lib/copy";
import { Button } from "../Button";
import { Card } from "../Card";
import { BoothPill, Pill } from "../CategoryBadge";
import { IconClose, IconZoomIn } from "../icons/UiIcons";
import { Notice } from "../Notice";
import { SectionHeader } from "../PageHeader";
import { PlaceholderArt } from "../PlaceholderArt";
import type { DashboardTenant, PlainAction, StatefulAction } from "./TenantDashboard";

const MAX = 5;

type Props = {
  tenant: Pick<DashboardTenant, "name" | "category" | "photos" | "logoUrl">;
  addPhotoUrl: StatefulAction;
  uploadPhoto: StatefulAction;
  removePhoto: PlainAction;
};

/** Five product photo tiles plus a sixth logo tile. "Tambah" opens a small sheet: paste a URL or upload a file. */
export function PhotoGrid({ tenant, addPhotoUrl, uploadPhoto, removePhoto }: Props) {
  const [adding, setAdding] = useState<"photo" | "logo" | null>(null);
  const [urlState, urlAction, urlPending] = useActionState<ActionResult, FormData>(addPhotoUrl, null);
  const [fileState, fileAction, filePending] = useActionState<ActionResult, FormData>(uploadPhoto, null);
  const fileForm = useRef<HTMLFormElement>(null);
  const lastOk = useRef<ActionResult>(null);

  useEffect(() => {
    const latest = urlState?.ok ? urlState : fileState?.ok ? fileState : null;
    if (latest && latest !== lastOk.current) {
      lastOk.current = latest;
      setAdding(null);
    }
  }, [urlState, fileState]);

  const error = (urlState && !urlState.ok ? urlState.error : null) ?? (fileState && !fileState.ok ? fileState.error : null);
  const tiles: Array<{ kind: "photo"; src: string; index: number } | { kind: "add" }> = tenant.photos.map((src, index) => ({ kind: "photo" as const, src, index }));
  while (tiles.length < MAX) tiles.push({ kind: "add" });

  return (
    <section className="flex flex-col gap-2.5">
      <SectionHeader title={copy.tenantEdit.photos} action={<span className="text-small text-ink-soft">{copy.tenantEdit.photosCount(tenant.photos.length, MAX)}</span>} />
      <ul className="grid grid-cols-3 gap-2">
        {tiles.map((t, i) =>
          t.kind === "photo" ? (
            <li key={`${t.src}-${t.index}`} className="relative aspect-square overflow-hidden rounded-[14px] border-2 border-edge bg-cream-deep">
              <img src={t.src} alt={copy.tenant.photoAlt(tenant.name, t.index + 1)} className="h-full w-full object-cover" />
              {t.index === 0 ? <Pill tone="navy" className="absolute left-1.5 top-1.5 min-h-6 px-2 text-caption">{copy.tenantEdit.primary}</Pill> : null}
              <form action={removePhoto} className="absolute bottom-1 right-1">
                <input type="hidden" name="index" value={t.index} />
                <button type="submit" aria-label={copy.tenantEdit.removePhoto} className="flex size-11 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sticker-code">
                  <IconClose size={20} />
                </button>
              </form>
            </li>
          ) : (
            <li key={`add-${i}`}>
              <button
                type="button"
                onClick={() => setAdding("photo")}
                className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-[14px] border-2 border-dashed border-line-strong bg-cream-deep font-display text-small font-semibold text-navy"
              >
                <IconZoomIn size={26} />
                {copy.tenantEdit.addPhoto}
              </button>
            </li>
          ),
        )}
        <li className="relative aspect-square overflow-hidden rounded-[14px] border-2 border-edge">
          {tenant.logoUrl ? (
            <>
              <img src={tenant.logoUrl} alt="" className="h-full w-full object-cover" />
              <form action={removePhoto} className="absolute right-1 top-1">
                <input type="hidden" name="target" value="logo" />
                <button type="submit" aria-label={copy.tenantEdit.removePhoto} className="flex size-11 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sticker-code">
                  <IconClose size={20} />
                </button>
              </form>
            </>
          ) : (
            <button type="button" onClick={() => setAdding("logo")} aria-label={copy.tenantEdit.addLogo} className="block h-full w-full">
              <PlaceholderArt name={tenant.name} category={tenant.category} variant="thumb" />
            </button>
          )}
          <BoothPill size="sm" className="pointer-events-none absolute bottom-1.5 left-1.5">
            {copy.tenantEdit.logo}
          </BoothPill>
        </li>
      </ul>
      <p className="text-small text-ink-soft">{copy.tenantEdit.photosHint}</p>

      {adding ? (
        <Card pad className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <p className="flex-1 font-display text-h3 text-ink">{adding === "logo" ? copy.tenantEdit.addLogo : copy.tenantEdit.addPhoto}</p>
            <Button variant="ghost" icon sm aria-label={copy.common.close} onClick={() => setAdding(null)}>
              <IconClose size={22} />
            </Button>
          </div>
          <form action={urlAction} className="flex gap-2">
            <input type="hidden" name="target" value={adding} />
            <input
              name="url"
              type="url"
              inputMode="url"
              required
              placeholder={copy.tenantEdit.pasteUrl}
              aria-label={copy.tenantEdit.pasteUrl}
              className="h-12 min-w-0 flex-1 rounded-pill border-2 border-edge bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
            />
            <Button type="submit" variant="primary" sm disabled={urlPending}>
              {copy.tenantEdit.useUrl}
            </Button>
          </form>
          <form ref={fileForm} action={fileAction} className="flex flex-col gap-1">
            <input type="hidden" name="target" value={adding} />
            <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-pill border-2 border-edge bg-paper px-5 font-display text-[17px] font-semibold text-navy shadow-btn-ghost">
              {filePending ? copy.tenantEdit.saving : copy.tenantEdit.upload}
              <input
                type="file"
                name="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={() => fileForm.current?.requestSubmit()}
              />
            </label>
            <span className="text-caption text-ink-soft">{copy.tenantEdit.uploadHint}</span>
          </form>
          {error ? <Notice tone="warn">{error}</Notice> : null}
        </Card>
      ) : null}
    </section>
  );
}

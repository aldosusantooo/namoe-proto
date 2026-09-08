"use client";

import { useActionState, useRef, useState } from "react";
import type { ActionResult } from "@/actions/tenant";
import type { Category } from "@prisma/client";
import { catVar } from "@/lib/categories";
import { copy } from "@/lib/copy";
import { INTRO_MAX, PROMO_MAX } from "@/lib/validate";
import { Button } from "../Button";
import { Card } from "../Card";
import { BoothPill, CategoryBadge, Pill } from "../CategoryBadge";
import { Empty } from "../Empty";
import { IconCheck, IconExternalLink, IconInstagram, IconMarketplace, IconPin, IconTiktok } from "../icons/UiIcons";
import { Notice } from "../Notice";
import { SectionHeader } from "../PageHeader";
import { PlaceholderArt } from "../PlaceholderArt";
import { FeedComposer } from "./FeedComposer";
import { PhotoGrid } from "./PhotoGrid";
import { PostsModeration } from "./PostsModeration";
import { SlotEditor } from "./SlotEditor";

export type DashboardTenant = {
  slug: string;
  name: string;
  category: Category;
  intro: string;
  promo: string | null;
  promoVisible: boolean;
  instagram: string | null;
  tiktok: string | null;
  marketplace: string | null;
  photos: string[];
  logoUrl: string | null;
  codes: string[];
  slots: { id: string; label: string; time: string | null; day: number | null }[];
  posts: { id: string; body: string; displayName: string | null; reply: string | null; pinned: boolean; hidden: boolean }[];
  feedCount: number;
};

export type StatefulAction = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
export type PlainAction = (formData: FormData) => Promise<void>;

export type DashboardActions = {
  saveProfile: StatefulAction;
  addPhotoUrl: StatefulAction;
  uploadPhoto: StatefulAction;
  removePhoto: PlainAction;
  addSlot: StatefulAction;
  removeSlot: PlainAction;
  replyPost: StatefulAction;
  togglePin: PlainAction;
  toggleHide: PlainAction;
  postFeed: StatefulAction;
};

type Props = { token: string; tenant: DashboardTenant; actions: DashboardActions };

const FORM_ID = "tenant-profile";
const INPUT = "w-full rounded-md border-2 border-edge bg-paper px-3.5 py-2.5 text-body text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none";

/**
 * The whole /t/[token]/edit page. One form (intro, promo, links) saves from the pinned bar and reports
 * "Tersimpan" or "Belum disimpan"; photos, slots, replies, pins and feed posts save on their own action.
 */
export function TenantDashboard({ tenant, actions }: Props) {
  const [dirty, setDirty] = useState(false);
  const [promoVisible, setPromoVisible] = useState(tenant.promoVisible);
  const [introLen, setIntroLen] = useState(tenant.intro.length);
  const form = useRef<HTMLFormElement>(null);
  // Wrapping the action (instead of watching its state in an effect) clears the dirty flag exactly once per save.
  const [saveState, saveAction, saving] = useActionState<ActionResult, FormData>(async (prev, formData) => {
    const result = await actions.saveProfile(prev, formData);
    if (result?.ok) setDirty(false);
    return result;
  }, null);

  const unanswered = tenant.posts.filter((p) => !p.hidden && !p.reply).length;
  const accent = catVar(tenant.category);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex min-h-12 items-center gap-2.5">
        <h1 className="min-w-0 flex-1 font-display text-h1 text-ink">{copy.tenantEdit.title}</h1>
        {dirty ? (
          <Pill tone="navy">{copy.tenantEdit.dirty}</Pill>
        ) : (
          <Pill tone="outline">
            <IconCheck size={16} />
            {copy.tenantEdit.saved}
          </Pill>
        )}
      </header>

      <Card className="flex items-center gap-3 p-3">
        <div className="size-[var(--thumb-size)] shrink-0 overflow-hidden rounded-md">
          {tenant.logoUrl ? <img src={tenant.logoUrl} alt="" className="h-full w-full object-cover" /> : <PlaceholderArt name={tenant.name} category={tenant.category} variant="thumb" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-h3 text-ink">{tenant.name}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <CategoryBadge category={tenant.category} size="sm" />
            {tenant.codes.length ? <BoothPill size="sm">{tenant.codes.join(", ")}</BoothPill> : null}
          </div>
        </div>
        <Button href={`/tenant/${tenant.slug}`} variant="ghost" icon aria-label={copy.tenantEdit.viewPublic}>
          <IconExternalLink size={24} />
        </Button>
      </Card>

      <Notice tone="warn" icon={<IconPin size={24} />}>
        <span className="text-small">{copy.tenantEdit.warning}</span>
      </Notice>

      <PhotoGrid tenant={tenant} addPhotoUrl={actions.addPhotoUrl} uploadPhoto={actions.uploadPhoto} removePhoto={actions.removePhoto} />

      <form id={FORM_ID} ref={form} action={saveAction} onInput={() => setDirty(true)} className="flex flex-col gap-4">
        <section className="flex flex-col gap-2.5">
          <SectionHeader title={copy.tenantEdit.intro} action={introLen >= 500 ? <span className="text-small text-ink-soft">{copy.tenantEdit.introCounter(introLen, INTRO_MAX)}</span> : undefined} />
          <Card>
            <textarea
              name="intro"
              defaultValue={tenant.intro}
              maxLength={INTRO_MAX}
              rows={4}
              onInput={(e) => setIntroLen(e.currentTarget.value.length)}
              placeholder={copy.tenantEdit.introPlaceholder}
              aria-label={copy.tenantEdit.intro}
              className="min-h-24 w-full resize-y border-0 bg-paper px-3.5 py-3 text-body leading-[1.45] text-ink placeholder:text-ink-muted focus:outline-none"
            />
          </Card>
        </section>

        <section className="flex flex-col gap-2.5">
          <SectionHeader
            title={copy.tenantEdit.promo}
            action={
              <button
                type="button"
                onClick={() => {
                  setPromoVisible((v) => !v);
                  setDirty(true);
                }}
                aria-pressed={promoVisible}
                className={`inline-flex min-h-11 items-center rounded-pill px-3.5 font-display text-small font-semibold ${promoVisible ? "bg-green text-paper" : "border-2 border-edge bg-paper text-ink-soft"}`}
              >
                {promoVisible ? copy.tenantEdit.promoShown : copy.tenantEdit.promoHidden}
              </button>
            }
          />
          <input type="hidden" name="promoVisible" value={promoVisible ? "1" : "0"} />
          <Card>
            <input
              name="promo"
              type="text"
              defaultValue={tenant.promo ?? ""}
              maxLength={PROMO_MAX}
              placeholder={copy.tenantEdit.promoPlaceholder}
              aria-label={copy.tenantEdit.promo}
              className="h-12 w-full border-0 bg-paper px-3.5 text-body font-bold text-ink placeholder:font-normal placeholder:text-ink-muted focus:outline-none"
            />
          </Card>
        </section>

      </form>

      <SlotEditor slots={tenant.slots} addSlot={actions.addSlot} removeSlot={actions.removeSlot} />

      {/* Link fields belong to the profile form through the form attribute: the slot editor between them has forms of its own. */}
      <div onInput={() => setDirty(true)} className="flex flex-col gap-4">
        <section className="flex flex-col gap-2.5">
          <SectionHeader title={copy.tenantEdit.links} />
          <Card>
            <ul className="divide-y-2 divide-line">
              <li className="flex items-center gap-2.5 px-4 py-2">
                <IconInstagram size={24} className="shrink-0 text-ink" />
                <input form={FORM_ID} name="instagram" type="text" defaultValue={tenant.instagram ?? ""} placeholder={copy.tenantEdit.instagram} aria-label={copy.tenantEdit.instagram} className={`${INPUT} border-0 px-0`} />
              </li>
              <li className="flex items-center gap-2.5 px-4 py-2">
                <IconTiktok size={24} className="shrink-0 text-ink" />
                <input form={FORM_ID} name="tiktok" type="text" defaultValue={tenant.tiktok ?? ""} placeholder={copy.tenantEdit.tiktok} aria-label={copy.tenantEdit.tiktok} className={`${INPUT} border-0 px-0`} />
              </li>
              <li className="flex items-center gap-2.5 px-4 py-2">
                <IconMarketplace size={24} className="shrink-0 text-ink" />
                <input form={FORM_ID} name="marketplace" type="url" inputMode="url" defaultValue={tenant.marketplace ?? ""} placeholder={copy.tenantEdit.marketplace} aria-label={copy.tenantEdit.marketplace} className={`${INPUT} border-0 px-0`} />
              </li>
            </ul>
          </Card>
        </section>

        {saveState && !saveState.ok ? <Notice tone="warn">{saveState.error}</Notice> : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[var(--page-max)] border-t-2 border-edge bg-cream px-4 pb-[calc(12px+var(--safe-bottom))] pt-3">
        <Button type="submit" form={FORM_ID} variant="primary" block disabled={saving}>
          {saving ? copy.tenantEdit.saving : copy.tenantEdit.saveAll}
        </Button>
      </div>

      <section className="flex flex-col gap-2.5">
        <SectionHeader title={copy.tenantEdit.posts} action={unanswered > 0 ? <Pill tone="coral">{copy.tenantEdit.unanswered(unanswered)}</Pill> : undefined} />
        {tenant.posts.length ? (
          <PostsModeration posts={tenant.posts} accent={accent} replyPost={actions.replyPost} togglePin={actions.togglePin} toggleHide={actions.toggleHide} />
        ) : (
          <Empty kind="questions" title={copy.tenantEdit.postsEmptyTitle} body={copy.tenantEdit.postsEmptyBody} />
        )}
      </section>

      <section className="flex flex-col gap-2.5">
        <SectionHeader title={copy.tenantEdit.feed} />
        {tenant.feedCount === 0 ? <Empty kind="feed" title={copy.tenantEdit.feedEmptyTitle} body={copy.tenantEdit.feedEmptyBody} /> : null}
        <FeedComposer postFeed={actions.postFeed} />
      </section>
    </div>
  );
}

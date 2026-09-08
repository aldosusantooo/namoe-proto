"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ActionResult } from "@/actions/tenant";
import { copy } from "@/lib/copy";
import { DAY_LABELS, type EventDay } from "@/lib/time";
import { Button } from "../Button";
import { Card } from "../Card";
import { IconClose } from "../icons/UiIcons";
import { Notice } from "../Notice";
import { Eyebrow, SectionHeader } from "../PageHeader";
import { SchedRow } from "../ScheduleList";
import type { DashboardTenant, PlainAction, StatefulAction } from "./TenantDashboard";

type Props = { slots: DashboardTenant["slots"]; addSlot: StatefulAction; removeSlot: PlainAction };

/** "Di booth ini" rows with a 44px remove button each; "Tambah" opens time and title fields. */
export function SlotEditor({ slots, addSlot, removeSlot }: Props) {
  const [adding, setAdding] = useState(false);
  const [state, action, pending] = useActionState<ActionResult, FormData>(addSlot, null);
  const lastOk = useRef<ActionResult>(null);

  useEffect(() => {
    if (state?.ok && state !== lastOk.current) {
      lastOk.current = state;
      setAdding(false);
    }
  }, [state]);

  return (
    <section className="flex flex-col gap-2.5">
      <SectionHeader
        title={copy.tenantEdit.slots}
        action={
          <button type="button" onClick={() => setAdding((v) => !v)} className="inline-flex min-h-11 items-center font-display text-eyebrow text-navy">
            {copy.tenantEdit.slotAdd}
          </button>
        }
      />
      {slots.length ? (
        <Card className="flex flex-col divide-y-2 divide-line">
          {slots.map((s) => (
            <SchedRow
              key={s.id}
              lead={s.time ?? copy.tenant.allDay}
              leadClassName={s.time ? "" : "text-[16px]"}
              title={s.label}
              sub={s.day ? DAY_LABELS[(s.day as EventDay) - 1] : copy.tenant.everyDay}
              className="items-center"
              trailing={
                <form action={removeSlot}>
                  <input type="hidden" name="id" value={s.id} />
                  <Button type="submit" variant="ghost" icon sm aria-label={copy.tenantEdit.slotRemove}>
                    <IconClose size={22} />
                  </Button>
                </form>
              }
            />
          ))}
        </Card>
      ) : null}
      {adding ? (
        <Card pad>
          <form action={action} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                name="time"
                type="text"
                inputMode="numeric"
                placeholder={copy.tenantEdit.slotTime}
                aria-label={copy.tenantEdit.slotTime}
                className="h-12 w-32 rounded-pill border-2 border-edge bg-paper px-4 font-display text-body font-semibold text-ink placeholder:font-sans placeholder:font-normal placeholder:text-ink-muted focus:border-navy focus:outline-none"
              />
              <input
                name="label"
                type="text"
                required
                maxLength={80}
                placeholder={copy.tenantEdit.slotTitle}
                aria-label={copy.tenantEdit.slotTitle}
                className="h-12 min-w-0 flex-1 rounded-pill border-2 border-edge bg-paper px-4 text-body text-ink placeholder:text-ink-muted focus:border-navy focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" sm onClick={() => setAdding(false)}>
                {copy.common.cancel}
              </Button>
              <Button type="submit" variant="primary" sm disabled={pending}>
                {copy.common.add}
              </Button>
            </div>
            {state && !state.ok ? <Notice tone="warn">{state.error}</Notice> : null}
          </form>
        </Card>
      ) : null}
      {!slots.length && !adding ? (
        <p className="text-small text-ink-soft">
          <Eyebrow>{copy.tenantEdit.slotAdd}</Eyebrow>
        </p>
      ) : null}
    </section>
  );
}

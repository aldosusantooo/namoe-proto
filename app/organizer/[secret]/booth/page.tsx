import { headers } from "next/headers";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";
import { boothNumber } from "@/lib/booth-label";

export const metadata = { title: copy.organizer.boothLinks };

/** Absolute origin from the request, never from an env var, so links match whatever domain serves the app. */
async function requestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function OrganizerBoothLinksPage({ params }: PageProps<"/organizer/[secret]/booth">) {
  const { secret } = await params;
  requireOrganizer(secret);
  const origin = await requestOrigin();
  const booths = await db.booth.findMany({ select: { code: true, qrToken: true, tenant: { select: { name: true } } } });
  booths.sort((a, b) => boothNumber(a.code) - boothNumber(b.code));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-display text-fg">{copy.organizer.boothLinks}</h1>
      <p className="text-body text-fg-soft">{copy.organizer.boothLinksHint}</p>
      <div className="overflow-x-auto rounded-lg bg-surface shadow-card">
        <table className="w-full text-left text-small">
          <thead className="bg-surface-alt text-caption uppercase tracking-wide text-fg-muted">
            <tr>
              <th className="px-4 py-2">{copy.organizer.boothCode}</th>
              <th className="px-4 py-2">{copy.organizer.tenantCol}</th>
              <th className="px-4 py-2">{copy.organizer.linkCol}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {booths.map((b) => {
              const href = `${origin}/b/${b.qrToken}`;
              return (
                <tr key={b.code}>
                  <td className="px-4 py-2 font-display text-body text-fg">{b.code}</td>
                  <td className="px-4 py-2 text-fg">{b.tenant?.name ?? <span className="text-fg-muted">{copy.organizer.emptyBooth}</span>}</td>
                  <td className="px-4 py-2">
                    <a href={href} className="break-all font-mono text-link underline">
                      {href}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

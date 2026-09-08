import { headers } from "next/headers";
import { Card } from "@/components/Card";
import { OrganizerShell } from "@/components/OrganizerShell";
import { boothNumber } from "@/lib/booth-label";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";
import { originFromHeaders } from "@/lib/request-origin";

export const metadata = { title: copy.organizer.boothLinks };

export default async function OrganizerBoothLinksPage({ params }: PageProps<"/organizer/[secret]/booth">) {
  const { secret } = await params;
  requireOrganizer(secret);
  const origin = originFromHeaders(await headers());
  const booths = await db.booth.findMany({ select: { code: true, qrToken: true, tenant: { select: { name: true } } } });
  booths.sort((a, b) => boothNumber(a.code) - boothNumber(b.code));

  return (
    <OrganizerShell secret={secret} active="booths" title={copy.organizer.boothLinks} hint={copy.organizer.boothLinksHint}>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-small">
          <thead className="bg-cream font-display text-body font-semibold text-ink">
            <tr>
              <th className="px-4 py-2.5">{copy.organizer.boothCode}</th>
              <th className="px-4 py-2.5">{copy.organizer.tenantCol}</th>
              <th className="px-4 py-2.5">{copy.organizer.linkCol}</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-line">
            {booths.map((b) => {
              const href = `${origin}/b/${b.qrToken}`;
              return (
                <tr key={b.code} id={b.code}>
                  <td className="px-4 py-2 font-display text-body font-semibold text-navy">{b.code}</td>
                  <td className="px-4 py-2 text-ink">{b.tenant?.name ?? <span className="text-ink-muted">{copy.organizer.emptyBooth}</span>}</td>
                  <td className="px-4 py-2">
                    <a href={href} className="break-all font-mono text-navy underline">
                      {href}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </OrganizerShell>
  );
}

import { headers } from "next/headers";
import { Button } from "@/components/Button";
import { IconBack } from "@/components/icons/UiIcons";
import { PrintButton } from "@/components/PrintButton";
import { boothNumber } from "@/lib/booth-label";
import { APP_NAME, copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";
import { qrEncode, qrPath } from "@/lib/qr";
import { originFromHeaders } from "@/lib/request-origin";

export const metadata = { title: copy.organizer.qrSheetTitle };

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

/**
 * Printable QR sheet: one A4 page per booth with the tenant name, the booth code, the QR for /b/<token>
 * built from the request host, the lockup and "Scan untuk stempel paspor". `?booth=A37` prints one booth.
 * Print styles drop the cream and the toolbar.
 */
export default async function BoothQrSheetPage({ params, searchParams }: PageProps<"/organizer/[secret]/booth/cetak">) {
  const { secret } = await params;
  requireOrganizer(secret);
  const only = (first((await searchParams).booth) ?? "").toUpperCase().trim();
  const origin = originFromHeaders(await headers());
  const booths = await db.booth.findMany({
    where: only ? { code: only } : undefined,
    select: { code: true, qrToken: true, tenant: { select: { name: true } } },
  });
  booths.sort((a, b) => boothNumber(a.code) - boothNumber(b.code));
  const [firstWord, secondWord] = APP_NAME.split(" ");

  return (
    <div className="min-h-screen bg-cream print:bg-paper">
      <style>{`@page { size: A4 portrait; margin: 14mm; } @media print { .qr-sheet { break-after: page; } .qr-sheet:last-child { break-after: auto; } }`}</style>
      <div className="mx-auto flex max-w-[var(--dashboard-max)] items-center gap-3 px-8 py-5 print:hidden">
        <Button href={`/organizer/${secret}/booth`} variant="ghost" icon aria-label={copy.common.back}>
          <IconBack size={24} />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-h1 text-ink">{copy.organizer.qrSheetTitle}</h1>
          <p className="text-small text-ink-soft">{copy.organizer.qrSheetHint}</p>
        </div>
        <PrintButton>{copy.organizer.print}</PrintButton>
      </div>

      <div className="mx-auto flex max-w-[var(--dashboard-max)] flex-col items-center gap-8 px-8 pb-16 print:block print:max-w-none print:p-0">
        {booths.map((b) => {
          const url = `${origin}/b/${b.qrToken}`;
          const modules = qrEncode(url);
          return (
            <section
              key={b.code}
              className="qr-sheet flex w-[210mm] flex-col items-center justify-between rounded-lg border-2 border-edge bg-paper p-[16mm] text-center text-ink shadow-card print:h-[269mm] print:w-auto print:rounded-none print:border-0 print:shadow-none"
              style={{ minHeight: "269mm" }}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-left font-display text-[28px] font-bold leading-[0.95] tracking-[-0.02em] text-navy">
                  {firstWord}
                  <br />
                  {secondWord}
                </span>
                <span className="text-right text-small text-ink-soft">
                  Namoe Market, {copy.home.dates}
                  <br />
                  {copy.home.venue}
                </span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <p className="font-display text-code text-navy">{b.code}</p>
                <p className="font-display text-display text-ink">{b.tenant?.name ?? copy.organizer.emptyBooth}</p>
                <svg viewBox={`-4 -4 ${modules.length + 8} ${modules.length + 8}`} width="380" height="380" role="img" aria-label={`QR ${b.code}`} className="mt-2 block">
                  <rect x={-4} y={-4} width={modules.length + 8} height={modules.length + 8} fill="var(--color-paper)" />
                  <path d={qrPath(modules)} fill="var(--color-ink)" />
                </svg>
                <p className="font-display text-h1 text-ink">{copy.organizer.scanToStamp}</p>
                <p className="break-all font-mono text-small text-ink-soft">{url}</p>
              </div>
              <p className="text-small text-ink-soft">{copy.passport.howBody}</p>
            </section>
          );
        })}
      </div>
    </div>
  );
}

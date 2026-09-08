import { OrganizerShell } from "@/components/OrganizerShell";
import { OrganizerTenantList } from "@/components/OrganizerTenantList";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";
import { requireOrganizer } from "@/lib/organizer";

export const metadata = { title: copy.organizer.tenants };

export default async function OrganizerTenantsPage({ params }: PageProps<"/organizer/[secret]/tenant">) {
  const { secret } = await params;
  requireOrganizer(secret);
  const tenants = await db.tenant.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true, category: true, logoUrl: true, editToken: true, booths: { select: { code: true } } },
  });
  return (
    <OrganizerShell secret={secret} active="tenants" title={copy.organizer.tenants} hint={copy.organizer.tenantsHint}>
      <div className="max-w-[760px]">
        <OrganizerTenantList secret={secret} tenants={tenants} title={copy.organizer.allTenants(tenants.length)} />
      </div>
    </OrganizerShell>
  );
}

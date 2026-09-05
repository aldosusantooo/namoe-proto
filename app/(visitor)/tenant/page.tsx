import { PageHeader } from "@/components/PageHeader";
import { copy } from "@/lib/copy";

export default function TenantDirectoryPage() {
  return <PageHeader title={copy.nav.tenants} />;
}

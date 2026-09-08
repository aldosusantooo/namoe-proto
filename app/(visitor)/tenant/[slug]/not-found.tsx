import { Button } from "@/components/Button";
import { Empty } from "@/components/Empty";
import { PageHeader } from "@/components/PageHeader";
import { copy } from "@/lib/copy";

export default function TenantNotFound() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={copy.tenant.notFound} back="/tenant" />
      <Empty kind="search" title={copy.tenant.notFound} body={copy.tenant.notFoundHint} />
      <Button href="/tenant" variant="ghost">
        {copy.tenant.backToDirectory}
      </Button>
    </div>
  );
}

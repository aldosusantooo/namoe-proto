import { Button } from "@/components/Button";
import { Empty } from "@/components/Empty";
import { PageHeader } from "@/components/PageHeader";
import { copy } from "@/lib/copy";

export default function SessionNotFound() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={copy.qa.sessionNotFound} back="/jadwal" />
      <Empty kind="questions" title={copy.qa.sessionNotFound} />
      <Button href="/jadwal" variant="ghost">
        {copy.qa.backToSchedule}
      </Button>
    </div>
  );
}

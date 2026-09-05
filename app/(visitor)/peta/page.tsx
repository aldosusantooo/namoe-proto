import { PageHeader } from "@/components/PageHeader";
import { copy } from "@/lib/copy";

export default function MapPage() {
  return <PageHeader title={copy.map.title} subtitle={copy.map.hint} />;
}

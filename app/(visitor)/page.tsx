import { PageHeader } from "@/components/PageHeader";
import { copy } from "@/lib/copy";

export default function HomePage() {
  return <PageHeader title="Namoe Market" subtitle={`${copy.home.dates}. ${copy.home.venue}`} />;
}

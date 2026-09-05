import { PageHeader } from "@/components/PageHeader";
import { copy } from "@/lib/copy";

export default function PassportPage() {
  return <PageHeader title={copy.passport.title} subtitle={copy.passport.subtitle(5)} />;
}

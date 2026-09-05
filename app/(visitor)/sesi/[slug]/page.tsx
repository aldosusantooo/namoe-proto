import { PageHeader } from "@/components/PageHeader";

export default async function SessionPage({ params }: PageProps<"/sesi/[slug]">) {
  const { slug } = await params;
  return <PageHeader title={slug} />;
}

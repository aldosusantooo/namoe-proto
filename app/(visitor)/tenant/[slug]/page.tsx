import { PageHeader } from "@/components/PageHeader";

export default async function TenantPage({ params }: PageProps<"/tenant/[slug]">) {
  const { slug } = await params;
  return <PageHeader title={slug} />;
}

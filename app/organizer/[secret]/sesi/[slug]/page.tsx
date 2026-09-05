export default async function OrganizerSessionPage({ params }: PageProps<"/organizer/[secret]/sesi/[slug]">) {
  const { slug } = await params;
  return <h1 className="font-display text-display">{slug}</h1>;
}

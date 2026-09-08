import { notFound } from "next/navigation";
import { addPhotoUrl, addSlot, postFeedAsTenant, removePhoto, removeSlot, replyPost, saveProfile, toggleHide, togglePin, uploadPhoto } from "@/actions/tenant";
import { TenantDashboard } from "@/components/tenant-edit/TenantDashboard";
import { sortCodes } from "@/lib/booth-label";
import { copy } from "@/lib/copy";
import { db } from "@/lib/db";

export const metadata = { title: copy.tenantEdit.title };

export default async function TenantEditPage({ params }: PageProps<"/t/[token]/edit">) {
  const { token } = await params;
  const tenant = await db.tenant.findUnique({
    where: { editToken: token },
    include: {
      booths: { select: { code: true } },
      slots: { orderBy: { order: "asc" } },
      posts: { orderBy: [{ pinned: "desc" }, { createdAt: "desc" }] },
      _count: { select: { feedPosts: true } },
    },
  });
  if (!tenant) notFound();

  return (
    <TenantDashboard
      token={token}
      tenant={{
        slug: tenant.slug,
        name: tenant.name,
        category: tenant.category,
        intro: tenant.intro,
        promo: tenant.promo,
        promoVisible: tenant.promoVisible,
        instagram: tenant.instagram,
        tiktok: tenant.tiktok,
        marketplace: tenant.marketplace,
        photos: tenant.photos,
        logoUrl: tenant.logoUrl,
        codes: sortCodes(tenant.booths.map((b) => b.code)),
        slots: tenant.slots.map((s) => ({ id: s.id, label: s.label, time: s.time, day: s.day })),
        posts: tenant.posts.map((p) => ({ id: p.id, body: p.body, displayName: p.displayName, reply: p.reply, pinned: p.pinned, hidden: p.hidden })),
        feedCount: tenant._count.feedPosts,
      }}
      actions={{
        saveProfile: saveProfile.bind(null, token),
        addPhotoUrl: addPhotoUrl.bind(null, token),
        uploadPhoto: uploadPhoto.bind(null, token),
        removePhoto: removePhoto.bind(null, token),
        addSlot: addSlot.bind(null, token),
        removeSlot: removeSlot.bind(null, token),
        replyPost: replyPost.bind(null, token),
        togglePin: togglePin.bind(null, token),
        toggleHide: toggleHide.bind(null, token),
        postFeed: postFeedAsTenant.bind(null, token),
      }}
    />
  );
}

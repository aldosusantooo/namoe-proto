import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { generateBooths } from "../lib/layout";
import { TENANTS } from "./seed-data/tenants";
import { SPEAKERS } from "./seed-data/speakers";
import { SESSIONS, SESSION_MINUTES, wib } from "./seed-data/sessions";
import { QUESTIONS, SEED_DEVICES, THANKS } from "./seed-data/questions";
import { FEED_POSTS, TENANT_POSTS } from "./seed-data/feed";
import { parseActivity } from "./seed-data/activity";

const db = new PrismaClient();

const BASE32 = "abcdefghijklmnopqrstuvwxyz234567";
function token(length = 20): string {
  const bytes = randomBytes(length);
  let out = "";
  for (const b of bytes) out += BASE32[b % 32];
  return out;
}

const minutes = (d: Date, n: number) => new Date(d.getTime() + n * 60_000);

async function seedEvent() {
  await db.event.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      name: "Namoe Market",
      tagline: "A home for every family",
      venue: "Main Atrium, PIK Avenue Mall",
      startsOn: wib(1, "10.00"),
      endsOn: wib(4, "22.00"),
      passportTarget: 5,
      prizeCopy: "Hadiah diisi oleh panitia",
    },
    update: {
      name: "Namoe Market",
      tagline: "A home for every family",
      venue: "Main Atrium, PIK Avenue Mall",
      startsOn: wib(1, "10.00"),
      endsOn: wib(4, "22.00"),
    },
  });
}

async function seedBooths() {
  for (const b of generateBooths()) {
    const geometry = { zone: b.zone, band: b.band, cluster: b.cluster, x: b.x, y: b.y, w: b.w, h: b.h };
    // Existing rows keep their qrToken: printed QR stickers must never change.
    await db.booth.upsert({
      where: { code: b.code },
      create: { code: b.code, qrToken: token(), ...geometry },
      update: geometry,
    });
  }
}

async function seedTenants() {
  const assigned = new Set<string>();
  for (const t of TENANTS) {
    // No fake product photos: the card and the page fall back to the generated placeholder art.
    // Photos and the logo are entered through the tenant dashboard, so a re-seed never touches them.
    const data = {
      name: t.name,
      category: t.category,
      intro: t.intro,
      promo: t.promo,
      instagram: t.instagram,
      color: t.color,
    };
    const tenant = await db.tenant.upsert({
      where: { slug: t.slug },
      create: { slug: t.slug, editToken: token(), photos: [], logoUrl: null, ...data },
      update: data,
    });

    await db.booth.updateMany({ where: { code: { in: t.booths } }, data: { tenantId: tenant.id } });
    t.booths.forEach((c) => assigned.add(c));

    const { label, times } = parseActivity(t.activity);
    const slots = times.length ? times.map((time, i) => ({ label, time, order: i })) : [{ label, time: null, order: 0 }];
    await db.$transaction([
      db.tenantSlot.deleteMany({ where: { tenantId: tenant.id } }),
      db.tenantSlot.createMany({ data: slots.map((s) => ({ ...s, tenantId: tenant.id, day: null })) }),
    ]);
  }
  await db.booth.updateMany({ where: { code: { notIn: [...assigned] } }, data: { tenantId: null } });
}

async function seedSpeakers() {
  const ids = new Map<string, string>();
  for (const s of SPEAKERS) {
    const row = await db.speaker.upsert({
      where: { slug: s.slug },
      create: { slug: s.slug, name: s.name, handle: s.handle, bio: s.bio },
      update: { name: s.name, handle: s.handle, bio: s.bio },
    });
    ids.set(s.slug, row.id);
  }
  return ids;
}

async function seedSessions(speakerIds: Map<string, string>) {
  const ids = new Map<string, { id: string; startsAt: Date }>();
  for (const s of SESSIONS) {
    const startsAt = wib(s.day, s.time);
    const endsAt = minutes(startsAt, SESSION_MINUTES);
    const data = { title: s.title, description: s.description, day: s.day, startsAt, endsAt };
    const row = await db.session.upsert({ where: { slug: s.slug }, create: { slug: s.slug, ...data }, update: data });
    ids.set(s.slug, { id: row.id, startsAt });
    await db.sessionSpeaker.deleteMany({ where: { sessionId: row.id } });
    await db.sessionSpeaker.createMany({
      data: s.speakers.map((slug) => {
        const speakerId = speakerIds.get(slug);
        if (!speakerId) throw new Error(`Unknown speaker ${slug}`);
        return { sessionId: row.id, speakerId };
      }),
    });
  }
  return ids;
}

async function seedQuestions(sessionIds: Map<string, { id: string; startsAt: Date }>) {
  for (const q of QUESTIONS) {
    const session = sessionIds.get(q.session);
    if (!session) throw new Error(`Unknown session ${q.session}`);
    const createdAt = minutes(session.startsAt, q.offsetMin);
    const answered = q.answered ?? false;
    await db.question.upsert({
      where: { id: q.id },
      create: {
        id: q.id,
        sessionId: session.id,
        kind: "QUESTION",
        body: q.body,
        displayName: q.displayName,
        deviceId: "seed-author",
        createdAt,
        answered,
        answeredAt: answered ? minutes(createdAt, 10) : null,
      },
      update: { body: q.body, displayName: q.displayName },
    });
    for (const deviceId of SEED_DEVICES.slice(0, q.upvotes)) {
      await db.upvote.upsert({
        where: { questionId_deviceId: { questionId: q.id, deviceId } },
        create: { questionId: q.id, deviceId, createdAt: minutes(createdAt, 2) },
        update: {},
      });
    }
    // Denormalised counter follows the real rows, including any upvotes visitors added since the last seed.
    const count = await db.upvote.count({ where: { questionId: q.id } });
    await db.question.update({ where: { id: q.id }, data: { upvoteCount: count } });
  }
  for (const t of THANKS) {
    const session = sessionIds.get(t.session);
    if (!session) throw new Error(`Unknown session ${t.session}`);
    await db.question.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        sessionId: session.id,
        kind: "THANKS",
        body: t.body,
        displayName: t.displayName,
        deviceId: "seed-author",
        createdAt: minutes(session.startsAt, t.offsetMin),
      },
      update: { body: t.body, displayName: t.displayName },
    });
  }
}

async function seedFeed() {
  const tenants = await db.tenant.findMany({ select: { id: true, slug: true } });
  const tenantId = (slug: string) => {
    const found = tenants.find((t) => t.slug === slug);
    if (!found) throw new Error(`Unknown tenant ${slug}`);
    return found.id;
  };
  for (const p of FEED_POSTS) {
    const data = {
      body: p.body,
      photoUrl: p.photo,
      authorTenantId: p.tenant ? tenantId(p.tenant) : null,
      displayName: p.displayName,
      deviceId: p.tenant ? null : "seed-author",
      createdAt: wib(p.day, p.time),
    };
    await db.feedPost.upsert({ where: { id: p.id }, create: { id: p.id, ...data }, update: data });
  }
  for (const p of TENANT_POSTS) {
    const data = {
      tenantId: tenantId(p.tenant),
      body: p.body,
      displayName: p.displayName,
      deviceId: "seed-author",
      reply: p.reply,
      repliedAt: p.reply ? minutes(wib(p.day, p.time), 30) : null,
      pinned: p.pinned,
      createdAt: wib(p.day, p.time),
    };
    await db.tenantPost.upsert({ where: { id: p.id }, create: { id: p.id, ...data }, update: data });
  }
}

async function printCounts() {
  const counts = {
    event: await db.event.count(),
    booth: await db.booth.count(),
    boothFilled: await db.booth.count({ where: { tenantId: { not: null } } }),
    tenant: await db.tenant.count(),
    tenantSlot: await db.tenantSlot.count(),
    speaker: await db.speaker.count(),
    session: await db.session.count(),
    sessionSpeaker: await db.sessionSpeaker.count(),
    question: await db.question.count({ where: { kind: "QUESTION" } }),
    thanks: await db.question.count({ where: { kind: "THANKS" } }),
    upvote: await db.upvote.count(),
    feedPost: await db.feedPost.count(),
    tenantPost: await db.tenantPost.count(),
    passport: await db.passport.count(),
    stamp: await db.stamp.count(),
  };
  console.table(counts);
}

async function main() {
  const ifEmpty = process.argv.includes("--if-empty");
  if (ifEmpty) {
    const tenants = await db.tenant.count();
    if (tenants > 0) {
      console.log(`Seed skipped, ${tenants} tenants already present.`);
      return;
    }
  }
  await seedEvent();
  await seedBooths();
  await seedTenants();
  const speakerIds = await seedSpeakers();
  const sessionIds = await seedSessions(speakerIds);
  await seedQuestions(sessionIds);
  await seedFeed();
  await printCounts();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

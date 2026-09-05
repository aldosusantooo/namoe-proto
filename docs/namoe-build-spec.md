# Namoe Market companion app: day-one build spec (P0 backbone)

Written 5 Sep 2026 from `namoe-product-brief.md` (locked), `seed-tenants.md` and `reference/`. This is the document the implementation session builds from. Where the brief says Locked, this spec does not reopen it.

## 0. Inputs, gaps and working assumptions

- Inputs read: the product brief, the 24-tenant seed file, the floor plan poster, the Google Form screenshots, five Instagram posts.
- Not found: a separate "working context" document. Nothing in the Namoe folder or its parent carries that name. If it exists elsewhere, reconcile it against section 0 and section 3 before starting.
- No approved mockups exist. The visual design session has not run. Tokens in `tokens.css` are therefore derived directly from the brief's visual direction notes and the posters. They are complete enough to build with and are the single place to adjust colour later.
- App name (locked): **Namoe Go**, written without an exclamation mark everywhere. Stored in one constant (`APP_NAME` in `lib/copy.ts`).
- Floor plan geometry, read from the poster at zoom (the brief's "six blocks of two rows" was a shorthand): booths A1 to A70 sit in 16 clusters across three bands. Band 1 has six clusters, bands 2 and 3 have five each. The first cluster in every band is 3 columns by 2 rows; the rest are 2 by 2. Numbering is row-major inside each cluster (A1 A2 A3 over A4 A5 A6; A7 A8 over A9 A10). The F&B arc along the bottom is A71 to A84 in groups of 2, 3, 4, 3, 2. The stage sits right of band 2 with a seating area of seven round tables between band 3 and the F&B arc. Gate bottom left. North lobby left, south lobby right, east lobby top centre. Mall tenants line the top (Paris Baguette, toilet, Adidas, Under Armour, H&M) and bottom (The Coffee Academic, Bistecca Milano, Kinka, toilet, Starbucks Reserve). Mall tenant labels are read from a low-resolution poster; confirm with Theo before printing anything.
- Booth sizes in the seed (4x2, 4x4, 6x2) mean a tenant occupies several adjacent 2x2 units. The map colours every unit the tenant holds. Cards show the first code only.
- Timezone is Asia/Jakarta for everything. The pitch happens before the event, so "Sedang berlangsung" would be empty in a real clock. `DEMO_NOW` (env, ISO string) overrides the clock app-wide so the demo shows a live session.

## 1. Day-one goal

By end of day one there is a public Railway URL that a phone can open and walk through all seven P0 items with seeded data, plus a skeleton organizer route for the two P0 behaviours that need it (mark a question answered, redeem a passport code). Unit tests cover every pure-logic module. P1 (tenant magic link, Tanya tenant posting, feed, full dashboard) is not started on day one unless everything above is deployed and green.

## 2. Stack and conventions

| Concern | Choice |
|---|---|
| Framework | Next.js latest stable (App Router, React Server Components, server actions), TypeScript strict |
| Styling | Tailwind v4, CSS-first. `tokens.css` is pasted as the top of `app/globals.css`. No `tailwind.config.js`. |
| Fonts | `next/font/google`: Fredoka (display, 500/600), Nunito (body, 400/600/700). Expose as `--font-fredoka`, `--font-nunito`. |
| ORM / DB | Prisma pinned to 6.x with `prisma-client-js`, Postgres 16 |
| Tests | Vitest, `environment: node`, tests in `lib/__tests__` |
| Package manager | pnpm |
| Hosting | Railway: one web service from the repo plus the Postgres plugin |
| Images | Plain `<img loading="lazy">`. Photos are URLs. Seed uses generated SVG placeholders at `/img/[slug]`. No `next/image` remote config. |
| QR codes | Not generated on day one. `/b/[token]` exists and works from a plain link. Printable QR is P1 dashboard work. |
| Floor map | Hand-written inline SVG from data. No library. |
| Language | All UI copy in Bahasa Indonesia via `lib/copy.ts`. Sentence case. No exclamation marks, emoji or em dashes. "kamu", never "Anda". |
| Client JS | Server components by default. Client components only for: search and filter inputs, upvote button, question form, floor map tap and zoom toggle, passport localStorage mirror. |
| Time | `lib/time.ts` exports `now()`; every date read goes through it. Honours `DEMO_NOW`. Formats with `Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta" })`. Times render as `14.00` (dot, WIB style). |

Repo layout:

```
app/
  layout.tsx            fonts, bottom nav, page-max wrapper
  globals.css           tokens.css content on top
  page.tsx              home
  tenant/page.tsx       directory (?kategori=&q=)
  tenant/[slug]/page.tsx
  peta/page.tsx         floor map (?kategori=&booth=)
  jadwal/page.tsx       full schedule
  sesi/[slug]/page.tsx  Q&A board, tabs Tanya pembicara / Ucapan
  paspor/page.tsx       passport, progress, redeem screen
  b/[token]/route.ts    QR landing, stamps then redirects
  img/[slug]/route.ts   SVG placeholder generator
  api/health/route.ts
  api/device/route.ts   re-issue cookie from localStorage id
  organizer/[secret]/page.tsx              skeleton: links to the two panels below
  organizer/[secret]/sesi/[slug]/page.tsx  mark answered
  organizer/[secret]/tukar/page.tsx        redeem lookup
  organizer/[secret]/booth/page.tsx        list of /b links for simulating scans in the demo
components/  Nav, PageHeader, Card, Chip, CategoryBadge, TenantCard, FloorMap, MiniMap,
             ScheduleStrip, ScheduleList, QuestionForm, QuestionList, UpvoteButton, StampGrid, RedeemCard, Empty
lib/         db.ts, time.ts, device.ts, categories.ts, layout.ts, booth-label.ts,
             ranking.ts, passport.ts, redeem.ts, schedule.ts, copy.ts, validate.ts
lib/__tests__/*.test.ts
actions/     qa.ts, passport.ts, organizer.ts
prisma/      schema.prisma, seed.ts, seed-data/{tenants,booths,speakers,sessions,questions,feed}.ts
proxy.ts     (Next 16) or middleware.ts (Next 15): ensures the device cookie
railway.json, .env.example, vitest.config.ts
docs/        copies of the brief, seed-tenants.md, this spec, tokens.css
```

## 3. Data model (Prisma)

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

enum Category {
  PAKAIAN_IBU_ANAK      // Pakaian ibu dan anak
  AKSESORI_ANAK         // Aksesori anak
  PERLENGKAPAN_RUMAH    // Perlengkapan rumah
  DEKORASI_RUMAH        // Dekorasi rumah
  MAINAN_HOBI           // Mainan dan hobi
  ELEKTRONIK            // Elektronik
  PERLENGKAPAN_IBU      // Perlengkapan ibu hamil dan menyusui
  PERALATAN_DAPUR       // Peralatan dapur
  EDUKASI               // Edukasi
  MAKANAN_MINUMAN       // Makanan dan minuman
}
enum Zone { A FNB }
enum QuestionKind { QUESTION THANKS }

model Event {
  id             Int      @id @default(1)
  name           String   // "Namoe Market"
  tagline        String   // "A home for every family"
  venue          String   // "Main Atrium, PIK Avenue Mall"
  startsOn       DateTime // 2026-10-22 10:00 WIB
  endsOn         DateTime // 2026-10-25 22:00 WIB
  passportTarget Int      @default(5)
  prizeCopy      String   // placeholder Theo fills in
}

model Tenant {
  id          String     @id @default(cuid())
  slug        String     @unique
  name        String
  category    Category
  intro       String
  promo       String?
  photos      String[]   // up to 5 URLs
  logoUrl     String?
  instagram   String?    // handle without @
  tiktok      String?
  marketplace String?    // Shopee or Tokopedia URL
  color       String?    // brand hex, optional
  editToken   String     @unique   // magic link token, used in P1
  viewCount   Int        @default(0)
  booths      Booth[]
  slots       TenantSlot[]
  posts       TenantPost[]
  feedPosts   FeedPost[]
  createdAt   DateTime   @default(now())
}

model TenantSlot {              // "Di booth ini"
  id       String  @id @default(cuid())
  tenantId String
  tenant   Tenant  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  label    String  // "Demo gendongan hip seat dan carrier"
  time     String? // "14.00", null = sepanjang hari
  day      Int?    // 1..4, null = setiap hari
  order    Int     @default(0)
}

model Booth {
  code     String  @id      // "A12"
  zone     Zone
  band     Int              // 1..3 for A, 0 for FNB
  cluster  Int              // index within band
  x        Int
  y        Int
  w        Int
  h        Int
  qrToken  String  @unique
  tenantId String?
  tenant   Tenant? @relation(fields: [tenantId], references: [id], onDelete: SetNull)
  stamps   Stamp[]
}

model Speaker {
  id       String  @id @default(cuid())
  slug     String  @unique
  name     String
  handle   String?
  bio      String
  photoUrl String?
  sessions SessionSpeaker[]
}

model Session {
  id          String   @id @default(cuid())
  slug        String   @unique   // "kamis-1300"
  title       String
  description String?
  day         Int      // 1..4
  startsAt    DateTime
  endsAt      DateTime
  stage       String   @default("Panggung utama")
  speakers    SessionSpeaker[]
  questions   Question[]
}

model SessionSpeaker {
  sessionId String
  speakerId String
  session   Session @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  speaker   Speaker @relation(fields: [speakerId], references: [id], onDelete: Cascade)
  @@id([sessionId, speakerId])
}

model Question {
  id          String       @id @default(cuid())
  sessionId   String
  session     Session      @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  kind        QuestionKind @default(QUESTION)
  body        String
  displayName String?      // null = anonim
  deviceId    String
  upvoteCount Int          @default(0)   // denormalised, updated in the same transaction as Upvote
  answered    Boolean      @default(false)
  answeredAt  DateTime?
  hidden      Boolean      @default(false)
  createdAt   DateTime     @default(now())
  upvotes     Upvote[]
  @@index([sessionId, kind, hidden])
}

model Upvote {
  questionId String
  deviceId   String
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  @@id([questionId, deviceId])
}

model TenantPost {                // Tanya tenant (P1 posting, model exists day one)
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  body        String
  displayName String?
  deviceId    String
  reply       String?
  repliedAt   DateTime?
  pinned      Boolean  @default(false)
  hidden      Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model FeedPost {                  // P1 screen, seeded day one
  id             String   @id @default(cuid())
  body           String
  photoUrl       String?
  authorTenantId String?
  authorTenant   Tenant?  @relation(fields: [authorTenantId], references: [id], onDelete: SetNull)
  displayName    String?
  deviceId       String?
  hidden         Boolean  @default(false)
  createdAt      DateTime @default(now())
}

model Passport {
  id          String    @id @default(cuid())
  deviceId    String    @unique
  redeemCode  String?   @unique
  completedAt DateTime?
  redeemedAt  DateTime?
  createdAt   DateTime  @default(now())
  stamps      Stamp[]
}

model Stamp {
  passportId String
  boothCode  String
  passport   Passport @relation(fields: [passportId], references: [id], onDelete: Cascade)
  booth      Booth    @relation(fields: [boothCode], references: [code], onDelete: Cascade)
  createdAt  DateTime @default(now())
  @@id([passportId, boothCode])
}
```

Notes: `Event` is a singleton with id 1. `viewCount` is incremented with `after()` in the tenant page so it never blocks render. Tokens (`editToken`, `qrToken`) are 20-char random base32 strings from `crypto.randomBytes`.

## 4. Pure logic modules (all unit tested, no DB imports)

### 4.1 `lib/time.ts`
- `now(): Date`. Returns `new Date(process.env.DEMO_NOW)` when set and valid, else the real clock.
- `fmtTime(d)` returns `"14.00"`; `fmtDayShort(d)` returns `"Kamis, 22 Okt"`; `fmtDateRange(start, end)` returns `"22 sampai 25 Oktober 2026"`. All in Asia/Jakarta.
- Day labels: `DAY_LABELS = ["Kamis 22 Okt", "Jumat 23 Okt", "Sabtu 24 Okt", "Minggu 25 Okt"]`.

### 4.2 `lib/schedule.ts`
- `scheduleStrip(sessions, now)` returns `{ live: Session | null, next: Session | null, over: boolean }`. Live: `startsAt <= now < endsAt`. Next: earliest with `startsAt > now`. Over: no next and no live.
- `isThanksOpen(session, now)`: `now >= session.endsAt`.
- `groupByDay(sessions)`: `Record<1|2|3|4, Session[]>` sorted by `startsAt`.
- Tests: before event, during a talk, in a gap, after the last talk, exactly at a boundary.

### 4.3 `lib/ranking.ts`
```ts
export function rankQuestions<T extends { upvoteCount: number; displayName: string | null; createdAt: Date }>(items: T[]): T[]
```
Sort: `upvoteCount` desc, then named (non-null, non-empty after trim) before anonymous, then `createdAt` desc. Stable. Also `splitAnswered(items)` returns `{ open, answered }` with `answered` sorted by `answeredAt` desc. Tests: the three tie-breakers individually and combined, empty input, input not mutated.

### 4.4 `lib/passport.ts`
- `applyStamp(existing: string[], code: string, target: number)` returns `{ stamps: string[], added: boolean, completed: boolean, justCompleted: boolean }`. Adding an existing code returns `added: false`. `justCompleted` is true only on the stamp that reaches the target.
- `progress(count, target)` returns `{ count, target, remaining, done }` with `remaining >= 0`.
- Tests: first stamp, duplicate stamp, reaching target, beyond target (still counts, never re-completes).

### 4.5 `lib/redeem.ts`
- `REDEEM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"` (no 0, O, 1, I).
- `generateRedeemCode(random = crypto)` returns 6 chars from the alphabet. Uses `crypto.getRandomValues`.
- `normaliseRedeemCode(input)`: uppercase, strip whitespace and dashes, then return the string if it is exactly 6 chars and every char is in the alphabet, else `null`. No lookalike mapping: the alphabet already excludes 0, O, 1 and I, so the info desk types what they see.
- Tests: length, alphabet membership over 1000 draws, normalise happy path, lowercase input, invalid chars.

### 4.6 `lib/booth-label.ts`
- `boothLabel(codes: string[])`: sorted numerically. `["A3"]` gives `"A3"`; `["A1","A2"]` gives `"A1 dan A2"`; three or more consecutive codes give `"A11 sampai A14"`; non-consecutive give comma list `"A1, A3, A5"`. `primaryCode(codes)` returns the lowest.
- Tests for each branch and for unsorted input.

### 4.7 `lib/categories.ts`
```ts
export const CATEGORIES = [
  { key: "PAKAIAN_IBU_ANAK",   slug: "pakaian-ibu-anak",   label: "Pakaian ibu dan anak" },
  { key: "AKSESORI_ANAK",      slug: "aksesori-anak",      label: "Aksesori anak" },
  { key: "PERLENGKAPAN_RUMAH", slug: "perlengkapan-rumah", label: "Perlengkapan rumah" },
  { key: "DEKORASI_RUMAH",     slug: "dekorasi-rumah",     label: "Dekorasi rumah" },
  { key: "MAINAN_HOBI",        slug: "mainan-hobi",        label: "Mainan dan hobi" },
  { key: "ELEKTRONIK",         slug: "elektronik",         label: "Elektronik" },
  { key: "PERLENGKAPAN_IBU",   slug: "perlengkapan-ibu",   label: "Perlengkapan ibu" },
  { key: "PERALATAN_DAPUR",    slug: "peralatan-dapur",    label: "Peralatan dapur" },
  { key: "EDUKASI",            slug: "edukasi",            label: "Edukasi" },
  { key: "MAKANAN_MINUMAN",    slug: "makanan-minuman",    label: "Makanan dan minuman" },
] as const;
```
Helpers: `bySlug`, `byKey`, `cssVar(key)` returns `var(--color-cat-<slug>)`, `cssVarSoft(key)`. The colour itself lives only in `tokens.css`. Seed mapping from `seed-tenants.md`: "Mom and kids clothing" to PAKAIAN_IBU_ANAK, "Kids accessories" to AKSESORI_ANAK, "Maternity essentials" to PERLENGKAPAN_IBU, "Toys and hobbies" to MAINAN_HOBI, "Education" to EDUKASI, "Homeware / kitchenware" to PERALATAN_DAPUR, "Home decoration" to DEKORASI_RUMAH, "Electronics" to ELEKTRONIK, "F&B" to MAKANAN_MINUMAN. PERLENGKAPAN_RUMAH has no seed tenant and stays in the filter so the pitch shows all ten poster categories.

### 4.8 `lib/layout.ts` (floor map geometry)

SVG `viewBox="0 0 1200 680"`. Booth unit `BOOTH = 36`, gap `GAP = 4`. Cluster gap 40. Every position is in viewBox units and stored in the `Booth` table by the seed.

```ts
export const BOOTH = 36, GAP = 4;
// A clusters: row-major numbering, `cols` x 2 rows, starting at `first`
export const CLUSTERS = [
  // band 1
  { band: 1, first: 1,  cols: 3, x: 150, y: 140 },
  { band: 1, first: 7,  cols: 2, x: 306, y: 140 },
  { band: 1, first: 11, cols: 2, x: 422, y: 140 },
  { band: 1, first: 15, cols: 2, x: 538, y: 140 },
  { band: 1, first: 19, cols: 2, x: 654, y: 140 },
  { band: 1, first: 23, cols: 2, x: 770, y: 140 },
  // band 2
  { band: 2, first: 27, cols: 3, x: 150, y: 260 },
  { band: 2, first: 33, cols: 2, x: 306, y: 260 },
  { band: 2, first: 37, cols: 2, x: 422, y: 260 },
  { band: 2, first: 41, cols: 2, x: 538, y: 260 },
  { band: 2, first: 45, cols: 2, x: 654, y: 260 },
  // band 3
  { band: 3, first: 49, cols: 3, x: 150, y: 380 },
  { band: 3, first: 55, cols: 2, x: 306, y: 380 },
  { band: 3, first: 59, cols: 2, x: 422, y: 380 },
  { band: 3, first: 63, cols: 2, x: 538, y: 380 },
  { band: 3, first: 67, cols: 2, x: 654, y: 380 },
];
// F&B arc: single row groups, slightly lower towards the centre
export const FNB_GROUPS = [
  { first: 71, count: 2, x: 150, y: 505 },
  { first: 73, count: 3, x: 270, y: 525 },
  { first: 76, count: 4, x: 420, y: 540 },
  { first: 80, count: 3, x: 610, y: 525 },
  { first: 83, count: 2, x: 770, y: 505 },
];
export const FIXTURES = {
  stage:   { x: 900, y: 250, w: 180, h: 110, label: "Panggung" },
  seating: { label: "Area duduk", y: 470, tables: [300, 360, 420, 480, 540, 600, 660], r: 10 },
  gate:    { x: 40, y: 420, w: 44, h: 16, label: "Gerbang" },
  lobbies: [ { x: 20, y: 110, label: "Lobi utara" }, { x: 1060, y: 110, label: "Lobi selatan" }, { x: 600, y: 100, label: "Lobi timur" } ],
  mallTop:    { y: 30, h: 44, items: ["Paris Baguette", "Toilet", "Adidas", "Under Armour", "H&M"] },
  mallBottom: { y: 600, h: 44, items: ["The Coffee Academic", "Bistecca Milano", "Kinka", "Toilet", "Starbucks Reserve"] },
};
export function generateBooths(): Array<{ code: string; zone: "A" | "FNB"; band: number; cluster: number; x: number; y: number; w: number; h: number }>
```
`generateBooths()` expands clusters (x offsets `col * (BOOTH + GAP)`, y offsets `row * (BOOTH + GAP)`) and F&B groups (band 0). Tests: exactly 84 booths, codes A1..A84 unique and complete, A1 at (150,140), A6 at (230,180), A7 at (306,140), A10 at (346,180), A70 at (694,420), A76 at (420,540), no two rects overlap.

### 4.9 `lib/device.ts`
- Cookie name `nm_did`, value UUID v4, `maxAge` 400 days, `sameSite: "lax"`, `path: "/"`, not httpOnly (the client mirrors it to localStorage).
- `getOrCreateDeviceId()` (server, from `cookies()`), `readDeviceIdFromRequest(req)` for route handlers and the proxy.
- Client component `DeviceSync`: on mount, if cookie exists write it to `localStorage.nm_did`; if cookie missing but localStorage has one, `POST /api/device` with it so the server re-sets the cookie. Runs once per page load, no UI.

### 4.10 `lib/validate.ts`
- `cleanBody(s)`: trim, collapse whitespace, 3 to 280 chars, else error key `bodyTooShort` or `bodyTooLong`.
- `cleanName(s)`: trim, max 30 chars, empty becomes null.
- Both return `{ ok: true, value } | { ok: false, error }`.

## 5. Screens (P0) and behaviour

Common frame: `layout.tsx` wraps pages in `max-w-[var(--page-max)] mx-auto px-[var(--page-gutter)] pb-[calc(var(--nav-height)+var(--safe-bottom))]`. Bottom tab bar with five items: Beranda, Tenant, Peta, Jadwal, Paspor. Active tab in `primary`. Icons are inline SVG line icons, 24px, no icon library. Organizer routes use a separate layout with `--dashboard-max` and no tab bar.

### 5.1 Home `/`
1. Header: wordmark text "Namoe Market" in display face, tagline "A home for every family" small, then `22 sampai 25 Oktober 2026` and `Main Atrium, PIK Avenue Mall`.
2. Strip: card with two rows. If `live`: label "Sedang berlangsung", session title, speaker names, `13.30 sampai 14.15`, button "Tanya pembicara" to `/sesi/[slug]`. Then "Berikutnya" row with the next session. If nothing live, only "Berikutnya". If `over`: "Acara sudah selesai. Terima kasih sudah mampir".
3. Entry tiles (2 by 2 grid): Tenant (count), Peta, Paspor (`n dari 5 stempel` when a passport exists), Jadwal. Each tile is a card with a coloured soft background from the brand hues.
4. Full schedule: day tabs (client, default to today's day when inside the event, else day 1) rendering `ScheduleList` for that day. Each row: time, title, speakers, chevron to `/sesi/[slug]`. Live row gets a `Sedang berlangsung` pill.

### 5.2 Directory `/tenant`
- Sticky top: search input (placeholder "Cari tenant") and a horizontally scrolling chip row: "Semua" then the ten categories. Filter and search are URL state (`?kategori=slug&q=`), applied server-side. Search matches name and intro, case-insensitive.
- Grid 2 columns. Card: square image (logo, else first photo, else placeholder), name (2 lines max), `CategoryBadge`, `Booth A12` pill in display face.
- Empty: mascot-free empty card: "Tidak ada tenant yang cocok. Coba kata lain atau pilih kategori lain."
- Link "Lihat di peta" carries the current `kategori` to `/peta?kategori=`.

### 5.3 Tenant page `/tenant/[slug]`
Order top to bottom: logo plus name plus badge; photo strip (horizontal snap scroll, up to 5, `aspect-square`, `rounded-lg`); intro paragraph; promo card (accent soft background, title "Promo di booth") only if `promo` is set; booth card with `MiniMap` (full map SVG at small size, this tenant's booths filled, everything else at `--map-dim-opacity`), text `Booth A11 sampai A14`, link "Lihat di peta" to `/peta?booth=A11`; "Di booth ini" list (`14.00  Demo gendongan hip seat dan carrier`; slots with no time say "Sepanjang hari"); social row as pill buttons (Instagram, TikTok, Toko online), only those present; "Tanya tenant" section showing existing non-hidden posts (pinned first) and, on day one, a disabled composer with the note "Fitur tanya tenant menyusul" replaced in P1. `after()` increments `viewCount`. 404 to a friendly "Tenant tidak ditemukan" page.

### 5.4 Floor map `/peta`
- `FloorMap` (client). Props: `booths` (with tenant name, category), `activeCategory?`, `highlightCodes?`, `onSelect?`. Renders the SVG at `width: 1200px` inside an `overflow-auto` container with `touch-action: pan-x pan-y`. A toggle "Perbesar / Perkecil" switches the SVG width between 1200 and the container width. Default on phones: fit to width (whole map visible), tap to enlarge.
- Booth rect: `rx=6`. Filled booths use `fill: var(--color-cat-<slug>)` and white code text. Empty booths use `--map-booth-empty` with `--map-booth-empty-stroke` and muted text. Booth tap: filled opens a bottom sheet (name, badge, booth label, "Buka halaman tenant"); empty shows "Belum terisi". Hit target: the rect plus a transparent 44x44 rect around it.
- Multi-unit tenants: units keep their own rects; a single label (tenant short name, 10px) is drawn once across the union bounding box on the large view only.
- Category filter: chip row identical to the directory, URL `?kategori=`. Non-matching booths drop to `--map-dim-opacity`.
- `?booth=A11` highlights those booths with `stroke: var(--map-highlight); stroke-width: 3` and a small triangle marker above, and scrolls them into view on mount.
- Fixtures drawn from `FIXTURES`: stage (navy, white label "Panggung"), seating (seven circles and label), gate, lobbies as text, mall strips as `--map-fixture` rounded rects with small labels.
- Legend under the map: category dots with labels, two columns.

### 5.5 Session board `/sesi/[slug]`
- Header: title, speakers, `Sabtu 24 Okt, 13.30 sampai 14.15`, status pill (Sedang berlangsung / Berikutnya / Selesai).
- Tabs: "Tanya pembicara" and "Ucapan". The Ucapan tab is visible always; before `endsAt` its body reads "Ucapan bisa dikirim setelah sesi selesai" and the composer is hidden.
- Composer (client): textarea (280 max with a counter after 200), name input ("Nama, boleh dikosongkan"), submit "Kirim". Server action `postQuestion(sessionSlug, kind, body, displayName)`. Validation messages from `lib/validate.ts` in copy. After posting, the list revalidates and the composer clears. Name is remembered in localStorage for the next post.
- List: `rankQuestions(open)`. Row: body, meta `Anonim` or name, relative time ("5 menit lalu", "baru saja"), `UpvoteButton` showing count. Upvote is a toggle via `toggleUpvote(questionId)`: transaction that inserts or deletes `Upvote` and increments or decrements `upvoteCount`. Optimistic UI with `useOptimistic`. One per device per question is enforced by the composite primary key.
- Answered: collapsed `<details>` labelled `n pertanyaan sudah dijawab`, each row with a `Sudah dijawab` pill, no upvote button.
- Empty: "Belum ada pertanyaan. Jadi yang pertama bertanya." For Ucapan: "Belum ada ucapan. Tulis ucapan pertama untuk pembicara."
- Hidden questions never render for visitors.

### 5.6 Passport `/paspor` and `/b/[token]`
- `/paspor`: ensures device id, loads or creates the `Passport`. Header "Paspor booth", subtitle "Kumpulkan 5 stempel dari booth yang kamu kunjungi". `StampGrid`: five slots (target from Event), filled slot shows the booth code in display face on a category-coloured circle, empty slot is a dashed circle. Line `n dari 5 stempel`. List of stamped booths with time and link to the tenant. If completed: `RedeemCard` with "Paspor kamu lengkap", the 6-char code in large display face with letter spacing, "Tunjukkan kode ini di meja informasi", prize copy from Event (placeholder text "Hadiah diisi oleh panitia"). If redeemed: "Hadiah sudah diambil" with the time. Extra stamps past the target still list.
- `?stempel=A12` shows a success toast "Stempel baru dari booth A12". `?sudah=A12` shows "Booth A12 sudah pernah distempel". `?salah=1` shows "Kode booth tidak dikenal".
- `/b/[token]` (route handler, GET): look up `Booth` by `qrToken`; 404 redirects to `/paspor?salah=1`. Get or create device id (set cookie on the redirect response). In a transaction: upsert Passport, `applyStamp`, insert `Stamp` if added, and if `justCompleted` set `completedAt` and a fresh `generateRedeemCode()` (retry on unique violation, max 5). Redirect 303 to `/paspor?stempel=CODE` or `?sudah=CODE`.
- Demo helper: `/organizer/[secret]/booth` lists every booth with its `/b/[token]` link so the pitch can "scan" by tapping. Printable QR is P1.

### 5.7 Organizer skeleton `/organizer/[secret]`
- `secret` must equal `ORGANIZER_SECRET` or the page renders 404. Everything here is desktop, plain, in Bahasa Indonesia ("Panel panitia").
- `/organizer/[secret]`: links to Tukar hadiah, Tautan booth, and a list of sessions each linking to its moderation page. Counts: tenant, pertanyaan, paspor dimulai, paspor lengkap.
- `/organizer/[secret]/sesi/[slug]`: same ranked list, each row with "Tandai sudah dijawab" (and "Batalkan" for answered) and "Sembunyikan / Tampilkan". Server actions in `actions/organizer.ts` re-check the secret.
- `/organizer/[secret]/tukar`: input "Kode paspor", submit "Cari". Shows the passport (stamp count, completedAt, redeemedAt) and a button "Tandai sudah ditukar" if not yet redeemed. Codes normalised with `normaliseRedeemCode`.

## 6. Seed data (idempotent, keyed by slug or code)

Run with `pnpm db:seed`. Every write is an upsert so the script can run on each deploy. `pnpm db:seed --if-empty` exits early when a Tenant exists (used in the Railway start command).

### 6.1 Event
Namoe Market, "A home for every family", Main Atrium, PIK Avenue Mall, 2026-10-22 10:00 to 2026-10-25 22:00 WIB, target 5, prizeCopy "Hadiah diisi oleh panitia".

### 6.2 Booths
`generateBooths()` for all 84, each with a random `qrToken`. Existing rows keep their token (upsert updates geometry only).

### 6.3 Tenants and booth assignment
All 24 from `seed-tenants.md` (name, category mapping per 4.7, instagram handle, intro, promo, colour where given). Photos: three placeholder URLs `/img/<slug>?n=1..3`, logo `/img/<slug>?logo=1`. The `activity` column becomes one `TenantSlot`; a trailing time such as `14.00` or `10.30 dan 15.00` is parsed into `time` (two slots for two times); no time means `time: null`. Slugs are kebab-case of the name (`mamas-choice`, `kanva-home-living`).

| Tenant | Size | Booths |
|---|---|---|
| Little Palmerhaus | 4x2 | A1, A2 |
| Nice Kids | 2x2 | A3 |
| Petite Mimi | 2x2 | A6 |
| Velvet Junior | 4x2 | A7, A8 |
| Bohopanna | 4x4 | A11, A12, A13, A14 |
| Ziel Kids | 4x2 | A15, A16 |
| Dialogue Baby | 4x2 | A19, A20 |
| CuddleMe | 4x2 | A23, A24 |
| MOOIMOM | 6x2 | A27, A28, A29 |
| Mama's Choice | 4x4 | A33, A34, A35, A36 |
| GabaG Indonesia | 4x2 | A37, A38 |
| Kayu Seru | 4x2 | A41, A42 |
| mainkayoo | 2x2 | A45 |
| Kummara | 4x2 | A47, A48 |
| Rabbit Hole | 4x2 | A49, A50 |
| Oxone | 6x2 | A52, A53, A54 |
| Ganara Art Space | 4x4 | A55, A56, A57, A58 |
| Twin Tulipware | 4x2 | A59, A60 |
| Kanva Home & Living | 4x2 | A63, A64 |
| Little Giant | 4x2 | A67, A68 |
| BabySafe | 4x2 | A69, A70 |
| Crystal of the Sea | 2x2 (F&B) | A74 |
| Ladang Lima | 4x2 (F&B) | A77, A78 |
| Nayz | 2x2 (F&B) | A81 |

51 of 84 units filled, 33 empty, which reads as a realistic pre-event map.

### 6.4 Speakers
- Theo Derick (`theo-derick`, @byteproject): founder byte.project, penyelenggara Namoe Market.
- Billy Tanhadi (`billy-tanhadi`, @billytanhadi): kreator konten dan pelaku usaha keluarga.
- Natasha Surya (`natasha-surya`, @natashadap): co-host Namoe Market, kreator konten parenting.
Bios two sentences each, placeholders marked for Theo to replace. Photo null (renders initials).

### 6.5 Sessions (45 minutes each, afternoon heavy, WIB)
| Day | Slug | Time | Title | Speakers |
|---|---|---|---|---|
| 1 Kamis 22 | kamis-1300 | 13.00 | Membuka Namoe Market: cerita di balik pasar keluarga | Theo |
| 1 | kamis-1500 | 15.00 | Belanja cerdas untuk kebutuhan bayi tahun pertama | Natasha |
| 1 | kamis-1700 | 17.00 | Membangun brand keluarga dari nol | Billy |
| 2 Jumat 23 | jumat-1300 | 13.00 | MPASI tanpa drama | Natasha |
| 2 | jumat-1500 | 15.00 | Konten keluarga yang jujur di media sosial | Billy |
| 2 | jumat-1700 | 17.00 | Ngobrol santai bareng tenant: dari ide sampai booth | Theo |
| 3 Sabtu 24 | sabtu-1100 | 11.00 | Bermain bersama anak di rumah tanpa layar | Natasha |
| 3 | sabtu-1330 | 13.30 | Mengelola keuangan keluarga muda | Billy |
| 3 | sabtu-1530 | 15.30 | Tanya jawab orang tua baru | Theo, Natasha |
| 3 | sabtu-1730 | 17.30 | Dari hobi jadi usaha rumahan | Billy |
| 4 Minggu 25 | minggu-1100 | 11.00 | Merancang rumah yang ramah anak | Theo |
| 4 | minggu-1330 | 13.30 | Menyusui dan kembali bekerja | Natasha |
| 4 | minggu-1530 | 15.30 | Penutupan: cerita empat hari Namoe Market | Theo, Billy |

Recommended `DEMO_NOW=2026-10-24T14:10:00+07:00` so `sabtu-1330` is live, `sabtu-1530` is next, and day 1 and 2 sessions are finished (their Ucapan tabs open).

### 6.6 Questions, upvotes, feed
- 4 to 6 questions on each of `kamis-1300`, `jumat-1300`, `sabtu-1330`, mixed named and anonymous, plausible parent questions in Bahasa Indonesia. Two marked answered on the finished sessions. Upvotes from synthetic device ids (`seed-dev-01`...) so counts range 0 to 9 and the ranking rule is visibly exercised (one tie between a named and an anonymous question).
- 3 thank-you notes (`kind: THANKS`) on `kamis-1300` and `jumat-1300`.
- 6 feed posts (3 from tenants, 3 from visitors) with placeholder photos. Not rendered on day one; ready for P1.
- 2 Tanya tenant posts on CuddleMe and Oxone, one with a reply and pinned.

## 7. Copy (`lib/copy.ts`, id-ID)

```ts
export const APP_NAME = "Namoe Go";
export const copy = {
  nav: { home: "Beranda", tenants: "Tenant", map: "Peta", schedule: "Jadwal", passport: "Paspor", feed: "Feed" },
  home: {
    dates: "22 sampai 25 Oktober 2026", venue: "Main Atrium, PIK Avenue Mall",
    live: "Sedang berlangsung", next: "Berikutnya", over: "Acara sudah selesai. Terima kasih sudah mampir",
    askSpeaker: "Tanya pembicara", allTenants: "Lihat semua tenant", openMap: "Buka peta",
    startPassport: "Mulai paspor", scheduleTitle: "Jadwal talkshow", tenantsCount: (n: number) => `${n} tenant`,
  },
  directory: {
    search: "Cari tenant", all: "Semua", booth: (c: string) => `Booth ${c}`,
    empty: "Tidak ada tenant yang cocok. Coba kata lain atau pilih kategori lain.", seeOnMap: "Lihat di peta",
  },
  tenant: {
    promo: "Promo di booth", atBooth: "Di booth ini", allDay: "Sepanjang hari", ask: "Tanya tenant",
    askSoon: "Fitur tanya tenant menyusul", seeOnMap: "Lihat di peta", booth: (label: string) => `Booth ${label}`,
    instagram: "Instagram", tiktok: "TikTok", shop: "Toko online", notFound: "Tenant tidak ditemukan", pinned: "Disematkan",
  },
  map: {
    title: "Peta booth", hint: "Ketuk booth untuk melihat tenant", empty: "Belum terisi", enlarge: "Perbesar", shrink: "Perkecil",
    stage: "Panggung", seating: "Area duduk", gate: "Gerbang", openTenant: "Buka halaman tenant", legend: "Kategori",
  },
  qa: {
    tabQuestions: "Tanya pembicara", tabThanks: "Ucapan", placeholder: "Tulis pertanyaan kamu",
    thanksPlaceholder: "Tulis ucapan untuk pembicara", name: "Nama, boleh dikosongkan", send: "Kirim", anon: "Anonim",
    answered: "Sudah dijawab", answeredCount: (n: number) => `${n} pertanyaan sudah dijawab`,
    thanksClosed: "Ucapan bisa dikirim setelah sesi selesai",
    emptyQuestions: "Belum ada pertanyaan. Jadi yang pertama bertanya.",
    emptyThanks: "Belum ada ucapan. Tulis ucapan pertama untuk pembicara.",
    live: "Sedang berlangsung", upcoming: "Berikutnya", finished: "Selesai", justNow: "baru saja",
    minutesAgo: (n: number) => `${n} menit lalu`, hoursAgo: (n: number) => `${n} jam lalu`,
  },
  passport: {
    title: "Paspor booth", subtitle: (t: number) => `Kumpulkan ${t} stempel dari booth yang kamu kunjungi`,
    progress: (n: number, t: number) => `${n} dari ${t} stempel`, stamped: (c: string) => `Stempel baru dari booth ${c}`,
    already: (c: string) => `Booth ${c} sudah pernah distempel`, unknown: "Kode booth tidak dikenal",
    complete: "Paspor kamu lengkap", showCode: "Tunjukkan kode ini di meja informasi", redeemed: "Hadiah sudah diambil",
    prizePlaceholder: "Hadiah diisi oleh panitia", visited: "Booth yang sudah dikunjungi", howTo: "Scan kode QR di setiap booth untuk mendapat stempel",
  },
  organizer: {
    title: "Panel panitia", redeem: "Tukar hadiah", boothLinks: "Tautan booth", sessions: "Sesi", codeLabel: "Kode paspor", find: "Cari",
    markRedeemed: "Tandai sudah ditukar", markAnswered: "Tandai sudah dijawab", unmarkAnswered: "Batalkan", hide: "Sembunyikan", show: "Tampilkan",
    notFound: "Kode tidak ditemukan", stats: { tenants: "Tenant", questions: "Pertanyaan", passportsStarted: "Paspor dimulai", passportsDone: "Paspor lengkap" },
  },
  errors: { bodyTooShort: "Tulis minimal 3 karakter", bodyTooLong: "Maksimal 280 karakter", generic: "Terjadi kesalahan, coba lagi" },
};
```

## 8. Railway deployment

Two services in one project: `web` (this repo) and `Postgres` (Railway plugin). Deploy the skeleton in hour one so infrastructure problems surface early.

### 8.1 Files in the repo
`railway.json`:
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": { "builder": "RAILPACK", "buildCommand": "pnpm install --frozen-lockfile && pnpm prisma generate && pnpm build" },
  "deploy": {
    "startCommand": "pnpm prisma migrate deploy && pnpm db:seed --if-empty && pnpm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 180,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 5
  }
}
```
`package.json` scripts: `dev`, `build` (`next build`), `start` (`next start -p ${PORT:-3000}`), `test` (`vitest run`), `db:migrate` (`prisma migrate dev`), `db:seed` (`tsx prisma/seed.ts`), `postinstall` (`prisma generate`). Prisma `seed` entry in `package.json` also points to `tsx prisma/seed.ts`.

`.env.example`:
```
DATABASE_URL=postgresql://postgres:namoe@localhost:5432/namoe
ORGANIZER_SECRET=change-me
TZ=Asia/Jakarta
DEMO_NOW=
```

`/api/health` runs `SELECT 1` through Prisma and returns `{ ok: true }` with 200, or 503.

### 8.2 Steps (Railway CLI)
```bash
railway login
railway init --name namoe-go
railway add --database postgres
railway variables --set "DATABASE_URL=\${{Postgres.DATABASE_URL}}" --set "ORGANIZER_SECRET=$(openssl rand -hex 12)" --set "TZ=Asia/Jakarta" --set "DEMO_NOW=2026-10-24T14:10:00+07:00"
railway up
railway domain
```
Notes: `railway variables --set` with the `${{Postgres.DATABASE_URL}}` reference links the plugin's internal URL; use the private URL, not `DATABASE_PUBLIC_URL`, for the running service. The generated domain is the base for every `/b/` link; build links from the request host, never from an env var. To connect a GitHub repo instead of `railway up`, use the dashboard's "Deploy from GitHub" on the `web` service and keep `railway.json` as above.

### 8.3 Local development
```bash
docker run -d --name namoe-pg -e POSTGRES_PASSWORD=namoe -e POSTGRES_DB=namoe -p 5432:5432 postgres:16
pnpm install && pnpm db:migrate --name init && pnpm db:seed && pnpm dev
```
Or point `DATABASE_URL` at the Railway `DATABASE_PUBLIC_URL` for a shared dev database.

## 9. Order of work for day one (with checkpoints)

1. Scaffold: `create-next-app` (TS, App Router, Tailwind v4, no src dir), pnpm, fonts, `tokens.css` into `globals.css`, `lib/copy.ts`, bottom nav, empty pages for every route. Checkpoint: `pnpm build` passes.
2. Prisma schema from section 3, first migration, `lib/db.ts` singleton, `/api/health`. Checkpoint: health returns ok locally.
3. Railway project, Postgres, variables, `railway.json`, first deploy of the skeleton. Checkpoint: public URL serves the home shell and `/api/health` is 200.
4. Pure logic from section 4 with Vitest tests written first. Checkpoint: `pnpm test` green, at least 25 tests.
5. Seed from section 6. Checkpoint: 84 booths, 24 tenants, 13 sessions, questions with upvotes, visible in Prisma Studio.
6. Screens in this order: home, directory, tenant page, floor map, session board, passport plus `/b/`, organizer skeleton. After each screen: run on a phone-sized viewport and on the deployed URL.
7. Redeploy, seed on Railway (start command handles it), smoke test the checklist in section 10 from a real phone on the Railway domain.

## 10. Acceptance checklist (day one done when all pass on the Railway URL)

- Home shows dates, venue, a live session and a next session under `DEMO_NOW`, and the four-day schedule with day tabs.
- Directory filters by every category through the URL and searches by name; cards show image, name, category, booth code.
- Tenant page shows photos, intro, promo, booth label, mini map with the booth highlighted, "Di booth ini" slots, social pills.
- Map renders 84 booths, 51 coloured by category, stage, seating, gate, lobbies, mall strips; tapping a filled booth opens the sheet and the link lands on the tenant; `?kategori=` dims the rest; `?booth=` highlights and scrolls.
- Session board: post anonymously and with a name, upvote toggles once per device, order follows the ranking rule, marking answered from the organizer page moves the question into the collapsed section, Ucapan tab opens only after `endsAt`.
- Passport: opening `/paspor` creates a passport; five distinct `/b/` links fill the grid and show a 6-char code; a repeated link shows the "sudah pernah" message; the organizer redeem page finds the code and marks it redeemed; the passport then shows "Hadiah sudah diambil".
- Organizer routes 404 without the secret.
- `pnpm test`, `pnpm lint` and `pnpm build` are clean. No English UI copy, no exclamation marks, no emoji, no em dashes (grep the copy file and components for `!`, `—` and emoji ranges).

## 11. Out of scope for day one (do not start)
Tenant magic link editing, Tanya tenant posting, feed screen, full dashboard counts and moderation for feed, QR image generation, speaker pages, Simpan list, WhatsApp reminders, livestream (cut), Google Form import.

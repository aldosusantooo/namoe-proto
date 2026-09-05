# Namoe Go, companion app for Namoe Market. Product brief (locked 5 Sep 2026)

Product-thinking session output. This is the bridge for the visual design session and the implementation session. Decisions marked Locked are not reopened.

## The event

- Namoe Market, "A home for every family". Family / mom-and-kids market, 80+ tenants.
- 22 to 25 October 2026, Main Atrium, PIK Avenue Mall, Jakarta.
- Organized by byte.project (Theo Derick, Aldo's friend, the person we are pitching to) with Natasha Surya (@natashadap). Instagram: @namoe.market.
- Tenant categories per the organizer's poster: mom and kids clothing, kids accessories, homeware, home decoration, toys and hobbies, electronics, maternity essentials, kitchenware, education, food and beverages.
- Tenants apply through a Google Form that already collects: brand name, PIC name, PIC WhatsApp number, brand social media link, brand introduction, brand category, up to 5 product photos, booth design, booth size (2x2, 4x2, 6x2, 4x4, 6x4, 2x2 F&B).
- Floor plan (see reference/floorplan.png in the Namoe folder): booths A1 to A70 in six blocks of two rows, an F&B row along the bottom, a stage on the right with a seating area in front of it, a gate at the bottom left, north and south lobbies at the sides. Existing mall tenants line the top and bottom edges.
- Benchmark: IMBEX / Mommy N' Me (JICC). Much bigger scale. Their digital layer is Instagram plus a static page plus WhatsApp broadcasts. That gap is our pitch.

## Why we are building this

The user is the visitor (a mom, often with kids in tow, phone in one hand). The buyer is Theo. He cares about three things: tenants feel their booth fee was worth it, talkshow seats get filled, and he has numbers to show the mall and sponsors afterwards. Every feature is judged by "does this make Theo look good to his tenants and speakers."

Opening line for the pitch: the tenant directory populates itself from the application form Theo already runs.

## Locked decisions

- No sign-up or login anywhere. Visitors are anonymous; identity for the passport is a device-local id. Tenants edit through a private magic link. The organizer dashboard sits behind a single shared secret URL for the prototype.
- All copy in Bahasa Indonesia, including the organizer dashboard. Sentence case, no exclamation marks, no emoji, no em dashes.
- Stack: Next.js, Tailwind v4 (CSS-first tokens), Prisma, Postgres, Railway. No dependency for the floor map or QR codes beyond what is trivial to inline.
- Livestream: cut. Not built, not mentioned.
- WhatsApp reminders and phone/email unlock: deferred. Mentioned in the pitch as the full product, not built in the prototype.
- Per-tenant board: kept, framed as "Tanya tenant" (ask this tenant), with organizer hide/unhide.
- Speaker Q&A ranking: upvotes first, then named posts above anonymous posts at equal upvotes, then newest. Anonymous posting stays allowed.
- Mock speakers: Theo Derick, Billy Tanhadi (spelling per his Instagram handle), Natasha Surya. Mock tenants: 24 real Indonesian brands in seed-tenants.md, used as placeholders only.

## Scope, prioritised

### P0, must be in the demo

1. Event home. Dates and venue, "Sedang berlangsung / Berikutnya" strip, full four-day talk schedule, entry points to tenants, floor map, passport, feed.
2. Tenant directory. Grid with category filter and search. Each card: logo or first product photo, name, category, booth code.
3. Tenant page. Logo, up to 5 product photos, brand intro, one active promo, booth code with a mini map marker, social links (Instagram, TikTok, Shopee/Tokopedia), "Di booth ini" time slots (e.g. "Demo gendongan, 14.00"), "Tanya tenant" board (P1 behaviour below).
4. Floor map. Inline SVG replicating the real layout: six A blocks (A1 to A70), F&B row, stage, seating, gate, lobbies. Booth positions stored as data (code, x, y, w, h). Tap a booth to open the tenant page; tenant page highlights its booth. Category colour on booths, filter from the directory carries over.
5. Speaker Q&A per session. Post a question anonymously or with a display name, upvote (one per device per question), ranking rule as locked above, organizer or speaker can mark a question "Sudah dijawab" which moves it to a collapsed answered section. After the session ends the same board accepts "Ucapan untuk pembicara" (thank-you notes) as a second tab.
6. Booth passport. Visitor opens the passport, gets a device-local id (cookie plus localStorage). Each booth has a QR that opens /b/{booth-token}; scanning stamps that booth once. Progress shown as stamps on a grid, target 5 stamps. Reaching the target shows a redeem screen with a 6-character code the info desk marks as redeemed from the dashboard. Prize copy is a placeholder Theo fills in.
7. Seed data. 24 tenants assigned to booths, 3 speakers, a four-day schedule (roughly 3 to 4 talks a day, 45 minutes each, afternoon-heavy for a mall audience), a handful of pre-seeded questions, upvotes and feed posts so the demo does not look empty.

### P1, in if day one goes to plan

8. Tenant magic link. /t/{tenant-token}/edit: edit intro, promo, photos (URL paste is fine for the prototype), social links, "Di booth ini" slots; reply to and pin "Tanya tenant" posts; post to the feed as the tenant.
9. "Tanya tenant" board on each tenant page. Visitor posts a question (anonymous or named). Tenant replies inline through the magic link and can pin one answer to the top. Organizer can hide or unhide any post from the dashboard.
10. Feed. Photo plus one line, from visitors and tenants, newest first, no login. Tenant posts carry the tenant badge. Organizer hide/unhide.
11. Organizer dashboard (/organizer/{secret}). Tenant list with magic links and printable booth QR codes, Q&A moderation, feed and Tanya tenant hide/unhide, passport redeem lookup, counts: tenant page views, questions and upvotes per session, passports started and completed, posts per day. Doubles as the live moderation panel during the event and the post-mortem afterwards.

### P2, stretch

12. Speaker pages linked from the schedule (photo, bio, sessions).
13. "Simpan" list: visitors bookmark tenants, list stored device-locally.

### Deferred to the full-product pitch (not built)

- WhatsApp reminder 10 minutes before a talk (visitor enters a number, no account).
- Phone or email unlock to receive speaker slides or a reply.
- Tenant profile auto-import from the Google Form.

### Cut

- Livestream per tenant.
- Kudoboard as a separate product (folded into the Q&A board's second tab).

## Data model sketch

- Event (singleton): name, dates, venue, prize copy, passport target.
- Tenant: slug, name, category, intro, promo, photos[], instagram, tiktok, marketplace, boothCode, editToken, color?, viewCount.
- Booth: code, x, y, w, h, zone (A block / F&B), tenantId?, qrToken.
- Speaker: slug, name, bio, photo.
- Session: title, day, start, end, speakerIds[], stage.
- Question: sessionId, body, displayName?, upvotes, answered, hidden, kind (question | thanks), createdAt.
- Upvote: questionId, deviceId (unique together).
- TenantPost (Tanya tenant): tenantId, body, displayName?, reply?, pinned, hidden.
- FeedPost: body, photoUrl, authorTenantId?, displayName?, hidden.
- Passport: deviceId, stamps[] (boothCode, at), redeemCode?, redeemedAt?.

## Copy and naming

- Bahasa Indonesia everywhere. Casual but not slangy; "kamu" for visitors, "Anda" is not used. Sentence case. No exclamation marks, no emoji, no em dashes.
- Section names to use: Tenant, Peta, Jadwal, Tanya pembicara, Ucapan, Tanya tenant, Paspor, Feed (keep "Feed"; "Kabar" is the fallback if Feed reads too English in context), Sedang berlangsung, Berikutnya, Di booth ini.
- App name (locked): Namoe Go. Written without an exclamation mark everywhere (UI, title, URL, QR stickers), per the copy rules above.

## Visual direction notes for the design session

Pulled from @namoe.market. Finalize in the design session; do not treat as tokens yet.

- Ground: warm cream (approximately #FFF6E6), not white.
- Palette: primary blue (approximately #4B7FD6) with a light blue (#8FC1EE), coral red (#E2574C), green (#2BB673), yellow (#F5C445), pink (#F3A7C0), orange (#F7B15C). Each blob character carries one colour; categories can map to the same set.
- Characters: five blob mascots with googly eyes (blue triangle, green circle, pink pill, red flower, orange square). Use them as empty-state and passport-stamp art, not as UI chrome.
- Type: chunky rounded display face for the wordmark (Fredoka or Baloo 2 are close), clean rounded sans for body (Nunito or Plus Jakarta Sans). Sentence case, generous size on mobile.
- Texture: hand-drawn grid, stripes, and wavy-edged panels. One texture per screen at most.
- Mobile first. The visitor is standing in a mall. Organizer dashboard is desktop.
- Reference images are in the Namoe folder under reference/.

## Next sessions (order locked: backbone first, design second, polish third)

1. Implementation session A (day one): build spec plus paste-ready Claude Code prompt. Order: schema and seed, pure logic (ranking, passport stamping, redeem code) with tests, then P0 screens with placeholder styling but with colour and type tokens already set up as CSS variables. Deploy to Railway at the end of the day.
2. Visual design session: run against the deployed app. Output: final tokens and component-level fixes for home, tenant directory, tenant page, floor map, Q&A board, passport (mobile), organizer dashboard (desktop). Input: this brief, seed-tenants.md, reference/, the live URL.
3. Implementation session B (day two): apply the design output, then P1 in order, then P2 if time allows.

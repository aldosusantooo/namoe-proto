You are running implementation session B of Namoe Go, the mobile-first companion app for Namoe Market (PIK Avenue Mall, Jakarta, 22 to 25 October 2026). Day one shipped the P0 backbone and it is live on Railway. Your job today, in this order: apply the approved visual design to everything that exists, then build P1 in the new design, then P2 if time allows.

Read these first, in this order, and treat them as the source of truth:

1. `docs/namoe-design-spec.md` (tokens diff, component-by-component changes and removals, screens, placeholder generator, acceptance checklist). This wins on how anything looks.
2. `docs/tokens.css` (v2; replaces the top of `app/globals.css` byte for byte).
3. `docs/design/namoe-go-direction.html` and `docs/design/namoe-go-system.html`: open both in a browser. They are the reference renders; their `<style>` block is the reference CSS for every component. When the spec is ambiguous, the render is right.
4. `docs/assets/` (59 SVG files, listed in `docs/assets/INVENTORY.json`).
5. `docs/namoe-product-brief.md` (locked product decisions; wins on scope), `docs/namoe-build-spec.md` (schema, logic contracts; wins on data and behaviour), `docs/working_context_brief.md` (quality bar and copy rules), `docs/RUNBOOK.md` (how the repo runs).

After reading, tell me in a few lines what you found, anything inconsistent between the docs and the code as it stands, and how many components you count as changed, new, and removed. Then wait for my go before writing any code.

Precedence: this prompt wins on process. The design spec wins on look and layout. The build spec wins on data and logic. The product brief's Locked decisions win over everything.

## Division of labour, non-negotiable

- You write code, tests and config. You never run `git commit`, `git push`, `git add`, or create branches. I commit after each checkpoint. Do not ask me to commit; tell me when a checkpoint is clean.
- You never touch Railway: no `railway` CLI, no deploys, no environment variables anywhere but `.env.example`. The only environment variables are `DATABASE_URL` and `ORGANIZER_SECRET`. Railway rebuilds on every push; every checkpoint must build and run there.
- `DATABASE_URL` is in `.env`. Use it as is. Schema changes go through `pnpm prisma migrate dev --name <step>`; the start command already runs `migrate deploy`.
- `.gitignore` stays as it is; check that `public/uploads/` is gitignored once you add it (step 5), with a `.gitkeep` committed.

## Hard constraints

- Stack unchanged: Next.js App Router, TypeScript strict, Tailwind v4 CSS-first, Prisma 6, Vitest, pnpm. No new runtime dependencies. The one exception, approved: a QR encoder for the printable booth sheet may be added as a single vendored file under `lib/qr.ts` (a minimal QR code generator, MIT, byte-mode, error level M) if writing it is faster than inlining; no npm package.
- The "no image files" rule from session A is dropped by the owner: tenants may upload or paste photo URLs and those render as `<img>`. Icons, glyphs, mascots and placeholders stay inline SVG or generated SVG. Uploads for the prototype go to `public/uploads/<slug>/` with a 5 MB limit, image mime types only.
- Colours live only in `docs/tokens.css`. Components use utilities and `var()`. `grep -rn "#[0-9A-Fa-f]\{6\}" components app --include=*.tsx` must return nothing outside the generated token JSON consumers named in spec section 5.
- No login. Bahasa Indonesia everywhere, sentence case, no exclamation marks, no emoji, no em dashes, "kamu". Every UI string comes from `lib/copy.ts`. Before each checkpoint grep `components`, `app` and `lib/copy.ts` for `!`, `—`, emoji and the `uppercase` utility and remove any.
- No clock. No live states, no countdowns, no timestamps on questions, posts or stamps.
- Tap targets 44px, body 16px. Visitor pages inside `var(--page-max)`. Organizer inside `var(--dashboard-max)` with the sidebar shell, no tab bar. Tenant dashboard is phone-first, no visitor tab bar, one pinned save bar.
- Floor map geometry (`lib/layout.ts` constants) is untouched. Only rendering changes.
- Do not reopen product scope. If the spec asks for something the schema cannot hold, add the smallest migration and say so at the checkpoint.

## Order of work

Work in exactly this order. At each checkpoint run the command shown, fix until clean, then stop and tell me "Checkpoint N clean, ready to commit" with a one-line summary. Wait for my go. Do not move on while a checkpoint fails. Screens are checked at 390 x 844 (visitor, tenant dashboard) and 1200 x 900 (organizer); use the browser tooling you have, or at minimum read the rendered HTML and computed classes.

### Part A, design pass

1. Tokens and assets. Replace the top of `app/globals.css` with `docs/tokens.css` v2. Load Fredoka 500, 600, 700 and Nunito 400, 600, 700, 800 in `app/layout.tsx`. Write `scripts/tokens-to-json.ts` that parses `docs/tokens.css` and emits `lib/tokens.generated.json` (category hex and ink hex per slug), wired into `pnpm build` as a prebuild step and into `postinstall`. Create `components/icons/` from `docs/assets/`: `TabIcons.tsx` (10), `UiIcons.tsx` (21), `Glyphs.tsx` (10, plus `lib/glyph-paths.ts` exporting the raw path data for the SVG route), `Mascots.tsx` (5), `StampShape.tsx` (wavy path helper in `lib/stamp-path.ts` with a unit test that the path closes and has 12 waves), `EmptyArt.tsx` (3). Replace `app/favicon.ico` with `app/icon.svg` from `docs/assets/favicon.svg` and point metadata at it. Checkpoint A1: `pnpm build && pnpm test`, and `curl localhost:3000/icon.svg` returns the mascot.
2. Components. Implement spec section 4 exactly, in this order: Card, Button (new), CategoryBadge, Chip and CategoryChips, Nav, PageHeader, SearchBox, PlaceholderArt (new) and the `/img/[slug]` route rewrite (spec section 5), TenantCard, Tile (new), ScheduleList, DayTabs, Segmented (new), QuestionList and UpvoteButton, QuestionForm (pinned compose), Stamp (new) and StampGrid, RedeemCard (ticket), Notice, Empty, FloorMap and MapSvg and MiniMap (remove MapLegend from `/peta`), OrganizerShell (new), Stat (new). Delete what spec section 8 lists. Update `lib/copy.ts` per spec section 7. Update the seed per spec section 5 (no fake product photos) and re-run `pnpm db:seed`. Checkpoint A2: `pnpm lint && pnpm build && pnpm test`.
3. Screens. Apply spec section 6 to the existing routes in this order: Beranda, Tenant directory, Tenant page, Peta, Jadwal and Sesi, Paspor, organizer index. Walk each against the reference render at 390 (organizer at 1200) and fix until it matches. Checkpoint A3 after Beranda, Tenant, Tenant page. Checkpoint A4 after Peta, Jadwal, Sesi. Checkpoint A5 after Paspor and organizer. Each: `pnpm lint && pnpm build && pnpm test`, plus spec section 9 items 1 to 12 and 14 to 18 walked locally; list any item you could not verify.

### Part B, P1 in the new design

4. Tanya tenant board and tenant dashboard together (product brief items 8 and 9; spec sections 6.8 and 6.9). Migration if needed for `Tenant.logoUrl` handling and any missing fields (the schema already has `TenantPost.reply`, `pinned`, `hidden`, `Tenant.editToken`, `photos`, `logoUrl`). Routes: `/t/[token]/edit` (404 on unknown token, with the pink mascot), server actions for each section, photo add by URL and by upload (`public/uploads/<slug>/`, 5 MB, image types), reply, pin (single pinned post per tenant), hide. Visitor side: the board on the tenant page with anonymous or named posting and the compose sheet shared with the session board. Organizer hide/unhide from the tenant's row later in step 6. Checkpoint B1: `pnpm lint && pnpm build && pnpm test`, plus spec section 9 items 7 and 13 walked locally with one tenant edited end to end (photo by URL, photo by upload, intro, promo, one slot, one reply pinned) and visible on the public page and card.
5. Feed (product brief item 10; spec section 6.10). `/feed` with newest-first cards, visitor and tenant posting (tenant posts from the dashboard carry the tenant badge), organizer hide/unhide. Entry points: the "Feed" link on Beranda and the dashboard section. Checkpoint B2: `pnpm lint && pnpm build && pnpm test`.
6. Fuller organizer (product brief item 11). In the OrganizerShell: Ringkasan (done in A5), Tanya pembicara (per-session moderation: mark answered, hide/unhide, same list styling as the visitor board plus action buttons), Tenant (list with magic links, view counts, Tanya tenant and Feed hide/unhide per tenant), Tukar hadiah (lookup and mark redeemed), Tautan booth (the table plus a printable QR sheet: one A4 page per booth with the tenant name, booth code, the QR for `/b/<token>` built from the request host, the lockup and "Scan untuk stempel paspor"; print stylesheet, cream removed for print). Counts per product brief: tenant page views, questions and upvotes per session, passports started and completed, posts per day. Checkpoint B3: `pnpm lint && pnpm build && pnpm test`, print preview of one booth sheet checked.

### Part C, P2 if time allows

7. Speaker pages `/pembicara/[slug]` linked from the schedule rows (photo or navy avatar, bio, their sessions as a ScheduleList). Checkpoint C1.
8. "Simpan" list: bookmark button (heart icon added to `UiIcons`, outline and filled) on TenantCard and the tenant page, stored in localStorage under `nm_saved`, a "Tersimpan" filter chip on the directory that appears only when the list is non-empty. Checkpoint C2.

## Implementation notes that prevent common mistakes

- Placeholder route: resolve colours from `lib/tokens.generated.json`, never from a hand-typed map. Add `?t=<updatedAt epoch>` to every placeholder URL the app builds so renames bust the immutable cache.
- Compose bar: `position: fixed; bottom: calc(var(--nav-height) + var(--safe-bottom))`. Add bottom padding to the page so the last question is never under the bar. On the tenant dashboard the save bar sits at `bottom: 0` and the visitor Nav is not rendered (layout at `app/(tenant)/` with its own layout file).
- Stamp "baru": derive from `?stempel=CODE` on that render only; do not persist a "new" flag. Reduced motion: opacity only.
- Map zoom: scale the SVG's rendered width by `--map-zoom-scale` relative to the fit width, keep hit rects at 44 units, and when a booth is selected scroll the container so that booth is centred. Fit view renders no booth code text.
- Booth sheet is inline under the map card, not fixed. `?booth=` on load selects and scrolls the sheet into view.
- Uploads: validate mime and size server-side, write with `fs/promises` under `public/uploads/<slug>/<random>.<ext>`, store the public path. Never trust the client filename.
- Pin: enforce single pinned post per tenant in one transaction (unpin others, pin this).
- Reply and pin from the dashboard revalidate the public tenant page (`revalidatePath`).
- Back button: `history.back()` when `document.referrer` is same-origin, otherwise the parent route. Server-render the parent route link so it works without JS.
- Organizer routes stay under `/organizer/[secret]` and 404 on a wrong secret. The sidebar links carry the secret.
- Every icon component renders `aria-hidden="true"`; the button or link carries the label.
- Keep `MapSvg` server-renderable (no hooks); interaction lives in `FloorMap`.

## Definition of done

Report done only when every line of spec section 9 passes locally, `pnpm lint`, `pnpm build` and `pnpm test` are clean, and `docs/RUNBOOK.md` is updated with: the upload directory and its size limit, the tenant magic link path pattern, the QR sheet path, and any new seed row counts. In your final message list: components changed, added and removed (names), the test count, checklist items you could not verify locally and why, any decision the spec left open and how you resolved it, and anything you skipped from Part C. Do not commit.

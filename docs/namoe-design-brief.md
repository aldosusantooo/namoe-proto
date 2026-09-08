# Namoe Go, visual design brief (input for the design session)

Written 5 Sep 2026 after day one shipped. Read with `namoe-product-brief.md` (locked product decisions) and `working_context_brief.md` (how Aldo works). This file says what exists, what is wrong with it, what the design session must produce, and what it must not touch.

## What exists

- Live: https://namoe-proto-production.up.railway.app (organizer panel at `/organizer/<secret>`, Aldo has the secret).
- Repo: the Namoe folder. Tokens live only in `docs/tokens.css` (mirrored as the top of `app/globals.css`). Fonts: Fredoka (display) and Nunito (body) via next/font.
- Routes: `/` Beranda, `/tenant` directory, `/tenant/[slug]`, `/peta` floor map, `/jadwal`, `/sesi/[slug]` Q&A board with Tanya pembicara and Ucapan tabs, `/paspor`, `/b/[token]` stamp redirect, `/organizer/[secret]` with `/sesi/[slug]`, `/tukar`, `/booth`.
- Components (23): Card, CategoryBadge, CategoryChips, Chip, DayTabs, Empty, FloorMap, MapLegend, MapSvg, MiniMap, Nav (bottom tab bar), Notice, PageHeader, QuestionForm, QuestionList, RedeemCard, ScheduleList, SearchBox, StampGrid, TenantCard, UpvoteButton, plus two client helpers.
- Tenant images: no real photos. `/img/[slug]` returns a generated SVG placeholder (a coloured circle with the brand initial). This placeholder is what every tenant card shows today.
- Tokens already defined: warm cream ground, nine brand hues with soft variants, ten category colours (slugs match the Prisma Category enum), radii up to 32px, warm offset shadows, three optional textures (`.texture-grid`, `.texture-stripes`, `.panel-wavy`). Full file in `docs/tokens.css`.

## Honest audit of the live app (ordered by impact per hour of work)

1. Tenant cards are dominated by a giant initial in a coloured circle. Twenty-four of them in a grid reads as a broken image gallery. The placeholder system is the single biggest visual liability and it will stay in the product until tenants upload photos, so it has to be designed, not tolerated.
2. Zero brand personality. Cream plus Fredoka is there, nothing else from the posters is: no blob mascots, no wavy panels, no stripes, no hand-drawn grid except on the passport card. It reads as a competent generic app with a warm palette.
3. Passport has no moment. Five dashed circles and a grey sentence. This is the feature Theo will like most and the completion screen is the one visitors will screenshot. It needs stamp art, a filling animation, and a redeem screen that looks like a prize.
4. Stock icons. The tab bar and UI icons are a generic outline set. The brand is chunky and rounded; the icons are thin and neutral.
5. Colour is used as pastel wash (soft tiles, soft chips) instead of the posters' saturated blocks on cream with navy text. The result is low contrast and flat hierarchy.
6. Floor map is the strongest screen already. On a phone it needs the booth labels to survive fit-to-width, the selected-booth sheet to feel like the rest of the app, and the legend to be a horizontal chip row rather than a two-column list.
7. Home hero is title, uppercase tagline, two lines of metadata, one card, four tiles. Correct information, no composition. The headline talk card and the four tiles compete.
8. Session board and schedule are untouched lists. Fine as structure, need typographic hierarchy (speaker vs title vs time) and the upvote control needs to feel tappable at 44px.

## What the design session must produce

1. Audit first. Open the live URL in Chrome at 390px wide, screenshot every route including the organizer panel, and list everything wrong ordered by impact per hour. Do not skip the embarrassing items.
2. Direction. One direction, rendered, not three. Show it as a design canvas or HTML mockups of these screens at 390px: Beranda, Tenant directory, Tenant page, Peta (fit-to-width and zoomed), Sesi board, Paspor (empty, 3 of 5, complete with redeem code), plus the organizer index at 1200px. Aldo picks the most distinctive option when offered choices, so do not pre-soften.
3. Design system. Final `tokens.css` (same file shape, same variable names where they exist; add, do not rename, so components keep compiling), plus a component sheet: Card, Chip, CategoryBadge, TenantCard with the new placeholder, button variants, tab bar, DayTabs, question row with upvote, stamp, notice, empty state. State every spacing, radius, shadow and type token used.
4. Asset pack, all as SVG code, not PNG:
   - Tab bar icons (5): Beranda, Tenant, Peta, Jadwal, Paspor. Chunky rounded stroke, filled active state.
   - UI icons (about 12): search, back, close, upvote, pin, external link, Instagram, TikTok, marketplace, zoom in, zoom out, check, location, clock, filter.
   - Category glyphs (10), one per Category enum slug, for chips, booth sheet and the tenant placeholder.
   - Five blob mascots (blue triangle, green circle, pink pill, red flower, orange square) with googly eyes, as simple SVG paths. These are Theo's brand characters; approximations are fine for the pitch, and the spec must say the originals replace them later.
   - Tenant placeholder system: a generated SVG (the `/img/[slug]` route stays) built from category colour, category glyph, brand name in Fredoka, and one texture. It must look intentional at card size and at hero size on the tenant page.
   - Stamp art: one stamp badge shape (wavy-edged circle) that takes a category colour and glyph; the empty state, the pressed state, and a "baru" state for the stamp just earned.
   - Empty states (3): no search results, no questions yet, no stamps yet, each with a mascot.
   - Favicon and app icon: a mascot, not a letter.
   - Wordmark: do not redraw the Namoe Market logo. Define the "Namoe Go" text lockup in Fredoka and its clear space; the real wordmark comes from Theo.
5. Handoff. `docs/namoe-design-spec.md`: tokens diff, component-by-component detail (what changes, what is removed), asset list with file paths under `docs/assets/`, and an acceptance checklist. Plus `docs/namoe-claude-code-prompt-b.md`, the paste-ready prompt for implementation session B: apply the design first, then P1 (tenant magic link editing, Tanya tenant posting with tenant reply and pin, Feed screen, fuller organizer dashboard with printable booth QR codes), then P2 if time allows. Same rules as prompt A: Claude Code writes code only, no git, no Railway, checkpoints.

## Constraints the design cannot break

- Locked product decisions in `namoe-product-brief.md`. No login. Bahasa Indonesia everywhere, sentence case, no exclamation marks, no emoji, no em dashes, "kamu".
- Mobile first at 390px. Visitor pages max 640px. Organizer at 1200px, desktop, no tab bar.
- Tap targets 44px minimum. Body text 16px minimum. The visitor is standing in a mall with a child.
- Tokens are the only place colours live. Components use utilities and `var()`; the design session may add tokens and textures, never inline hex.
- No image assets, no icon libraries, no new dependencies. Everything is inline SVG or CSS.
- One texture per screen at most. Mascots are art for empty states, stamps and the passport; they are not UI chrome and never sit behind text.
- Do not redesign the floor map geometry. Booth positions are data in `lib/layout.ts` and match the real poster.
- The clock does not exist. No "live now" states, no countdowns.

## Reference

- `docs/reference/ig-*.png`: the brand as Theo posts it. Cream ground, saturated blue, coral, green, yellow, pink, orange; chunky rounded type; five blob mascots; hand-drawn grid and stripe textures; wavy-edged panels; navy headline text.
- `docs/reference/floorplan.png`: the venue layout the map follows.
- `docs/reference/tenant-form-*.png`: the data tenants already give the organizer, which is the tenant page's content model.
- Benchmarks with live products: IMBEX / Mommy N' Me (Instagram-first, static page), and for interaction quality any Jakarta mall or festival companion app Aldo names in the session.

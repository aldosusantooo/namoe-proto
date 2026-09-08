# Namoe Go, design spec (handoff to implementation session B)

Written 8 Sep 2026 from the visual design session. Direction approved: "Poster on cream". Read with `docs/namoe-product-brief.md` (locked product decisions) and `docs/namoe-build-spec.md` (schema, logic, day-one screens). Where this spec and the build spec disagree on how something looks, this spec wins. Where they disagree on data, logic or behaviour, the build spec wins. The brief's Locked decisions win over both.

Reference renders, both self-contained HTML, open them in a browser at any width:

- `docs/design/namoe-go-direction.html`: the ten screens at 390px plus the organizer at 1200px. The CSS in its `<style>` block is the reference implementation for every component below; when a value here is ambiguous, the render is right.
- `docs/design/namoe-go-system.html`: tokens, component sheet, asset sheet.

Rules that did not change: Bahasa Indonesia everywhere, sentence case, no exclamation marks, no emoji, no em dashes, "kamu". Tap targets 44px minimum, body text 16px minimum. Visitor pages max 640px. Organizer at 1200px, no tab bar. Colours live only in `docs/tokens.css`. No new dependencies. No clock, no live states. Floor map geometry in `lib/layout.ts` is untouched.

Rule that changed (owner decision, 8 Sep): the "no image files" rule is dropped. Tenants may upload or paste photo URLs in P1 and those render as `<img>`. Icons, glyphs, mascots and generated placeholders stay inline SVG.

## 1. The direction in one paragraph

The app is assembled from the pieces already in Theo's posters. Cream page ground. Saturated colour blocks with white (or ink) type carry hierarchy: the hero, the four entry tiles, category pills, tenant placeholders, stamps, the redeem ticket. Headlines are Fredoka 600 in ink or navy, always sentence case. Cards are paper with a visible edge: a 2px outline in `--color-edge` plus a solid 3px shadow of the same colour, replacing the grey blur that vanished on cream. One texture per screen. The five blob mascots appear only as art: empty states, the hero corner, the passport. Icons are a chunky 2.6px rounded stroke set; the active tab is a filled icon on a yellow pill.

## 2. Tokens diff (`docs/tokens.css` v2)

Paste the new file over the old one and over the top of `app/globals.css`. Every v1 variable name still exists. Diff:

Changed values

| Token | v1 | v2 | Why |
|---|---|---|---|
| `--color-primary` | blue | navy | Buttons are navy, colour blocks are blue |
| `--color-border` | `--color-line` | `--color-edge` | Card outline must be visible on cream |
| `--shadow-card` | 2px line + 24px blur | `0 3px 0 0 var(--color-edge)` | Solid edge, poster flat |
| `--shadow-card-raised` | blur | `0 4px 0 0 var(--color-line-strong)` | |
| `--text-h1` | 24/30 | 26/28.8 | Titles carry more of the page now |
| `--text-h2` | 20/26 | 22/25.6 | |
| `--text-h3` | 18/24 | 18/22.4 | Tighter for card titles |
| `--text-display` | 28/32 | 30/32 | Organizer page title |
| `--nav-height` | 64px | 72px | Icon 28 + label 12 + pill |
| `--stamp-size` | 72px | 88px | Glyph plus code fit inside |
| `.texture-grid` | 28px, 1px | 26px, 1.5px | Reads on the passport at 390 |

New tokens (all marked `v2` in the file)

- Colour: `--color-edge`, `--color-navy-deep`, `--color-blue-deep`, `--color-coral-deep`, `--color-green-deep`, `--color-yellow-deep`, `--color-success-ink`, `--color-success-line`, `--color-tab-active`, `--color-border-row`, and ten `--color-cat-<slug>-ink` tokens (white for seven categories, `--color-ink` for `perlengkapan-rumah`, `mainan-hobi`, `peralatan-dapur`).
- Type: `--text-lockup` 44/0.95 700, `--text-code` 56/1 700, `--text-eyebrow` 14/20 600.
- Shadow: `--shadow-btn-primary`, `--shadow-btn-coral`, `--shadow-btn-ghost`, `--shadow-sticker-code`.
- Motion: `--duration-stamp` 500ms, `@keyframes stamp-press`.
- Layout (`:root`): `--dashboard-side` 232px, `--nav-icon` 28px, `--compose-height` 68px, `--hero-art-height` 250px, `--thumb-size` 72px, `--thumb-size-sm` 40px, `--card-edge-width` 2px.
- Map: `--map-highlight-width` 4, `--map-zoom-scale` 1.25, `--map-label-fill`, `--map-booth-radius` 8.
- Passport: `--stamp-gap-x` 26px, `--stamp-gap-y` 18px, `--stamp-burst`, `--stamp-tilt` -8deg, `--ticket-bg`, `--ticket-ink`.
- Placeholder: `--ph-glyph-opacity` 0.92, `--ph-dot-opacity` 0.28.
- Textures: `.texture-dots`, `.texture-check`, `.texture-stripes-light`, `.edge-wavy-bottom`. Existing `.texture-grid`, `.texture-stripes`, `.panel-wavy` stay.

Removed: nothing. `--color-cat-*-soft` tokens stay defined but no component uses them any more (see CategoryBadge).

Fonts: Fredoka must load weights 500, 600, 700 (700 is new, for the lockup and the redeem code). Nunito 400, 600, 700, 800.

Texture assignment, one per screen: Beranda = `.texture-check` on the hero block. Tenant directory = none (the texture is inside the placeholder art). Tenant page = dots inside the hero art. Peta = none. Jadwal = none. Sesi = none. Paspor = `.texture-grid` on the booklet card. Organizer = none. Tenant dashboard = none.

## 3. Assets (`docs/assets/`)

59 SVG files. Icons and glyphs use `currentColor`. Mascots and stamps use `var(--color-x, #hex)` so they work inline (token) and standalone (fallback). Inline them as React components under `components/icons/` (one file per group, exporting named components that render the `<svg>` with `aria-hidden="true"` and `width`/`height` props defaulting to 24, 28 or 48 as noted). Do not load them as `<img>`; the app needs `currentColor`.

| Group | Path | Files | Rendered size |
|---|---|---|---|
| Tab icons | `docs/assets/icons/tab/` | `beranda.svg`, `tenant.svg`, `peta.svg`, `jadwal.svg`, `paspor.svg` and `<name>-active.svg` (filled) | 28 |
| UI icons | `docs/assets/icons/ui/` | `search`, `back`, `chevron-right`, `chevron-down`, `upvote`, `close`, `check`, `pin`, `zoom-in`, `zoom-out`, `fit-screen`, `instagram`, `tiktok`, `marketplace`, `external-link`, `clock`, `filter`, `qr`, `gift`, `chat`, `grid` (.svg) | 20 to 24 |
| Category glyphs | `docs/assets/glyphs/` | one per Category slug: `pakaian-ibu-anak`, `aksesori-anak`, `perlengkapan-rumah`, `dekorasi-rumah`, `mainan-hobi`, `elektronik`, `perlengkapan-ibu`, `peralatan-dapur`, `edukasi`, `makanan-minuman` | 16 in pills, 20 in chips, 34 in stamps, 64% of short side in placeholders |
| Mascots | `docs/assets/mascots/` | `segitiga-biru`, `bulat-hijau`, `pil-pink`, `bunga-merah`, `kotak-oranye` | 44 in hero, 56 on the complete passport, 64 in empty states |
| Stamp states | `docs/assets/stamp/` | `stamp-empty.svg`, `stamp-pressed.svg` (fill from `--stamp-fill`), `stamp-baru.svg` | 88, baru 116 including burst |
| Empty-state art | `docs/assets/empty/` | `no-results.svg` (green mascot + magnifier), `no-questions.svg` (pink + speech bubble), `no-stamps.svg` (blue + empty stamp) | 160 x 120 |
| Favicon, app icon | `docs/assets/favicon.svg`, `docs/assets/app-icon.svg` | blue mascot on cream | 64, 512 |
| Lockup | `docs/assets/lockup/namoe-go-lockup.svg` | text lockup only | 320 x 120 |
| Placeholder examples | `docs/assets/placeholder/` | `example-card.svg`, `example-card-dark-ink.svg`, `example-hero.svg` | reference output of `/img/[slug]` |
| Inventory | `docs/assets/INVENTORY.json` | | |

Mascots are approximations of Theo's characters for the pitch. When Theo supplies the originals, they replace the five files with the same names and the same `viewBox="0 0 100 100"`; no component changes.

Wordmark: the app does not draw the Namoe Market logo anywhere. "Namoe Go" is a text lockup: Fredoka 700, two lines ("Namoe" / "Go"), letter-spacing -0.02em, cream on blue (hero) or navy on cream (organizer sidebar uses cream on navy). Clear space one cap height on all sides. Theo supplies the real wordmark later; the lockup component takes a `children` override for it.

Favicon: replace `app/favicon.ico` (the Next.js default, 25,931 bytes) with `app/icon.svg` from `docs/assets/favicon.svg`, and add `app/apple-icon.png` only if Theo asks; otherwise metadata `icons` points at the SVG. Manifest `theme_color` stays `#FFF6E6`.

## 4. Components, one by one

Each entry: what it is now, what changes, what is removed. Values are tokens unless a pixel is a raw number, in which case it is a Tailwind spacing utility or an explicit style. Class names in brackets are the reference classes in the direction HTML.

### 4.1 Card (`Card.tsx`) [.card]
- Paper surface, `border: 2px solid var(--color-edge)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-card)`, `overflow: hidden`.
- `pad` variant: padding 16.
- Removed: the blur shadow, the 4px coloured top arc used on the headline card and the redeem card. A card that needs a coloured band gets a full-width band inside (see Beranda headline card).

### 4.2 CategoryBadge (`CategoryBadge.tsx`) [.pill]
- Becomes a saturated pill: `min-height 28px`, padding 2px 12px, `radius-pill`, background `--color-cat-<slug>`, text `--color-cat-<slug>-ink`, Fredoka 600 14, category glyph 16 before the label, `white-space: nowrap`.
- Removed: soft background, coloured dot, Nunito text. `--color-cat-*-soft` is no longer used by this component.
- Size prop `sm`: min-height 22 to 24, font 12, padding 0 8 to 9, glyph hidden. Used in the booth sheet and the tenant dashboard identity card.

### 4.3 Chip (`Chip.tsx`) and CategoryChips (`CategoryChips.tsx`) [.chip, .chips]
- Chip: height 44, padding 0 16 0 12, `border: 2px solid var(--color-edge)`, paper, `radius-pill`, Fredoka 600 16 ink, glyph 20 in the category colour before the label.
- Active category chip: background `--color-cat-<slug>`, border transparent, text and glyph `--color-cat-<slug>-ink`. Active "Semua": navy background, white text.
- Row: horizontal scroll, gap 8, margin `0 calc(-1 * var(--page-gutter))`, padding `2px var(--page-gutter) 6px`, hidden scrollbar, right-edge fade `mask: linear-gradient(90deg, #000 calc(100% - 40px), transparent)`. The active chip is rendered first after "Semua" so a filtered state is visible without scrolling.
- Removed: the coloured dot.

### 4.4 Button (new, `Button.tsx`) [.btn]
- Base: inline-flex, gap 8, `min-height 48px`, padding 0 20, `radius-pill`, Fredoka 600 17, no border.
- `primary`: navy, white text, `--shadow-btn-primary`. Pressed: `translateY(3px)`, shadow none, duration fast.
- `coral`: `--color-coral`, white, `--shadow-btn-coral`. Only for the passport prize action ("Tukar hadiah" on the organizer redeem, "Tunjukkan kode" if ever needed).
- `ghost`: paper, `2px solid var(--color-edge)`, navy text, `--shadow-btn-ghost`.
- `icon`: 48 x 48, padding 0. Used for back, search, close, chevron.
- `sm`: min-height 44, font 15, padding 0 16, icon 20.
- Replaces every ad hoc `<button>`/`<Link>` styling in the P0 screens.

### 4.5 Nav (`Nav.tsx`) [.tabbar, .tab]
- Height `var(--nav-height)` plus `--safe-bottom`, paper, `border-top: 2px solid var(--color-edge)`, 5 equal columns, padding 0 6.
- Item: column, min-height 56, gap 2, label Fredoka 600 12 `--color-ink-soft`. Icon 28 sits in a 52 x 32 pill.
- Active: pill background `--color-tab-active` (yellow), filled icon variant in `--color-ink`, label `--color-navy`.
- Icons: replace the five inline paths with the `docs/assets/icons/tab/*` outline and `*-active` filled versions.
- Removed: 1.8 stroke icons, colour-only active state.

### 4.6 PageHeader (`PageHeader.tsx`) [.topbar]
- One row, min-height 48, gap 10: optional back `Button icon ghost` on the left, title `--text-h1` Fredoka 600 growing, optional trailing action (pill or `Button ghost sm`).
- Title text: "Tenant", "Peta", "Jadwal", "Paspor" (not "Peta booth" / "Paspor booth"; the tab label and the page title must match).
- Removed: subtitle line under the title; eyebrows above the title. Eyebrow text (session meta) moves into the topbar's trailing slot as `--text-eyebrow` navy.
- New behaviour: every non-tab page (tenant page, session board) renders the back button. Back goes to `history.back()` when the referrer is in-app, otherwise to the parent route (`/tenant`, `/jadwal`).

### 4.7 SearchBox (`SearchBox.tsx`) [.search]
- Height 48 pill, `2px solid var(--color-edge)`, paper, icon 22 ink, placeholder `--color-ink-muted` 16. Placeholder copy: "Cari tenant atau booth". Search also matches booth codes.
- On `/tenant` the box is collapsed behind the search icon button in the PageHeader; tapping expands it under the header (client state) and focuses it. Removed: the always-visible 48px search row and the sticky header block. Only the chip row may stick, and only while the grid scrolls.

### 4.8 TenantCard (`TenantCard.tsx`) [.tcard]
- Card as 4.1, no padding, flex column. Image area `aspect-ratio: 1`, `position: relative`. Body padding 10 12 12, gap 6.
- Name: Fredoka 600 17/1.2, `line-clamp: 2`. Under it one line: category glyph 16 in the category colour plus the category label, Nunito 700 13 `--color-ink-soft`, wraps if needed (no ellipsis).
- Booth code: a cream sticker over the image, top-left 8/8: Fredoka 600 14 ink, background `--color-cream`, radius 8, padding 2 8, `--shadow-sticker-code`. Copy is the code only ("A69"), never "Booth A69"; the word is redundant next to the pin everywhere else.
- Image source unchanged in priority: `logoUrl`, then `photos[0]`, then `/img/[slug]` (see 5).
- Removed: the CategoryBadge inside the card (replaced by the glyph line), the "Booth A69" pill, the grey placeholder circle.

### 4.9 Placeholder art (new, `PlaceholderArt.tsx`) and `/img/[slug]` route [.ph-art]
- One design at four sizes: thumb (40, 72: glyph only, centred, inset 14%), card (171: glyph top-right at 64%, name bottom-left 20px), hero (358 x 250: glyph at 46% width right, name 34px bottom-left, right inset 40% so the name never sits under the glyph).
- Background `--color-cat-<slug>`, `.texture-dots`, glyph `--color-cat-<slug>-ink` at `--ph-glyph-opacity`, name Fredoka 600 in the same ink.
- The React component renders it inline (used in booth sheet, organizer list, tenant dashboard identity card, the tenant page hero). The `/img/[slug]` route emits the same design as an SVG file for `<img>` consumers (cards, seeded photos); generator rules in section 5.
- Removed: hash-based colour, the initials, the "GI 1" product photo placeholders. Seed tenants get no fake product photos; the photo strip on the tenant page is hidden when `photos` is empty (see 6.3).

### 4.10 Tile (new, `Tile.tsx`) [.tile]
- Link block, `radius-lg`, padding 14 14 12, min-height 112, flex column space-between, filled tab icon 30 top-left, title Fredoka 600 22, subtitle Nunito 700 14 at 0.95 opacity.
- Fixed colours: Tenant blue, Peta green, Jadwal yellow with `--color-ink` text, Paspor coral. Pressed: the matching `-deep` token. No edge, no shadow.

### 4.11 ScheduleList (`ScheduleList.tsx`) [.sched]
- Inside a Card. Row: link, flex, gap 14, padding 14 16, min-height 64. Time column: Fredoka 600 20 navy, min-width 56, tabular numerals. Title: Nunito 800 16/1.3. Second line: speaker avatar 24 (initials, Fredoka 600 11) plus name, Nunito 14 `--color-ink-soft`. Chevron-right 22 `--color-ink-muted` right, vertically centred. `2px solid var(--color-line)` between rows.
- On Jadwal each day is a section: heading `--text-h2` "Kamis 22 Okt" (sentence case) above its Card. No DayTabs on Jadwal; all four days scroll. DayTabs stay for any future filter that needs them and are restyled in 4.12.
- Removed: uppercase day headers, stock chevron.

### 4.12 DayTabs (`DayTabs.tsx`) [.daytabs]
- Track `--color-cream-deep`, padding 4, `radius-pill`, 4 equal columns, gap 4. Item: min-height 52, column, Fredoka 600 15 day name over Nunito 700 12 date, `--color-ink-soft`. Active: navy background, white, `0 2px 0 0 var(--color-navy-deep)`.
- No longer rendered on Beranda (see 6.1). Kept as a component.

### 4.13 Segmented tabs (new, `Segmented.tsx`) [.seg]
- Same track as DayTabs, 2 columns. Item min-height 44, Fredoka 600 16, `--color-ink-soft`. Active: paper, `--color-ink`, `0 2px 0 0 var(--color-edge)`. Used for Tanya pembicara / Ucapan.

### 4.14 QuestionList (`QuestionList.tsx`) and UpvoteButton (`UpvoteButton.tsx`) [.q, .up, .answered]
- Row: padding 14 16, gap 12, question text Nunito 600 16/1.4, byline Nunito 14 `--color-ink-soft` (display name or "Anonim"). `2px solid var(--color-line)` between rows.
- Removed: the timestamp on every question. Time is not shown anywhere on the board.
- UpvoteButton: 48 wide, min-height 52, radius 14, `2px solid var(--color-edge)`, paper, navy, `0 2px 0 0 var(--color-edge)`; arrow icon 20 over the count Fredoka 600 16, gap 1. Voted: navy fill, white, `0 2px 0 0 var(--color-navy-deep)`. Pressed: `translateY(2px)`.
- Answered section: a 44px row "N pertanyaan sudah dijawab" with a green check 22 on the left and chevron-down 22 on the right, `--color-ink-soft` Nunito 700 15; tapping expands the answered list below it (client state, default collapsed).
- Helper line under the card, Nunito 14 `--color-ink-soft`: "Pertanyaan dengan dukungan terbanyak naik ke atas. Kamu bisa dukung satu kali per pertanyaan."

### 4.15 QuestionForm (`QuestionForm.tsx`) [.compose]
- Becomes a pinned compose bar: `position: fixed`, bottom `var(--nav-height)` plus safe area, padding 10 12, cream, `border-top: 2px solid var(--color-edge)`, flex gap 8. Field: 48 pill, paper, 2px edge, placeholder "Tulis pertanyaan kamu". Button primary "Kirim".
- Tapping the field expands a sheet above the bar with the textarea (min 96px) and the optional name field ("Nama, boleh dikosongkan"), same tokens as 4.7; Kirim stays put. Page content gets bottom padding `var(--compose-height) + var(--nav-height) + 16`.
- Removed: the form card at the top of the board.

### 4.16 StampGrid (`StampGrid.tsx`) and Stamp (new, `Stamp.tsx`) [.stamps, .stamp]
- Booklet: Card with background `--color-cream` and `.texture-grid`, padding 18 14 16. Inside, `.stamps`: flex, wrap, centre, gap `--stamp-gap-y` `--stamp-gap-x`; with 88px stamps this lays out 3 + 2 at 390.
- Stamp shape: the wavy badge path (12 waves, amplitude 3.5 on radius 42 in a 100 viewBox); path string in `docs/assets/stamp/stamp-pressed.svg`, or generate it once in `lib/stamp-path.ts` with the loop from the direction HTML.
- Empty: fill `--stamp-empty`, stroke `--stamp-empty-stroke` 2.5 dashed 6 5, slot number Fredoka 600 22 `--color-ink-muted` at 0.7.
- Pressed: fill `--color-cat-<slug>` of the stamped booth's tenant (empty booth: navy), inner dashed ring r 33 at 0.55 white (0.35 ink on light hues), category glyph 34, booth code Fredoka 600 14 below it, ink `--color-cat-<slug>-ink`.
- Baru (the stamp matching `?stempel=` on this render): `transform: rotate(var(--stamp-tilt)) scale(1.08)`, a dashed yellow burst ring (`--stamp-burst`, 16 waves, stroke 5, dash 10 9) at inset -14px, `animation: stamp-press var(--duration-stamp) var(--ease-soft)`. Reduced motion: opacity only.
- Under the stamps, centred: `--text-h2` "Kumpulkan 5 stempel" (0), "N stempel lagi" (1 to 4), "5 dari 5 stempel" (complete); one line of Nunito `--color-ink-soft` under it.
- Removed: the 4 + 1 layout, the flat circles, the dashed "Booth yang sudah dikunjungi" empty box.

### 4.17 RedeemCard (`RedeemCard.tsx`) [.ticket]
- Becomes a ticket: `--ticket-bg` coral, white text, `radius-lg`, padding 20 18 18, `position: relative; overflow: hidden`. Eyebrow "Paspor kamu lengkap" Fredoka 600 14 cream. Code `--text-code` cream, letter-spacing 0.08em, tabular. Line "Tunjukkan kode ini di meja informasi" Nunito 700. Divider `3px dashed rgba(255,255,255,.5)` full bleed, then gift icon 30 and "Hadiah" small 800 over `Event.prizeCopy` in `--text-h3`. Two 26px cream circles at the left and right edges at 50% height (tear notches).
- Above the ticket on the complete passport: the five mascots in a row at 56px, alternating baseline by 10px, centred, never overlapping text.
- Removed: the white card with green arc, the "HADIAH" uppercase label, the green soft box.

### 4.18 Notice (`Notice.tsx`) [.notice]
- Flex, gap 12, padding 12 14, `radius-md`, Nunito 700, icon 24. `ok`: `--color-success-soft` fill, `2px solid var(--color-success-line)`, text `--color-success-ink`. `warn`: `--color-yellow-soft` fill, `2px solid var(--color-yellow)`, ink text (tenant dashboard link warning).
- Stamp notice copy names the tenant: "Stempel baru dari Petite Mimi, booth A6". Already-stamped: "Booth A6 sudah ada di paspor kamu". Wrong token: "Kode QR tidak dikenal".

### 4.19 Empty (`Empty.tsx`) [.empty]
- Flex, gap 14, padding 14 16, `--color-cream`, `2px dashed var(--color-line-strong)`, `radius-lg`. Mascot 64 on the left (prop: `search` green, `questions` pink, `stamps` blue, `feed` orange), title Fredoka 600 17, body Nunito 14 `--color-ink-soft`.
- Copy: search "Tidak ada tenant yang cocok" / "Coba kata lain atau pilih kategori lain."; questions "Belum ada pertanyaan" / "Jadi yang pertama bertanya ke pembicara."; Tanya tenant "Belum ada pertanyaan" / "Tanya soal produk, ukuran, atau stok. Tenant menjawab langsung di sini."; stamps handled by StampGrid; feed "Belum ada kabar" / "Foto plus satu kalimat dari pengunjung dan tenant."

### 4.20 FloorMap (`FloorMap.tsx`), MapSvg (`MapSvg.tsx`), MiniMap (`MiniMap.tsx`), MapLegend (`MapLegend.tsx`)
- Geometry unchanged. Booth rect `rx` from `--map-booth-radius` (8). Filled booth: category colour, no stroke. Empty: `--map-booth-empty` with `--map-booth-empty-stroke` 2. Dimmed: `--map-dim-opacity`. Selected: stroke `--map-highlight` width `--map-highlight-width` plus a small ink triangle marker centred above the booth.
- Fit view (default at 390): no booth code labels at all (they render at 4px and read as noise); fixtures keep their labels at 13. Zoomed view: `--map-zoom-scale` 1.25 so booths are 45px; booth codes Fredoka 600 12 in `--color-cat-<slug>-ink`; one tenant label per multi-unit group as a paper pill (80 x 18, radius 9, `1.5px solid var(--color-edge)`, Fredoka 600 11, name cut at 12 characters) placed above the group when the group starts on a cluster's top row or spans both rows, below it otherwise.
- Controls: a vertical stack bottom-right inside the map card, buttons 44 x 44, radius 12, paper, `2px solid var(--color-edge)`, `0 2px 0 0 var(--color-edge)`: zoom-in, zoom-out, and fit-screen (only while zoomed). Zoomed map pans in both axes inside the card (`overflow: auto`, momentum), and zooming in centres on the selected booth if any. Removed: the "Perbesar" text button and the "Ketuk booth untuk melihat tenant" line above the map. The hint moves under the map as Nunito 14 `--color-ink-soft`: "Ketuk booth untuk melihat tenant. Warna mengikuti kategori di atas."
- MapLegend: removed from `/peta`. The CategoryChips row is the legend. Keep the component file only if the organizer QR sheet uses it; otherwise delete it.
- Booth sheet: no longer `position: fixed`. It renders inline directly under the map card as a Card: 72px PlaceholderArt (or `logoUrl`) thumb, `--text-h3` name, CategoryBadge `sm` plus booth codes, chevron Button icon ghost linking to the tenant page. Tapping the same booth again or the close icon clears it. The map card and the sheet must both be visible at 390 x 844 without scrolling.
- MiniMap on the tenant page: fixtures without text, emphasis on the tenant's booths, the marker, no labels. Under it: "Booth A37 dan A38" Nunito 800 16 plus a location hint line (block name from `lib/layout.ts` cluster and band: "Blok tengah, dekat area duduk" style, generated from band 1 to 3 = depan, tengah, belakang; FNB = "Deretan makanan dan minuman"), and a `Button ghost sm` "Buka peta" linking to `/peta?booth=A37`.

### 4.21 Organizer shell (new, `OrganizerShell.tsx`) [.org]
- Grid `var(--dashboard-side) 1fr`, min-height 100vh. Sidebar navy, padding 22 16: lockup (Fredoka 700 26 cream, "Panel panitia" 13 under it), then links: Ringkasan (grid icon), Tanya pembicara (chat), Tenant (store), Tukar hadiah (gift), Tautan booth (qr). Link 44 high, radius 12, Fredoka 600 16, white at 0.85; active: yellow background, ink text. Footer: event dates and venue, 13 at 0.75.
- Main: padding 28 32 40, gap 22. Page title `--text-display`, one-line Nunito `--color-ink-soft` under it, primary action top-right as `Button ghost sm`.
- Removed: the three text links header, the 730px cap. Content uses the full 1200 minus the sidebar.

### 4.22 Stat tile (new, `Stat.tsx`) [.stat]
- Card, padding 16 18, gap 4. Number Fredoka 600 40 navy tabular, label Nunito 800 15, context line Nunito 13 `--color-ink-soft` (always present: "dari 84 booth, 60 masih kosong"; "di 3 dari 13 sesi, 2 sudah dijawab"; "rata-rata 1,5 stempel per paspor"; "0 hadiah ditukar"). Passport tiles add an 8px progress bar (`--color-cream-deep` track, `--color-green` fill).
- Removed: uppercase labels, bare numbers.

## 5. Placeholder generator (`app/img/[slug]/route.ts`)

The route stays and keeps its URL shape so seeded `photos` and `logoUrl` values that point at it keep working, but the output changes:

1. Look up the tenant by slug (name, category). Unknown slug: 404.
2. Query `?v=card` (default, 600 x 600), `?v=hero` (1200 x 750), `?v=thumb` (200 x 200). `?logo=1` maps to `thumb`. `?n=` is ignored.
3. Background rect in the category colour, resolved server-side from a `CATEGORY_HEX` map that is generated from `docs/tokens.css` at build time (script `scripts/tokens-to-json.ts` writes `lib/tokens.generated.json`); never hand-copy hex into the route. Ink from the same map (`-ink`).
4. `<pattern>` of white circles r 4 on a 32 grid at 0.28 opacity over the whole rect.
5. Category glyph path from `components/icons/glyphs` (share the path data through `lib/glyph-paths.ts`, generated from `docs/assets/glyphs/*.svg`), at 0.92 opacity, scaled to 64% of the short side, translated so it bleeds 6% off the right and top edges. Thumb: 72% of the side, centred, no name.
6. Name: Fredoka 600 (font-family string "Fredoka, Nunito, system-ui, sans-serif"), 12% of the short side, ink colour, wrapped at 14 characters (20 on hero) into at most 3 lines, anchored bottom-left with a 40 unit inset; hero variant keeps the name inside the left 60%.
7. Headers: `content-type: image/svg+xml`, `cache-control: public, max-age=86400, immutable`. Add the tenant's `updatedAt` epoch as `?t=` in every URL the app builds so a rename busts the cache.
8. The card component never requests the art when `logoUrl` or `photos[0]` exists.

Seed change: remove the five fake `/img/<slug>?n=` product photos from every seeded tenant; `photos` seeds as an empty array and `logoUrl` as null. Theo (or Aldo before the pitch) fills real photos through the tenant dashboard.

## 6. Screens

### 6.1 Beranda `/`
- Hero block: full-bleed blue (`margin: 0 calc(-1 * var(--page-gutter))`), `.texture-check`, padding 22 20 46, `.edge-wavy-bottom`. Lockup component top-left, "Panduan pengunjung Namoe Market" Fredoka 600 16 under it, dates Fredoka 600 18, venue Nunito 15 at 0.92. Three mascots (blue, red, orange) at 44px top-right, in the padding zone, never over text.
- Headline card: Card with a yellow band (padding 8 16) holding the eyebrow "Talkshow pembuka" left and "Kamis 22 Okt, 13.00" Nunito 800 14 right; body padding 14 16 16: title `--text-h2`, speaker row (avatar 40 + name 700 + "byte.project" small), description `--color-ink-soft`, `Button primary` "Tanya pembicara". Content: first session of day 1.
- Four Tiles in a 2 x 2 grid, gap 12, in this order: Tenant "24 brand", Peta "Denah booth", Jadwal "13 talkshow", Paspor "0 dari 5 stempel" (or "3 dari 5 stempel" once started, "Lengkap" when complete).
- "Talkshow berikutnya": `--text-h2` with "Semua jadwal" eyebrow link right; a Card with the next three sessions after the headline (day 1 sessions 2 and 3, then day 2 session 1 prefixed "Jum" in the time column).
- Removed: "Namoe Market" title, uppercase tagline, the metadata lines, DayTabs and the day schedule, the pastel tiles.
- Copy: `copy.home.tenantsCount` becomes `${n} brand`; `sessionsCount` becomes `${n} talkshow`; add `nextTalks: "Talkshow berikutnya"`, `allSchedule: "Semua jadwal"`, `openingTalk: "Talkshow pembuka"`, `subtitle: "Panduan pengunjung Namoe Market"`.

### 6.2 Tenant directory `/tenant`
- PageHeader "Tenant" with search icon button and `Button ghost sm` "Peta" (map icon) on the right. CategoryChips row. Count line Nunito 14 `--color-ink-soft`: "24 brand, urut nama" (or "6 brand di Aksesori anak"). Grid 2 columns gap 12 of TenantCard.
- Search expands under the header on tap; when expanded, the header shows a close icon instead. Filtering stays URL-driven (`?kategori=`, `?q=`).
- Removed: sticky header block, the always-visible search field, "Lihat di peta" text link.

### 6.3 Tenant page `/tenant/[slug]`
- Hero art: full-bleed `var(--hero-art-height)` PlaceholderArt hero variant with `.edge-wavy-bottom`, or the `logoUrl` image cropped to the same box with the same wavy edge. Back `Button icon ghost` floats top-left at 12/12 over the art.
- Under it: PageHeader row with `--text-h1` name and booth pill (pin icon + "A37, A38") right; CategoryBadge on its own line.
- Photo strip: only when `photos.length > 0`; 160 x 160 tiles, radius-md, `2px solid var(--color-edge)`, gap 10, horizontal scroll with `margin: 0 calc(-1 * var(--page-gutter))` and matching padding so the first tile aligns with the gutter. Tap opens the image full width (simple overlay, no library).
- Intro paragraph, body 16.
- Promo block: yellow, `radius-lg`, padding 14 16, gift icon 30, eyebrow "Promo di booth" ink, `--text-h3` promo text. Hidden when promo is empty.
- Map card: MiniMap plus the booth line and "Buka peta" (4.20).
- "Di booth ini": `--text-h2`, ScheduleList rows with time and title, second line the slot note ("Setiap hari" when no day is set).
- Links: chips with icons, 44 high: Instagram, TikTok, Shopee or Tokopedia (label from the URL host: `shopee` = "Shopee", `tokopedia` = "Tokopedia", else "Toko online"). Only present links render.
- "Tanya tenant": `--text-h2`, then the board (P1). Until P1 lands in this same session, render the Empty (questions) plus a disabled `Button primary` "Tulis pertanyaan"; never the "menyusul" text twice. Remove `copy.tenant.askSoon`.
- Removed: the "GI 1" photo placeholders, the disabled textarea with placeholder text, the caption "Booth A37 dan A38 / Lihat di peta" split across the card.

### 6.4 Peta `/peta`
- PageHeader "Peta" with `Button ghost sm` "Tenant" (store icon) right; when `?kategori=` is set the right slot shows that CategoryBadge instead.
- CategoryChips (the legend). Map card with controls (4.20). Hint line. Inline booth sheet when `?booth=` or a tap selected one.
- Filter caption when a category is active, Nunito 14 `--color-ink-soft`: "Filter aktif: 3 booth Perlengkapan ibu. Booth lain diredupkan."
- Removed: title "Peta booth", "Perbesar" button, the "Kategori" legend list, the fixed bottom sheet.

### 6.5 Jadwal `/jadwal` and Sesi `/sesi/[slug]`
- Jadwal: PageHeader "Jadwal"; four sections, one per day, `--text-h2` heading "Kamis 22 Okt" and a Card of ScheduleList rows. No DayTabs.
- Sesi: PageHeader with back button and the eyebrow "Kamis 22 Okt, 13.00 sampai 13.45" in the trailing slot; `--text-h1` title; speaker row (avatar 48 Fredoka 18, name 700, "byte.project, penyelenggara Namoe Market" small from `Speaker.bio` first clause or handle); Segmented tabs; QuestionList card; helper line; pinned compose bar. Ucapan tab uses the same list and bar with placeholder "Tulis ucapan untuk pembicara".
- Removed: uppercase meta, the form card, timestamps, the plain "2 pertanyaan sudah dijawab" text.

### 6.6 Paspor `/paspor`
- PageHeader "Paspor" with a count pill right: outline "0 dari 5" / "3 dari 5"; green filled with check "Lengkap" when complete.
- Notice (ok / warn) when `?stempel=`, `?sudah=` or `?salah=` is present.
- Complete state: the mascot row and the ticket (4.17) above the booklet.
- Booklet (4.16).
- Empty state extra: a Card (pad) with the green mascot 64 and "Cara dapat stempel" 700 plus "Scan kode QR di meja booth mana pun. Stempel masuk otomatis ke paspor ini, tanpa daftar." small, then `Button primary` "Lihat daftar booth" (store icon) to `/tenant`.
- Visited list (1 to 5 stamps): `--text-h2` "Booth yang sudah dikunjungi", a Card of rows: code in the time column style (Fredoka 600 16 navy), tenant name 800, category small, chevron; row links to the tenant page. No timestamp.
- Removed: "Paspor booth" title, the subtitle sentence, the dashed empty box, the timestamped list.

### 6.7 Organizer `/organizer/[secret]` (index)
- OrganizerShell (4.21) with Ringkasan active. Header: "Ringkasan", "Angka sejak aplikasi dibuka. Diperbarui setiap kali halaman dimuat.", `Button ghost sm` "Cetak QR booth" (qr icon) linking to the booth sheet page.
- Stats row: 4 Stat tiles (4.22).
- Two columns `1fr 340px`, gap 20. Left: "Sesi" `--text-h2` with the caption "Buka untuk moderasi dan tandai sudah dijawab"; one Card per day stacked, header row cream "Kamis 22 Okt", rows as links: time Fredoka 600 16 navy (52 wide), title 15, count Nunito 800 `--color-ink-soft` ("5 pertanyaan", coral when > 0 unanswered), chevron 24. Right: "Tukar hadiah" card with the 6-character field (Fredoka 22, letter-spacing 0.1em, 48 high) and `Button primary` "Cek", result Notice below; under it the "Tenant" list card: 40px PlaceholderArt thumb, name 700, "category, codes" small, two eyebrow links "Tautan edit" and "QR", header link "Semua 24".
- Removed: the three text links, uppercase stat labels, the 730px width cap, the two-column session grid.

### 6.8 Tenant dashboard `/t/[token]/edit` (P1, new)
Phone-first (tenants edit from the booth). No visitor tab bar; a single pinned bottom bar with `Button primary` "Simpan perubahan" (full width, cream bar, 2px edge top, safe-area padding). Unknown token: 404 page with the pink mascot and "Tautan tidak dikenal".

Sections, top to bottom, each `--text-h2` with an optional trailing action, 16 gap:

1. PageHeader "Kelola booth" with a status pill right: outline with check "Tersimpan", or navy "Belum disimpan" when the form is dirty.
2. Identity Card: 72 thumb (logo or PlaceholderArt), `--text-h3` name, CategoryBadge `sm` and booth pill `sm`, `Button icon ghost` external-link to the public tenant page.
3. Notice `warn` with pin icon: "Simpan tautan halaman ini. Siapa pun yang memilikinya bisa mengubah booth kamu."
4. "Foto produk" with "N dari 5" right. 3-column grid, gap 8, square tiles radius 14 `2px solid var(--color-edge)`: filled tiles show the image, the first carries a navy pill "Utama" top-left; empty tiles are dashed `--color-line-strong` on `--color-cream-deep` with a plus icon (reuse zoom-in) and "Tambah" Fredoka 600 14 navy, 44px minimum. Tapping "Tambah" opens a small sheet: paste URL field (48 pill) with "Pakai tautan", or "Unggah dari galeri" (file input, image only, max 5 MB; upload handler stores the file under `public/uploads/<slug>/` for the prototype and saves the path). Long-press or a small close on a tile removes it; the first tile is the card photo. A sixth tile holds the logo, labelled with a booth-style pill "Logo" bottom-left, same add flow, saves to `logoUrl`.
5. "Perkenalan brand": Card textarea, min-height 96, 16/1.45, max 600 characters with a counter at 500+.
6. "Promo di booth" with a Tampil / Sembunyi pill toggle right (green when shown): Card input, Nunito 700 16.
7. "Di booth ini" with "Tambah" eyebrow right: ScheduleList rows (time + title + note) each with a 44px close button; add opens time (HH.MM) and title fields.
8. "Tautan": Card with three rows, icon 24 + input 16: Instagram, TikTok, marketplace URL. Accept a handle or URL for Instagram and TikTok; store the URL.
9. "Tanya tenant" with a coral pill "N belum dibalas" right when unanswered posts exist: Card of posts. Each post: question 600 16, byline; answered posts show the reply in a cream inset (radius 14, padding 10 12, `border-left: 4px solid --color-cat-<slug>`) with "Jawaban kamu" small 800 and the pinned one carries a yellow pill "Disematkan" (pin icon). Unanswered posts show `Button primary sm` "Balas" and `Button ghost sm` "Sembunyikan". Reply opens a textarea inline; "Sematkan" toggles the single pinned post.
10. "Kabar untuk Feed": Empty (feed, orange mascot) when the tenant has not posted, `Button ghost` "Tulis kabar" opens photo (URL or upload) plus one line, max 140 characters.

Saving: one server action per section is acceptable; the pinned bar saves the dirty sections and shows the status pill "Tersimpan". Server-side validation per `lib/validate.ts`.

### 6.9 Tanya tenant board (P1, visitor side, on the tenant page)
- Under "Tanya tenant": posts as QuestionList rows without upvotes; the pinned post first with the yellow "Disematkan" pill; replies rendered in the cream inset with "Jawaban tenant"; hidden posts not rendered. Then `Button primary` "Tulis pertanyaan" opening the same compose sheet as the session board (anonymous or named). Empty state per 4.19.

### 6.10 Feed `/feed` (P1)
- Add a sixth entry point as a Tile? No: the tab bar stays at five. Feed is reached from a "Feed" eyebrow link in the Beranda "Talkshow berikutnya" header row ("Feed" right of "Semua jadwal") and from the tenant dashboard. Layout: PageHeader "Feed" with `Button primary sm` "Tulis kabar"; a single column of Cards: image (aspect 4:3, radius inherits), padding 12 14, one line 16, byline with the tenant badge (CategoryBadge `sm` plus name) or display name. Newest first. Compose sheet as above with photo URL or upload.

## 7. Copy changes (`lib/copy.ts`)

Add or change (Indonesian, sentence case):

- `nav`: unchanged.
- `home`: `subtitle`, `openingTalk`, `nextTalks`, `allSchedule`, `tenantsCount(n) = "${n} brand"`, `sessionsCount(n) = "${n} talkshow"`, `passportProgress(n, t) = "${n} dari ${t} stempel"`, `passportComplete = "Lengkap"`.
- `directory`: `search = "Cari tenant atau booth"`, `count(n) = "${n} brand, urut nama"`, `countIn(n, cat) = "${n} brand di ${cat}"`; remove `booth()` from cards (code only).
- `tenant`: remove `askSoon`; add `askEmptyTitle`, `askEmptyBody`, `askWrite = "Tulis pertanyaan"`, `openMap = "Buka peta"`, `boothLine(codes) = "Booth A37 dan A38"` (keep existing `booth()`), `photosTitle`.
- `map`: `title = "Peta"`, `hint = "Ketuk booth untuk melihat tenant. Warna mengikuti kategori di atas."`, `zoomIn = "Perbesar"`, `zoomOut = "Perkecil"`, `fit = "Pas layar"`, `filterActive(n, cat) = "Filter aktif: ${n} booth ${cat}. Booth lain diredupkan."`; remove `legend`.
- `qa`: `helper`, `answered(n) = "${n} pertanyaan sudah dijawab"`, `thanksPlaceholder = "Tulis ucapan untuk pembicara"`.
- `passport`: `title = "Paspor"`, `collect = "Kumpulkan 5 stempel"`, `left(n) = "${n} stempel lagi"`, `done = "5 dari 5 stempel"`, `how = "Cara dapat stempel"`, `howBody`, `seeBooths = "Lihat daftar booth"`, `newStamp(tenant, code) = "Stempel baru dari ${tenant}, booth ${code}"`, `already(code)`, `unknown = "Kode QR tidak dikenal"`, `complete = "Paspor kamu lengkap"`, `show = "Tunjukkan kode ini di meja informasi"`, `prize = "Hadiah"`, `keepGoing = "Kamu boleh terus mengumpulkan stempel, hadiahnya satu per paspor."`
- `organizer`: `summary = "Ringkasan"`, `summaryHint`, `printQr = "Cetak QR booth"`, stat labels and context strings, `openSession = "Buka"`, `redeemHint`, `check = "Cek"`, `allTenants(n) = "Semua ${n}"`, `editLink = "Tautan edit"`, `qr = "QR"`, sidebar labels.
- `tenantEdit` (new namespace): every string in 6.8.
- `feed` (new): `title = "Feed"`, `write = "Tulis kabar"`, `emptyTitle = "Belum ada kabar"`, `emptyBody`.

Grep before every checkpoint: no `!`, no `—`, no emoji, no ALL CAPS words longer than 3 letters in components or copy (booth codes and "QR" excepted).

## 8. Removals (delete, do not hide)

- `app/favicon.ico` (Next default).
- `MapLegend` usage on `/peta` (component may go).
- Hash-based colour and initials in `app/img/[slug]/route.ts`.
- DayTabs and the day schedule on Beranda.
- Sticky header block and always-visible SearchBox on `/tenant`.
- The 4px coloured top arc on cards.
- Timestamps on questions and visited booths.
- Every uppercase eyebrow (`uppercase`, `tracking-wide` utilities on text).
- `copy.tenant.askSoon`, `copy.map.legend`, `copy.directory.booth` on cards.
- Fake product photos in the seed.
- The blur shadows in any component class list (`shadow-card` now resolves to the solid edge; check for raw `shadow-` utilities).

## 9. Acceptance checklist

Layout and tokens
1. `docs/tokens.css` v2 is byte-identical to the top of `app/globals.css`. `grep -rn "#[0-9A-Fa-f]\{6\}" components app --include=*.tsx` returns nothing outside `app/img/[slug]/route.ts` (which reads generated JSON) and `lib/tokens.generated.json`.
2. At 390 x 844 every visitor route renders with no horizontal scroll and no text under 16px except tab labels (12), pills (14), captions (13 to 14).
3. Every tappable element measures at least 44 x 44 (check chips, upvotes, map controls, zoomed booths, tab items, photo tiles, close buttons).
4. Fonts: Fredoka 700 renders on the lockup and the redeem code (not synthesised bold).

Screens
5. Beranda: hero block with check texture and wavy bottom, three mascots not overlapping text, headline card with yellow band, four saturated tiles, three next talks; no DayTabs; page height under 1300px at 390.
6. Tenant: header is one row; chip row fades on the right; grid cards agree on colour with their category glyph; code sticker top-left; no card taller than its row partner by more than the name wrap; search expands from the icon.
7. Tenant page: back button over the hero art; art is the category colour with glyph and name; photo strip absent for seeded tenants; promo in yellow; mini map with marker; link chips with icons; Tanya tenant shows one empty state or the board, never "menyusul".
8. Peta: no legend list; fit view has no booth codes; zoom-in makes booths 45px with codes and tenant labels; fit-screen returns; selecting a booth shows the inline sheet with the thumb; map card and sheet both visible at 390 x 844.
9. Jadwal: four day sections, no tabs, speaker avatars.
10. Sesi: back button, sentence-case eyebrow, segmented tabs, questions before the form, compose bar pinned above the tab bar, upvote 48 x 52 with filled voted state, answered section collapses, no timestamps.
11. Paspor: empty shows five numbered wavy slots in 3 + 2 and the "Cara dapat stempel" card; a fresh stamp arrives tilted with the yellow burst and a notice naming the tenant; complete shows mascots, the coral ticket with the code at 56px and the prize line, then the full booklet.
12. Organizer index: navy sidebar with yellow active item; four stats with context lines; stacked day cards with coral counts; redeem card; tenant list with thumbs and links; content spans the full 1200 minus the sidebar.
13. Tenant dashboard: reachable only by token; every section from 6.8 present; photo add by URL and by upload both persist and appear on the public tenant page and card; reply and pin work and show on the public page; save bar reports "Tersimpan".
14. Favicon in the tab is the blue mascot on every route.

Assets
15. `components/icons/` exports every file in `docs/assets/INVENTORY.json`; `MapLegend` and the old inline Nav paths are gone.
16. `/img/<slug>?v=card`, `?v=hero`, `?v=thumb` return SVG matching `docs/assets/placeholder/example-*.svg` in structure (colour rect, dot pattern, glyph, name), with the category colour of that tenant.

Copy
17. Grep for `!`, `—`, emoji ranges and `uppercase` returns nothing in `components`, `app`, `lib/copy.ts`.
18. Page titles match tab labels: Tenant, Peta, Jadwal, Paspor.

## 10. Open items for Aldo (not blocking)

- Theo's five mascot originals and the Namoe Go wordmark (drop-in replacements, same file names).
- `Event.prizeCopy` real text ("Goodie bag Namoe Market" is a placeholder in the render).
- Real photos for the eight tenants Aldo wants on the pitch grid, entered through the tenant dashboard.
- Whether a shared tenant across two booths (A1 and A2, Little Palmerhaus) should count as one stamp or two; the current logic counts per booth. Product call, not design.

## Amendment 9 Sep, Feed strip on Beranda

Owner decision after session B: the Feed is shown on Beranda, not linked. Section 6.1 order becomes hero, headline talk card, four tiles, Feed strip, Talkshow berikutnya. The "Feed" eyebrow link in the schedule header is removed.

Feed strip (`components/FeedStrip.tsx`): section header `--text-h2` "Feed" with eyebrow "Semua" right (to `/feed`); a horizontal row built like PhotoStrip (gutter bleed, gap 10, hidden scrollbar, right fade) of the three newest visible posts as 160px cards: photo 160 x 160 `radius-md` `2px solid var(--color-edge)` (orange mascot on `--color-cream-deep` when no photo), text Nunito 700 14 clamped to 2 lines, byline Nunito 13 `--color-ink-soft` with CategoryBadge `sm` for tenant posts. Card links to `/feed#post-<id>`. Fourth card: dashed `--color-line-strong` on `--color-cream-deep` with plus icon and "Tulis kabar" Fredoka 600 14 navy, to `/feed?tulis=1` which opens the composer. Empty: Empty (feed) plus `Button ghost` "Tulis kabar". Seed: feed posts dated relative to seed time so the strip reads as current at the pitch; the app still never reads the clock.

Acceptance addition (item 19): Beranda shows the Feed strip between tiles and schedule with three cards plus the write card; first card aligned to the gutter; page height under 1650px at 390 (amended 9 Sep after implementation: the strip as specified adds about 310px to a page that measured 1301px).

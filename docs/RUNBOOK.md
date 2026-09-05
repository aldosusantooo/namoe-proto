# Namoe Go runbook

How the deployed prototype runs and how to drive the demo. Everything here is outside the code: Railway settings, the organizer URL and the demo links.

## Environment variables

Railway's web service needs exactly two variables. Nothing else is read by the app.

| Variable | Value |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}`, the reference to the Postgres plugin so the service uses the private network URL |
| `ORGANIZER_SECRET` | A random string. Generate one with the command below and use the same value locally in `.env` |

```bash
openssl rand -hex 12
```

The local `.env` uses the Postgres plugin's `DATABASE_PUBLIC_URL` as `DATABASE_URL` so local development and Railway share one database. There is no `TZ` and no `DEMO_NOW`: the app never reads the clock and formats every time explicitly in Asia/Jakarta.

## Build and start

`railway.json` in the repo root drives both. Railway runs them on every push to `main`.

- Build: `pnpm install --frozen-lockfile && pnpm prisma generate && pnpm build`
- Start: `pnpm prisma migrate deploy && pnpm db:seed --if-empty && pnpm start`
- Health check path: `/api/health` (returns `{"ok":true}` when the database answers)

`pnpm start` runs `next start -p ${PORT:-3000}`, so it binds to the port Railway assigns. The seed only runs when the Tenant table is empty, so a redeploy never touches live data. To re-seed on purpose, run `pnpm db:seed` locally against the same database. It upserts by slug or code and keeps existing booth tokens.

## Organizer panel

Path pattern: `/organizer/<ORGANIZER_SECRET>`

Every other value in that segment returns 404. Pages under it:

- `/organizer/<secret>` counts and the session list
- `/organizer/<secret>/sesi/<session-slug>` mark questions answered, hide or show them
- `/organizer/<secret>/tukar` look up a passport code and mark it redeemed
- `/organizer/<secret>/booth` every booth with its `/b/` link, for simulating scans

## Demo stamps

Five links that fill one passport. Prefix each path with the Railway domain. Open them on the same phone or browser profile so they land on the same device cookie. The fifth link completes the passport and shows the redeem code.

| Booth | Tenant | Path |
|---|---|---|
| A1 | Little Palmerhaus | `/b/deqiikpjdbl5sdl6mmul` |
| A11 | Bohopanna | `/b/k5kpggupbitafk2bxunl` |
| A27 | MOOIMOM | `/b/xaixrp2et4bokjslgnqo` |
| A52 | Oxone | `/b/yjnf7ad2mbxxih3leojn` |
| A77 | Ladang Lima | `/b/oty54s6p6j4b5hvrqgfp` |

Tokens live in the Booth table and survive re-seeding. If the database is ever recreated from empty, the tokens change: read the new ones from `/organizer/<secret>/booth`.

A repeated link shows "Booth A1 sudah pernah distempel". An unknown token lands on the passport with "Kode booth tidak dikenal". Type the code from the passport into `/organizer/<secret>/tukar` and press "Tandai sudah ditukar"; the passport then shows "Hadiah sudah diambil".

## Local development

```bash
pnpm install
pnpm dev
```

`pnpm test` runs the unit tests, `pnpm lint && pnpm build` mirrors what Railway does. Migrations are created locally with `pnpm db:migrate --name <name>` and applied on Railway by the start command.

# Namoe Go

Mobile-first companion app for Namoe Market, a family market at PIK Avenue Mall, Jakarta, 22 to 25 October 2026.

- Product docs, build spec, tokens and seed data live in `docs/`.
- Runbook for deployment: `docs/RUNBOOK.md`.

## Local development

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Requires `DATABASE_URL` and `ORGANIZER_SECRET` in `.env` (see `.env.example`).

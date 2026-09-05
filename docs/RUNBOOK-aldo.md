# Runbook for Aldo (everything outside Claude Code)

Claude Code writes code only. You own git, GitHub and Railway. Paste the entire contents of `docs/namoe-claude-code-prompt.md` as the first message; there is nothing to trim.

## Before pasting the prompt

1. `cd ~/Documents/learning/Namoe && git init`, then create the GitHub repo (`gh repo create namoe-go --private --source=. --remote=origin`, or create it in the GitHub UI and add the remote).
2. Railway: new project, add Postgres, add a service from the GitHub repo `namoe-go`, main branch, auto-deploy on push.
3. On the web service set two variables: `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (the reference, so it uses the private URL) and `ORGANIZER_SECRET` = output of `openssl rand -hex 12`. Set the health check path to `/api/health`. Generate a domain.
4. Create `.env` in the repo root with the same two variables. For the local `DATABASE_URL` use the Postgres service's `DATABASE_PUBLIC_URL` from Railway (shared dev database, no Docker needed).

## During the build

5. Open Claude Code in the folder, paste the prompt. It reads the docs, reports what it found, waits for your go.
6. After each "Checkpoint N clean, ready to commit": `git add -A && git commit -m "checkpoint N" && git push`. Railway rebuilds. The first one or two deploys fail until checkpoint 2 lands (no `railway.json`, no health route yet); expected.

## After checkpoint 6

7. Open the Railway domain on your phone and walk spec section 10 yourself. Skip the spec's clock-dependent lines (live strip, Ucapan opening after a session); the prototype has no clock.

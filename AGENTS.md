# AGENTS.md

This repository is `rclub` — a single Next.js 16 (App Router, React 19) website + admin
back-office for a Strasbourg nightclub. Package manager is **pnpm** (`pnpm@10.20.0`).
For product/feature context see `project.md`, `features.md`, `tech.md`, and `RUNBOOK.md`.
Available scripts live in `package.json` (`dev`, `build`, `lint`, `typecheck`, `test`,
`test:e2e`, `db:push`, `db:seed`, `db:setup`).

## Cursor Cloud specific instructions

- **Dev server:** `pnpm dev` (Next.js + Turbopack) serves the whole product on port **3000**
  (public site + `/admin`). There is only one service.
- **Database is optional for booting.** When `DATABASE_URL` is unset, the app automatically
  uses an in-memory repository seeded with demo data (`lib/db/is-database-enabled.ts`), so
  `pnpm dev`, `pnpm test`, lint and typecheck all work with no database. In-memory data lives
  only inside the running dev-server process (it resets on restart) but is enough to exercise
  the reservation + admin flows end-to-end within one session.
- **Postgres is installed in this environment** (PostgreSQL 16) for full persistence. It is a
  system dependency and is NOT part of the update script, so it does not auto-start. If
  `DATABASE_URL` is set in `.env`, you MUST start the cluster first or runtime DB queries fail:
  - Start: `sudo pg_ctlcluster 16 main start`
  - Local creds used during setup: role `rclub` / password `rclub`, database `rclub`
    (`DATABASE_URL=postgresql://rclub:rclub@127.0.0.1:5432/rclub`).
  - After (re)creating the DB, run `pnpm db:setup` (prisma db push + seed) to load demo data.
  - To skip Postgres entirely, remove/comment `DATABASE_URL` in `.env` to use the in-memory fallback.
- **`.env` is gitignored** and not persisted in the repo. Copy `.env.example` to `.env` and fill it.
  Required for full dev: `DATABASE_URL` (or leave unset for in-memory), `NEXTAUTH_SECRET`/`AUTH_SECRET`,
  `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- **Admin auth is env-var based, not DB-based.** Log in at `/admin/login` with `ADMIN_EMAIL` /
  `ADMIN_PASSWORD` (the `.env.example` defaults are `adminRclub` / `strasbourgRClub`).
- **Resend email is optional.** Without a valid `RESEND_API_KEY` the site runs fine; only the
  action that actually sends a reservation confirm/refuse email will throw.
- **Lint currently reports pre-existing errors** in committed code (e.g.
  `react-hooks/set-state-in-effect` in `components/site-nav.tsx`). `pnpm lint` runs correctly —
  these failures are not caused by environment setup. `pnpm typecheck` and `pnpm test` pass.
- **Playwright E2E** (`pnpm test:e2e`) auto-starts the dev server but needs browsers installed
  first: `pnpm exec playwright install chromium`.
- **Media uploads** (`POST /api/admin/media/upload`, used by the admin forms via
  `components/admin/media-upload-field.tsx`) auto-select a backend like the DB layer does:
  Cloudinary when `CLOUDINARY_*` are set to real (non-placeholder) values, otherwise a local
  dev fallback (`lib/media/local-storage.ts`) that writes to `public/media/uploads/`
  (gitignored). So uploads work with no Cloudinary credentials in dev; production should set the
  `CLOUDINARY_*` secrets. The local fallback writes to disk and is not suitable for
  serverless/production filesystems.
- **Cloudinary target folder is `Rclub`** (capital R). Set `CLOUDINARY_FOLDER=Rclub` when using
  real Cloudinary credentials so uploads land in the correct folder. The code default in
  `lib/media/cloudinary-config.ts` is the lowercase `"rclub"`, so this env var must be set
  explicitly to match the actual Cloudinary folder.

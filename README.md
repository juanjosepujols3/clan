# ClanOps (Survivor.io Clan Battle Tracker)

Production-grade Next.js app for clan leaders to track PHASE1 rankings, exploration streaks, warnings, and comparisons across date ranges.

## Tech stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + DaisyUI
- Postgres + Prisma
- NextAuth Credentials (email/password, bcrypt)

## Setup
1) Install dependencies
```bash
pnpm install
```

2) Configure environment
```bash
cp .env.example .env
```
Update values as needed:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `SEED_USER_EMAIL`
- `SEED_USER_PASSWORD`
- Optional: `SEED_SAMPLE=true` to create a demo clan and players

3) Start Postgres
```bash
pnpm db:up
```

4) Run migrations + seed
```bash
pnpm prisma:gen
pnpm db:migrate
pnpm db:seed
```

5) Run the app
```bash
pnpm dev
```

Open http://localhost:3000

## Scripts
- `pnpm db:up` / `pnpm db:down`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm prisma:gen`
- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`

## Routes
- Public landing: `/`
- Auth: `/login`, `/signup`
- Dashboard: `/dashboard`
- Clan roster: `/clan/members`
- Periods: `/periods`
- Phase1 entry: `/phase1/[periodId]`
- Exploration: `/exploration`
- Exploration history: `/exploration/history`
- Compare: `/compare`
- Warnings: `/warnings`
- Import/export: `/import-export`

## Import formats
You can upload CSV/XLSX exported from Google Sheets. If headers do not match, the UI prompts you to map the columns.

### PHASE1
Required columns: IGN, value, date (period start or any date inside the week).
```csv
IGN,PHASE1,Date
Echo,120000,2025-02-03
Nova,118900,2025-02-03
```

### Exploration
Required columns: IGN, swords, date.
```csv
IGN,Swords,Date
Echo,10,2025-02-04
Nova,8,2025-02-04
```

### Exports
- PHASE1 exports require a `periodId` prompt.
- Exploration and warnings export as XLSX.

## Notes
- Periods default to weekly (Monday start). Date range comparisons use the dates you select.
- Closed periods are read-only unless the clan toggles "Allow closed edits."
- OCR upload is scaffolded in `/import-export` and returns a placeholder response.

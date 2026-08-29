# hvacnumbers.com

Free, mobile-first field calculator for HVAC technicians. This first build ships
one calculator: **Static Pressure (External Static Pressure / ESP)**.

## Stack

Next.js 14 (App Router) · Vercel · Supabase · Resend · GA4 · installable PWA.

## Getting started locally

This was authored in a sandbox with no Node.js installed, so it has not been run
through `npm install` / `npm run build` yet. On a machine with Node 18.17+:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Environment variables

Real values are already in `.env.local` (gitignored, not committed). See
`.env.example` for the list of keys. When deploying, set the same keys in
Vercel under Project Settings → Environment Variables — **do not** commit
`.env.local`.

One key is intentionally blank right now: `BEEHIIV_API_KEY`. Only a Beehiiv
*publication ID* was provided, not an API key. Until `BEEHIIV_API_KEY` is set,
`lib/beehiiv.ts` no-ops the newsletter sync step (job records and emails still
work fully — the `subscribers.beehiiv_synced` column just stays `false`). Add
the real key to `.env.local` and Vercel to turn it on, no code changes needed.

## Database setup

Run `supabase/schema.sql` once in the Supabase project's SQL editor
(ugjeoekmezgceqthqjle). It creates `job_records` and `subscribers` with RLS
policies that allow inserts/updates from the anon key used by the app's
`/api/job-record` route handler.

## Deploying

The GitHub repo is https://github.com/externaladmin/hvacnumbers, connected to
Vercel. To push this code:

```bash
git remote add origin https://github.com/externaladmin/hvacnumbers.git
git push -u origin main
```

Then set the environment variables from `.env.local` in the Vercel dashboard
before the first deploy (or redeploy after adding them).

## What's intentionally not built yet

Only the static pressure calculator exists. No navigation implying other
calculators, per the brief — that comes later.

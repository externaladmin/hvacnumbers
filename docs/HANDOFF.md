# Handoff

Written 31 October 2026 for a move to a different Claude account on the same
Mac. Read this first. Everything needed to carry on is in this repository, the
local-only `docs/private/` folder and the memory folder described below.
Nothing depends on the old Claude account. If you check `git log` and find
commits newer than this date, the "where we stopped" section is out of date.

## What hvacnumbers is, in two paragraphs

hvacnumbers.com is a free, mobile-first field calculator site for HVAC
technicians, built on the same product-led model as builtmath.com: free
calculators that answer the exact questions techs already search for, no login
and no gate on the result, an optional email capture afterwards, and later
contextual ads from equipment makers and distributors. The long-term plan is a
suite of six calculators. This first build deliberately ships only one,
**Static Pressure (External Static Pressure, ESP)**, because the brief for the
build said to do one calculator well and not to add navigation that implies
others exist.

The calculator takes supply static, return static, filter drop and coil drop,
all in inches w.c., and shows ESP = supply + return − filter − coil at once,
with a normal-range badge, a plain-English interpretation, the formula, the
source line, the assumptions and the required disclaimer. After the result,
and never before it, an optional form saves a job record (name optional,
email required, site address optional) to Supabase, emails a copy through
Resend and, once a key exists, adds the person to Beehiiv. A story-sized share
card (1080x1920) is drawn in the browser for sharing or download. The site is
an installable PWA with an offline-cached calculator page.

## Starting the new session

Open the new session in **`/Users/deeps/Documents/hvacnumbers`** and begin
with:

> Read /Users/deeps/Documents/hvacnumbers/docs/HANDOFF.md, then tell me where
> we are and what you need from me. Don't build anything until I say.

The folder matters because Claude Code keeps memory per project folder.
`hvacnumbers` has its own git repository (created 28 August 2026), so a session
opened there uses `~/.claude/projects/-Users-deeps-Documents-hvacnumbers/memory`.
Since 31 October 2026 that folder is a link to
`~/.claude/projects/-Users-deeps/memory`, which is Deeps' shared memory with the
standing rules and a pointer back to this file. A session opened at the home
folder `/Users/deeps` uses that same shared memory directly, so either location
works. This is the same arrangement already used for `inqa-live`. Do not
replace the link with a real folder. If a session ever reports empty memory,
the standing rules at the end of this file are a complete copy.

Be aware that `/Users/deeps` itself is a git repository that tracks nothing of
this project. Never run `git add` or `git commit` from the home folder for
this work. Check `git rev-parse --show-toplevel` and expect
`/Users/deeps/Documents/hvacnumbers`.

Don't resume the old conversation. It is long and this file replaces it.

## Where everything lives

**Repository.** `/Users/deeps/Documents/hvacnumbers`, remote `origin` at
`https://github.com/externaladmin/hvacnumbers.git`. The GitHub repository is
**public**. Its first commit (28 August 2026, an auto-generated `LICENSE`, a
one-line README and a `.gitignore`) was merged into local history on 31 October
rather than overwritten. The repository is connected to Vercel, according to
Deeps; nobody on the Claude side has verified that because there is no Vercel
or GitHub CLI access.

**Code layout.**

- `app/` holds the pages (`page.tsx` is the calculator, `about/`, `privacy/`),
  `layout.tsx` (metadata, Inter font, GA4, service worker registration),
  `globals.css` (all styling, plain CSS with variables, no Tailwind),
  `manifest.ts`, `robots.ts`, `sitemap.ts`, and the only API route,
  `api/job-record/route.ts`.
- `components/` holds `StaticPressureCalculator` (form and state),
  `ResultCard` (result, formula, disclaimer), `JobRecordForm` (email capture),
  `ShareCard` (canvas share image), `GoogleAnalytics`, `ServiceWorkerRegister`.
- `lib/` holds `calculations.ts` (formula and range bands), `supabase.ts`,
  `beehiiv.ts`, `email-template.ts`.
- `public/` holds `sw.js`, the icons and `og-image.png`.
- `supabase/schema.sql` is the database setup, to be run by hand.
- `tools/gen_icons.py` and `tools/gen_og.py` regenerate the icons, favicon and
  OG image. They need Pillow (`pip3 install --user Pillow`, already installed).
  Run without `python3 -I`, which hides user-level packages.
- `.claude/launch.json` defines the `hvacnumbers-dev` preview server.

**Stack.** Next.js 15.5.21 (App Router), React 18.3.1, TypeScript, Supabase
(`@supabase/supabase-js`), Resend, GA4, Beehiiv over plain `fetch`. Next was
bumped from 14.2.15 because that version had critical advisories.

**Secrets.** They are in `.env.local` in the repo root, which is gitignored and
was confirmed ignored before the first commit. The variable names are
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`,
`RESEND_FROM_ADDRESS`, `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `BEEHIIV_API_KEY`
(currently empty), `BEEHIIV_PUBLICATION_ID` and `NEXT_PUBLIC_SITE_URL`.
`.env.example` lists them without values. Never print or commit the values.
Whether the same variables have been entered in the Vercel dashboard is
unknown.

**Private planning material.** `docs/private/` is gitignored on purpose,
because the repository is public. It holds `MASTER-PLAN.md` (the April 2026
six-calculator plan, SEO plan, ad monetization phases and outreach list, copied
from an earlier Claude session on the old account) and `reference/` with the
three BuiltMath prototype pages (`builtmath-index.html`,
`builtmath-contractor.html`, `builtmath-dealer.html`) used as the design
reference. The originals are still in the old account's app folder under
`~/Library/Application Support/Claude/local-agent-mode-sessions/`, but treat
the copies in `docs/private/` as the working copies. Because they are ignored
they are not in GitHub, so they live only on this Mac. If Deeps wants them
versioned, the repository should be made private first.

**Dev environment.** Node v24.20.0 and npm 11.19.0 were installed on 28 August
through nvm (no sudo). The nvm lines are in `~/.zprofile` and `~/.zshrc`.
Someone later added Ollama and `~/.local/bin` PATH lines to `~/.zshrc`; those
are not part of this project and were left alone.

## Where we stopped

The build is complete for v1 and has been verified in the dev server on a
phone-sized viewport: the type-check is clean, ESP is calculated correctly in
all four range bands (0.05" low, 0.20" normal, 0.60" high end of normal,
1.20" above range), empty-field validation works, `/about`, `/privacy`,
`/manifest.webmanifest`, `/robots.txt` and `/sitemap.xml` all serve, and the
share card renders. One real bug was found and fixed along the way: the share
card's four input rows overflowed the white card, hiding the coil-drop value.

These were **never tested**: a production `npm run build`; a real submission
through `/api/job-record` (the Supabase tables may not exist yet, so it would
fail); delivery of the Resend email; the service worker working offline;
Web Share on a real phone; GA4 receiving events.

In flight when the session ended, with no reply from Deeps yet:

1. A BuiltMath restyle. Deeps asked for the site to look more like BuiltMath.
   The feedback given was to adopt the skin (slate and olive-green with a gold
   accent, Barlow Condensed headings, DM Mono for every number, sharp 3-5px
   corners, unit chips inside inputs, verdict pills with a dot) but not the
   BuiltMath app shell (tabs, audience switcher, ad slot, sign-up gate bar),
   and to keep the single-column phone layout. It was flagged that three Google
   font families conflict with the brief's "Inter only, fast load", with a
   suggested compromise of Barlow plus DM Mono. Nothing was changed.
2. An ad slot. Deeps asked whether the page is too busy and said there should
   be room for an ad or two. The answer was that the page is long, not
   cluttered (about 3,000 px on a phone across four stacked cards), that one
   slot fits best right after the result card and before "Save this job
   record", that a second could go after the share card, and that nothing
   should sit above or before the result. Deeps was asked which network or
   tag is planned. Nothing was built.

## Open bugs and risks

These were found by reading the code during this handoff. None has been fixed,
because the handoff rules said not to start new work.

- **Email HTML is not escaped.** `lib/email-template.ts` puts the name, site
  address and interpretation into the HTML unescaped. Because the endpoint
  mails whatever address it is given, someone could send a crafted email from
  the hvacnumbers domain to a third party. Fix this before launch.
- **No abuse protection on `/api/job-record`.** There is no rate limit, bot
  check or email confirmation, so the endpoint could be used to send mail to
  arbitrary addresses and fill the tables.
- **The success message can be wrong.** `JobRecordForm` always says "We've
  emailed a copy" once the save succeeds, even when the response says
  `emailSent: false` (Resend failed or no key). The route already returns
  `emailSent` and `beehiivSynced`; the form ignores them.
- **Build fails without env vars.** `lib/supabase.ts` throws at import if the
  Supabase variables are missing, so the first Vercel build fails until they
  are set. Failing safe is fine, but it will look like a broken deploy.
- **Loose database policies.** In `supabase/schema.sql` the `subscribers`
  update policy is `using (true)`, so anyone holding the public anon key can
  change any subscriber row. The server also trusts the ESP value the browser
  sends instead of recomputing it.
- **Unverified engineering content.** The formula, the "ASHRAE / ACCA Manual D
  field reference guidance" source line and the 0.1-0.8 range came from
  Deeps' brief and were not checked against a source. The split at 0.50"
  between "within typical range" and "high end of typical range", and all the
  interpretation wording, were written by Claude and have not been approved.
  A technician or ACCA-literate reviewer should confirm all of this, since the
  page presents it as a reference.
- **Instagram Stories is not literally one tap.** A website cannot open
  Instagram Stories directly. The share button uses the Web Share API with the
  PNG, which on a phone lets the person pick Instagram; on desktop it falls
  back to Download. Untested on a real device.
- **npm audit shows 3 high findings** (`postcss` and `sharp`, both pulled in by
  Next). They affect only features this app does not use (`next/image`,
  untrusted CSS). `npm audit fix --force` would jump to Next 16.3.3, an
  untested major upgrade, so it was declined. npm also blocks `sharp`'s
  install script; that is harmless here.
- **Service worker cache.** `public/sw.js` uses a cache named
  `hvacnumbers-v1` and serves cached pages when the network fails. Bump the
  version when deploying a page change you need people to see promptly.

## Next steps and decisions waiting

Decisions only Deeps can make:

- Which design direction to follow. The brief of 28 August asked for one
  calculator, no navigation, Inter, dark header, white card, light gray page,
  and a primary of blue `#1E40AF` or orange `#EA580C` (blue was chosen). The
  April master plan instead describes an exact BuiltMath-style app shell with
  tabs, a 728x90 ad slot and a gate bar, in an HVAC palette (topbar
  `#1C2E3E`, accent `#2E7DC4`, background `#F2F5F8`, pass green `#1E6B40`,
  fail red `#A32D1A`) with Barlow Condensed, Barlow and DM Mono. These pull in
  different directions and the restyle question above is the same decision.
- Ad placement and network. The master plan stages it as a branded placeholder
  slot first, Google AdSense at roughly 1,000 sessions a month, direct sales
  to equipment makers in parallel, and Ezoic much later. Note that 728x90 does
  not fit a phone, so a responsive or native card is needed.
- Which calculator comes second. The master plan orders them BTU load, duct
  size, refrigerant charge, static pressure, heating/cooling capacity, airflow
  versus system size. The GitHub README says "static pressure, target
  superheat, duct sizing". These do not match.
- Whether to make the GitHub repository private.
- Whether the backup-before-push rule below is a standing rule for this
  repository. It was recorded as an inqa-site rule, and was applied to the push
  on 31 October because Deeps asked for backups to be followed.

Sensible order of work once Deeps decides: fix the email escaping and the
false success message, add rate limiting, make `lib/supabase.ts` fail softly,
run a real `npm run build`, test one end-to-end submission once the tables
exist, then do the restyle and the ad slot.

## Things only Deeps can do

- Run `supabase/schema.sql` in the Supabase SQL editor for the hvacnumbers
  project and confirm it succeeds. Until then, saving a job record fails.
- Enter all the `.env.local` variables in Vercel (Production, and Preview if
  wanted) and redeploy. Do this before relying on the deployed site.
- Verify the `hvacnumbers.com` sending domain in Resend (SPF and DKIM DNS
  records), otherwise mail from `records@hvacnumbers.com` will be rejected.
- Provide the Beehiiv API key. Only the publication ID was supplied. Put the key
  in `.env.local` and Vercel; no code change is needed and the sync starts
  working, tagging people `hvacnumbers-static-pressure`.
- Point the `hvacnumbers.com` domain at Vercel and add it in the Vercel
  project. Its current DNS state is unknown.
- Consider rotating the credentials pasted into chat on 28 August, in
  particular the database password, the Supabase account password and the
  Resend key, because they now exist in transcripts. The anon key and GA4 ID
  are public by design.
- Reconnect connectors and log in to the web dashboards (Vercel, GitHub,
  Supabase, Resend, Beehiiv, GA4) on the new account where needed. Claude has
  no access to any of those logins and should not enter passwords.

## Lessons learned the hard way

- The home folder is a git repository. In the first minute, `git status` in the
  empty `hvacnumbers` folder reported changes from unrelated projects. The
  fix was a fresh `git init` inside `hvacnumbers`, after which memory moved to
  its own folder. Always check the repository root.
- Claude Code's Bash tool runs non-interactive shells that do not load nvm.
  Prefix every Node command with
  `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh";`. A normal Terminal window
  does load it, which is why `npm: command not found` happened only until
  `~/.zshrc` was created.
- Do not run `npm audit fix --force`, and note that `npm audit` exits with 1
  whenever it finds anything, so the tool reports it as failed even though
  the report is fine.
- The in-app browser's click tool times out when the Browser pane is hidden.
  `read_page`, `form_input` and `get_page_text` still work, and triggering the
  button from the page's own script is a reasonable workaround. Calling
  `location.reload()` inside the same script kills that script.
- Port 3000 may be taken by Deeps' own `npm run dev`, in which case
  `preview_start` refuses. Navigate to the running server instead. Never run
  `next build` while a dev server is running, because they share `.next`.
- Check canvas layouts by looking at them. The share card looked fine in code
  and overflowed on screen.
- Pasted credentials: put only API keys and IDs into `.env.local`, never use the
  Supabase account login password, and never repeat values in chat.
- The GitHub repository already contained a commit when the first push was
  planned, so a plain push would have been rejected. Merge with
  `--allow-unrelated-histories` and never force-push.

## Standing rules (copied from memory)

These come from Deeps' memory folder; there is no `CLAUDE.md` anywhere.

- **Commits carry no attribution trailer.** Never add a `Co-Authored-By: Claude`
  line to a commit message, whatever Claude Code's own defaults suggest. Deeps
  asked for this explicitly. Keep messages plain: a subject line, plus a body
  if it is needed.
- **Backup before every push.** Before each `git push`, create a timestamped
  folder in the project root named `backup-YYYYMMDD-HHMMSS` holding copies of
  the changed files, and never keep more than three, deleting the oldest first.
  It started as a rule for inqa-site; Deeps asked for it to be followed during
  this handoff, so it was applied here. `backup-*/` is gitignored.
- **Writing style.** Write natural, flowing prose in full connected sentences,
  not clipped fragments or one-beat-per-line rhythm. Use em dashes sparingly,
  keep answers concise, and end a long answer with a short summary. In copy,
  prefer plain direct phrasing over clever wordplay, and reuse Deeps' own words
  when they have already phrased something well.

From the build brief and the session itself: build one calculator only and add
no navigation implying others; never show the email form before the result or
require an email to see it; keep OEM logos and faces off the share card; ask
before pushing, sending or publishing anything outward unless Deeps has said to
(the 31 October push was explicitly requested); never enter or reveal
credentials.

Deeps' other memory notes, such as the inqa and taor ones, belong to those
projects and do not apply here. They are in
`~/.claude/projects/-Users-deeps/memory/` if ever needed.

## What did not transfer

Nothing the project needs lives only on the old account. Things that do not
carry over by themselves: the account's connectors (Gmail, Webflow, Docs,
Chrome) and any per-account settings, the scheduled tasks under the old
account, any sign-ins to Vercel, GitHub, Supabase, Resend, Beehiiv and Google
Analytics, and any Claude link that only opens while logged in to the old
account. No Claude Docs or published pages were created for hvacnumbers in
this session. A zip export of the 31 October working session was saved to
Downloads as a fallback and is not needed for normal work.

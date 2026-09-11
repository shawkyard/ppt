# SignalScout

A self-hosted, 15-step AI pipeline that turns "here are our best customers"
into a prioritized, sales-ready contact list with a researched reason to
reach out to each person, a recommended channel, and a handoff packet —
powered by Claude, Apollo.io, and (optionally) Clay.

This is a real, working product, not a mockup: every stage below makes a
real API call (to Anthropic, and to Apollo.io once you add a key) and
persists real results per campaign.

## The pipeline

Each campaign runs through 15 stages, in order. Every stage is independently
inspectable and re-runnable from the campaign page.

| # | Stage | What it does |
|---|-------|---------------|
| 1 | Best-Customer Analyser | Reads your best-customer notes and extracts the patterns that actually predict fit. |
| 2 | ICP Criteria Builder | Turns those patterns into a weighted Ideal Customer Profile. |
| 3 | Exclusion Rule Builder | Writes hard rules to keep obviously-bad-fit accounts out. |
| 4 | Lookalike Account Researcher | Translates the ICP into Apollo.io search filters and pulls candidate accounts. |
| 5 | Market Segment Mapper | Groups candidate accounts into a handful of useful segments. |
| 6 | Account Fit Scorer | Scores every account 0–100 against the ICP and applies exclusion rules. |
| 7 | Buying Signal Finder | Pulls hiring signals from Apollo (and pushes accounts to Clay, if configured, for further enrichment). |
| 8 | Signal Relevance Checker | Filters out signals that don't actually indicate intent for *this* product. |
| 9 | Buyer Role Mapper | Works out which titles are the decision-maker, influencer, and champion. |
| 10 | Contact Research Brief | Finds real people at each account via Apollo and writes a pre-call brief on each. |
| 11 | Account Priority Ranker | Ranks accounts by fit + signal strength + timing into a work queue. |
| 12 | Outreach Reason Builder | Writes the specific, non-generic reason to reach out to each contact. |
| 13 | Channel Selector | Picks the best first-touch channel (email / LinkedIn / phone) per contact. |
| 14 | Lead Handoff Writer | Compiles a full handoff packet: summary, talking points, suggested opener, next step. |
| 15 | List Quality Auditor | Final QA pass — flags weak fit, stale signals, or missing data before handoff. |

Stages 1–3, 5–6, 8–9, 11–15 are Claude reasoning calls (`lib/skills.js`).
Stages 4, 7, and 10 also call Apollo.io's REST API for real account and
contact data (`lib/apollo.js`). Export the final list as CSV any time from a
campaign page.

## Getting started

```bash
cp .env.example .env.local   # or just use the in-app Settings page
npm install
npm run dev
```

Open `http://localhost:3000`, add your Anthropic and Apollo.io API keys on
the **Settings** page (or via `.env.local`), then start a campaign.

- **Anthropic API key** — required, powers every reasoning stage. Get one at
  [console.anthropic.com](https://console.anthropic.com).
- **Apollo.io API key** — required for stages 4, 7, 10 (account/contact
  research). Get one at [app.apollo.io](https://app.apollo.io).
- **Clay webhook URL** — optional. Point it at a Clay table's "Send to
  Webhook" trigger to push candidate accounts/contacts into Clay for extra
  enrichment. Have that Clay table call `/api/webhooks/clay` back with the
  enriched fields (see `lib/clay.js` for the exact contract) to merge results
  back into the campaign.

`maxAccounts` and `maxContactsPerAccount` (Settings page) cap how many
Apollo lookups and Claude calls a single pipeline run makes — keep these
low while testing.

## Architecture

- **Next.js App Router**, one codebase for UI + API routes.
- **`lib/store.js`** — a zero-dependency, file-based JSON store (one file
  per campaign under `data/campaigns/`). No native modules to compile, runs
  anywhere Node runs. It assumes a persistent, writable filesystem, so it
  will **not** work as-is on stateless serverless platforms (e.g. Vercel's
  default runtime) — every call goes through this one module, so swapping in
  a Postgres-backed version is a single-file change.
- **`lib/anthropic.js`** — wraps the Claude API, forcing structured JSON
  output via tool-use rather than parsing free text.
- **`lib/apollo.js`** — thin wrapper over Apollo.io's v1 REST API. Uses
  whichever workspace API key is configured — nothing is shared between
  installs.
- **`lib/clay.js`** — outbound push to a Clay webhook + the contract for
  Clay's inbound callback.
- **`lib/skills.js`** — the 15 skills as pure functions (input → structured
  output via Claude).
- **`lib/pipeline.js`** — orchestrates the 15 stages in order against one
  campaign, persisting each stage's result.

## Licensing this

This is meant to be sold/licensed as a self-hosted app: each customer runs
their own deployment with their own Anthropic/Apollo/Clay keys, and nothing
is shared between installs. That keeps v1 deliberately simple (no
multi-tenant auth, no billing). If you want to run this as a single hosted
multi-tenant SaaS instead:

- Swap `lib/store.js` for a Postgres/Supabase-backed version and add
  per-workspace auth (the module boundary is designed for this).
- Encrypt API keys at rest instead of storing them as plain JSON.
- Add per-workspace usage metering for Anthropic/Apollo spend.
- Move long pipeline runs (stage 7/10 fan out to many Apollo calls) to a
  background job queue instead of a single request/response cycle.

## Known limitations (v1)

- No authentication — anyone who can reach the deployment can use it and
  see the configured API keys' effects. Put it behind your own auth/VPN for
  now, or wait for the multi-tenant auth described above.
- "Buying signals" currently come from Apollo job postings only (plus
  whatever a connected Clay table adds back). Funding/news signals aren't
  wired up yet — Apollo's job-postings endpoint is the only signal source
  built in.
- Apollo's API surface changes over time; if a stage errors with a 4xx from
  Apollo, check `lib/apollo.js` against Apollo's current API docs first.

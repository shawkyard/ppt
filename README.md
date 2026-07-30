# Stonebrook RV Underwriter

Parse **any RV-park deal package** and produce an **investor-ready Year-3 Destination
Trifecta decision** — fast enough to screen 50 parks a day and decide which are worth
full diligence.

Drop the OM, T-12, rate sheet, occupancy report, or seller pro forma — or just paste
everything. The app extracts every field it can, **fills the rest with clearly-labeled
assumptions**, runs the full 10-year underwriting model, and renders a PASS / CONDITIONAL /
REPRICE / REJECT decision with the exact max supportable price.

It is a **static, browser-only app** — no backend, no auth, no API keys. All state lives
in `localStorage`. It is a decision model, **not** an appraisal, audit, tax/legal opinion,
engineering or environmental report, lender commitment, or securities offering.

## What it does

1. **Ingest anything.** Text, CSV, TSV, Markdown and JSON files parse directly. For
   PDF / Excel / images, paste the extracted text. A heuristic parser scans for price,
   sites, occupancy, rents, ADR, expenses, cap rate, acres and more — recording the exact
   snippet it matched as evidence. It **never invents figures**: anything it can't source
   stays at the illustrative model default and is flagged **Assumption**.
2. **Hard screen first.** Before deep math, a destination screen gives a fast
   QUALIFIED / CONDITIONAL / REJECTED read with a 0–100 score: a landlord/owner-friendly
   **jurisdiction gate** (auto-detects the state), scale (100+ existing, path to 200+ keys),
   expansion acreage, resort amenities and ways to stay, destination readiness, and 20%
   stabilized cash-on-cash potential. Off-thesis stopovers and tenant-protective states are
   flagged or rejected up front.
3. **Underwrite.** A faithful port of the 14-sheet *RV Park Destination Trifecta 10-Year
   Underwriting Model* — buildout, sources & uses, three 10-year P&Ls (Current / Seller
   Pro Forma / Our Target), the Year-3 Trifecta, price correction, debt schedule, investor
   returns, sensitivity, break-even and release-gate checks. Verified against the source
   workbook to the penny.
4. **Decide fast.** Every deal opens on a screen verdict + decision banner + Trifecta
   scorecard + max price. Data-confidence counts show how many fields came from your docs
   vs. assumptions, and an **"Assumptions to verify"** list surfaces exactly what needs
   backing before investor use.
5. **Review 50/day.** The pipeline dashboard ranks every park by screen verdict, decision,
   Year-3 CoC / DSCR / cap, max supportable price, and evidence quality.

Adapted from the *Alma AI OS Destination RV Park Hunter & Underwriter* build sequence, the
app implements the feasible, browser-side core: the destination hard screen, the jurisdiction
gate, the three always-visible financial cases, per-value provenance tagging, and the full
three-case underwriting. Live multi-source deal *hunting*, OCR of scanned PDFs, and
auth/multi-user roles require a backend and are out of scope for this static build.

## The decision gates

| Metric | Minimum gate | Preferred | Destination Strike |
|---|---:|---:|---:|
| Year-3 Cash-on-Cash | 12% | 15% | 20% |
| Year-3 DSCR | 1.40x | 1.60x | 1.60x |
| Year-3 Stabilized Cap | 7% | 8% | 8% |
| Full-build sites | disclosure | supported | 200+ |

Year 3 is the first full stabilized year (Months 25–36). Years 1–2 are the funded buildout
period and may show negative cash-on-cash — that does not fail the deal when the shortfall is
covered by disclosed reserves. Every value is editable inline; the whole model recomputes
instantly and the edited field is marked reviewer-**verified**.

## Every figure is sourced or flagged

Following the underwriting truth rules, each input carries a provenance label:
**Verified actual · Reported / from docs · Seller / broker claim · Market-supported ·
Assumption (default) · Calculated**. Parsed values are Reported; unfilled values are
Assumption; your edits become Verified.

## Tech

React + Vite + Tailwind, `react-router-dom` for routing. No other runtime deps, no backend,
no APIs, no env vars, no secrets.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In Cloudflare Pages, **Create a project** → connect the repo.
3. Build settings: **Build command** `npm run build`, **Output directory** `dist`.
4. Deploy. `public/_redirects` (`/* /index.html 200`) resolves client-side routes on
   refresh / deep-link. No environment variables required.

## Project structure

```
src/
  context/   AppContext — deal pipeline + localStorage persistence
  lib/
    model.js    the underwriting engine (verified against the source workbook)
    schema.js   default inputs + field metadata + provenance labels
    parse.js    file reading + heuristic field extraction
    refdata.js  execution timeline + risk register
    fmt.js      money / percent / multiple formatters
    store.js    localStorage helpers
  components/ ui.jsx — chips, verdict pills, gate bars, sections
  pages/      Intake (upload/paste) · Pipeline (dashboard) · Review (full package)
```

## Verification

`runModel(defaultInputs())` reproduces the source workbook's Target scenario exactly:
Year-3 CoC 20.2%, DSCR 5.00x, cap 31.8%, investor IRR 20.95%, equity multiple 4.83x — and
matches Current and Seller Pro Forma Year-3 metrics to the penny across all 10 years.

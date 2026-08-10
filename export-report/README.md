# ALMA AI OS — Loyalty™ · Executive Report package (Netlify-ready)

**Everyone wins when the fit is right.**

This package contains **Screen #6 — the Executive Report** (the final payoff of the investor/customer
demo) plus the full product **Blueprint** it belongs to. Both are static, self-contained pages with
**no build step and zero external dependencies**.

```
index.html      ← THE EXECUTIVE REPORT (board-ready consulting document). Open this first.
blueprint.html  ← the 20-section product blueprint (the OS tour) — linked from the report toolbar.
README.md       ← this file
DEMO-DATA.md    ← every illustrative number/company, labeled, in one place
netlify.toml    ← optional deploy config (no build; security headers)
```

## Run / deploy
- **Locally:** open `index.html` in any modern browser (or `python3 -m http.server` → `localhost:8000`).
- **Netlify:** drag this folder (or the ZIP) in. No build command, no env vars. Publish dir = this folder.
- **Entry point:** `index.html`. It cross-links to `blueprint.html` (top toolbar → "Blueprint").

## What the Executive Report is (and is not)
It is a **premium, board-ready consulting report** — editorial, serif-set, page-structured, and
**print-to-PDF ready** (toolbar → "Save as PDF" triggers a clean paginated export). It is deliberately
*not* another application dashboard.

**First page = 30-second CEO read.** One headline verdict ("loyalty is economically justified — even
conservatively"), the money answer to *"Does this still make money conservatively?"* (+$4.2M floor),
the Conservative/Expected/High range, the five scores, and the one-line recommendation. Everything
below adds CFO/analyst depth.

## The 11 pages (every requested element is present)
1. **Cover** — subject, prepared-for, report ID, date, DRAFT stamp, illustrative band.
2. **Executive conclusion** — 30-sec verdict + "does it make money conservatively?" + five-score gauges.
3. **The economic case** — Conservative/Expected/High **range graphic** + **financial waterfall** (AOV-only + frequency-only + interaction, then costs). Benefit-Cost Ratio never mislabeled "ROI×".
4. **Financial foundation & member derivation** — members derived *down* from Revenue ÷ AOV ÷ Frequency.
5. **The five fit scores** — Financial · Capability · Buyer Intent · Mutual Match · Commercial Priority, each with "why".
6. **MarTech foundation** — a **constellation map** with loyalty at the centre; migration signals.
7. **Loyalty situation + vendor ranking & why** — honest #2 **competitive podium** + competitive risks.
8. **Buyer-intent timeline** — corroborated **evidence timeline**, "possible" not "definite".
9. **Key evidence & provenance** — field-level record table + legend + model confidence.
10. **Assumptions to validate + what could cause underperformance.**
11. **Recommendations + Sales recommendation + Customer Success success criteria + Sales→CS path.**
12. **Sources / model version / approval status** + the prototype-vs-production disclosure + contents.

## Actual / Estimated / Hybrid — enforced throughout
- `ACTUAL` = solid emerald · `~ESTIMATED` = **dashed** amber · `HYBRID` = indigo · `MISSING` = dotted grey.
- Confidence dots accompany material fields.
- **No illustrative/estimated number is ever rendered in the "Actual" style.** Web reach is labeled a
  "digital-demand signal," never audited revenue. A tech migration is a *signal with confidence*, never a fact.

## Visual storytelling included (as requested)
Financial waterfall · range graphic · score gauges · MarTech constellation map · competitive podium ·
evidence timeline · Sales→Customer Success path. Waterfall and gauges render responsively via a small
inline script (no libraries) and redraw on theme change / resize.

## Audit interactions to test
- **Theme toggle** (light / dark / system — built for all three states).
- **Save as PDF** — confirm the paginated, board-ready print layout.
- **Responsiveness** — resize to phone width; wide tables and the constellation scroll inside their own
  containers so the page body never scrolls sideways.

## Governance disclosure (keep this through the React build)
The scenario math here is **hand-authored demonstration logic**, not Alma's protected production engine.
When the real app is wired, this logic is **replaced** by the canonical server-side Alma engine and formula
registry — prototype formulas must never quietly become production formulas. Every figure and company is
illustrative; nothing is a verified actual, a real ranking, or advice to transact. See `DEMO-DATA.md`.

## Cadence (per project direction)
Claude prototype → Claude Executive Report → **upload package for independent audit** → Horizon comparison
→ correction round → choose architecture → **only then** build the real app. This package is the upload for
the audit step. No React conversion has been done.

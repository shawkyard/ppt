# ALMA AI OS — Loyalty™ · Product Blueprint (Netlify-ready export)

**Everyone wins when the fit is right.**

This is the full, un-simplified visual build of the Alma product blueprint — a single-page,
interactive "operating-system tour" that answers all 50 parts of the design brief. It is a
**design + architecture prototype** (a clickable story), not a wired-up production app.

---

## How to run / deploy

This is a **static site with no build step**. Everything is inlined.

- **Locally:** open `index.html` in any modern browser. (Or `python3 -m http.server` in this folder → visit `http://localhost:8000`.)
- **Netlify (drag-and-drop):** drop this whole folder (or the ZIP) onto Netlify. No build command, no framework, no environment variables. Publish directory = this folder. `netlify.toml` is included but optional.
- **Entry point:** `index.html`.

## What's in the box

```
index.html      ← the complete site. All HTML/CSS/JS inlined. No external requests.
README.md       ← this file
DEMO-DATA.md    ← every illustrative number/company, labeled, in one place
netlify.toml    ← optional deploy config (security headers; no build step)
```

## Zero external dependencies (by design)

- **No CDN scripts, no webfont links, no remote images.** The favicon is an inline SVG data-URI.
- **Fonts:** system font stacks only — a sans stack for UI chrome, **Georgia** (serif) for the
  "reads like a McKinsey conclusion" statements, and a **monospace** stack (with `tabular-nums`)
  for every financial figure and provenance tag. Nothing to 404.
- This means the site renders identically offline and behind any CSP. If you audit network
  traffic you should see **only** the initial HTML document load.

## How the demo is structured (top → bottom)

1. **Hero** — 30-second story: `Brands ↔ ALMA ↔ Vendors` + the six verbs (Calculate · Match · Monitor · Research · Act · Prove).
2. **Understand Alma in 30 seconds** — 10th-grader explanation, what it decides, brand-promise verdict.
3. **The honest product read** — the CPO/CTO challenge: what's strong, what to combine, what stays separate, what NOT to build.
4. **The five scores stay five** — Financial · Capability · Intent · Mutual Match · Commercial Priority (never one black-box score).
5. **One protected financial engine** — *interactive*: toggle Conservative / Expected / High and the numbers, BCR, ROI, payback and verdict recompute. Members are derived **down** from Revenue ÷ AOV ÷ Frequency. Incremental revenue = AOV-only + Frequency-only + interaction.
6. **Actual · Estimated · Hybrid** — the provenance system: solid emerald / **dashed** amber / indigo / dotted grey chips + confidence dots + a full field-record table.
7. **Screen — Vendor Daily Dashboard** — "what changed since yesterday" retention loop.
8. **Screen — Company Intelligence Record** — the centerpiece object (Nike demo, labeled illustrative).
9. **Screen — Two-sided Matchmaker** — two doors: "I am a brand" / "I sell loyalty software."
10. **Screen — Competitive ranking & urgency** — honest #2 with evidence and a visible clock.
11. **Screen — Buyer-intent event timeline** — corroborated signals, never "definitely switched."
12. **MarTech Stack Intelligence** — categories, current/previous, migration signals.
13. **Research agents & the living system** — visible agents + the L0–L5 research cost ladder.
14. **Brand Growth Intelligence** — the weekly executive brief + brand-side agents.
15. **Sales → Customer Success continuity** — the model survives the signature; the handoff package.
16. **Expansion, data moat & "why not just use ChatGPT?"**
17. **What to build / what not to** — first 10 screens, 5 to perfect for the investor demo, MVP exclusions, 30/90-day plans.
18. **Pricing & GTM.**
19. **Risks, trust & what needs a human.**
20. **Part 50 — how we beat Hostinger Horizons.**
21. **All 50 parts — index** (each links to where it's answered; the two scripted demo narratives are in a disclosure panel).

## Interactions to test in an audit

- **Theme toggle** (top-right) — cycles light/dark; the page is built for all three states
  (explicit light, explicit dark, and un-stamped system default).
- **Financial engine tabs** — Conservative / Expected / High recompute nine derived fields + verdict.
- **Progressive disclosure** — the `›` "Show why / evidence / math / source / history" panels.
- **Responsiveness** — grids collapse at 900px and 560px; the Sales→CS timeline and the
  provenance table scroll horizontally inside their own containers (the page body never scrolls sideways).

## Important: this is a prototype, not production

- All company names (Nike, ACME, Yotpo, etc.) and every number are **illustrative demo material**
  — see `DEMO-DATA.md`. Nothing here is a verified actual, a real ranking, or a real financial model.
- The financial engine's scenario math is a **hand-authored illustration** of the intended engine
  behavior, not the real formula registry (that's the protected IP the blueprint describes).
- Buttons ("Open account", "Draft outreach", etc.) are visual affordances; they are not wired to backends.

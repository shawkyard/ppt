# Branded Games for Loyalty Programs — Market Research & Go-to-Market

**Prepared for:** BBPLLC
**Date:** July 2026
**Question:** Can BBPLLC build branded, embeddable games that hosted by us, plug into brand
loyalty systems bidirectionally (deduct and add points via API), and monetize via a
transaction fee that is auto-billed to the brand or the loyalty software vendor once it
crosses a threshold — and what does it take to make that market work?

**Short answer:** Yes, there is a real and fast-growing market, and the specific slot BBPLLC
wants to occupy — *the branded "games layer" that any loyalty vendor can plug into* — is
under-served. But the business only works if three things are engineered from day one:
(1) a **partner-first channel** through the loyalty software vendors rather than selling to
brands one at a time, (2) a **legally clean points-to-play mechanic** that avoids the US
illegal-lottery tripwire, and (3) a **metered points/transaction ledger** that makes
usage-based, threshold-triggered billing automatic and auditable. The rest of this document
lays out the market, the competition, the architecture, the money model, the legal
constraints, and a concrete plan.

---

## 1. The opportunity is real and growing

- The **global gamification market** is estimated at **~$21–27B in 2025–2026** and is
  forecast to grow at a **~22–28% CAGR** through the early-2030s, reaching $100B+.
  Expansion of gamification *specifically inside customer loyalty programs* is called out
  as a leading driver.
- **85% of consumers** say they prefer brands with gamified loyalty programs, and gamified
  programs are associated with **~47% higher retention**.
- **45% of loyalty professionals in 2025** named gamification the single most influential
  loyalty trend for the next 2–3 years — i.e., the buyers BBPLLC would sell through are
  actively looking for exactly this.

**What this means for BBPLLC:** demand exists on both sides. Brands want games; loyalty
vendors know they need games but most don't want to build and operate real *game* content
(art, mechanics, hosting, fraud). That gap is the wedge.

---

## 2. How the market is structured today (and where the gap is)

There are three distinct categories of players. BBPLLC's opportunity is that **almost no one
sits cleanly in the middle**, connecting real branded games to the loyalty ledger through a
vendor-neutral API.

### A. White-label / HTML5 game makers (content, weak on loyalty plumbing)
Companies that build embeddable games — spin-the-wheel, scratch-to-win, instant-win, memory,
quiz, arcade mini-games — with branding and iframe/WebView embedding:
- **MarketJS** (white-label HTML5 games + hosted game portals), **Drimify**, **Priiize**
  (digital scratch-offs), **Odicci**, **Brame**, **Contest Factory / SpinZone API**.
- **Strength:** real games, fast to brand, embeddable. **Weakness:** they mostly reward
  *coupon codes / vouchers*, not a live, bidirectional points balance. They are not deeply
  wired into loyalty ledgers, and they are not sold *through* loyalty vendors.

### B. Promotion / campaign platforms (marketing tools, campaign-scoped)
- **Woobox, Easypromos, Wyng** — instant-win and sweepstakes builders for marketing teams.
- **Strength:** self-serve, compliance features (AMOE, rules). **Weakness:** campaign-centric,
  not a persistent "play with your points" experience tied to the loyalty account.

### C. Loyalty / promotion engines (the ledger, weak on game *content*)
API-first platforms that own the points balance and rules:
- **Open Loyalty** (API-first, 250+ REST/GraphQL endpoints, points engine + wallet),
  **Antavo** ("AI Loyalty Cloud," gamification modules, promotion engine at 100k+ req/min),
  **Talon.One** (promotions/loyalty/pricing/gamification, one-time integration + partner
  program), **Voucherify** (API-first; explicitly *partners with gamification vendors —
  Wyng, Brame, Odicci — for widgets while it handles rewards/redemptions*), **Capillary**
  (200+ connectors), **Enable3**, **All Digital Rewards (RewardSTACK API)**.
- **Strength:** they own the points ledger and the brand relationship. **Weakness:** their
  "gamification" is usually mechanics (points, tiers, badges, challenges, leaderboards) — not
  polished, brandable *games*. Voucherify's model is the tell: **loyalty engines would rather
  partner for game content than build it.**

### The gap BBPLLC fills
> **A vendor-neutral "games layer": production-quality branded games, hosted by BBPLLC,
> embedded on brand properties, that read and write the brand's live points balance through
> whichever loyalty engine the brand already uses — with a single integration per loyalty
> vendor rather than per brand.**

That "one integration per vendor, many brands" model is what turns this from an agency into a
platform. Voucherify already proves loyalty vendors will slot a games partner into that seam.

---

## 3. Product architecture — what has to be built

### 3.1 Hosting + embedding (the "hosted by BBPLLC, embedded into sites" requirement)
- **Games run on BBPLLC infrastructure** (CDN-delivered HTML5) and are embedded via:
  - **`<iframe>`** — simplest, works everywhere, strongest security isolation.
  - **A lightweight JS SDK / Web Component** (`<bb-game campaign="..." token="...">`) —
    better UX, resize handling, event callbacks (`onPointsSpent`, `onReward`), and postMessage
    bridge to the host page.
  - **Mobile:** the same build inside a **WebView** for brand apps.
- **Branding engine:** a theme layer (logo, palette, fonts, copy, sounds, prize art, win/lose
  states) driven by a per-brand config so one game engine produces N branded skins without a
  code fork. This is the productization that keeps margins high.

### 3.2 Bidirectional points API (the core)
This is the heart of what the user asked for — "connect to the overall system bidirectionally
so we can deduct and add value (points)." Design it as a **two-legged ledger transaction**:

1. **Authenticate the player** — the brand/loyalty vendor hands BBPLLC a short-lived,
   signed token (OAuth2 / JWT) identifying the member. BBPLLC never stores loyalty
   credentials.
2. **Deduct to play** (`POST /debit`) — spend points to enter/play. Must be **idempotent**
   (idempotency key per play), **atomic**, and reversible.
3. **Award on outcome** (`POST /credit`) — add points/prizes based on the result.
4. **Reconcile** — webhooks in both directions; a **double-entry ledger** on BBPLLC's side
   that mirrors the loyalty balance so every point in and out is auditable.

**Integration patterns to support (you will need all three):**
- **Direct to loyalty engine APIs** — Open Loyalty, Antavo, Talon.One, Voucherify all expose
  points debit/credit endpoints; build one connector per engine (this is the scalable path).
- **Generic REST + webhook spec** — for brands on homegrown/legacy systems, publish a small
  BBPLLC points-adapter contract they implement.
- **Redemption-code fallback** — for vendors that won't grant write access, award a
  voucher/coupon code (the MarketJS/Odicci model) instead of a live credit.

**Non-negotiable engineering properties:** idempotency keys, atomic debit-before-play,
compensating reversal if a game crashes mid-play, signed webhooks with retries, rate limits,
and per-transaction audit logs. Points are money; treat the ledger like a payments system.

### 3.3 Fraud & abuse controls
Points have cash-equivalent value, so expect abuse: multi-accounting, bots, replay, and
collusion. Minimum controls: server-authoritative game outcomes (never trust the client for
win/loss), per-member play caps, velocity limits, device/session signals, and anomaly
alerts. This is also a **selling point to loyalty vendors**, who fear a games partner
leaking points.

---

## 4. The money model — transaction fees and threshold auto-billing

The user's stated model: *"deduct our transaction fees after they reach a certain amount,
automatically paid by brand or software vendor."* That is a **metered, usage-based billing**
design. Here's how to make it real and what to charge.

### 4.1 What to meter (pick 1–2, keep it legible)
| Model | Bill on | Pros | Cons |
|---|---|---|---|
| **Per-play / per-transaction fee** | Each debit+credit round | Directly tied to your value; easy to explain | Needs volume to add up |
| **% of points value moved** | Points debited/credited × point value | Scales with brand's own economics | Requires agreeing on point-to-$ value |
| **Per monthly active player (MAU)** | Unique players/mo | Predictable; matches how Trophy/Xtremepush price gamification | Decouples fee from actual play |
| **Platform SaaS + usage overage** | Base fee + metered overage | Predictable floor + upside | Two line items |

**Recommendation:** lead with **base platform fee + per-play transaction fee** (with volume
tiers). It maps cleanly to "we host and run the game each time it's played," and it's the
easiest to auto-meter and auto-bill.

### 4.2 Threshold-triggered automatic billing (exactly what was asked)
Implement it as a **metered billing ledger with an auto-charge trigger**:
1. Every play writes a priced usage event to a **billing meter** (separate from the points
   ledger).
2. Accrued fees roll up per account. When the balance **crosses a configured threshold**
   (e.g., $500) **or** a time cap (e.g., monthly), the system **auto-charges the stored
   payment method**.
3. Payment rails: **Stripe metered billing / usage-based invoicing** (card or ACH) with a
   mandate on file, so the charge is automatic and requires no manual invoice chase. ACH/
   direct-debit is preferable for larger B2B amounts (lower fees than cards).
4. **Who is billed** is a config flag on the account — **the brand** *or* **the loyalty
   software vendor** — because in a vendor-channel deal, the vendor often prefers to be the
   single payer and re-bill the brand inside their own contract. Support both from day one.

### 4.3 Channel economics (this is the strategic part)
- If you sell **through loyalty vendors** (recommended), expect to give a **revenue share /
  wholesale discount** (commonly 15–30%) or let the vendor **mark up and resell** your games
  as their own gamification add-on. You trade margin for distribution — one vendor deal can
  put you in front of hundreds of brands already on their platform.
- If you sell **direct to brands**, you keep full margin but carry the sales cost and each
  integration. Use direct deals to prove the model, then convert the brand's *loyalty vendor*
  into a channel partner.

---

## 5. The single biggest risk: the illegal-lottery tripwire

This is the issue that can quietly sink a "spend points to play and win" product in the US,
and it needs to be designed around, not bolted on.

**The rule:** a promotion that combines **(1) a prize, (2) awarded by chance, and (3)
consideration** (paying or giving something of value to enter) is an **illegal lottery** in
the US unless you are a licensed operator. All three together = illegal.

**Why it bites BBPLLC directly:** if a member **spends points** (consideration — points have
value) to play a **game of chance** (spin/scratch/instant-win) for a **prize**, that is all
three elements. Points are widely treated as consideration.

**Ways to stay legal — design the mechanic to break one leg of the triangle:**
- **Remove consideration → Sweepstakes model.** Keep games free to play with a genuine
  **AMOE** (Alternative Method of Entry) at parity, so no purchase/points are *required*.
  Spending points can be an *option*, but a free path must exist and be real.
- **Remove chance → Skill-based games.** Trivia, memory, arcade skill games where outcome is
  determined by skill can charge points to play. Note some states (Colorado, Maryland,
  Nebraska, North Dakota, Vermont) restrict/prohibit entry fees even for skill contests.
- **Remove the gamble → Guaranteed-value redemption.** "Spend 100 points, get a guaranteed
  reward, delivered with a fun reveal." Because the outcome is guaranteed (no chance), it's a
  **redemption with a game wrapper**, not gambling. This is often the safest default and
  still feels like play.
- **Also comply with:** sweepstakes **registration and bonding** where prize pools exceed
  thresholds (**FL, NY, RI**), clear official rules, eligibility, odds disclosure, and record
  keeping. Enforcement comes from **State AGs, the FTC, FCC, and USPS**; penalties include
  civil and criminal liability.

**Recommendation:** ship BBPLLC's engine with **compliance built into the mechanic
templates** — a "guaranteed-reward reveal" template and a "skill game" template as the default
safe options, and a "sweepstakes with AMOE" template with rules/registration tooling for
prize-draw campaigns. Sell compliance as a feature; it's a real moat versus generic HTML5
game shops. **Get a promotions/gaming attorney to review each mechanic before launch.**

---

## 6. Two-sided go-to-market

**Primary channel — loyalty software vendors (B2B2C).** Land 2–3 API-first vendors
(**Open Loyalty, Antavo, Talon.One, Voucherify** are the natural first targets; Voucherify
already partners this exact way). Become their "recommended games add-on," integrate once,
and reach their brand base. This is the fastest path to volume and the cleanest fit for
threshold billing to the *vendor*.

**Secondary channel — direct to brands** with a strong loyalty program (retail, QSR, CPG,
banking, telco — the verticals the incumbents already serve). Use these as **lighthouse case
studies** ("Brand X ran our branded spin game, +Y% redemption, +Z% repeat visits"), then
pull their loyalty vendor into a partnership.

**Proof metrics to instrument from day one:** incremental visits/spend, redemption-rate lift,
repeat-purchase lift, zero-party data captured per play, and retention delta. These are the
numbers both brands and vendors buy on.

---

## 7. Risks & how to manage them

| Risk | Mitigation |
|---|---|
| **Illegal-lottery / gambling exposure** | Compliance-first mechanic templates (guaranteed-reward, skill, sweepstakes+AMOE); legal review per mechanic; registration/bonding tooling |
| **Points fraud / leakage** | Server-authoritative outcomes, idempotent atomic ledger, velocity/device controls, audit logs |
| **Vendors build it themselves** | Move fast, be the neutral cross-vendor layer, out-execute on game quality + compliance; make partnering cheaper than building |
| **Integration sprawl (per-brand)** | Standardize on per-*vendor* connectors + one generic REST adapter; don't do bespoke per brand |
| **Getting write-access to points ledgers** | Offer redemption-code fallback for read-only vendors; earn write access with fraud controls |
| **Billing disputes** | Transparent metered ledger, per-transaction receipts, configurable payer (brand vs vendor), ACH mandates |
| **Data privacy** | Never store loyalty credentials; token-based auth; process only what a play requires |

---

## 8. Recommended plan — what to do to make this market work

**Phase 0 — Validate & de-risk (weeks 0–6)**
- Pick **one vertical** (QSR or retail) and **one flagship mechanic** that is *legally safe by
  design*: a **branded "guaranteed-reward reveal"** (spend points → guaranteed reward with a
  scratch/spin animation). No chance = no lottery problem, still feels like a game.
- Get a **promotions-law attorney** to bless the mechanic and draft rule templates.
- Have **2–3 discovery calls** with API-first loyalty vendors (Open Loyalty, Voucherify,
  Antavo) to confirm the partner model and their debit/credit API surface.

**Phase 1 — MVP (weeks 6–16)**
- Build the **branding engine + one game**, hosted by BBPLLC, embeddable via iframe **and** a
  small JS SDK.
- Build the **bidirectional points connector for ONE loyalty engine** (start where you have a
  partner), with idempotent atomic debit/credit, webhooks, and a double-entry audit ledger.
- Build the **metered billing meter + threshold auto-charge** on Stripe (card + ACH), with a
  **payer flag (brand vs vendor)**.
- Launch **one paying lighthouse brand**; instrument the proof metrics.

**Phase 2 — Productize the channel (weeks 16–30)**
- Add **2–3 more game mechanics** (skill game + sweepstakes-with-AMOE template) so you cover
  all three legal-safe patterns.
- Add **connectors for 2 more loyalty engines**; publish a **generic REST adapter** for
  everyone else.
- Sign **1–2 vendor channel partnerships** with revenue share and vendor-as-payer billing.
- Ship a **self-serve branding/campaign console** so brands (or vendor CSMs) launch games
  without BBPLLC engineering.

**Pricing to test:** base platform fee + **per-play transaction fee** with volume tiers;
auto-bill at a **$ threshold or monthly**, whichever first; **payer = brand or vendor** per
contract; **15–30% revenue share** to channel partners.

---

## What makes this work, in one paragraph

BBPLLC wins by being the **neutral, compliance-first games layer** that any loyalty vendor can
switch on: real branded games hosted by BBPLLC, embedded on the brand's site, wired to the
brand's live points balance through a per-vendor connector, monetized with a transparent
per-play fee that auto-bills the brand *or* the vendor once it crosses a threshold. The two
things most competitors get wrong — **(a) selling one brand at a time instead of through
vendors, and (b) treating the lottery/consideration problem as an afterthought** — are exactly
the two things to get right from day one.

---

## Sources

- [Gamification Market Report 2026 — Research and Markets](https://www.researchandmarkets.com/reports/5767632/gamification-market-report)
- [Gamification Market Size & Trends 2026–2035 — Precedence Research](https://www.precedenceresearch.com/gamification-market)
- [26 Gamification statistics — Open Loyalty](https://www.openloyalty.io/insider/gamification-statistics)
- [10 best gamification loyalty programs — Open Loyalty](https://www.openloyalty.io/resources/10-best-gamification-loyalty-programs)
- [LoyaltyPlay — Mistplay](https://business.mistplay.com/publishers/loyaltyplay)
- [Branded Mini-Games (BMG Studio)](https://www.brandedminigames.com/)
- [Brands In Games®](https://test-brandsingames.com/)
- [API-first Gamification Software — Voucherify](https://www.voucherify.io/gamification-software)
- [Open Loyalty — Loyalty Points System](https://www.openloyalty.io/product/loyalty-points-system)
- [Antavo vs Talon.One](https://antavo.com/antavo-vs-talon-one/)
- [Technology partners — Talon.One](https://www.talon.one/technology-partners)
- [RewardSTACK API Documentation — All Digital Rewards](https://alldigitalrewards.com/solutions/api-integration/rewardstack-api-documentation/)
- [Enable3 Loyalty API](https://enable3.io/loyalty-api)
- [Scratch & Win White Label HTML5 Game — MarketJS](https://www.marketjs.com/scratch-and-win-white-label-html5-game/)
- [SpinZone API — Contest Factory](https://contestfactory.com/products-and-services/spinzone-api/)
- [Scratch to Reveal / Instant Win — Odicci](https://odicci.com/game-library/scratch-to-win/)
- [Free Instant Win Game Maker — Woobox](https://woobox.com/instantwin)
- [Digital Scratch-Off examples — Priiize](https://priiize.com/examples/)
- [2026 Sweepstakes & Promotions Compliance Guide — Brandmovers](https://blog.brandmovers.com/promotions-compliance-in-2026-sweepstakes-instant-win-and-ugc-rules-marketers-must-know)
- [No Purchase Necessary Sweepstakes Laws — Votigo](https://social.votigo.com/2025/11/05/no-purchase-necessary-sweepstakes-laws/)
- [Sweepstakes 101: Prize, Chance & Consideration — US Sweeps](https://ussweeps.com/about-us/blog/sweepstakes-law/sweepstakes-101/)
- [Gamification Platform Costs 2026: Build vs Buy — Trophy](https://trophy.so/blog/what-building-gamification-actually-costs)
- [Gamification acquisition ROI — Xtremepush](https://www.xtremepush.com/blog/gamification-acquisition-roi-calculator)

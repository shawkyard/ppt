# Omnichannel Loyalty Business — Platform Decision Brief

Prepared 2026-08-13 (rev. 2 — Salt Lake City vendor corrected to Loyalty
Partners Group). Decision: how to deliver a white-labeled, omnichannel loyalty
platform for $200K–$300K/yr accounts — outsource to White Label Loyalty (UK),
Preferred Patron (NJ), Loyalty Partners Group (Salt Lake City), or build our own.

---

## Bottom line

1. **Don't build the core platform, and don't let an AI agent build it for
   production.** AI can absolutely build the public-facing site (component #1)
   and a convincing prototype of the member portal, but a production loyalty
   engine — points ledger, fraud controls, POS/e-commerce/ESP integrations,
   uptime SLAs — is a 6–18 month, $120K–$320K+ build with 20–30% annual
   maintenance. That's capital burned rebuilding what vendors already sell.
2. **Run a two-vendor stack:** White Label Loyalty for the complicated
   $200K–$300K omnichannel deals (it's the only one of the three that is a true
   enterprise omnichannel engine), Preferred Patron's white-label reseller
   program for speed-to-market and mid-market wins (you price, bill, and brand
   it yourself).
3. **Loyalty Partners Group (SLC) is not a full platform — it's a co-branded
   card-linked cashback app.** Powered by Savers App: members link a Visa or
   Mastercard and earn automatic cashback at ~8,000 merchants / 20,000+ US
   locations, no POS integration needed. That makes it a great *earning
   channel* to bundle into programs (especially multifamily resident perks —
   everyday-spend cashback with zero merchant work), but it has no points
   rules engine, campaign console, or POS/e-commerce/ESP integration depth to
   carry a $200K–$300K omnichannel deal on its own.
4. **Own the customer. Do not refer.** Contracts on your paper, billing through
   you, vendor invisible behind your brand. Referral commissions are worth
   roughly 1x annual value at exit; owned recurring revenue trades at 3–8x.
   If the plan is to sell the company someday, referral economics kill the
   valuation.

---

## Side-by-side: the four options

| | **White Label Loyalty** (Leeds, UK) | **Preferred Patron** (New Jersey) | **Loyalty Partners Group** (Salt Lake City) | **Build our own** |
|---|---|---|---|---|
| **What it actually is** | Enterprise, API-first omnichannel loyalty engine ("Reactor" event-based rules engine) | SMB/mid-market loyalty & gift-card suite with a true white-label reseller program | Co-branded card-linked-offer (CLO) cashback app, powered by Savers App — a turnkey product, not a configurable engine | Custom platform (all three components from scratch) |
| **Target deal size** | Enterprise — fits the $200K–$300K/yr complicated deals | $30–$150+/mo per client retail; volume mid-market | Any org wanting a branded cashback perk (financial institutions, telecoms, sports teams, charities) | N/A |
| **Omnichannel depth** | Strongest: event-driven, any channel, receipt scanning, branded apps, AI personalization | Good for its tier: in-store, kiosk ($49.95/mo), SMS, email, mobile app, gift cards | One channel done well: automatic in-store/online earning via linked Visa/Mastercard at ~8,000 merchants, 20,000+ US locations | Whatever we build (eventually) |
| **POS integrations** | 3,000+ integrations incl. ePOS, CRM, ERP | REST API / JSON toolkit into POS; kiosk hardware | None needed — card-linking bypasses the POS entirely (its superpower and its ceiling) | Every integration hand-built |
| **E-commerce** | Shopify, Stripe, API-first for anything else | API into e-commerce sites | Cashback at network merchants only; no client-store integration | Hand-built |
| **ESP / marketing** | Mailchimp, mParticle, plus API | Built-in omni-channel comms, SMS marketing, email | Personalized offers inside the app; no client ESP stack | Hand-built |
| **White-label / who owns the customer** | Full white-label; partner terms negotiated per deal — push for contracts on our paper | Best-in-class: reseller prices, sells, bills, services under own brand; no limits on margin; alt. agent model pays 5-yr residual | Co-branded (their engine, your client's logo); LPG sources/closes B2B partner contracts — customer ownership must be negotiated | We own everything |
| **Cost to us** | From ~£1,999/mo (~$2.5K+); enterprise deals custom | Deep wholesale discounts; retail from ~$30/mo — fattest margin % | Not published — largely merchant-funded cashback economics; get terms in writing | $120K–$320K build, 6–18 months, +20–30%/yr maintenance |
| **Proof / credibility** | PepsiCo, Burger King, Unilever, BAT; 32M users, 20+ countries | 11+ yrs, transparent pricing, no transaction fees | Savers App serves 150+ countries, 8,000+ merchants | None until year 2 |
| **Risk** | Higher floor cost; UK time zone; partner terms need negotiating | May cap out on the most complex enterprise omnichannel requirements | Small company; agent-recruitment go-to-market; can't run points/tiers/campaigns for a client's own brand — total risk if mistaken for a full platform | Slow time-to-market, capital burn, we become a software company instead of a loyalty company |

---

## The three components, and who builds what

1. **Public-facing marketing site** (yours + each client's program page):
   build with AI now — days, not months. This repo is already a Vite/React
   site that can host it.
2. **Member portal** (points balance, rewards, ways to earn): comes *with*
   White Label Loyalty and Preferred Patron, white-labeled. Don't rebuild it.
3. **Admin console** (points rules, campaigns, program ops): the hard 80% of
   the platform. This is exactly what you're paying the vendor for.

AI verdict: use AI aggressively for #1, for prototypes/demos of #2 to close
deals, and for glue code and integrations. Do not bet a $300K/yr client's
production points ledger on an AI-generated platform in year one.

## Own vs. refer

Own. Structure every deal so the client contract, billing, and support
front-door are ours; the vendor is invisible infrastructure. Preferred
Patron's reseller program is explicitly built this way. With White Label
Loyalty, negotiate an agency/partner agreement with the same shape before the
first enterprise deal. Referral-only arrangements (like Preferred Patron's 5%
agent residual) are the fallback, not the plan — they don't build sellable
enterprise value.

## Multifamily / multi-tenant angle

Resident-perks programs are a natural fit for card-linked cashback: Loyalty
Partners Group's co-branded Savers App gives every resident automatic
everyday-spend cashback (merchant-funded, no property spend, no POS work) —
a rich-feeling perk on day one. Deploy the *program engine* (points, tiers,
campaigns, resident portal) on WLL/Preferred Patron and bundle the LPG
cashback app as an earning/benefit channel inside it. A second content
option worth pricing against LPG: Access Development (also Salt Lake City,
founded 1984) licenses white-label travel/discount network content — ~1M
merchant partnerships, 850K hotels at 30–50% below OTA rates.

## Next 30 days

1. Sign Preferred Patron white-label reseller agreement (fast, cheap, revenue-ready).
2. Open partner-terms negotiation with White Label Loyalty for enterprise deals (contracts on our paper).
3. Get Loyalty Partners Group's partner terms in writing — economics (revenue share on interchange/merchant funding), who owns the member data, and whether their app can co-brand under *our client's* brand with us holding the contract. Price Access Development's network content against it.
4. Build the public website + a demo member portal with AI to use in sales.
5. Standardize the stack with the IT lead: CRM, billing, support desk, SSO — one system of record for *our* customers, independent of any vendor.

## Sources

- [White Label Loyalty — GetApp profile & pricing](https://www.getapp.com/customer-management-software/a/white-label-loyalty-platform/)
- [White Label Loyalty — official site](https://whitelabel-loyalty.com/)
- [Preferred Patron — pricing](https://www.preferredpatron.com/pricing)
- [Preferred Patron — reseller/white-label/affiliate options](https://www.preferredpatron.com/reseller-loyalty-programs)
- [Preferred Patron — features](https://www.preferredpatron.com/loyalty-program-features)
- [Loyalty Partners Group — official site](https://loyaltypartnersgroup.com/)
- [Savers App — member portal](https://members.saversapp.com/)
- [Access Development — official site](https://www.accessdevelopment.com/) (alternate SLC rewards-content option)
- [Access Development — discount platform](https://www.accessdevelopment.com/discount-platform/)
- [Loyalty program development cost guide (RaftLabs)](https://www.raftlabs.com/blog/loyalty-program-development-costs)
- [Build vs. buy a loyalty platform (Brandmovers)](https://blog.brandmovers.com/build-vs.-buy-a-loyalty-platform-a-framework-for-making-the-right-decision)
- [Cost of implementing a loyalty program (Propello Cloud)](https://propellocloud.com/blog/cost-of-implementing-loyalty-program/)

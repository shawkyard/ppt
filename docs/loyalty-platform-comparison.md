# Omnichannel Loyalty Business — Platform Decision Brief

Prepared 2026-08-13. Decision: how to deliver a white-labeled, omnichannel loyalty
platform for $200K–$300K/yr accounts — outsource to White Label Loyalty (UK),
Preferred Patron (NJ), Access Development (Salt Lake City), or build our own.

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
3. **Access Development is not a platform — it's rewards content.** Largest
   private discount/travel network in North America (SLC, founded 1984). Use it
   as an add-on catalog (travel, entertainment, everyday savings) inside
   programs you deploy on the other platforms. Very strong fit for
   multifamily/resident-perks programs.
4. **Own the customer. Do not refer.** Contracts on your paper, billing through
   you, vendor invisible behind your brand. Referral commissions are worth
   roughly 1x annual value at exit; owned recurring revenue trades at 3–8x.
   If the plan is to sell the company someday, referral economics kill the
   valuation.

---

## Side-by-side: the four options

| | **White Label Loyalty** (Leeds, UK) | **Preferred Patron** (New Jersey) | **Access Development** (Salt Lake City) | **Build our own** |
|---|---|---|---|---|
| **What it actually is** | Enterprise, API-first omnichannel loyalty engine ("Reactor" event-based rules engine) | SMB/mid-market loyalty & gift-card suite with a true white-label reseller program | B2B discount, shopping & travel rewards *network* (~1M merchant partnerships) — content, not an engine | Custom platform (all three components from scratch) |
| **Target deal size** | Enterprise — fits the $200K–$300K/yr complicated deals | $30–$150+/mo per client retail; volume mid-market | Priced per-member as an add-on benefit | N/A |
| **Omnichannel depth** | Strongest: event-driven, any channel, receipt scanning, branded apps, AI personalization | Good for its tier: in-store, kiosk ($49.95/mo), SMS, email, mobile app, gift cards | None on its own — rides inside another program | Whatever we build (eventually) |
| **POS integrations** | 3,000+ integrations incl. ePOS, CRM, ERP | REST API / JSON toolkit into POS; kiosk hardware | N/A | Every integration hand-built |
| **E-commerce** | Shopify, Stripe, API-first for anything else | API into e-commerce sites | N/A | Hand-built |
| **ESP / marketing** | Mailchimp, mParticle, plus API | Built-in omni-channel comms, SMS marketing, email | Merchant-funded offers engine | Hand-built |
| **White-label / who owns the customer** | Full white-label; partner terms negotiated per deal — push for contracts on our paper | Best-in-class: reseller prices, sells, bills, services under own brand; no limits on margin; alt. agent model pays 5-yr residual | White-label branded apps/portals for the *rewards content* | We own everything |
| **Cost to us** | From ~£1,999/mo (~$2.5K+); enterprise deals custom | Deep wholesale discounts; retail from ~$30/mo — fattest margin % | Per-member content licensing (negotiated) | $120K–$320K build, 6–18 months, +20–30%/yr maintenance |
| **Proof / credibility** | PepsiCo, Burger King, Unilever, BAT; 32M users, 20+ countries | 11+ yrs, transparent pricing, no transaction fees | Founded 1984; 850K hotels, 130+ attractions, wholesale travel 30–50% below OTA | None until year 2 |
| **Risk** | Higher floor cost; UK time zone; partner terms need negotiating | May cap out on the most complex enterprise omnichannel requirements | Zero risk as add-on; total risk if mistaken for a platform | Slow time-to-market, capital burn, we become a software company instead of a loyalty company |

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

Resident-perks programs are a natural coalition play: Access Development's
discount network (travel, dining, entertainment, everyday savings) is
merchant-funded content that makes a property's program feel rich without the
property funding every reward. Deploy the engine on WLL/Preferred Patron,
plug Access in as the reward catalog.

## Next 30 days

1. Sign Preferred Patron white-label reseller agreement (fast, cheap, revenue-ready).
2. Open partner-terms negotiation with White Label Loyalty for enterprise deals (contracts on our paper).
3. Talk to Access Development about content licensing for the multifamily vertical.
4. Build the public website + a demo member portal with AI to use in sales.
5. Standardize the stack with the IT lead: CRM, billing, support desk, SSO — one system of record for *our* customers, independent of any vendor.

## Sources

- [White Label Loyalty — GetApp profile & pricing](https://www.getapp.com/customer-management-software/a/white-label-loyalty-platform/)
- [White Label Loyalty — official site](https://whitelabel-loyalty.com/)
- [Preferred Patron — pricing](https://www.preferredpatron.com/pricing)
- [Preferred Patron — reseller/white-label/affiliate options](https://www.preferredpatron.com/reseller-loyalty-programs)
- [Preferred Patron — features](https://www.preferredpatron.com/loyalty-program-features)
- [Access Development — official site](https://www.accessdevelopment.com/)
- [Access Development — discount platform](https://www.accessdevelopment.com/discount-platform/)
- [Access Development travel-redemption launch (PRWeb)](https://www.prweb.com/releases/access-development-launches-points-based-travel-redemption-solution-for-loyalty-programs-302802462.html)
- [Loyalty program development cost guide (RaftLabs)](https://www.raftlabs.com/blog/loyalty-program-development-costs)
- [Build vs. buy a loyalty platform (Brandmovers)](https://blog.brandmovers.com/build-vs.-buy-a-loyalty-platform-a-framework-for-making-the-right-decision)
- [Cost of implementing a loyalty program (Propello Cloud)](https://propellocloud.com/blog/cost-of-implementing-loyalty-program/)

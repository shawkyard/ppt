/* ============================================================
   U.S. GOLD CARD — Marketing & Sales Pages
   /business /pricing /seo /email-program /loyalty
   /state-partners /join /sitemap
   ============================================================ */

/* ---------------- BUSINESS OWNER PAGE ---------------- */
function pageBusiness() {
  const problems = [
    ["📉", "Not enough website traffic", "Most small businesses don't get enough website traffic to matter — if they have a website at all."],
    ["🕸️", "Outdated websites", "Many local sites haven't been touched in years: wrong hours, dead links, no mobile design."],
    ["📇", "No customer list", "Most businesses never collect emails or phone numbers — so they can't reach customers who already love them."],
    ["📭", "No consistent campaigns", "Sending regular promotions takes time, tools, and copywriting that owners don't have."],
    ["🔍", "Local SEO is a mystery", "Titles, structured data, city pages, canonical URLs — nobody opened a restaurant to learn this."],
    ["🧰", "No appetite for more tech", "Another dashboard, another login, another subscription to manage? No thanks."]
  ];
  const solutions = [
    ["📄", "Local business page", "A real, search-friendly page for your business — name, city, category, hours, photos, and one-tap contact."],
    ["🌐", "Mini-site build", "Three pages: your main page, an offer/lead-capture page, and a menu/services/showcase page. We build all of it."],
    ["🎯", "Lead capture", "A lead form on every page, delivered to you instantly — quotes, bookings, catering requests, questions."],
    ["🏷️", "Offer promotion", "Your offer gets its own page, plus placement in the deals network and email campaigns."],
    ["📬", "Email/SMS audience building", "Every signup on your pages joins your audience and the shared network list we promote you to."],
    ["🗂️", "City & category placement", "You appear in your city directory, your category, and every relevant combination page."],
    ["🗺️", "State network placement", "Your page strengthens — and is strengthened by — your state's Gold Card brand."],
    ["✨", "Homepage rotation", "Gold and Premium members rotate through featured homepage slots as available."],
    ["💎", "Optional Platinum upgrade", "When you want maximum visibility: sponsorships, custom campaigns, more pages, advanced automation."]
  ];
  const faqs = [
    { q: "Do I have to build or manage anything?", a: "No. We do the setup, the pages, the local SEO structure, the directory placement, and the group campaigns for you. You review, approve, and run your business." },
    { q: "What if my state's directory is still small?", a: SITE.copy.earlyMarket },
    { q: "How is this different from Yelp or a Facebook page?", a: "Those are profiles on someone else's platform, formatted like everyone else's. A Gold Card listing is your own three-page mini-website with unique titles, descriptions, structured data, and an offer engine — inside a network that promotes you." },
    { q: "What does it cost to start?", a: "The Starter Gold Listing is $65/month. The most popular plan — the three-page Gold Mini-Site — is $95/month. Premium is $195/month with priority placement and a featured badge." },
    { q: "Can I upgrade later?", a: "Yes. Start at any tier and move up as you grow. The Platinum tier (coming soon) adds sponsorship placement, custom campaigns, and even a custom-domain website." },
    { q: "Who writes the content?", a: "We do — unique copy for every page, based on a short intake. Nothing is duplicated boilerplate, because duplicated copy doesn't rank." }
  ];

  const html = `
  ${Header("#/business")}
  <div class="hero">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "For Businesses"]])}
      <div class="eyebrow" style="margin-top:20px">For Business Owners</div>
      <h1 style="max-width:900px">Get Found on U.S. Gold Card — and Get a Search-Friendly Mini-Website Without Doing the Work</h1>
      <p class="lede" style="margin-top:18px">We build your listing, your local SEO page, your offer page, your email signup system, and your local promotion engine. You focus on running the business.</p>
      <div class="btn-row" style="margin-top:28px">
        <a class="btn btn-gold" href="#/join">Get My Business Listed</a>
        <a class="btn btn-outline-light" href="${bizUrl(findBusiness("fajita-grill"))}">See a Live Example →</a>
      </div>
      <div class="hero-stat">
        <div><strong>3 pages</strong><span>Built for every mini-site</span></div>
        <div><strong>$65/mo</strong><span>Starting price</span></div>
        <div><strong>0 hrs</strong><span>Of your time managing tech</span></div>
      </div>
    </div>
  </div>

  <section>
    <div class="wrap">
      <div class="section-head center">
        <div class="eyebrow">The Problem</div>
        <h2>Local marketing is broken for small businesses</h2>
      </div>
      <div class="grid grid-3">
        ${problems.map(([icon, t, d]) => `
        <div class="card step-card">
          <span class="icon-tile">${icon}</span>
          <h3 style="font-size:17px">${t}</h3>
          <p class="card-desc">${d}</p>
        </div>`).join("")}
      </div>
      <div class="quote-block" style="max-width:820px;margin:34px auto 0">${esc(SITE.copy.ownerPromise)}</div>
    </div>
  </section>

  <section class="dark">
    <div class="wrap">
      <div class="section-head center">
        <div class="eyebrow">The Solution</div>
        <h2>What we build for you</h2>
        <p class="lede" style="margin:10px auto 0">One flat monthly price. A complete local presence, done for you.</p>
      </div>
      <div class="grid grid-3">
        ${solutions.map(([icon, t, d]) => `
        <div class="card step-card">
          <span class="icon-tile">${icon}</span>
          <h3 style="font-size:17px">${t}</h3>
          <p class="card-desc">${d}</p>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="alt">
    <div class="wrap two-col">
      <div class="prose">
        <div class="eyebrow">Why Every Listing Gets Page-Level SEO</div>
        <h2 style="margin-bottom:14px">Your page is built to rank on its own</h2>
        <p>${esc(SITE.copy.pageLevelSeo)}</p>
        <p><strong>Why it matters early:</strong> ${esc(SITE.copy.earlyMarket)}</p>
        <a class="btn btn-dark" href="#/seo">See the Full SEO Strategy</a>
      </div>
      <div class="prose">
        <div class="eyebrow">How Shared Directory Traffic Works</div>
        <h2 style="margin-bottom:14px">Every new business makes the network stronger</h2>
        <p>${esc(SITE.copy.sharedNetwork)}</p>
        <p>A customer who finds <strong>Fajita Grill</strong> by searching for halal fajitas in Midvale lands on the network — then discovers the Ogden coffee house, the antique shop, and the deals page. Their email signup then helps promote every business in the next Utah campaign.</p>
        <a class="btn btn-outline" href="#/email-program">How Campaigns Include You</a>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head center">
        <div class="eyebrow">Pricing Preview</div>
        <h2>Pick a lane. Upgrade any time.</h2>
      </div>
      <div class="grid grid-3">${TIERS.slice(0, 3).map(t => PricingCard(t, { compact: true })).join("")}</div>
      <div style="text-align:center;margin-top:24px"><a class="btn btn-dark" href="#/pricing">Compare Every Tier</a></div>
    </div>
  </section>

  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">FAQ</div><h2>Business owner questions, answered straight</h2></div>
      ${FAQAccordion(faqs, { openFirst: true })}
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="cta-band">
        <div>
          <h2>Ready to get found?</h2>
          <p>Tell us about your business — we'll build the pages, the SEO, and the promotion. You'll be live inside the network fast.</p>
        </div>
        <a class="btn btn-gold" href="#/join">Get My Business Listed</a>
      </div>
    </div>
  </section>
  ${Footer()}`;

  return {
    html,
    seo: {
      title: "For Business Owners — Get a Search-Friendly Mini-Website, Done For You | U.S. Gold Card",
      description: "U.S. Gold Card builds your local business page, offer page, lead capture, email audience, and promotion engine — from $65/month. Get found. Get leads. Get promoted.",
      canonical: SITE.domain + "/business"
    }
  };
}

/* ---------------- PRICING ---------------- */
function pagePricing() {
  const faqs = [
    { q: "Is there a setup fee?", a: "A one-time setup fee applies at onboarding ($99–$249 depending on tier) to cover the page builds, SEO writing, and directory placement. It's shown clearly before you commit." },
    { q: "Can I cancel anytime?", a: "Yes — plans are month-to-month. Your pages stay live while you're subscribed." },
    { q: "What's the Featured Placement Ad?", a: "A $25/month add-on that puts your business in feature slots on your state homepage, city page, and category page, plus deal spotlights and campaign highlights when relevant." },
    { q: "When does Platinum launch?", a: "Platinum is the future premium tier for maximum visibility — sponsorships, advanced SEO expansion, custom campaigns, and custom-domain website options. Join the waitlist from any plan." },
    { q: "What does a custom website include?", a: "A full standalone website on your own domain with advanced SEO plus booking, ordering, ecommerce, appointment requests, catering forms, quote forms, or custom integrations — scoped and priced per business." }
  ];
  const html = `
  ${Header("#/pricing")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "Pricing"]])}
      <div class="eyebrow" style="margin-top:20px">Simple, Flexible Pricing</div>
      <h1>Priced for Main Street. Built like enterprise.</h1>
      <p class="lede" style="margin-top:16px">Every paid tier gets a real SEO-built page — never a thin directory card. Start small, upgrade as you grow.</p>
    </div>
  </div>
  <section>
    <div class="wrap">
      <div class="grid grid-3">${TIERS.slice(0, 3).map(t => PricingCard(t)).join("")}</div>
      <div class="grid grid-3" style="margin-top:22px">${TIERS.slice(3).map(t => PricingCard(t)).join("")}</div>
    </div>
  </section>
  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Side by Side</div><h2>Full tier comparison</h2></div>
      ${ComparisonTable()}
    </div>
  </section>
  <section>
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">FAQ</div><h2>Pricing questions</h2></div>
      ${FAQAccordion(faqs)}
    </div>
  </section>
  ${BusinessOwnerCTA({ title: "Not sure which tier fits? Start the conversation.", sub: "Tell us about your business on the join form and we'll recommend the right starting point — no pressure, no lock-in." })}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: "Pricing — Gold Listings from $65/mo, Mini-Sites from $95/mo | U.S. Gold Card",
      description: "U.S. Gold Card pricing: Starter Gold Listing $65/mo, Gold Mini-Site $95/mo, Premium Gold Mini-Site $195/mo, Featured Placement Ad $25/mo, plus future Platinum and custom websites.",
      canonical: SITE.domain + "/pricing"
    }
  };
}

/* ---------------- SEO PAGE ---------------- */
function pageSeo() {
  const fg = findBusiness("fajita-grill");
  const layers = [
    ["1", "Business pages rank first", "Each business page targets its own name + city + state + category. This is where SEO effort concentrates from day one — it works even when the directory is young."],
    ["2", "City pages rank second", "As businesses join, city pages accumulate real content and internal links — becoming genuine 'best of [city]' resources."],
    ["3", "Category pages rank third", "Category and city/category combination pages capture 'restaurants in Midvale'-style searches across the network."],
    ["4", "State pages rank fourth", "State Gold Card pages grow into statewide authorities as their cities and categories fill in."],
    ["5", "The national platform compounds", "Every page strengthens usgoldcard.com's overall authority — which flows back down to every business page."]
  ];
  const perPage = [
    ["Main business page", "/utah/midvale/fajita-grill", "Ranks for business name + city + state + category.", "Unique title, meta description, H1, body copy, FAQ, local keyword section, JSON-LD, and internal links to city, category, and state pages."],
    ["Offers page", "/utah/midvale/fajita-grill/offers", "Ranks for business name + offers + deals + city + state.", "Its own title and description, offer schema, email/birthday capture, and links back to the main page and the deals network."],
    ["Menu / services page", "/utah/midvale/fajita-grill/menu", "Ranks for business name + menu/services/products + city + state.", "Item-level content — dishes, services, or products — that captures long-tail searches like 'halal shawarma Midvale.'"]
  ];
  const html = `
  ${Header("#/seo")}
  <div class="hero">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "SEO"]])}
      <div class="eyebrow" style="margin-top:20px">The Local SEO Engine</div>
      <h1 style="max-width:880px">Every Paid Listing Is Built Like Its Own Local Business Page</h1>
      <p class="lede" style="margin-top:18px">“Your U.S. Gold Card page is built to help customers find your business by name, city, state, category, services, menu items, offers, and local search terms.”</p>
      <div class="btn-row" style="margin-top:28px">
        <a class="btn btn-gold" href="${bizUrl(fg)}">See a Live SEO Build →</a>
        <a class="btn btn-outline-light" href="#/join">Get Listed</a>
      </div>
    </div>
  </div>

  <section>
    <div class="wrap">
      <div class="section-head center">
        <div class="eyebrow">The Priority Stack</div>
        <h2>Our SEO strategy, in ranking order</h2>
        <p class="lede" style="margin:10px auto 0">${esc(SITE.copy.earlyMarket)}</p>
      </div>
      <div class="grid" style="gap:14px;max-width:820px;margin:0 auto">
        ${layers.map(([n, t, d]) => `
        <div class="card" style="padding:22px;flex-direction:row;gap:18px;align-items:flex-start">
          <span class="step-num">${n}</span>
          <div><h3 style="font-size:17px">${t}</h3><p class="card-desc" style="margin-top:4px">${d}</p></div>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="dark">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow">Three Pages Per Business</div>
        <h2>One listing = three SEO-built pages</h2>
        <p class="lede">No canonicals pointing back to the homepage. No thin duplicate cards. Each page stands on its own.</p>
      </div>
      <div class="grid grid-3">
        ${perPage.map(([t, url, purpose, detail]) => `
        <div class="card step-card">
          <h3 style="font-size:17px;color:var(--gold-bright)">${t}</h3>
          <code style="font-size:12px;background:rgba(0,0,0,.35);padding:6px 10px;border-radius:8px;color:#cfc6a8;word-break:break-all">${url}</code>
          <p class="card-desc"><strong style="color:var(--paper)">SEO purpose:</strong> ${purpose}</p>
          <p class="card-desc">${detail}</p>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="alt">
    <div class="wrap two-col">
      <div class="prose">
        <div class="eyebrow">What's Inside Every Page</div>
        <h2 style="margin-bottom:14px">The page-level SEO checklist</h2>
        <p>${esc(SITE.copy.pageLevelSeo)}</p>
        <ul class="feature-list" style="margin-top:10px">
          <li>Unique SEO title, meta description, and H1</li>
          <li>Unique URL slug and canonical URL</li>
          <li>Unique business description and local keyword section</li>
          <li>Unique FAQ, offer, and services/menu sections</li>
          <li>Unique image alt text and Open Graph tags</li>
          <li>JSON-LD structured data with the most specific schema type</li>
          <li>Breadcrumbs: Home › State › City › Category › Business</li>
          <li>Internal links to state, city, category, related businesses, nearby cities, deals, and join pages</li>
        </ul>
      </div>
      <div class="prose">
        <div class="eyebrow">Structured Data</div>
        <h2 style="margin-bottom:14px">The right schema, honestly used</h2>
        <p>We use the most specific schema.org type available: <strong>Restaurant</strong> for restaurants, <strong>Store</strong> for retail, <strong>HealthAndBeautyBusiness</strong> for salons and wellness, <strong>HomeAndConstructionBusiness</strong> or <strong>ProfessionalService</strong> for service companies, and <strong>LocalBusiness</strong> as the general case.</p>
        <p>JSON-LD includes name, description, URL, telephone, address, opening hours, images, price range, cuisine and menu URL for restaurants, area served, and current offers.</p>
        <p><strong>What we never do:</strong> fake reviews or ratings in structured data. Review markup appears only when real review data exists. Search engines penalize dishonest markup — and honest businesses shouldn't be gambling their name on it.</p>
        <div class="card" style="padding:20px;margin-top:8px">
          <h3 style="font-size:15px;margin-bottom:8px">🗺️ Sitemap & indexing</h3>
          <p class="card-desc">Every public page — national, state, city, category, combination, and all three pages of every business — is in the XML sitemap. Admin and campaign dashboards are noindex/nofollow.</p>
          <a class="card-link" href="#/sitemap">View the sitemap logic →</a>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head center">
        <div class="eyebrow">Proof, Not Promises</div>
        <h2>Inspect a real page build</h2>
        <p class="lede" style="margin:10px auto 0">Open the Fajita Grill mini-site and expand “Under the Hood” at the bottom — you'll see this page's actual titles, canonical, keywords, and JSON-LD.</p>
      </div>
      <div class="grid grid-3">
        ${[findBusiness("fajita-grill"), findBusiness("golden-hour-salon"), findBusiness("austin-home-repair-pros")].map(b => BusinessCard(b)).join("")}
      </div>
    </div>
  </section>
  ${BusinessOwnerCTA({ title: "Want this SEO build under your business name?", sub: "Every paid tier includes page-level SEO. We write it, structure it, and maintain it — you approve it." })}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: "Local SEO Strategy — Page-Level SEO for Every Business | U.S. Gold Card",
      description: "How U.S. Gold Card builds SEO: individual business pages rank first, then city, category, and state pages. Unique metadata, JSON-LD, and three SEO-built pages per business.",
      canonical: SITE.domain + "/seo"
    }
  };
}

/* ---------------- EMAIL PROGRAM ---------------- */
function pageEmailProgram() {
  const campaigns = [
    ["🌮", "Best Mexican Food This Weekend", "City · Utah"],
    ["🏷️", "Omaha Local Deals", "City · Nebraska"],
    ["🍽️", "Utah Family Dinner Picks", "State · Utah"],
    ["🛍️", "New York Local Shops", "State · New York"],
    ["🎂", "Birthday Club Offers", "National · Monthly"],
    ["🥘", "Catering for Office Lunches", "Category · National"],
    ["✨", "New Local Businesses", "Regional · Rotating"],
    ["💎", "Hidden Gems Near You", "National · Monthly"]
  ];
  const html = `
  ${Header("#/email-program")}
  <div class="hero">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "Email Program"]])}
      <div class="eyebrow" style="margin-top:20px">The Shared Audience Engine</div>
      <h1 style="max-width:840px">We build the audience. Your business rides every send.</h1>
      <p class="lede" style="margin-top:18px">${esc(SITE.copy.emailProgram)}</p>
      <div class="hero-stat">
        <div><strong>20,400+</strong><span>Subscribers network-wide</span></div>
        <div><strong>10</strong><span>Monthly campaign slots</span></div>
        <div><strong>0</strong><span>Emails you have to write</span></div>
      </div>
    </div>
  </div>

  <section>
    <div class="wrap">
      <div class="section-head center">
        <div class="eyebrow">How It Works</div>
        <h2>Four steps, all handled for you</h2>
      </div>
      <div class="grid grid-4">
        ${[
          ["1", "We build the audience", "Signup points on every business page, offer page, deals page, and city directory feed one growing local audience."],
          ["2", "We collect across the network", "Every business's signups strengthen the shared list — with city, state, category, and birthday segmentation baked in."],
          ["3", "We write and send campaigns", "Local, state, category, and national sends — designed, written, and scheduled by our team."],
          ["4", "You get the exposure", "Participating businesses appear in relevant campaigns with their offer and a link to their page. No work required."]
        ].map(([n, t, d]) => `
        <div class="card step-card">
          <span class="step-num">${n}</span>
          <h3 style="font-size:17px">${t}</h3>
          <p class="card-desc">${d}</p>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="dark">
    <div class="wrap">
      <div class="section-head">
        <div class="eyebrow">Campaign Examples</div>
        <h2>The kind of email people actually open</h2>
        <p class="lede">Customers get local deals, openings, events, and featured picks — curated, not spammy.</p>
      </div>
      <div class="grid grid-4">
        ${campaigns.map(([icon, name, scope]) => `
        <div class="card step-card">
          <span class="icon-tile">${icon}</span>
          <h3 style="font-size:16px">${name}</h3>
          <div class="card-meta">${scope}</div>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="alt">
    <div class="wrap two-col">
      <div class="prose">
        <div class="eyebrow">For Businesses</div>
        <h2 style="margin-bottom:14px">Exposure without the workload</h2>
        <p>You never write, design, or send anything. When a campaign fits your city, category, or offer, your business is included — with your current Gold Card offer and a link straight to your page.</p>
        <p><strong>Gold Mini-Site members</strong> are included in regular campaign rotation. <strong>Premium members</strong> get more inclusion plus dedicated campaign landing pages. <strong>Starter members</strong> join selected local campaigns when available.</p>
        <a class="btn btn-dark" href="#/pricing">See What Each Tier Includes</a>
      </div>
      <div class="card" style="padding:26px">
        <h3 style="margin-bottom:6px">📬 For customers: join the list</h3>
        <p class="card-desc" style="margin-bottom:16px">One signup. Local deals, new openings, hidden gems, and birthday perks for your city and state.</p>
        ${EmailCapture({ placeholder: "you@email.com", cta: "Join Free" })}
        <p class="form-note">Segmented by your city, state, and interests. Unsubscribe anytime — but you won't want to.</p>
      </div>
    </div>
  </section>
  ${BusinessOwnerCTA({ title: "Get your business into the next campaign", sub: "Every plan includes audience building; Gold and Premium include campaign rotation. We handle everything." })}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: "Email Program — Shared Local Audience & Done-For-You Campaigns | U.S. Gold Card",
      description: "U.S. Gold Card collects emails across the network and sends local, state, category, and national campaigns on behalf of participating businesses. Exposure without writing a single email.",
      canonical: SITE.domain + "/email-program"
    }
  };
}

/* ---------------- LOYALTY ---------------- */
function pageLoyalty() {
  const html = `
  ${Header("#/loyalty")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "Loyalty"]])}
      <div class="eyebrow" style="margin-top:20px">Gold Card Loyalty</div>
      <h1>Offers that bring customers back</h1>
      <p class="lede" style="margin-top:16px">Gold Card offers, birthday clubs, and repeat-customer promotions — built into every business page on the network.</p>
    </div>
  </div>
  <section>
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Live Loyalty Programs</div><h2>Running across the network right now</h2></div>
      <div class="grid grid-3">
        ${LoyaltyOfferCard("🏷️", "Gold Card Offers", "Every participating business runs a real, claimable offer on its own offer page — updated monthly on Premium plans.", "All tiers")}
        ${LoyaltyOfferCard("🎂", "Birthday Clubs", "Customers register a birthday month once and receive perks from salons, dessert bars, restaurants, and family venues near them.", "Gold & up")}
        ${LoyaltyOfferCard("🔁", "Repeat-Customer Promotions", "Digital punch programs like Lincoln Fresh Bowls' 'buy 5 bowls, get the 6th free' — tracked by email, nothing to carry.", "Gold & up")}
        ${LoyaltyOfferCard("🍽️", "Restaurant Rewards", "Family-night deals, free add-ons, and off-peak specials that fill slow nights — like Omaha Family Pizza's $2 kids' Fridays.", "Restaurants")}
        ${LoyaltyOfferCard("🛍️", "Retail Rewards", "First-visit discounts and free-delivery thresholds that convert browsers into regulars — like Phoenix Boutique Market's 15% first visit.", "Retail")}
        ${LoyaltyOfferCard("🔧", "Service Provider Offers", "Seasonal packages and job-size discounts that win the first booking — like Wasatch Home Repair's $50 off jobs over $300.", "Services")}
      </div>
    </div>
  </section>
  <section class="dark">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow">Coming with Platinum</div>
        <h2>Future Platinum perks</h2>
        <p class="lede" style="margin-top:12px">The Platinum tier will add advanced loyalty offers: multi-visit reward tracks, SMS-triggered perks, VIP early access to campaigns, and cross-business reward partnerships inside each state network.</p>
        <a class="btn btn-gold" href="#/pricing" style="margin-top:20px">Preview Platinum on the Pricing Page</a>
      </div>
      <div class="grid" style="gap:14px">
        ${LoyaltyOfferCard("💎", "VIP reward tracks", "Multi-visit journeys with escalating rewards, tracked automatically.")}
        ${LoyaltyOfferCard("📱", "SMS-triggered perks", "Time-sensitive offers delivered the moment they matter.")}
        ${LoyaltyOfferCard("🤝", "Cross-business rewards", "Dinner at one Gold Card business earns dessert at another.")}
      </div>
    </div>
  </section>
  <section>
    <div class="wrap">
      <div class="cta-band">
        <div>
          <div class="eyebrow on-dark" style="color:var(--gold-bright)">For Businesses</div>
          <h2>Loyalty is built into your listing</h2>
          <p>Birthday club signup, offer pages, and repeat-customer promotions come standard with Gold Mini-Site plans and up — no extra tools, no punch cards to print.</p>
        </div>
        <a class="btn btn-gold" href="#/join">Get Listed with Loyalty Built In</a>
      </div>
    </div>
  </section>
  ${Footer()}`;

  return {
    html,
    seo: {
      title: "Gold Card Loyalty — Birthday Clubs, Rewards & Repeat-Customer Offers | U.S. Gold Card",
      description: "Loyalty built into every listing: Gold Card offers, birthday clubs, restaurant and retail rewards, service promotions, and future Platinum perks.",
      canonical: SITE.domain + "/loyalty"
    }
  };
}

/* ---------------- STATE PARTNERS ---------------- */
function pageStatePartners() {
  const openStates = STATES.filter(s => s.partnerOpen);
  const html = `
  ${Header("#/state-partners")}
  <div class="hero">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "State Partners"]])}
      <div class="eyebrow" style="margin-top:20px">Territory & Sales Opportunity</div>
      <h1>Bring Gold Card to Your State</h1>
      <p class="lede" style="margin-top:18px">U.S. Gold Card gives local sales partners a simple, repeatable offer: affordable business pages, local SEO, lead capture, offers, and done-for-you promotion.</p>
      <div class="btn-row" style="margin-top:28px">
        <a class="btn btn-gold" href="#partner-form" data-scroll>Apply to Launch a Gold Card Market</a>
        <a class="btn btn-outline-light" href="#/states">See Live State Networks</a>
      </div>
      <div class="hero-stat">
        <div><strong>${openStates.length}</strong><span>Open state territories</span></div>
        <div><strong>$65–$195</strong><span>Monthly plans you sell</span></div>
        <div><strong>Recurring</strong><span>Revenue model</span></div>
      </div>
    </div>
  </div>

  <section>
    <div class="wrap">
      <div class="section-head center">
        <div class="eyebrow">The Opportunity</div>
        <h2>Three ways to own a territory</h2>
      </div>
      <div class="grid grid-3">
        <div class="card step-card">
          <span class="icon-tile">🗺️</span>
          <h3>State Operator</h3>
          <p class="card-desc">Run an entire state Gold Card brand — like Utah Gold Card or Nebraska Gold Card. You own local sales, we run the platform, pages, SEO, and campaigns.</p>
          <div class="chip-row">${openStates.map(s => `<span class="chip gold">${s.name} open</span>`).join("")}</div>
        </div>
        <div class="card step-card">
          <span class="icon-tile">🏙️</span>
          <h3>City Partner</h3>
          <p class="card-desc">Own a city inside a live state — build the Omaha, Buffalo, or Boise directory street by street. Perfect for well-connected locals and chamber-of-commerce types.</p>
        </div>
        <div class="card step-card">
          <span class="icon-tile">🗂️</span>
          <h3>Category Specialist</h3>
          <p class="card-desc">Sell into one vertical you know — restaurants, salons, home services — across a state or region. Your industry credibility is the pitch.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="dark">
    <div class="wrap two-col">
      <div class="prose">
        <div class="eyebrow">Why It Sells</div>
        <h2 style="margin-bottom:14px">An offer small businesses instantly understand</h2>
        <p><strong>It's easy to explain:</strong> “We build you a search-friendly page for your business, put your offer in front of local customers, capture leads, and include you in local email campaigns. $65 to $195 a month. We do the work.”</p>
        <p><strong>It's easy to believe:</strong> you show them a live page — like Fajita Grill's — on your phone, in the parking lot, in ninety seconds.</p>
        <p><strong>It's easy to keep:</strong> the businesses get pages, leads, offers, and promotion every month. Retention is the product doing its job.</p>
      </div>
      <div class="prose">
        <div class="eyebrow">How Partners Sell It</div>
        <h2 style="margin-bottom:14px">The playbook, state by state</h2>
        <p><strong>1. Anchor businesses first.</strong> Sign the beloved local restaurant, the busiest salon, the trusted handyman. ${esc(SITE.copy.earlyMarket)}</p>
        <p><strong>2. Build the city page around them.</strong> Each anchor makes the city directory real — and gives you proof for the next pitch.</p>
        <p><strong>3. Let campaigns do the retention.</strong> Monthly emails featuring your accounts keep owners seeing value without you re-selling them.</p>
        <p><strong>4. Roll to the next city.</strong> The state brand compounds: Omaha proves Lincoln, Lincoln proves Grand Island.</p>
      </div>
    </div>
  </section>

  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Sample State Brands</div><h2>Your territory, your brand, our platform</h2></div>
      <div class="grid grid-2">${STATES.slice(0, 4).map(StateCard).join("")}</div>
    </div>
  </section>

  <section id="partner-form">
    <div class="wrap" style="max-width:760px">
      <div class="section-head center">
        <div class="eyebrow">Partner Inquiry</div>
        <h2>Apply to launch a Gold Card market</h2>
        <p class="lede" style="margin:10px auto 0">Tell us who you are and where you'd build. We respond to every serious inquiry.</p>
      </div>
      <div class="form-card" data-form-wrap>
        <form data-demo-form data-success="Application received! We'll reach out to talk through your market." class="form-grid">
          <div class="field"><label>Full name</label><input required placeholder="Your name"></div>
          <div class="field"><label>Email</label><input type="email" required placeholder="you@email.com"></div>
          <div class="field"><label>Phone</label><input placeholder="(555) 555-0100"></div>
          <div class="field"><label>Target state / territory</label>${StateSelector("partner-state", { placeholder: "Choose a state" })}</div>
          <div class="field"><label>Opportunity type</label>
            <select><option>State operator</option><option>City partner</option><option>Category specialist</option><option>Sales rep</option></select>
          </div>
          <div class="field"><label>Sales / local business experience</label>
            <select><option>Currently in local sales</option><option>Former business owner</option><option>Marketing / agency background</option><option>Strong local network</option><option>Other</option></select>
          </div>
          <div class="field full"><label>Tell us about your market and why you'd win it</label><textarea placeholder="The cities you know, the businesses you'd sign first, the network you bring…"></textarea></div>
          <div class="field full"><button class="btn btn-gold btn-block" type="submit">Apply to Launch a Gold Card Market</button></div>
        </form>
        <p class="form-note">Prototype demo — submissions are simulated.</p>
      </div>
    </div>
  </section>
  ${Footer()}`;

  return {
    html,
    seo: {
      title: "State Partners — Launch a Gold Card Market in Your State | U.S. Gold Card",
      description: "Sales reps, territory partners, and state operators: bring Gold Card to your state. A simple, repeatable local-business offer with recurring revenue. Open territories available.",
      canonical: SITE.domain + "/state-partners"
    }
  };
}

/* ---------------- JOIN ---------------- */
function pageJoin(params = {}) {
  const html = `
  ${Header("#/join")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "Join"]])}
      <div class="eyebrow" style="margin-top:20px">Get Listed</div>
      <h1>Request your U.S. Gold Card page</h1>
      <p class="lede" style="margin-top:16px">Ten minutes of your info. Then we build the pages, the SEO, the offer, and the placement — and you get back to business.</p>
    </div>
  </div>
  <section>
    <div class="wrap" style="display:grid;grid-template-columns:1.2fr .8fr;gap:34px" data-join-layout>
      <div class="form-card" data-form-wrap>
        <h3 style="margin-bottom:4px">Business owner application</h3>
        <p class="card-desc" style="margin-bottom:20px">No commitment yet — this starts the conversation and the build plan.</p>
        <form data-demo-form data-success="Request received! We'll review your business and reach out within one business day with your build plan." class="form-grid">
          <div class="field"><label>Business name *</label><input required placeholder="e.g. Fajita Grill"></div>
          <div class="field"><label>Owner name *</label><input required placeholder="Your name"></div>
          <div class="field"><label>Email *</label><input type="email" required placeholder="you@email.com"></div>
          <div class="field"><label>Phone *</label><input required placeholder="(555) 555-0100"></div>
          <div class="field"><label>State *</label>${StateSelector("join-state", { selected: params.state, placeholder: "Choose your state" })}</div>
          <div class="field"><label>City *</label><input required placeholder="e.g. Midvale"></div>
          <div class="field"><label>Business category *</label>${CategorySelector("join-cat", { placeholder: "Choose a category" })}</div>
          <div class="field"><label>Current website URL</label><input placeholder="https:// (leave blank if none)"></div>
          <div class="field"><label>Interested tier</label>
            <select id="join-tier">
              <option value="starter" ${params.tier === "starter" ? "selected" : ""}>Starter Gold Listing — $65/mo</option>
              <option value="gold" ${!params.tier || params.tier === "gold" ? "selected" : ""}>Gold Mini-Site — $95/mo (most popular)</option>
              <option value="premium" ${params.tier === "premium" ? "selected" : ""}>Premium Gold Mini-Site — $195/mo</option>
              <option value="platinum" ${params.tier === "platinum" ? "selected" : ""}>Platinum Upgrade — waitlist</option>
              <option value="custom-site" ${params.tier === "custom-site" ? "selected" : ""}>Custom Website — custom pricing</option>
              <option ${params.tier === "featured-ad" ? "selected" : ""}>Not sure — recommend for me</option>
            </select>
          </div>
          <div class="field"><label>Do you have photos?</label>
            <select><option>Yes, good photos</option><option>Some, could be better</option><option>No — need placeholder/shoot plan</option></select>
          </div>
          <div class="field"><label>Do you want offers?</label>
            <select><option>Yes — help me create one</option><option>Yes — I have one ready</option><option>Not right now</option></select>
          </div>
          <div class="field"><label>Email/SMS campaign inclusion?</label>
            <select><option>Yes, include my business</option><option>Tell me more first</option><option>Not right now</option></select>
          </div>
          <div class="field"><label>Want a custom website too?</label>
            <select><option>No — Gold Card pages are enough</option><option>Maybe — tell me about pricing</option><option>Yes — full custom site</option></select>
          </div>
          <div class="field full"><label>Notes</label><textarea placeholder="Anything we should know — busy seasons, current marketing, what's worked, what hasn't…"></textarea></div>
          <div class="field full"><button class="btn btn-gold btn-block" type="submit" style="font-size:16px;padding:16px">Request My U.S. Gold Card Page</button></div>
        </form>
        <p class="form-note">Prototype demo — submissions are simulated. In production this creates your onboarding record and checklist in the admin dashboard.</p>
      </div>
      <aside style="display:grid;gap:20px;align-content:start">
        <div class="card" style="padding:24px">
          <h3 style="font-size:17px;margin-bottom:12px">What happens next</h3>
          <ul class="feature-list">
            <li>We review your business and city</li>
            <li>You get a build plan and tier recommendation</li>
            <li>We write and build your pages (you approve)</li>
            <li>Your mini-site goes live in the directory</li>
            <li>Your offer enters the deals network</li>
            <li>You appear in your first campaign</li>
          </ul>
        </div>
        <div class="card" style="padding:24px;background:var(--charcoal);color:var(--paper);border-color:var(--line-dark)">
          <h3 style="font-size:17px;margin-bottom:10px;color:var(--gold-bright)">See what you're getting</h3>
          <p class="card-desc" style="color:var(--muted-dark);margin-bottom:14px">Open a live example mini-site — this is the product, built for a real restaurant.</p>
          <a class="btn btn-gold btn-sm btn-block" href="${bizUrl(findBusiness("fajita-grill"))}">View Fajita Grill's Mini-Site</a>
        </div>
        <div class="card" style="padding:24px">
          <h3 style="font-size:17px;margin-bottom:10px">Pricing at a glance</h3>
          <ul style="list-style:none;display:grid;gap:10px;font-size:14px">
            <li style="display:flex;justify-content:space-between"><span>Starter Gold Listing</span><strong>$65/mo</strong></li>
            <li style="display:flex;justify-content:space-between"><span>Gold Mini-Site</span><strong>$95/mo</strong></li>
            <li style="display:flex;justify-content:space-between"><span>Premium Gold Mini-Site</span><strong>$195/mo</strong></li>
            <li style="display:flex;justify-content:space-between"><span>Featured Placement Ad</span><strong>+$25/mo</strong></li>
            <li style="display:flex;justify-content:space-between"><span>Platinum / Custom site</span><strong>Custom</strong></li>
          </ul>
          <a class="card-link" href="#/pricing" style="display:inline-block;margin-top:12px">Full comparison →</a>
        </div>
      </aside>
    </div>
  </section>
  <style>@media (max-width: 900px) { [data-join-layout] { grid-template-columns: 1fr !important; } }</style>
  ${Footer()}`;

  return {
    html,
    seo: {
      title: "Get Listed — Request Your U.S. Gold Card Page | U.S. Gold Card",
      description: "Request your U.S. Gold Card business page: we build your listing, mini-site, local SEO, offer page, and campaign placement. Plans from $65/month.",
      canonical: SITE.domain + "/join"
    }
  };
}

/* ---------------- SITEMAP VIEW ---------------- */
function buildSitemapUrls() {
  const urls = [
    "/", "/states", "/cities", "/categories", "/directory", "/deals",
    "/business", "/pricing", "/seo", "/email-program", "/loyalty", "/state-partners", "/join"
  ];
  STATES.forEach(s => {
    urls.push(`/states/${s.slug}`);
    CATEGORIES.forEach(c => urls.push(`/states/${s.slug}/categories/${c.slug}`));
  });
  CITIES.forEach(c => {
    urls.push(`/states/${c.state}/cities/${c.slug}`);
    CATEGORIES.forEach(cat => urls.push(`/states/${c.state}/cities/${c.slug}/categories/${cat.slug}`));
  });
  BUSINESSES.forEach(b => {
    urls.push(bizPath(b), `${bizPath(b)}/offers`, `${bizPath(b)}/menu`);
  });
  return urls;
}

function pageSitemap() {
  const urls = buildSitemapUrls();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE.domain}${u}</loc></url>`).join("\n")}\n</urlset>`;
  const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/campaigns\n\nSitemap: ${SITE.domain}/sitemap.xml`;
  const html = `
  ${Header("")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "Sitemap & Indexing"]])}
      <div class="eyebrow" style="margin-top:20px">Indexing Logic</div>
      <h1>Sitemap &amp; robots — generated from real data</h1>
      <p class="lede" style="margin-top:16px">${urls.length} public URLs, generated live from the network's states, cities, categories, combination pages, and every business's three pages. Admin surfaces are excluded and noindexed.</p>
    </div>
  </div>
  <section>
    <div class="wrap two-col" style="align-items:start">
      <div>
        <h2 style="margin-bottom:14px">sitemap.xml <span class="badge badge-soft">${urls.length} URLs</span></h2>
        <div class="seo-panel"><pre style="max-height:520px;overflow:auto">${esc(xml)}</pre></div>
      </div>
      <div>
        <h2 style="margin-bottom:14px">robots.txt</h2>
        <div class="seo-panel"><pre>${esc(robots)}</pre></div>
        <div class="card" style="padding:22px;margin-top:20px">
          <h3 style="font-size:16px;margin-bottom:10px">Indexing rules</h3>
          <ul class="feature-list">
            <li>All public pages: indexable, self-canonical</li>
            <li>/admin — noindex, nofollow, robots-disallowed</li>
            <li>/admin/campaigns — noindex, nofollow, robots-disallowed</li>
            <li>Business pages never canonical to the homepage or state page</li>
            <li>Each of a business's three pages stands alone</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  ${Footer()}`;
  return {
    html,
    seo: {
      title: "Sitemap & Indexing Logic | U.S. Gold Card",
      description: "The U.S. Gold Card XML sitemap and robots.txt logic: every public state, city, category, and business page indexed; admin dashboards excluded.",
      canonical: SITE.domain + "/sitemap"
    }
  };
}

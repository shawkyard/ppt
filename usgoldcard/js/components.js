/* ============================================================
   U.S. GOLD CARD — Reusable Components
   Every component returns an HTML string; events are delegated
   or bound after render in app.js.
   ============================================================ */

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const NAV_LINKS = [
  ["#/directory", "Explore"],
  ["#/states", "States"],
  ["#/cities", "Cities"],
  ["#/categories", "Categories"],
  ["#/deals", "Deals"],
  ["#/business", "For Businesses"],
  ["#/pricing", "Pricing"],
  ["#/email-program", "Email Program"],
  ["#/seo", "SEO"],
  ["#/state-partners", "State Partners"],
  ["#/join", "Join"]
];

function Header(activePath) {
  return `
  <header class="site-header">
    <div class="wrap header-inner">
      <a href="#/" class="logo" aria-label="U.S. Gold Card home">
        <span class="logo-card"></span>
        <span class="logo-text">U.S. Gold Card<small>National Local Network</small></span>
      </a>
      <button class="nav-toggle" data-nav-toggle aria-label="Toggle menu">Menu ☰</button>
      <nav class="main-nav" data-nav aria-label="Main navigation">
        ${NAV_LINKS.map(([href, label]) => `<a href="${href}" class="${activePath === href ? "active" : ""}">${label}</a>`).join("")}
        <a href="#/join" class="btn btn-gold btn-sm header-cta">Get Listed</a>
      </nav>
    </div>
  </header>`;
}

function Footer() {
  const liveStates = STATES.filter(s => s.live);
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <a href="#/" class="logo" style="margin-bottom:14px">
            <span class="logo-card"></span>
            <span class="logo-text" style="color:var(--paper)">U.S. Gold Card<small>National Local Network</small></span>
          </a>
          <p style="font-size:13.5px;max-width:280px">One national network of state Gold Card brands. Every business gets its own SEO-built local page. Every listing makes the network stronger.</p>
          <div class="btn-row" style="margin-top:16px">
            <a class="btn btn-gold btn-sm" href="#/join">Get Listed</a>
            <a class="btn btn-outline-light btn-sm" href="#/deals">Explore Deals</a>
          </div>
        </div>
        <div>
          <h4>Discover</h4>
          <ul>
            <li><a href="#/directory">Business Directory</a></li>
            <li><a href="#/states">States</a></li>
            <li><a href="#/cities">Cities</a></li>
            <li><a href="#/categories">Categories</a></li>
            <li><a href="#/deals">Local Deals</a></li>
            <li><a href="#/loyalty">Gold Card Loyalty</a></li>
          </ul>
        </div>
        <div>
          <h4>State Networks</h4>
          <ul>
            ${liveStates.map(s => `<li><a href="#/states/${s.slug}">${s.brand}</a></li>`).join("")}
            <li><a href="#/states">All states →</a></li>
          </ul>
        </div>
        <div>
          <h4>For Businesses</h4>
          <ul>
            <li><a href="#/business">Why Gold Card</a></li>
            <li><a href="#/pricing">Pricing</a></li>
            <li><a href="#/seo">Page-Level SEO</a></li>
            <li><a href="#/email-program">Email Program</a></li>
            <li><a href="#/join">Get Listed</a></li>
          </ul>
        </div>
        <div>
          <h4>Network</h4>
          <ul>
            <li><a href="#/state-partners">State Partners</a></li>
            <li><a href="#/state-partners">Launch a Market</a></li>
            <li><a href="#/sitemap">Sitemap</a></li>
            <li><a href="#/admin">Admin Demo</a></li>
            <li><a href="#/admin/campaigns">Campaigns Demo</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} U.S. Gold Card. All rights reserved. Prototype — sample data for demonstration.</span>
        <span>usgoldcard.com · state brands: utahgoldcard.com, nebraskagoldcard.com, and more</span>
      </div>
    </div>
  </footer>`;
}

/* Photo placeholder */
function Photo(image, opts = {}) {
  const badges = (opts.badges || []).join("");
  return `
  <div class="ph ${opts.cls || ""}" style="--h:${image.hue ?? 40}" role="img" aria-label="${esc(opts.alt || image.label || "")}">
    ${badges}
    <span class="ph-emoji">${image.emoji || "🏪"}</span>
    <span class="ph-label">${esc(image.label || "Photo placeholder")}</span>
  </div>`;
}

function tierBadge(tier) {
  if (tier === "premium") return `<span class="badge badge-premium">★ Premium</span>`;
  if (tier === "platinum") return `<span class="badge badge-platinum">Platinum</span>`;
  if (tier === "gold") return `<span class="badge badge-gold">Gold</span>`;
  return `<span class="badge badge-soft">Gold Starter</span>`;
}

/* BusinessCard */
function BusinessCard(b, opts = {}) {
  const st = findState(b.state), ct = findCity(b.city), cat = findCategory(b.category);
  const badges = [tierBadge(b.tier)];
  if (b.featured) badges.push(`<span class="badge badge-outline" style="background:var(--paper)">Featured</span>`);
  return `
  <a class="card fade-in" href="${bizUrl(b)}">
    ${Photo(b.image, { badges, alt: b.seo.imageAltText })}
    <div class="card-body">
      <h3>${esc(b.name)}</h3>
      <div class="card-meta">${cat.icon} ${esc(b.subcategory)}</div>
      <div class="card-meta">📍 ${ct.name}, ${st.abbrev}</div>
      <p class="card-desc">${esc(b.shortDescription)}</p>
      ${b.offer && !opts.hideOffer ? `<div class="chip-row"><span class="chip gold">🏷 ${esc(b.offer.title)}</span></div>` : ""}
      <div class="card-foot">
        <span class="card-link">View mini-site →</span>
        <span class="card-meta">${st.brand}</span>
      </div>
    </div>
  </a>`;
}

/* StateCard */
function StateCard(s) {
  const cities = s.featuredCities.map(findCity).filter(Boolean);
  const cats = s.featuredCategories.map(findCategory).filter(Boolean);
  return `
  <div class="card state-card hoverable fade-in">
    <a href="#/states/${s.slug}">
      <div class="ph" style="--h:${44 + (s.slug.length * 17) % 200}">
        ${s.live ? `<span class="badge badge-gold">Live Network</span>` : `<span class="badge badge-muted">Launching</span>`}
        <span class="state-flag">${esc(s.brand)}</span>
        <span class="ph-label">${s.live ? `${s.businessCount} businesses & growing` : "Founding spots open"}</span>
      </div>
    </a>
    <div class="card-body">
      <h3><a href="#/states/${s.slug}">${esc(s.brand)}</a></h3>
      <p class="card-desc">${esc(s.heroBlurb)}</p>
      ${cities.length ? `<div class="card-meta">Cities: ${cities.map(c => `<a class="chip" href="#/states/${s.slug}/cities/${c.slug}">${c.name}</a>`).join(" ")}</div>` : ""}
      ${cats.length ? `<div class="card-meta">Popular: ${cats.map(c => `<a class="chip" href="#/states/${s.slug}/categories/${c.slug}">${c.icon} ${c.name}</a>`).join(" ")}</div>` : ""}
      <div class="card-foot">
        <a class="btn btn-dark btn-sm" href="#/states/${s.slug}">Explore ${s.name} Gold Card</a>
        <a class="btn btn-outline btn-sm" href="#/state-partners">Become a Partner</a>
      </div>
    </div>
  </div>`;
}

/* CityCard */
function CityCard(c) {
  const s = findState(c.state);
  const count = bizIn({ city: c.slug }).length;
  return `
  <a class="card fade-in" href="#/states/${s.slug}/cities/${c.slug}">
    <div class="ph" style="--h:${30 + (c.slug.length * 31) % 210};aspect-ratio:16/8">
      ${c.live ? `<span class="badge badge-gold">${count} listed</span>` : `<span class="badge badge-muted">Opening soon</span>`}
      <span class="state-flag" style="font-size:26px">${esc(c.name)}</span>
      <span class="ph-label">${s.brand}</span>
    </div>
    <div class="card-body">
      <p class="card-desc">${esc(c.blurb)}</p>
      <div class="card-foot"><span class="card-link">Explore ${esc(c.name)} →</span></div>
    </div>
  </a>`;
}

/* CategoryCard */
function CategoryCard(cat, opts = {}) {
  const count = bizIn({ category: cat.slug, state: opts.state, city: opts.city }).length;
  const href = opts.state ? `#/states/${opts.state}/categories/${cat.slug}` : `#/categories/${cat.slug}`;
  return `
  <a class="card fade-in" href="${href}">
    <div class="card-body" style="flex-direction:row;align-items:center;gap:16px">
      <span class="icon-tile">${cat.icon}</span>
      <div style="flex:1">
        <h3 style="font-size:17px">${esc(cat.name)}</h3>
        <div class="card-meta">${count} listed${opts.state ? ` in ${findState(opts.state).name}` : " nationwide"}</div>
      </div>
      <span class="card-link">→</span>
    </div>
  </a>`;
}

/* DealCard */
function DealCard(b) {
  const st = findState(b.state), ct = findCity(b.city);
  return `
  <div class="card deal-card hoverable fade-in">
    <div class="card-body">
      <div class="chip-row">
        <span class="badge badge-gold">${esc(b.offer.tag)}</span>
        ${tierBadge(b.tier)}
      </div>
      <div class="deal-title">${esc(b.offer.title)}</div>
      <p class="card-desc">${esc(b.offer.details)}</p>
      <div class="card-meta">🏪 <a href="${bizUrl(b)}" style="font-weight:700;color:var(--gold-deep)">${esc(b.name)}</a> · ${ct.name}, ${st.abbrev}</div>
      <div class="card-foot">
        <a class="btn btn-dark btn-sm" href="${bizUrl(b)}/offers">Claim This Offer</a>
        <span class="card-meta">${st.brand}</span>
      </div>
    </div>
  </div>`;
}

/* PricingCard */
function PricingCard(t, opts = {}) {
  return `
  <div class="card pricing-card hoverable fade-in ${t.popular ? "popular" : ""}">
    ${t.popular ? `<div class="popular-flag">Most Popular</div>` : ""}
    <div class="card-body">
      <span class="badge ${t.badge === "PREMIUM" ? "badge-premium" : t.badge === "PLATINUM" ? "badge-platinum" : t.badge === "ADD-ON" ? "badge-outline" : t.badge === "CUSTOM" ? "badge-dark" : "badge-gold"}" style="align-self:flex-start">${t.badge}${t.future ? " · Future Tier" : ""}</span>
      <h3 style="margin-top:6px">${esc(t.name)}</h3>
      <div class="price-line"><span class="amount">${t.price}</span><span class="period">${t.period}</span></div>
      <div class="card-meta" style="font-weight:600">Best for: ${esc(t.bestFor)}</div>
      <ul class="feature-list">${(opts.compact ? t.features.slice(0, 6) : t.features).map(f => `<li>${esc(f)}</li>`).join("")}</ul>
      ${opts.compact && t.features.length > 6 ? `<div class="card-meta">+ ${t.features.length - 6} more — <a href="#/pricing" style="color:var(--gold-deep);font-weight:700">see full pricing</a></div>` : ""}
      <div class="card-foot">
        <a class="btn ${t.popular ? "btn-gold" : "btn-outline"} btn-block" href="#/join?tier=${t.id}">${t.future ? "Join the Platinum Waitlist" : t.addon ? "Add Featured Placement" : t.price === "Custom" ? "Request a Quote" : "Get Started"}</a>
      </div>
    </div>
  </div>`;
}

/* ComparisonTable */
function ComparisonTable() {
  const cell = v => v === true ? `<span class="yes">✓</span>` : v === false ? `<span class="no">—</span>` : `<span class="note">${esc(v)}</span>`;
  return `
  <div class="table-scroll">
    <table class="compare">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Starter Gold<br><small>$65/mo</small></th>
          <th>Gold Mini-Site<br><small>$95/mo</small></th>
          <th>Premium Gold<br><small>$195/mo</small></th>
          <th>Platinum<br><small>Future / Custom</small></th>
        </tr>
      </thead>
      <tbody>
        ${COMPARISON.map(r => `<tr><td>${r[0]}</td><td>${cell(r[1])}</td><td>${cell(r[2])}</td><td>${cell(r[3])}</td><td>${cell(r[4])}</td></tr>`).join("")}
      </tbody>
    </table>
  </div>`;
}

/* LeadCaptureForm — generic lead form used on business pages */
function LeadCaptureForm(b, opts = {}) {
  return `
  <div class="form-card" data-form-wrap>
    <h3 style="margin-bottom:4px">${esc(opts.title || `Contact ${b ? b.name : "this business"}`)}</h3>
    <p class="card-desc" style="margin-bottom:18px">${esc(opts.sub || "Send a message and get a reply directly from the business. Your info is never sold.")}</p>
    <form data-demo-form class="form-grid">
      <div class="field"><label>Your name</label><input required placeholder="Jane Smith"></div>
      <div class="field"><label>Phone or email</label><input required placeholder="(555) 555-0100"></div>
      <div class="field full"><label>What do you need?</label><textarea placeholder="${esc(opts.placeholder || "Tell us about your request — party size, project, date, or question…")}"></textarea></div>
      <div class="field full"><button class="btn btn-gold btn-block" type="submit">${esc(opts.cta || "Send My Request")}</button></div>
    </form>
    <p class="form-note">Prototype demo — submissions are simulated. In production this lead is delivered to the business instantly and tracked in their Gold Card report.</p>
  </div>`;
}

/* Email capture strip */
function EmailCapture(opts = {}) {
  return `
  <div data-form-wrap>
    <form data-demo-form data-success="${esc(opts.success || "You're on the list! Watch for local picks and deals.")}" class="email-capture">
      <input type="email" required placeholder="${esc(opts.placeholder || "Your email — get local deals & hidden gems")}">
      <button class="btn btn-gold" type="submit">${esc(opts.cta || "Join Free")}</button>
    </form>
  </div>`;
}

/* BusinessOwnerCTA band */
function BusinessOwnerCTA(opts = {}) {
  return `
  <section>
    <div class="wrap">
      <div class="cta-band">
        <div>
          <div class="eyebrow on-dark" style="color:var(--gold-bright)">For Business Owners</div>
          <h2>${esc(opts.title || "Own a local business? Get your own SEO-built Gold Card page.")}</h2>
          <p>${esc(opts.sub || "We build your listing, your local SEO page, your offer page, and your promotion engine. You focus on running the business. Plans from $65/month.")}</p>
        </div>
        <div class="btn-row">
          <a class="btn btn-gold" href="#/join">Get Listed</a>
          <a class="btn btn-outline-light" href="#/pricing">See Pricing</a>
        </div>
      </div>
    </div>
  </section>`;
}

/* StatePartnerCTA */
function StatePartnerCTA(stateName) {
  return `
  <div class="cta-band" style="margin-top:26px">
    <div>
      <div class="eyebrow on-dark" style="color:var(--gold-bright)">State Partner Opportunity</div>
      <h2>${stateName ? `Help run ${esc(stateName)} Gold Card` : "Bring Gold Card to your state"}</h2>
      <p>Sales reps and territory operators earn recurring revenue selling a simple, repeatable offer local businesses actually understand: a page, local SEO, leads, offers, and done-for-you promotion.</p>
    </div>
    <div class="btn-row">
      <a class="btn btn-gold" href="#/state-partners">Apply to Launch a Market</a>
    </div>
  </div>`;
}

/* FAQAccordion */
function FAQAccordion(faqs, opts = {}) {
  if (!faqs || !faqs.length) return "";
  return `
  <div class="faq">
    ${faqs.map(f => `<details${opts.openFirst && faqs.indexOf(f) === 0 ? " open" : ""}><summary>${esc(f.q)}</summary><div class="faq-a">${esc(f.a)}</div></details>`).join("")}
  </div>`;
}

/* Breadcrumbs — array of [href|null, label] */
function Breadcrumbs(items) {
  return `
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    ${items.map(([href, label], i) => {
      const link = href ? `<a href="${href}">${esc(label)}</a>` : `<span>${esc(label)}</span>`;
      return i ? `<span class="sep">›</span>${link}` : link;
    }).join("")}
  </nav>`;
}

/* BusinessMiniSiteHero */
function BusinessMiniSiteHero(b, page) {
  const st = findState(b.state), ct = findCity(b.city), cat = findCategory(b.category);
  const seoPage = page === "offers" ? b.seo.offers : page === "menu" ? b.seo.menu : b.seo;
  const base = bizUrl(b);
  return `
  <div class="hero compact minisite-hero">
    <div class="wrap">
      ${Breadcrumbs([
        ["#/", "Home"], ["#/states", "States"], [`#/states/${st.slug}`, st.brand],
        [`#/states/${st.slug}/cities/${ct.slug}`, ct.name],
        [`#/states/${st.slug}/cities/${ct.slug}/categories/${cat.slug}`, cat.name],
        page ? [base, b.name] : [null, b.name],
        ...(page ? [[null, page === "offers" ? "Offers" : b.menuLabel]] : [])
      ])}
      <div class="minisite-grid" style="margin-top:26px">
        <div>
          <div class="chip-row" style="margin-bottom:14px">
            ${tierBadge(b.tier)}
            ${b.featured ? `<span class="badge badge-outline" style="border-color:var(--gold-bright);color:var(--gold-bright);background:transparent">Featured on ${st.brand}</span>` : ""}
          </div>
          <h1>${esc(seoPage.h1)}</h1>
          <p class="lede" style="margin-top:14px">${esc(page ? seoPage.intro : b.shortDescription)}</p>
          <div class="minisite-tabs">
            <a href="${base}" class="${!page ? "active" : ""}">Business Page</a>
            <a href="${base}/offers" class="${page === "offers" ? "active" : ""}">Offers & Deals</a>
            <a href="${base}/menu" class="${page === "menu" ? "active" : ""}">${esc(b.menuLabel)}</a>
          </div>
          <div class="btn-row" style="margin-top:24px">
            <a class="btn btn-gold" href="tel:${b.phone.replace(/[^0-9]/g, "")}">📞 Call ${esc(b.phone)}</a>
            <a class="btn btn-outline-light" href="#" data-demo-alert="In production this opens turn-by-turn directions to ${esc(b.address)}.">🧭 Directions</a>
          </div>
        </div>
        ${Photo(b.image, { cls: "tall", alt: b.seo.imageAltText, badges: [b.featured ? `<span class="badge badge-gold">Featured</span>` : ""] })}
      </div>
    </div>
  </div>`;
}

/* OfferSignupSection — offer banner + email/birthday capture */
function OfferSignupSection(b) {
  return `
  <div class="grid grid-2">
    <div class="offer-banner">
      <h3>${esc(b.offer.title)}</h3>
      <p>${esc(b.offer.details)}</p>
      ${b.offer.secondary ? `<p style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(201,162,39,.3)"><strong style="color:var(--gold-bright)">Also running:</strong> ${esc(b.offer.secondary)}</p>` : ""}
      <div class="btn-row" style="margin-top:18px">
        <a class="btn btn-gold btn-sm" href="${bizUrl(b)}/offers">View Offer Page</a>
      </div>
    </div>
    <div class="form-card" data-form-wrap>
      <h3 style="margin-bottom:4px">Never miss a ${esc(b.name)} offer</h3>
      <p class="card-desc" style="margin-bottom:16px">Join the list for new offers — and add your birthday for birthday-club perks across the whole Gold Card network.</p>
      <form data-demo-form data-success="You're in! Offers from ${esc(b.name)} and local picks are on the way." class="form-grid">
        <div class="field full"><label>Email</label><input type="email" required placeholder="you@email.com"></div>
        <div class="field"><label>Birthday month (optional)</label>
          <select><option value="">Select month</option>${["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => `<option>${m}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Mobile for SMS (optional)</label><input placeholder="(555) 555-0100"></div>
        <div class="field full"><button class="btn btn-dark btn-block" type="submit">Join the Offer List</button></div>
      </form>
    </div>
  </div>`;
}

/* GalleryGrid */
function GalleryGrid(b) {
  return `
  <div class="gallery-grid">
    ${b.gallery.map((g, i) => `
      <div class="ph" style="--h:${(b.image.hue + i * 23) % 360}" role="img" aria-label="${esc(g.alt)}">
        <span class="ph-emoji" style="font-size:34px">${b.image.emoji}</span>
        <span class="ph-label">${esc(g.label)}</span>
      </div>`).join("")}
  </div>`;
}

/* SEOExplainerSection — the "view page SEO" panel on business pages */
function SEOExplainerSection(b, page) {
  const s = page === "offers" ? b.seo.offers : page === "menu" ? b.seo.menu : b.seo;
  const canonical = b.seo.canonicalUrl + (page ? `/${page === "menu" ? "menu" : "offers"}` : "");
  const jsonld = buildJsonLd(b, page);
  return `
  <div class="seo-panel">
    <h3>🔍 Under the Hood: This Page's Unique SEO Build</h3>
    <p style="color:rgba(250,246,238,.7);font-size:13.5px;margin-top:6px">Every paid Gold Card page ships with its own metadata, canonical URL, internal links, and JSON-LD structured data — this is the actual data for this page, not a template.</p>
    <div class="seo-kv">
      <div class="kv"><b>SEO title</b><span>${esc(s.title)}</span></div>
      <div class="kv"><b>Meta description</b><span>${esc(s.description)}</span></div>
      <div class="kv"><b>H1</b><span>${esc(s.h1)}</span></div>
      <div class="kv"><b>Canonical URL</b><span>${esc(canonical)}</span></div>
      ${!page ? `
      <div class="kv"><b>Open Graph title</b><span>${esc(b.seo.ogTitle)}</span></div>
      <div class="kv"><b>Open Graph description</b><span>${esc(b.seo.ogDescription)}</span></div>
      <div class="kv"><b>Image alt text</b><span>${esc(b.seo.imageAltText)}</span></div>
      <div class="kv"><b>Schema type</b><span>${esc(b.seo.schemaType)}</span></div>
      <div class="kv"><b>Primary search intent</b><span>${esc(b.seo.primarySearchIntent)}</span></div>
      <div class="kv"><b>Secondary intents</b><span>${b.seo.secondarySearchIntents.map(esc).join(" · ")}</span></div>
      <div class="kv"><b>Local keywords</b><span>${b.seo.localKeywords.map(esc).join(" · ")}</span></div>` : ""}
    </div>
    <details style="margin-top:14px"><summary style="cursor:pointer;color:var(--gold-bright);font-weight:700;font-size:13.5px">View JSON-LD structured data</summary>
      <pre>${esc(JSON.stringify(jsonld, null, 2))}</pre>
    </details>
  </div>`;
}

/* JSON-LD builder — specific schema types, no fake reviews/ratings */
function buildJsonLd(b, page) {
  const st = findState(b.state), ct = findCity(b.city);
  const base = SITE.domain + bizPath(b);
  const data = {
    "@context": "https://schema.org",
    "@type": b.seo.schemaType,
    "name": b.name,
    "description": b.shortDescription,
    "url": page === "offers" ? `${base}/offers` : page === "menu" ? `${base}/menu` : base,
    "telephone": b.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": b.address.split(",")[0],
      "addressLocality": ct.name,
      "addressRegion": st.abbrev,
      "addressCountry": "US"
    },
    "openingHours": b.hours,
    "image": `${SITE.domain}/images/${b.slug}-hero.jpg`,
    "priceRange": b.tier === "premium" ? "$$" : "$",
    "areaServed": `${ct.name}, ${st.name}`,
    "sameAs": b.website ? [`https://${b.website}`] : []
  };
  if (b.seo.schemaType === "Restaurant") {
    data.servesCuisine = b.subcategory.split("·").map(x => x.trim()).slice(0, 3);
    data.hasMenu = `${base}/menu`;
  }
  if (b.offer) {
    data.makesOffer = {
      "@type": "Offer",
      "name": b.offer.title,
      "description": b.offer.details,
      "url": `${base}/offers`
    };
  }
  return data;
}

/* RotatingSpotlightSection — homepage rotation demo */
function RotatingSpotlightSection() {
  const pool = BUSINESSES.filter(b => b.homepageRotation);
  return `
  <section class="dark">
    <div class="wrap">
      <div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;max-width:none">
        <div>
          <div class="eyebrow">Homepage Rotation</div>
          <h2>Tonight's Gold Card Spotlight</h2>
          <p class="lede">Gold and Premium members rotate through featured slots across the network — this one changes on every visit.</p>
        </div>
        <button class="btn btn-outline-light btn-sm" data-rotate-spotlight>↻ Rotate Spotlight</button>
      </div>
      <div data-spotlight-slot class="grid grid-3">
        ${pool.slice(0, 3).map(b => BusinessCard(b)).join("")}
      </div>
    </div>
  </section>`;
}

/* EmailProgramSection — shared explainer band */
function EmailProgramSection(opts = {}) {
  return `
  <section class="alt">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow">The Shared Audience</div>
        <h2>${esc(opts.title || "One audience, built for every business on the network")}</h2>
        <div class="prose" style="margin-top:14px">
          <p>${esc(SITE.copy.emailProgram)}</p>
          <p><strong>Customers win too:</strong> local deals, new openings, events, and featured picks — curated by city, state, and category, never spammy.</p>
        </div>
        <a class="btn btn-dark" href="#/email-program" style="margin-top:8px">How the Email Program Works</a>
      </div>
      <div class="card" style="padding:26px">
        <h3 style="margin-bottom:14px">📬 Recent & upcoming campaigns</h3>
        <ul class="feature-list">
          <li>Best Mexican Food This Weekend — Utah</li>
          <li>Omaha Local Deals</li>
          <li>Utah Family Dinner Picks</li>
          <li>New York Local Shops</li>
          <li>Birthday Club Offers — July</li>
          <li>Catering for Office Lunches</li>
          <li>Hidden Gems Near You</li>
        </ul>
        <div style="margin-top:18px">${EmailCapture({ placeholder: "Your email — join 20,000+ local subscribers" })}</div>
      </div>
    </div>
  </section>`;
}

/* LoyaltyOfferCard */
function LoyaltyOfferCard(icon, title, desc, meta) {
  return `
  <div class="card hoverable fade-in">
    <div class="card-body">
      <span class="icon-tile">${icon}</span>
      <h3 style="font-size:18px;margin-top:8px">${esc(title)}</h3>
      <p class="card-desc">${esc(desc)}</p>
      ${meta ? `<div class="card-foot"><span class="badge badge-soft">${esc(meta)}</span></div>` : ""}
    </div>
  </div>`;
}

/* AdminStatCard */
function AdminStatCard(label, value, delta) {
  return `
  <div class="stat-card">
    <div class="label">${esc(label)}</div>
    <div class="value">${esc(value)}</div>
    ${delta ? `<div class="delta">${esc(delta)}</div>` : ""}
  </div>`;
}

/* CampaignCard */
function CampaignCard(c) {
  const statusBadge = c.status === "sent" ? `<span class="badge badge-live">Sent</span>`
    : c.status === "scheduled" ? `<span class="badge badge-gold">Scheduled</span>`
    : `<span class="badge badge-muted">Draft</span>`;
  return `
  <div class="admin-panel" style="margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">
      <div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <strong style="font-size:15px">${esc(c.name)}</strong>
          ${statusBadge}
          <span class="badge badge-outline" style="background:transparent">${esc(c.scope)}</span>
        </div>
        <div style="color:var(--muted-dark);font-size:12.5px;margin-top:6px">
          📅 ${esc(c.date)} · 👥 ${esc(c.segmentLabel)} · 🏪 ${c.businesses.map(s => { const b = findBusiness(s); return b ? `<a href="${bizUrl(b)}" style="color:var(--gold-bright)">${esc(b.name)}</a>` : ""; }).join(", ")}
        </div>
      </div>
      <div style="display:flex;gap:22px;font-size:12px;color:var(--muted-dark);text-align:center">
        <div><div style="font-family:var(--font-display);font-size:20px;color:var(--gold-bright)">${c.openRate}</div>Open rate</div>
        <div><div style="font-family:var(--font-display);font-size:20px;color:var(--gold-bright)">${c.clicks}</div>Clicks</div>
      </div>
    </div>
  </div>`;
}

/* BusinessOnboardingChecklist */
function BusinessOnboardingChecklist(slug) {
  const meta = ADMIN_META[slug];
  if (!meta) return "";
  return `
  <ul class="checklist">
    ${CHECKLIST_STEPS.map((step, i) => `<li class="${meta.checklist[i] ? "done" : ""}"><span class="box">${meta.checklist[i] ? "✓" : ""}</span>${esc(step)}</li>`).join("")}
  </ul>`;
}

/* Selector helpers for hero search */
function StateSelector(id, opts = {}) {
  return `
  <select id="${id}" aria-label="Select state">
    <option value="">${opts.placeholder || "All states"}</option>
    ${STATES.filter(s => !opts.liveOnly || s.live).map(s => `<option value="${s.slug}" ${opts.selected === s.slug ? "selected" : ""}>${s.name}</option>`).join("")}
  </select>`;
}
function CitySelector(id, opts = {}) {
  const cities = opts.state ? citiesIn(opts.state) : CITIES;
  return `
  <select id="${id}" aria-label="Select city">
    <option value="">${opts.placeholder || "All cities"}</option>
    ${cities.map(c => `<option value="${c.slug}" ${opts.selected === c.slug ? "selected" : ""}>${c.name}, ${findState(c.state).abbrev}</option>`).join("")}
  </select>`;
}
function CategorySelector(id, opts = {}) {
  return `
  <select id="${id}" aria-label="Select category">
    <option value="">${opts.placeholder || "All categories"}</option>
    ${CATEGORIES.map(c => `<option value="${c.slug}" ${opts.selected === c.slug ? "selected" : ""}>${c.icon} ${c.name}</option>`).join("")}
  </select>`;
}

/* NationalHeroSearch */
function NationalHeroSearch() {
  return `
  <form class="search-bar" data-hero-search>
    <input id="hero-q" placeholder="Search businesses, cuisines, services… (try “fajitas”)" aria-label="Search">
    ${StateSelector("hero-state")}
    ${CategorySelector("hero-cat")}
    <button class="btn btn-gold" type="submit">Search</button>
  </form>`;
}

/* DirectoryFilters */
function DirectoryFilters(f = {}) {
  return `
  <div class="filter-bar" data-directory-filters>
    <input id="dir-q" placeholder="Search by name, tag, or service…" value="${esc(f.q || "")}">
    ${StateSelector("dir-state", { selected: f.state })}
    ${CitySelector("dir-city", { selected: f.city })}
    ${CategorySelector("dir-cat", { selected: f.category })}
    <select id="dir-deals" aria-label="Deals filter">
      <option value="">Deals: all</option>
      <option value="1" ${f.deals ? "selected" : ""}>Has active offer</option>
    </select>
    <select id="dir-sort" aria-label="Sort">
      <option value="featured">Sort: Featured</option>
      <option value="newest" ${f.sort === "newest" ? "selected" : ""}>Newest</option>
      <option value="deals" ${f.sort === "deals" ? "selected" : ""}>Deals</option>
      <option value="popular" ${f.sort === "popular" ? "selected" : ""}>Most popular</option>
      <option value="restaurants" ${f.sort === "restaurants" ? "selected" : ""}>Restaurants</option>
      <option value="local-shops" ${f.sort === "local-shops" ? "selected" : ""}>Local shops</option>
      <option value="services" ${f.sort === "services" ? "selected" : ""}>Services</option>
    </select>
  </div>`;
}

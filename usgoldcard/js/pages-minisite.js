/* ============================================================
   U.S. GOLD CARD — Business Mini-Site Pages (3 per business)
   /:state/:city/:slug          — main business page
   /:state/:city/:slug/offers   — offers & lead-capture page
   /:state/:city/:slug/menu     — menu / services / showcase page
   ============================================================ */

function relatedBlocks(b) {
  const st = findState(b.state), ct = findCity(b.city), cat = findCategory(b.category);
  const relatedBiz = BUSINESSES.filter(x => x.slug !== b.slug && (x.city === b.city || (x.category === b.category && x.state === b.state))).slice(0, 3);
  const moreBiz = relatedBiz.length ? relatedBiz : BUSINESSES.filter(x => x.slug !== b.slug && x.category === b.category).slice(0, 3);
  const nearby = b.seo.nearbyCities.map(findCity).filter(Boolean);
  const relCats = b.seo.relatedCategories.map(findCategory).filter(Boolean);
  return `
  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Keep Exploring</div><h2>More on the ${esc(st.brand)} network</h2></div>
      ${moreBiz.length ? `<div class="grid grid-3">${moreBiz.map(x => BusinessCard(x)).join("")}</div>` : ""}
      <div class="two-col" style="margin-top:34px;align-items:start">
        <div>
          <h3 style="margin-bottom:14px">Nearby cities</h3>
          <div class="grid" style="gap:14px">${nearby.slice(0, 2).map(CityCard).join("")}</div>
        </div>
        <div>
          <h3 style="margin-bottom:14px">Browse related</h3>
          <div class="grid" style="gap:14px">
            ${relCats.map(r => CategoryCard(r, { state: st.slug })).join("")}
            <a class="card fade-in" href="#/deals"><div class="card-body" style="flex-direction:row;align-items:center;gap:16px">
              <span class="icon-tile">🏷️</span><div style="flex:1"><h3 style="font-size:17px">All local deals</h3>
              <div class="card-meta">Offers across the network</div></div><span class="card-link">→</span></div></a>
            <a class="card fade-in" href="#/join"><div class="card-body" style="flex-direction:row;align-items:center;gap:16px">
              <span class="icon-tile">➕</span><div style="flex:1"><h3 style="font-size:17px">List your business</h3>
              <div class="card-meta">Get a page like this one</div></div><span class="card-link">→</span></div></a>
          </div>
        </div>
      </div>
      <div class="chip-row" style="margin-top:30px">
        <a class="chip gold" href="#/states/${st.slug}">${st.brand}</a>
        <a class="chip gold" href="#/states/${st.slug}/cities/${ct.slug}">${ct.name} directory</a>
        <a class="chip gold" href="#/categories/${cat.slug}">${cat.name} nationwide</a>
        <a class="chip gold" href="#/states/${st.slug}/categories/${cat.slug}">${cat.name} in ${st.name}</a>
        <a class="chip gold" href="#/states/${st.slug}/cities/${ct.slug}/categories/${cat.slug}">${cat.name} in ${ct.name}</a>
      </div>
    </div>
  </section>`;
}

function infoPanel(b) {
  const st = findState(b.state), ct = findCity(b.city), cat = findCategory(b.category);
  return `
  <div class="info-panel">
    <h3>Visit ${esc(b.name)}</h3>
    <div class="info-row"><span class="ico">📍</span><span>${esc(b.address)}</span></div>
    <div class="info-row"><span class="ico">📞</span><a href="tel:${b.phone.replace(/[^0-9]/g, "")}">${esc(b.phone)} — tap to call</a></div>
    ${b.website ? `<div class="info-row"><span class="ico">🌐</span><a href="#" data-demo-alert="Demo: would open ${esc(b.website)}">${esc(b.website)}</a></div>` : ""}
    <div class="info-row"><span class="ico">🗂️</span><span>${cat.icon} <a href="#/states/${st.slug}/cities/${ct.slug}/categories/${cat.slug}">${esc(cat.name)} in ${esc(ct.name)}</a></span></div>
    <div class="info-row"><span class="ico">🕒</span><div>${b.hours.map(h => `<div>${esc(h)}</div>`).join("")}</div></div>
    <div class="btn-row" style="margin-top:16px">
      <a class="btn btn-gold btn-sm" href="tel:${b.phone.replace(/[^0-9]/g, "")}">Call Now</a>
      <a class="btn btn-outline-light btn-sm" href="#" data-demo-alert="In production this opens turn-by-turn directions to ${esc(b.address)}.">Get Directions</a>
    </div>
  </div>`;
}

/* ---------------- MAIN BUSINESS PAGE ---------------- */
function pageBusinessProfile(b) {
  const st = findState(b.state), ct = findCity(b.city), cat = findCategory(b.category);
  const html = `
  ${Header("")}
  ${BusinessMiniSiteHero(b, null)}

  <section style="padding-top:50px">
    <div class="wrap minisite-grid">
      <div class="prose">
        <div class="eyebrow">About ${esc(b.name)}</div>
        <h2 style="margin-bottom:14px">The local story</h2>
        <p>${esc(b.longDescription)}</p>
        <h3 style="margin:22px 0 12px">Why locals pick ${esc(b.name)}</h3>
        <ul class="feature-list">${b.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>
        <div class="tag-cloud" style="margin-top:20px">${b.tags.map(t => `<span class="chip gold">${esc(t)}</span>`).join("")}</div>
      </div>
      ${infoPanel(b)}
    </div>
  </section>

  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Current Offer</div><h2>The Gold Card deal at ${esc(b.name)}</h2></div>
      ${OfferSignupSection(b)}
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px;max-width:none">
        <div><div class="eyebrow">Gallery</div><h2>Inside ${esc(b.name)}</h2></div>
        <a class="btn btn-outline btn-sm" href="${bizUrl(b)}/menu">Full ${esc(b.menuLabel)} →</a>
      </div>
      ${GalleryGrid(b)}
    </div>
  </section>

  <section class="alt">
    <div class="wrap minisite-grid">
      <div>
        <div class="section-head"><div class="eyebrow">${esc(b.menuLabel)} Preview</div><h2>A taste of the ${esc(b.menuLabel.toLowerCase())}</h2></div>
        ${b.menuItems.slice(0, 4).map(m => `
        <div class="menu-item">
          <div><h4>${esc(m.name)}</h4><p>${esc(m.desc)}</p></div>
          ${m.price ? `<span class="price">${esc(m.price)}</span>` : ""}
        </div>`).join("")}
        <a class="btn btn-dark" href="${bizUrl(b)}/menu" style="margin-top:20px">See the Full ${esc(b.menuLabel)}</a>
      </div>
      ${LeadCaptureForm(b, {
        title: `Message ${b.name}`,
        sub: cat.slug === "catering" || b.tags.includes("Catering") ? "Ask about availability, get a quote, or book a tasting — replies come straight from the team." : "Questions, bookings, quotes, or requests — this goes straight to the business.",
        cta: "Send My Request"
      })}
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Local Keywords</div><h2>Find ${esc(b.name)} by searching for…</h2></div>
      <div class="tag-cloud">${b.seo.localKeywords.map(k => `<span class="chip">${esc(k)}</span>`).join("")}</div>
      <p class="card-desc" style="margin-top:16px;max-width:720px">${esc(b.seo.categorySeoIntro)} ${esc(b.seo.citySeoIntro)} ${esc(b.seo.stateSeoIntro)}</p>
    </div>
  </section>

  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">FAQ</div><h2>${esc(b.name)} — frequently asked</h2></div>
      ${FAQAccordion(b.seo.faqs, { openFirst: true })}
    </div>
  </section>

  ${relatedBlocks(b)}

  <section>
    <div class="wrap">${SEOExplainerSection(b, null)}</div>
  </section>

  ${BusinessOwnerCTA({ title: "Want a page like this for your business?", sub: `This entire mini-site — page, offers, ${b.menuLabel.toLowerCase()}, SEO, and campaign placement — is what Gold Card builds for every member. From $65/month.` })}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: b.seo.title,
      description: b.seo.description,
      canonical: b.seo.canonicalUrl,
      ogTitle: b.seo.ogTitle,
      ogDescription: b.seo.ogDescription,
      jsonld: buildJsonLd(b, null)
    }
  };
}

/* ---------------- OFFERS PAGE ---------------- */
function pageBusinessOffers(b) {
  const st = findState(b.state), ct = findCity(b.city);
  const otherDeals = BUSINESSES.filter(x => x.slug !== b.slug && x.offer && x.state === b.state).slice(0, 2);
  const html = `
  ${Header("")}
  ${BusinessMiniSiteHero(b, "offers")}

  <section style="padding-top:50px">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Active Offers</div><h2>Claim these at ${esc(b.name)}</h2></div>
      <div class="minisite-grid">
        <div style="display:grid;gap:20px">
          <div class="offer-banner">
            <h3>${esc(b.offer.title)}</h3>
            <p>${esc(b.offer.details)}</p>
            <div class="btn-row" style="margin-top:18px">
              <a class="btn btn-gold btn-sm" href="tel:${b.phone.replace(/[^0-9]/g, "")}">📞 Call to Redeem</a>
              <a class="btn btn-outline-light btn-sm" href="#" data-demo-alert="In production: a claim code or wallet pass is issued here and tracked in the business's lead report.">Save This Offer</a>
            </div>
          </div>
          ${b.offer.secondary ? `
          <div class="offer-banner" style="border-style:dashed">
            <h3 style="font-size:19px">${esc(b.offer.secondary.split("—")[0].trim())}</h3>
            <p>${esc(b.offer.secondary)}</p>
          </div>` : ""}
          <div class="card" style="padding:22px">
            <h3 style="font-size:16px;margin-bottom:8px">How Gold Card offers work</h3>
            <p class="card-desc">No coupon printing, no apps to install. Show the offer at the counter or mention it when you book. Offers are real, current, and updated ${b.tier === "premium" ? "monthly (Premium plan)" : "regularly"} — if it's on this page, it's live.</p>
          </div>
        </div>
        <div class="form-card" data-form-wrap>
          <h3 style="margin-bottom:4px">Get ${esc(b.name)}'s next offer first</h3>
          <p class="card-desc" style="margin-bottom:16px">Join the offer list — and add your birthday for birthday-club perks from businesses across ${esc(st.name)}.</p>
          <form data-demo-form data-success="You're on the list — ${esc(b.name)}'s next offer will hit your inbox first." class="form-grid">
            <div class="field full"><label>Email *</label><input type="email" required placeholder="you@email.com"></div>
            <div class="field"><label>Birthday month</label>
              <select><option value="">Optional</option>${["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => `<option>${m}</option>`).join("")}</select>
            </div>
            <div class="field"><label>Mobile for SMS</label><input placeholder="Optional"></div>
            <div class="field full"><button class="btn btn-gold btn-block" type="submit">Join the Offer List</button></div>
          </form>
          <p class="form-note">One list, zero spam. Powered by the ${esc(st.brand)} email program.</p>
        </div>
      </div>
    </div>
  </section>

  ${otherDeals.length ? `
  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">More ${esc(st.name)} Deals</div><h2>While you're at it</h2></div>
      <div class="grid grid-2">${otherDeals.map(DealCard).join("")}</div>
      <div style="margin-top:20px"><a class="btn btn-outline" href="#/deals">Browse every deal on the network →</a></div>
    </div>
  </section>` : ""}

  <section>
    <div class="wrap">${SEOExplainerSection(b, "offers")}</div>
  </section>

  ${BusinessOwnerCTA({ title: "Your offer could have its own page too", sub: "Every Gold Card plan includes an offer page built to rank for “your business + deals + your city” — written, published, and promoted for you." })}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: b.seo.offers.title,
      description: b.seo.offers.description,
      canonical: `${b.seo.canonicalUrl}/offers`,
      jsonld: buildJsonLd(b, "offers")
    }
  };
}

/* ---------------- MENU / SERVICES / SHOWCASE PAGE ---------------- */
function pageBusinessMenu(b) {
  const st = findState(b.state), ct = findCity(b.city), cat = findCategory(b.category);
  const isRestaurant = b.seo.schemaType === "Restaurant";
  const html = `
  ${Header("")}
  ${BusinessMiniSiteHero(b, "menu")}

  <section style="padding-top:50px">
    <div class="wrap minisite-grid">
      <div>
        <div class="section-head"><div class="eyebrow">${esc(b.menuLabel)}</div><h2>The full ${esc(b.menuLabel.toLowerCase())}</h2></div>
        <div class="card" style="padding:8px 26px">
          ${b.menuItems.map(m => `
          <div class="menu-item">
            <div><h4>${esc(m.name)}</h4><p>${esc(m.desc)}</p></div>
            ${m.price ? `<span class="price">${esc(m.price)}</span>` : ""}
          </div>`).join("")}
        </div>
        <p class="card-desc" style="margin-top:14px">${isRestaurant ? "Menu items and prices are samples for this prototype — in production this page mirrors the live menu and updates with the business." : "Offerings and pricing are samples for this prototype — in production this page reflects the business's current services."}</p>
      </div>
      <div style="display:grid;gap:20px;align-content:start">
        ${infoPanel(b)}
        <div class="offer-banner">
          <h3 style="font-size:18px">${esc(b.offer.title)}</h3>
          <p>${esc(b.offer.details)}</p>
          <a class="btn btn-gold btn-sm" style="margin-top:14px" href="${bizUrl(b)}/offers">View Offer Page</a>
        </div>
      </div>
    </div>
  </section>

  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Gallery</div><h2>${esc(b.menuLabel)} highlights</h2></div>
      ${GalleryGrid(b)}
    </div>
  </section>

  <section>
    <div class="wrap minisite-grid">
      <div class="prose">
        <div class="eyebrow">Long-Tail Local Search</div>
        <h2 style="margin-bottom:14px">Why this page exists</h2>
        <p>Most directories stop at a name and a phone number. This page exists because customers don't search that way — they search for <strong>“${esc(b.seo.secondarySearchIntents[0])}”</strong> or <strong>“${esc(b.seo.secondarySearchIntents[1] || b.seo.primarySearchIntent)}”</strong>.</p>
        <p>By giving ${esc(b.name)}'s ${esc(b.menuLabel.toLowerCase())} its own SEO-built page — with unique title, description, item-level content, and structured data — the business can be found for what it actually ${isRestaurant ? "serves" : "does"}, not just what it's called.</p>
      </div>
      ${LeadCaptureForm(b, { title: `Ask ${b.name} a question`, sub: "Item availability, custom requests, bookings — straight to the team.", cta: "Send Question" })}
    </div>
  </section>

  <section class="alt">
    <div class="wrap">${SEOExplainerSection(b, "menu")}</div>
  </section>

  ${BusinessOwnerCTA({ title: `Every Gold Mini-Site includes a ${b.menuLabel.toLowerCase()} page`, sub: "Item-level content that captures long-tail local searches — written and structured for you as part of the $95/month plan." })}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: b.seo.menu.title,
      description: b.seo.menu.description,
      canonical: `${b.seo.canonicalUrl}/menu`,
      jsonld: buildJsonLd(b, "menu")
    }
  };
}

/* ============================================================
   ADMIN DASHBOARD  (/admin)  — noindex
   ============================================================ */
function adminTopbar(active) {
  return `
  <div class="admin-topbar">
    <a href="#/" class="logo" aria-label="Back to site">
      <span class="logo-card"></span>
      <span class="logo-text" style="color:var(--paper);font-size:16px">U.S. Gold Card<small>Operator Console</small></span>
    </a>
    <span class="badge badge-warn">Internal · noindex</span>
    <nav class="admin-nav">
      <a href="#/admin" class="${active === "admin" ? "active" : ""}">Businesses</a>
      <a href="#/admin/campaigns" class="${active === "campaigns" ? "active" : ""}">Campaigns</a>
      <a href="#/">← Public Site</a>
    </nav>
  </div>`;
}

function pageAdmin() {
  const totalMRR = BUSINESSES.reduce((sum, b) => sum + TIER_PRICE[b.tier] + (b.premiumAd ? 25 : 0), 0);
  const totalLeads = BUSINESSES.reduce((s, b) => s + b.leadsThisMonth, 0);
  const totalSignups = BUSINESSES.reduce((s, b) => s + b.emailSignupCount, 0);
  const stateRollup = STATES.filter(s => bizIn({ state: s.slug }).length).map(s => {
    const biz = bizIn({ state: s.slug });
    return { s, count: biz.length, mrr: biz.reduce((x, b) => x + TIER_PRICE[b.tier] + (b.premiumAd ? 25 : 0), 0), leads: biz.reduce((x, b) => x + b.leadsThisMonth, 0) };
  });
  const statusBadge = st => {
    if (st === "Featured") return `<span class="badge badge-gold">Featured</span>`;
    if (st === "Live") return `<span class="badge badge-live">Live</span>`;
    if (st === "Draft") return `<span class="badge badge-muted">Draft</span>`;
    return `<span class="badge badge-warn">${esc(st)}</span>`;
  };

  const html = `
  <div class="admin-shell">
    ${adminTopbar("admin")}
    <div class="admin-main">
      <h1 style="font-size:26px;margin-bottom:6px">Network Operations</h1>
      <p style="color:var(--muted-dark);font-size:14px;margin-bottom:22px">Live view of every business, tier, campaign slot, and dollar across the national network. Sample data.</p>

      <div class="stat-grid">
        ${AdminStatCard("Monthly recurring revenue", `$${totalMRR.toLocaleString()}`, "▲ +$310 vs. last month")}
        ${AdminStatCard("Active businesses", BUSINESSES.length, "▲ +3 this month")}
        ${AdminStatCard("Leads collected (30d)", totalLeads, "▲ +18% month over month")}
        ${AdminStatCard("Email signups (total)", totalSignups.toLocaleString(), "▲ +412 this month")}
      </div>

      <div class="admin-panel">
        <h3>Businesses</h3>
        <div class="admin-filter">
          <input id="adm-q" placeholder="Search businesses…" style="flex:1;min-width:160px">
          <select id="adm-state"><option value="">All states</option>${STATES.filter(s => bizIn({ state: s.slug }).length).map(s => `<option value="${s.slug}">${s.name}</option>`).join("")}</select>
          <select id="adm-city"><option value="">All cities</option>${CITIES.filter(c => c.live && bizIn({ city: c.slug }).length).map(c => `<option value="${c.slug}">${c.name}</option>`).join("")}</select>
          <select id="adm-cat"><option value="">All categories</option>${CATEGORIES.map(c => `<option value="${c.slug}">${c.name}</option>`).join("")}</select>
          <select id="adm-status"><option value="">All statuses</option>${["Featured","Live","Draft","Needs photos","Needs offer","Needs SEO review"].map(s => `<option>${s}</option>`).join("")}</select>
          <button class="btn btn-gold btn-sm" data-demo-alert="Demo: opens the Add Business intake form — same fields as the public Join form, plus tier, billing, and onboarding checklist.">＋ Add Business</button>
        </div>
        <div class="admin-table-scroll">
          <table class="admin" id="adm-table">
            <thead><tr>
              <th>Business</th><th>Location</th><th>Category</th><th>Status</th><th>Tier</th>
              <th>Monthly</th><th>Setup fee</th><th>Leads (30d)</th><th>Signups</th><th>Campaigns</th>
              <th>Rotation</th><th>Featured ad</th><th>Platinum flag</th><th>Page</th>
            </tr></thead>
            <tbody>
              ${BUSINESSES.map(b => {
                const meta = ADMIN_META[b.slug];
                const campaignCount = CAMPAIGNS.filter(c => c.businesses.includes(b.slug)).length;
                return `
                <tr data-adm-row data-name="${esc(b.name.toLowerCase())}" data-state="${b.state}" data-city="${b.city}" data-cat="${b.category}" data-status="${esc(meta.status)}">
                  <td><strong>${esc(b.name)}</strong></td>
                  <td>${findCity(b.city).name}, ${findState(b.state).abbrev}</td>
                  <td>${findCategory(b.category).name}</td>
                  <td>${statusBadge(meta.status)}</td>
                  <td>${tierBadge(b.tier)}</td>
                  <td>$${TIER_PRICE[b.tier]}${b.premiumAd ? " <span style='color:var(--gold-bright)'>+$25</span>" : ""}</td>
                  <td>$${meta.setupFee}</td>
                  <td>${b.leadsThisMonth}</td>
                  <td>${b.emailSignupCount}</td>
                  <td>${campaignCount} active</td>
                  <td><button class="toggle ${b.homepageRotation ? "on" : ""}" data-toggle aria-label="Homepage rotation"></button></td>
                  <td><button class="toggle ${b.premiumAd ? "on" : ""}" data-toggle aria-label="Featured ad"></button></td>
                  <td><button class="toggle ${b.platinumEligible ? "on" : ""}" data-toggle aria-label="Platinum upgrade flag"></button></td>
                  <td><a href="${bizUrl(b)}">View →</a></td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1.2fr .8fr;gap:22px" class="adm-two">
        <div class="admin-panel">
          <h3>State-by-state summary</h3>
          <div class="admin-table-scroll">
            <table class="admin" style="min-width:520px">
              <thead><tr><th>State network</th><th>Businesses</th><th>MRR</th><th>Leads (30d)</th><th>Partner</th></tr></thead>
              <tbody>
                ${stateRollup.map(r => `
                <tr>
                  <td><strong>${esc(r.s.brand)}</strong></td>
                  <td>${r.count}</td>
                  <td>$${r.mrr.toLocaleString()}</td>
                  <td>${r.leads}</td>
                  <td>${r.s.partnerOpen ? `<span class="badge badge-warn">Territory open</span>` : `<span class="badge badge-live">Staffed</span>`}</td>
                </tr>`).join("")}
                <tr>
                  <td colspan="5" style="color:var(--muted-dark)">+ ${STATES.filter(s => !bizIn({ state: s.slug }).length).map(s => s.name).join(", ")} — launching, territories open</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="admin-panel">
          <h3>Onboarding checklist — <span style="color:var(--paper)">Tampa Bay Smoothie Bar</span></h3>
          <p style="color:var(--muted-dark);font-size:12.5px;margin-bottom:12px">Newest starter listing. Two steps from fully live.</p>
          ${BusinessOnboardingChecklist("tampa-bay-smoothie-bar")}
          <h3 style="margin-top:22px">Onboarding checklist — <span style="color:var(--paper)">Heritage Clock &amp; Antiques</span></h3>
          ${BusinessOnboardingChecklist("heritage-clock-antiques")}
        </div>
      </div>
      <style>@media (max-width: 900px) { .adm-two { grid-template-columns: 1fr !important; } }</style>
    </div>
  </div>`;

  return {
    html,
    bare: true,
    seo: { title: "Admin — Network Operations | U.S. Gold Card", description: "Internal admin dashboard.", noindex: true },
    after: initAdminFilters
  };
}

/* ============================================================
   CAMPAIGN DASHBOARD  (/admin/campaigns)  — noindex
   ============================================================ */
function pageAdminCampaigns() {
  const sent = CAMPAIGNS.filter(c => c.status === "sent");
  const scheduled = CAMPAIGNS.filter(c => c.status === "scheduled");
  const drafts = CAMPAIGNS.filter(c => c.status === "draft");
  /* July 2026 mock calendar: 1st falls on Wednesday */
  const eventsByDay = {};
  CAMPAIGNS.forEach(c => {
    const d = parseInt(c.date.replace(/[^0-9]/g, ""), 10);
    if (c.date.startsWith("Jul")) (eventsByDay[d] = eventsByDay[d] || []).push(c);
  });
  const firstWeekday = 3; /* Wed */
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(`<div class="cal-cell" style="opacity:.35"></div>`);
  for (let d = 1; d <= 31; d++) {
    const evs = (eventsByDay[d] || []).map(c => `<div class="cal-event ${c.status}">${esc(c.name.length > 22 ? c.name.slice(0, 21) + "…" : c.name)}</div>`).join("");
    cells.push(`<div class="cal-cell"><span class="d">${d}</span>${evs}</div>`);
  }

  const html = `
  <div class="admin-shell">
    ${adminTopbar("campaigns")}
    <div class="admin-main">
      <h1 style="font-size:26px;margin-bottom:6px">Campaign Command Center</h1>
      <p style="color:var(--muted-dark);font-size:14px;margin-bottom:22px">10 monthly campaign slots across local, city, state, category, and national sends. Sample data.</p>

      <div class="stat-grid">
        ${AdminStatCard("Campaign slots used — July", `${CAMPAIGNS.length} / 10`, "3 sent · 2 scheduled · 5 drafts")}
        ${AdminStatCard("Total subscribers", "20,410", "▲ +1,120 this month")}
        ${AdminStatCard("Avg open rate (30d)", "44.1%", "▲ vs. 41.8% prior")}
        ${AdminStatCard("Clicks to business pages (30d)", "1,529", "▲ +22%")}
      </div>

      <div class="admin-panel">
        <h3>July campaign calendar</h3>
        <div class="cal-grid">
          ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => `<div class="cal-head">${d}</div>`).join("")}
          ${cells.join("")}
        </div>
        <p style="color:var(--muted-dark);font-size:12px;margin-top:10px">🟩 sent · 🟨 scheduled · ⬜ draft — calendar hidden on small screens; the list below is the source of truth.</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 300px;gap:22px" class="adm-two">
        <div>
          <div class="admin-panel" style="margin-bottom:14px">
            <h3>Scheduled &amp; sending</h3>
          </div>
          ${scheduled.map(CampaignCard).join("")}
          <div class="admin-panel" style="margin:20px 0 14px"><h3>Sent — last 30 days</h3></div>
          ${sent.map(CampaignCard).join("")}
          <div class="admin-panel" style="margin:20px 0 14px"><h3>Drafts — slot pipeline</h3></div>
          ${drafts.map(CampaignCard).join("")}
        </div>
        <aside>
          <div class="admin-panel">
            <h3>Audience segments</h3>
            <table class="admin" style="min-width:0">
              <tbody>
                ${CAMPAIGN_SEGMENTS.map(s => `
                <tr><td style="white-space:normal">${esc(s.name)}</td><td style="text-align:right;color:var(--gold-bright);font-weight:700">${s.count.toLocaleString()}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
          <div class="admin-panel">
            <h3>New campaign</h3>
            <p style="color:var(--muted-dark);font-size:12.5px;margin-bottom:12px">Pick a scope, a segment, and the businesses to feature — the platform drafts the send.</p>
            <button class="btn btn-gold btn-sm btn-block" data-demo-alert="Demo: opens the campaign composer — scope (local/city/state/category/national), segment picker, featured businesses, offer pull-in, and send scheduling.">＋ Draft a Campaign</button>
          </div>
        </aside>
      </div>
      <style>@media (max-width: 900px) { .adm-two { grid-template-columns: 1fr !important; } }</style>
    </div>
  </div>`;

  return {
    html,
    bare: true,
    seo: { title: "Admin — Campaign Dashboard | U.S. Gold Card", description: "Internal campaign dashboard.", noindex: true }
  };
}

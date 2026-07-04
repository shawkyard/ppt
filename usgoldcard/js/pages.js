/* ============================================================
   U.S. GOLD CARD — Public Page Renderers
   Each page returns { html, seo: { title, description, canonical, noindex } }
   ============================================================ */

/* ---------------- HOME ---------------- */
function pageHome() {
  const featuredBiz = BUSINESSES.filter(b => b.featured);
  const dealBiz = BUSINESSES.filter(b => b.offer).slice(0, 4);
  const liveStates = STATES.filter(s => s.live).slice(0, 5);
  const featuredCities = ["midvale", "ogden", "omaha", "buffalo", "austin", "tampa"].map(findCity);

  const html = `
  ${Header("#/")}
  <div class="notice-bar">🇺🇸 One national network · ${STATES.filter(s => s.live).length} state Gold Card brands live · ${BUSINESSES.length}+ founding businesses and growing</div>
  <div class="hero">
    <div class="wrap">
      <div class="eyebrow">The National Local Business Network</div>
      <h1 style="max-width:850px">Discover America's Local Restaurants, Shops, Services, Deals &amp; Hidden Gems</h1>
      <p class="lede" style="margin-top:18px">U.S. Gold Card helps local businesses get found while giving customers one beautiful place to discover trusted local places, offers, and services by state, city, and category.</p>
      ${NationalHeroSearch()}
      <div class="btn-row" style="margin-top:26px">
        <a class="btn btn-gold" href="#/join">Get Listed</a>
        <a class="btn btn-outline-light" href="#/deals">Explore Local Deals</a>
      </div>
      <div class="hero-stat">
        <div><strong>10</strong><span>State Gold Card brands</span></div>
        <div><strong>3 pages</strong><span>Per business mini-site</span></div>
        <div><strong>20,400+</strong><span>Local email subscribers</span></div>
        <div><strong>$65/mo</strong><span>Starting price</span></div>
      </div>
    </div>
  </div>

  <section>
    <div class="wrap">
      <div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px;max-width:none">
        <div>
          <div class="eyebrow">Featured States</div>
          <h2>Every state gets its own Gold Card network</h2>
        </div>
        <a class="btn btn-outline btn-sm" href="#/states">All states →</a>
      </div>
      <div class="grid grid-2">${liveStates.slice(0, 4).map(StateCard).join("")}</div>
    </div>
  </section>

  <section class="alt">
    <div class="wrap">
      <div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px;max-width:none">
        <div>
          <div class="eyebrow">Featured Cities</div>
          <h2>City directories with real local pages</h2>
        </div>
        <a class="btn btn-outline btn-sm" href="#/cities">All cities →</a>
      </div>
      <div class="grid grid-3">${featuredCities.map(CityCard).join("")}</div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px;max-width:none">
        <div>
          <div class="eyebrow">Featured Businesses</div>
          <h2>Not listings. Mini-websites.</h2>
          <p class="lede">Every featured business below has its own three-page, SEO-built mini-site inside the network. Click one — that's the product.</p>
        </div>
        <a class="btn btn-outline btn-sm" href="#/directory">Full directory →</a>
      </div>
      <div class="grid grid-3">${featuredBiz.map(b => BusinessCard(b)).join("")}</div>
    </div>
  </section>

  ${RotatingSpotlightSection()}

  <section>
    <div class="wrap">
      <div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px;max-width:none">
        <div>
          <div class="eyebrow">Featured Deals</div>
          <h2>Real offers from real local businesses</h2>
        </div>
        <a class="btn btn-outline btn-sm" href="#/deals">All deals →</a>
      </div>
      <div class="grid grid-2">${dealBiz.map(DealCard).join("")}</div>
    </div>
  </section>

  <section class="alt">
    <div class="wrap">
      <div class="section-head center">
        <div class="eyebrow">How U.S. Gold Card Works</div>
        <h2>Three audiences. One network that compounds.</h2>
      </div>
      <div class="grid grid-3">
        <div class="card step-card">
          <span class="step-num">1</span>
          <h3>For Local Customers</h3>
          <p class="card-desc">Discover trusted local restaurants, shops, services, deals, events, and hidden gems across your city, state, and the country — every listing is a real page with hours, menus, offers, and one-tap contact.</p>
          <a class="card-link" href="#/directory">Start exploring →</a>
        </div>
        <div class="card step-card">
          <span class="step-num">2</span>
          <h3>For Business Owners</h3>
          <p class="card-desc">We don't just list your business. We build you a search-friendly local business page, promote your offers, collect leads, grow your audience, and include you in local marketing campaigns.</p>
          <a class="card-link" href="#/business">See what we build →</a>
        </div>
        <div class="card step-card">
          <span class="step-num">3</span>
          <h3>For State Partners</h3>
          <p class="card-desc">Sales reps and operators launch their own state Gold Card brand — a simple, repeatable offer that small businesses instantly understand, with recurring revenue behind it.</p>
          <a class="card-link" href="#/state-partners">Claim a territory →</a>
        </div>
      </div>
      <div class="quote-block" style="max-width:820px;margin:34px auto 0">${esc(SITE.copy.sharedNetwork)}</div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head center">
        <div class="eyebrow">Simple Pricing</div>
        <h2>Plans that fit a taco shop and a five-truck crew</h2>
        <p class="lede" style="margin:10px auto 0">Every paid tier includes a real SEO-built page — never a thin directory card.</p>
      </div>
      <div class="grid grid-3">
        ${TIERS.slice(0, 3).map(t => PricingCard(t, { compact: true })).join("")}
      </div>
      <div style="text-align:center;margin-top:26px">
        <a class="btn btn-dark" href="#/pricing">Full Pricing &amp; Comparison Table</a>
        <p class="card-desc" style="margin-top:10px">Plus: Platinum upgrade (future tier), custom websites, and the $25/mo Featured Placement add-on.</p>
      </div>
    </div>
  </section>

  ${EmailProgramSection()}
  ${BusinessOwnerCTA()}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: "U.S. Gold Card — Discover America's Local Restaurants, Shops, Services & Deals",
      description: "U.S. Gold Card is the national local business network: state-by-state directories, SEO-built business mini-sites, local deals, and done-for-you marketing. Get found. Get leads. Get promoted.",
      canonical: SITE.domain + "/"
    }
  };
}

/* ---------------- STATES INDEX ---------------- */
function pageStates() {
  const html = `
  ${Header("#/states")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "States"]])}
      <div class="eyebrow" style="margin-top:20px">State Gold Card Networks</div>
      <h1>One national brand. A Gold Card network for every state.</h1>
      <p class="lede" style="margin-top:16px">Each state runs its own Gold Card experience — its own cities, categories, featured businesses, and campaigns — and every state rolls up into the national U.S. Gold Card platform.</p>
    </div>
  </div>
  <section>
    <div class="wrap">
      <div class="grid grid-2">${STATES.map(StateCard).join("")}</div>
    </div>
  </section>
  <section class="alt">
    <div class="wrap">
      ${StatePartnerCTA()}
    </div>
  </section>
  ${BusinessOwnerCTA()}
  ${Footer()}`;
  return {
    html,
    seo: {
      title: "State Gold Card Networks — Utah, Texas, New York, Florida & More | U.S. Gold Card",
      description: "Explore every state Gold Card network: Utah, Nebraska, New York, Florida, Texas, California, Arizona, Nevada, Idaho, and Colorado. Local directories, deals, and business pages by state.",
      canonical: SITE.domain + "/states"
    }
  };
}

/* ---------------- CITIES INDEX ---------------- */
function pageCities() {
  const live = CITIES.filter(c => c.live), soon = CITIES.filter(c => !c.live);
  const html = `
  ${Header("#/cities")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "Cities"]])}
      <div class="eyebrow" style="margin-top:20px">City Directories</div>
      <h1>Find your city's Gold Card directory</h1>
      <p class="lede" style="margin-top:16px">Every city directory is built from real local pages — restaurants, shops, and services with hours, menus, offers, and one-tap contact.</p>
    </div>
  </div>
  <section>
    <div class="wrap">
      <div class="section-head"><h2>Live city directories</h2></div>
      <div class="grid grid-3">${live.map(CityCard).join("")}</div>
      <div class="section-head" style="margin-top:50px"><h2>Opening soon</h2><p class="lede">Founding businesses in these cities get first-mover placement.</p></div>
      <div class="grid grid-3">${soon.map(CityCard).join("")}</div>
    </div>
  </section>
  ${BusinessOwnerCTA({ title: "Your city not listed yet? Be the business that opens it.", sub: "Early businesses get founding placement — and every Gold Card page is built to rank on its own, even before the city directory fills in." })}
  ${Footer()}`;
  return {
    html,
    seo: {
      title: "City Business Directories — Local Gold Card Networks by City | U.S. Gold Card",
      description: "Browse Gold Card city directories: Midvale, Ogden, Salt Lake City, Omaha, Lincoln, Buffalo, Brooklyn, Austin, Dallas, Tampa, Orlando, Phoenix, Denver, and more.",
      canonical: SITE.domain + "/cities"
    }
  };
}

/* ---------------- STATE LANDING ---------------- */
function pageState(stateSlug) {
  const s = findState(stateSlug);
  if (!s) return page404();
  const cities = citiesIn(s.slug);
  const biz = bizIn({ state: s.slug });
  const featured = biz.filter(b => b.featured);
  const deals = biz.filter(b => b.offer).slice(0, 2);
  const newest = [...biz].sort((a, b2) => b2.id - a.id).slice(0, 3);
  const restaurants = biz.filter(b => b.category === "restaurants");
  const shops = biz.filter(b => ["local-shops", "antiques"].includes(b.category));
  const services = biz.filter(b => ["home-services", "professional-services", "catering", "salons", "fitness-wellness"].includes(b.category));
  const cats = [...new Set(biz.map(b => b.category))].map(findCategory);

  const bizSection = (title, list) => list.length ? `
    <section class="alt">
      <div class="wrap">
        <div class="section-head"><h2>${title}</h2></div>
        <div class="grid grid-3">${list.map(b => BusinessCard(b)).join("")}</div>
      </div>
    </section>` : "";

  const html = `
  ${Header("#/states")}
  <div class="hero">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], ["#/states", "States"], [null, s.brand]])}
      <div class="eyebrow" style="margin-top:20px">${s.live ? "Live State Network" : "Launching Soon"}</div>
      <h1>${esc(s.brand)}: ${esc(s.tagline)}</h1>
      <p class="lede" style="margin-top:16px">${esc(s.heroBlurb)}</p>
      <div class="hero-stat">
        <div><strong>${s.businessCount || "Founding"}</strong><span>${s.businessCount ? "Businesses network-wide" : "spots open now"}</span></div>
        <div><strong>${cities.filter(c => c.live).length || "Soon"}</strong><span>Live city directories</span></div>
        <div><strong>${s.subscriberCount ? s.subscriberCount.toLocaleString() : "—"}</strong><span>${s.name} email subscribers</span></div>
      </div>
      <div class="btn-row" style="margin-top:28px">
        <a class="btn btn-gold" href="#/join?state=${s.slug}">List Your ${esc(s.name)} Business</a>
        <a class="btn btn-outline-light" href="#/state-partners">${s.partnerOpen ? `Become the ${esc(s.name)} Partner` : "State Partner & Sales Rep Info"}</a>
      </div>
    </div>
  </div>

  ${cities.length ? `
  <section>
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Featured Cities</div><h2>${esc(s.name)} city directories</h2></div>
      <div class="grid grid-3">${cities.map(CityCard).join("")}</div>
    </div>
  </section>` : ""}

  ${featured.length ? `
  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Featured Businesses</div><h2>Featured on ${esc(s.brand)}</h2></div>
      <div class="grid grid-3">${featured.map(b => BusinessCard(b)).join("")}</div>
    </div>
  </section>` : ""}

  ${deals.length ? `
  <section>
    <div class="wrap">
      <div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px;max-width:none">
        <div><div class="eyebrow">Featured Deals</div><h2>${esc(s.name)} deals right now</h2></div>
        <a class="btn btn-outline btn-sm" href="#/deals">All deals →</a>
      </div>
      <div class="grid grid-2">${deals.map(DealCard).join("")}</div>
    </div>
  </section>` : ""}

  ${cats.length ? `
  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Popular Categories</div><h2>Browse ${esc(s.name)} by category</h2></div>
      <div class="grid grid-3">${CATEGORIES.map(c => CategoryCard(c, { state: s.slug })).join("")}</div>
    </div>
  </section>` : ""}

  ${bizSection(`New on ${esc(s.brand)}`, newest)}
  ${restaurants.length ? `
  <section>
    <div class="wrap">
      <div class="section-head"><h2>${esc(s.name)} restaurants</h2></div>
      <div class="grid grid-3">${restaurants.map(b => BusinessCard(b)).join("")}</div>
    </div>
  </section>` : ""}
  ${shops.length ? `
  <section class="alt">
    <div class="wrap">
      <div class="section-head"><h2>${esc(s.name)} local shops</h2></div>
      <div class="grid grid-3">${shops.map(b => BusinessCard(b)).join("")}</div>
    </div>
  </section>` : ""}
  ${services.length ? `
  <section>
    <div class="wrap">
      <div class="section-head"><h2>${esc(s.name)} services</h2></div>
      <div class="grid grid-3">${services.map(b => BusinessCard(b)).join("")}</div>
    </div>
  </section>` : ""}

  <section class="alt">
    <div class="wrap two-col">
      <div class="prose">
        <div class="eyebrow">About ${esc(s.brand)}</div>
        <h2 style="margin-bottom:14px">The ${esc(s.name)} directory, built page by page</h2>
        <p>${esc(s.seoIntro)}</p>
        <p>${esc(SITE.copy.earlyMarket)}</p>
      </div>
      <div>
        ${StatePartnerCTA(s.name)}
      </div>
    </div>
  </section>
  ${BusinessOwnerCTA({ title: `Get your business on ${s.brand}`, sub: `We build your ${s.name} page, your local SEO, your offer page, and your placement across the ${s.name} and national directories — starting at $65/month.` })}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: `${s.brand} — ${s.tagline} | U.S. Gold Card`,
      description: s.seoIntro.slice(0, 158),
      canonical: `${SITE.domain}/states/${s.slug}`
    }
  };
}

/* ---------------- CITY PAGE ---------------- */
function pageCity(stateSlug, citySlug) {
  const s = findState(stateSlug), c = findCity(citySlug);
  if (!s || !c || c.state !== s.slug) return page404();
  const biz = bizIn({ city: c.slug });
  const featured = biz.filter(b => b.featured);
  const restaurants = biz.filter(b => b.category === "restaurants");
  const shops = biz.filter(b => ["local-shops", "antiques"].includes(b.category));
  const services = biz.filter(b => !["restaurants", "local-shops", "antiques"].includes(b.category));
  const deals = biz.filter(b => b.offer);
  const nearby = c.nearby.map(findCity).filter(Boolean);

  const section = (title, list, alt) => list.length ? `
    <section class="${alt ? "alt" : ""}">
      <div class="wrap">
        <div class="section-head"><h2>${title}</h2></div>
        <div class="grid grid-3">${list.map(b => BusinessCard(b)).join("")}</div>
      </div>
    </section>` : "";

  const html = `
  ${Header("#/cities")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], ["#/states", "States"], [`#/states/${s.slug}`, s.brand], [null, c.name]])}
      <div class="eyebrow" style="margin-top:20px">${esc(s.brand)} · City Directory</div>
      <h1>${esc(c.name)}, ${esc(s.name)}: Local Businesses, Deals &amp; Hidden Gems</h1>
      <p class="lede" style="margin-top:16px">${esc(c.blurb)}</p>
      <div class="btn-row" style="margin-top:26px">
        <a class="btn btn-gold" href="#/join?state=${s.slug}">List Your ${esc(c.name)} Business</a>
        <a class="btn btn-outline-light" href="#/deals">Explore ${esc(c.name)} Deals</a>
      </div>
    </div>
  </div>

  ${!c.live || !biz.length ? `
  <section>
    <div class="wrap">
      <div class="cta-band">
        <div>
          <div class="eyebrow on-dark" style="color:var(--gold-bright)">Founding Spots Open</div>
          <h2>Be the first Gold Card business in ${esc(c.name)}</h2>
          <p>${esc(SITE.copy.earlyMarket)}</p>
        </div>
        <a class="btn btn-gold" href="#/join?state=${s.slug}">Claim a Founding Spot</a>
      </div>
    </div>
  </section>` : ""}

  ${section(`Featured in ${esc(c.name)}`, featured, false)}
  ${section(`${esc(c.name)} restaurants`, restaurants, true)}
  ${section(`${esc(c.name)} shops`, shops, false)}
  ${section(`${esc(c.name)} services`, services, true)}

  ${deals.length ? `
  <section>
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Local Deals</div><h2>Deals in ${esc(c.name)} right now</h2></div>
      <div class="grid grid-2">${deals.map(DealCard).join("")}</div>
    </div>
  </section>` : ""}

  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Browse by Category</div><h2>${esc(c.name)} categories</h2></div>
      <div class="grid grid-3">${CATEGORIES.map(cat => `
        <a class="card fade-in" href="#/states/${s.slug}/cities/${c.slug}/categories/${cat.slug}">
          <div class="card-body" style="flex-direction:row;align-items:center;gap:16px">
            <span class="icon-tile">${cat.icon}</span>
            <div style="flex:1"><h3 style="font-size:17px">${esc(cat.name)}</h3>
            <div class="card-meta">${bizIn({ city: c.slug, category: cat.slug }).length} in ${esc(c.name)}</div></div>
            <span class="card-link">→</span>
          </div>
        </a>`).join("")}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap two-col">
      <div class="prose">
        <div class="eyebrow">About the ${esc(c.name)} directory</div>
        <h2 style="margin-bottom:14px">Local search, done properly</h2>
        <p>${esc(c.seoIntro)}</p>
        <p>${esc(SITE.copy.pageLevelSeo)}</p>
      </div>
      <div>
        <h3 style="margin-bottom:14px">Nearby cities</h3>
        <div class="grid" style="gap:14px">${nearby.map(CityCard).join("")}</div>
      </div>
    </div>
  </section>

  ${c.faqs.length ? `
  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">FAQ</div><h2>${esc(c.name)} Gold Card questions</h2></div>
      ${FAQAccordion(c.faqs)}
    </div>
  </section>` : ""}

  ${BusinessOwnerCTA({ title: `Own a ${c.name} business? This directory is your shortcut.`, sub: `A ${c.name} Gold Card page ranks for your name, your services, and your city — and we build the whole thing for you.` })}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: `${c.name}, ${s.abbrev} Local Business Directory — ${s.brand} | U.S. Gold Card`,
      description: c.seoIntro.slice(0, 158),
      canonical: `${SITE.domain}/states/${s.slug}/cities/${c.slug}`
    }
  };
}

/* ---------------- CATEGORIES INDEX ---------------- */
function pageCategories() {
  const html = `
  ${Header("#/categories")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "Categories"]])}
      <div class="eyebrow" style="margin-top:20px">Browse by Category</div>
      <h1>Every local category. Every state.</h1>
      <p class="lede" style="margin-top:16px">Categories organize the national network — and every business inside them still gets its own stand-alone SEO page.</p>
    </div>
  </div>
  <section>
    <div class="wrap">
      <div class="grid grid-2">
        ${CATEGORIES.map(cat => `
        <a class="card hoverable fade-in" href="#/categories/${cat.slug}">
          <div class="card-body" style="flex-direction:row;gap:18px;align-items:flex-start">
            <span class="icon-tile" style="width:56px;height:56px;font-size:26px">${cat.icon}</span>
            <div style="flex:1">
              <h3>${esc(cat.name)}</h3>
              <p class="card-desc" style="margin-top:4px">${esc(cat.blurb)}</p>
              <div class="card-meta" style="margin-top:8px">${bizIn({ category: cat.slug }).length} businesses nationwide · <span class="card-link">Explore →</span></div>
            </div>
          </div>
        </a>`).join("")}
      </div>
    </div>
  </section>
  ${BusinessOwnerCTA()}
  ${Footer()}`;
  return {
    html,
    seo: {
      title: "Local Business Categories — Restaurants, Salons, Home Services & More | U.S. Gold Card",
      description: "Browse U.S. Gold Card by category: restaurants, salons, home services, local shops, antiques, family fun, catering, professional services, and fitness.",
      canonical: SITE.domain + "/categories"
    }
  };
}

/* ---------------- CATEGORY PAGE ---------------- */
function pageCategory(catSlug) {
  const cat = findCategory(catSlug);
  if (!cat) return page404();
  const biz = bizIn({ category: cat.slug });
  const statesWith = [...new Set(biz.map(b => b.state))].map(findState);
  const citiesWith = [...new Set(biz.map(b => b.city))].map(findCity);
  const related = cat.related.map(findCategory).filter(Boolean);

  const html = `
  ${Header("#/categories")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], ["#/categories", "Categories"], [null, cat.name]])}
      <div class="eyebrow" style="margin-top:20px">National Category</div>
      <h1>${cat.icon} ${esc(cat.name)} on U.S. Gold Card</h1>
      <p class="lede" style="margin-top:16px">${esc(cat.blurb)}</p>
      <div class="chip-row" style="margin-top:22px">
        ${statesWith.map(s => `<a class="chip gold" href="#/states/${s.slug}/categories/${cat.slug}">${s.name}</a>`).join("")}
        ${citiesWith.map(c => `<a class="chip" style="background:rgba(250,246,238,.1);border-color:rgba(250,246,238,.2);color:var(--paper)" href="#/states/${c.state}/cities/${c.slug}/categories/${cat.slug}">${c.name}</a>`).join("")}
      </div>
    </div>
  </div>
  <section>
    <div class="wrap">
      <div class="section-head"><h2>Featured ${esc(cat.name.toLowerCase())} nationwide</h2></div>
      <div class="grid grid-3">${biz.map(b => BusinessCard(b)).join("")}</div>
    </div>
  </section>
  <section class="alt">
    <div class="wrap two-col">
      <div class="prose">
        <div class="eyebrow">Why this category works on Gold Card</div>
        <h2 style="margin-bottom:14px">${esc(cat.name)}, with page-level SEO behind every name</h2>
        <p>${esc(cat.seoIntro)}</p>
        <p>${esc(SITE.copy.pageLevelSeo)}</p>
      </div>
      <div>
        <h3 style="margin-bottom:14px">Related categories</h3>
        <div class="grid" style="gap:14px">${related.map(r => CategoryCard(r)).join("")}</div>
      </div>
    </div>
  </section>
  ${BusinessOwnerCTA({ title: `Run a ${cat.name.toLowerCase().replace(/s$/, "")} business? Own this category in your city.`, sub: `Priority category placement, a services page built for your work, and campaigns aimed at ${cat.name.toLowerCase()} customers.` })}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: `${cat.name} Near You — Local ${cat.name} Directory | U.S. Gold Card`,
      description: cat.seoIntro.slice(0, 158),
      canonical: `${SITE.domain}/categories/${cat.slug}`
    }
  };
}

/* ---------------- STATE + CATEGORY ---------------- */
function pageStateCategory(stateSlug, catSlug) {
  const s = findState(stateSlug), cat = findCategory(catSlug);
  if (!s || !cat) return page404();
  const biz = bizIn({ state: s.slug, category: cat.slug });
  const cities = citiesIn(s.slug).filter(c => c.live);
  const related = cat.related.map(findCategory).filter(Boolean);
  const deals = biz.filter(b => b.offer);

  const html = `
  ${Header("#/categories")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], ["#/states", "States"], [`#/states/${s.slug}`, s.brand], [null, cat.name]])}
      <div class="eyebrow" style="margin-top:20px">${esc(s.brand)} · Category</div>
      <h1>${cat.icon} ${esc(cat.name)} in ${esc(s.name)}</h1>
      <p class="lede" style="margin-top:16px">${esc(cat.name)} across the ${esc(s.brand)} network — every one with its own local SEO page, offer page, and ${cat.slug === "restaurants" ? "menu" : "services"} page. Filter by city or explore the featured picks below.</p>
      <div class="chip-row" style="margin-top:22px">
        ${cities.map(c => `<a class="chip gold" href="#/states/${s.slug}/cities/${c.slug}/categories/${cat.slug}">${c.name}</a>`).join("")}
      </div>
    </div>
  </div>
  <section>
    <div class="wrap">
      <div class="section-head"><h2>${biz.length ? `Featured ${esc(cat.name.toLowerCase())} in ${esc(s.name)}` : `Be the first ${esc(cat.name.toLowerCase().replace(/s$/, ""))} on ${esc(s.brand)}`}</h2></div>
      ${biz.length ? `<div class="grid grid-3">${biz.map(b => BusinessCard(b)).join("")}</div>` : `
      <div class="cta-band">
        <div>
          <h2>This category is wide open in ${esc(s.name)}.</h2>
          <p>${esc(SITE.copy.earlyMarket)}</p>
        </div>
        <a class="btn btn-gold" href="#/join?state=${s.slug}">Claim the Founding Spot</a>
      </div>`}
    </div>
  </section>
  ${deals.length ? `
  <section class="alt">
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">Offers</div><h2>${esc(s.name)} ${esc(cat.name.toLowerCase())} deals</h2></div>
      <div class="grid grid-2">${deals.map(DealCard).join("")}</div>
    </div>
  </section>` : ""}
  <section${deals.length ? "" : ' class="alt"'}>
    <div class="wrap two-col">
      <div class="prose">
        <div class="eyebrow">${esc(s.name)} + ${esc(cat.name)}</div>
        <h2 style="margin-bottom:14px">How ${esc(cat.name.toLowerCase())} rank on ${esc(s.brand)}</h2>
        <p>${esc(cat.seoIntro)}</p>
        <p>${esc(s.seoIntro)}</p>
      </div>
      <div>
        <h3 style="margin-bottom:14px">Related categories in ${esc(s.name)}</h3>
        <div class="grid" style="gap:14px">${related.map(r => CategoryCard(r, { state: s.slug })).join("")}</div>
      </div>
    </div>
  </section>
  ${BusinessOwnerCTA({ title: `Get listed: ${cat.name.toLowerCase()} in ${s.name}`, sub: `Priority placement in the ${s.name} ${cat.name.toLowerCase()} directory, plus your own three-page SEO mini-site — built for you.` })}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: `${cat.name} in ${s.name} — ${s.brand} ${cat.name} Directory | U.S. Gold Card`,
      description: `Find trusted ${cat.name.toLowerCase()} across ${s.name} on ${s.brand}. Every listing is a full local business page with offers, ${cat.slug === "restaurants" ? "menus" : "services"}, hours, and direct contact.`,
      canonical: `${SITE.domain}/states/${s.slug}/categories/${cat.slug}`
    }
  };
}

/* ---------------- CITY + CATEGORY ---------------- */
function pageCityCategory(stateSlug, citySlug, catSlug) {
  const s = findState(stateSlug), c = findCity(citySlug), cat = findCategory(catSlug);
  if (!s || !c || !cat || c.state !== s.slug) return page404();
  const biz = bizIn({ city: c.slug, category: cat.slug });
  const relatedBiz = bizIn({ state: s.slug, category: cat.slug }).filter(b => b.city !== c.slug);
  const cityBiz = bizIn({ city: c.slug }).filter(b => b.category !== cat.slug);
  const nearby = c.nearby.map(findCity).filter(Boolean);
  const related = cat.related.map(findCategory).filter(Boolean);
  const faqs = [
    { q: `Are there ${cat.name.toLowerCase()} on the ${c.name} Gold Card directory?`, a: biz.length ? `Yes — ${c.name} currently features ${biz.length} ${cat.name.toLowerCase().replace(/s$/, "")}${biz.length > 1 ? "s" : ""} with full Gold Card pages, and more join as the network grows.` : `${c.name}'s ${cat.name.toLowerCase()} directory is opening now — founding businesses get first placement and a page built to rank on its own.` },
    { q: `What makes these listings different from other directories?`, a: `Every paid Gold Card listing is a three-page mini-site — a main business page, an offers page, and a ${cat.slug === "restaurants" ? "menu" : "services"} page — each with unique titles, descriptions, structured data, and internal links.` },
    { q: `How do I get my ${c.name} business listed?`, a: `Start at the Join page. Plans start at $65/month, and we build the pages, the local SEO, and the ${c.name} directory placement for you.` }
  ];

  const html = `
  ${Header("#/categories")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], ["#/states", "States"], [`#/states/${s.slug}`, s.brand], [`#/states/${s.slug}/cities/${c.slug}`, c.name], [null, cat.name]])}
      <div class="eyebrow" style="margin-top:20px">${esc(c.name)} · ${esc(cat.name)}</div>
      <h1>${cat.icon} ${esc(cat.name)} in ${esc(c.name)}, ${esc(s.abbrev)}</h1>
      <p class="lede" style="margin-top:16px">The ${esc(c.name)} ${esc(cat.name.toLowerCase())} directory on ${esc(s.brand)} — real local pages with hours, offers, and one-tap contact, not thin listings.</p>
    </div>
  </div>
  <section>
    <div class="wrap">
      ${biz.length ? `
      <div class="section-head"><h2>${esc(cat.name)} in ${esc(c.name)}</h2></div>
      <div class="grid grid-3">${biz.map(b => BusinessCard(b)).join("")}</div>` : `
      <div class="cta-band">
        <div>
          <div class="eyebrow on-dark" style="color:var(--gold-bright)">Founding Spot Open</div>
          <h2>No ${esc(cat.name.toLowerCase())} in ${esc(c.name)} yet — that's an opportunity.</h2>
          <p>${esc(SITE.copy.earlyMarket)}</p>
        </div>
        <a class="btn btn-gold" href="#/join?state=${s.slug}">Claim the ${esc(c.name)} Spot</a>
      </div>`}
    </div>
  </section>
  ${relatedBiz.length ? `
  <section class="alt">
    <div class="wrap">
      <div class="section-head"><h2>${esc(cat.name)} elsewhere in ${esc(s.name)}</h2></div>
      <div class="grid grid-3">${relatedBiz.map(b => BusinessCard(b)).join("")}</div>
    </div>
  </section>` : ""}
  ${cityBiz.length ? `
  <section>
    <div class="wrap">
      <div class="section-head"><h2>More to discover in ${esc(c.name)}</h2></div>
      <div class="grid grid-3">${cityBiz.slice(0, 3).map(b => BusinessCard(b)).join("")}</div>
    </div>
  </section>` : ""}
  <section class="alt">
    <div class="wrap two-col">
      <div class="prose">
        <div class="eyebrow">${esc(c.name)} + ${esc(cat.name)}</div>
        <h2 style="margin-bottom:14px">Local pages that rank for "${esc(cat.name.toLowerCase())} in ${esc(c.name)}"</h2>
        <p>${esc(c.seoIntro)}</p>
        <p>${esc(cat.seoIntro)}</p>
      </div>
      <div>
        <h3 style="margin-bottom:14px">Nearby cities</h3>
        <div class="grid" style="gap:14px">${nearby.slice(0, 2).map(CityCard).join("")}</div>
        <h3 style="margin:22px 0 14px">Related categories</h3>
        <div class="grid" style="gap:14px">${related.slice(0, 2).map(r => CategoryCard(r, { state: s.slug })).join("")}</div>
      </div>
    </div>
  </section>
  <section>
    <div class="wrap">
      <div class="section-head"><div class="eyebrow">FAQ</div><h2>${esc(cat.name)} in ${esc(c.name)} — common questions</h2></div>
      ${FAQAccordion(faqs)}
    </div>
  </section>
  ${BusinessOwnerCTA({ title: `Own a ${c.name} ${cat.name.toLowerCase().replace(/s$/, "")} business? Get listed.`, sub: `Placement on this exact page, plus your own SEO-built mini-site — from $65/month, built for you.` })}
  ${Footer()}`;

  return {
    html,
    seo: {
      title: `${cat.name} in ${c.name}, ${s.abbrev} — ${c.name} ${cat.name} Directory | ${s.brand}`,
      description: `Discover ${cat.name.toLowerCase()} in ${c.name}, ${s.name} on ${s.brand}: full local business pages with offers, hours, ${cat.slug === "restaurants" ? "menus" : "services"}, and direct contact. Part of the U.S. Gold Card network.`,
      canonical: `${SITE.domain}/states/${s.slug}/cities/${c.slug}/categories/${cat.slug}`
    }
  };
}

/* ---------------- DIRECTORY ---------------- */
function pageDirectory(filters = {}) {
  const html = `
  ${Header("#/directory")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "Directory"]])}
      <div class="eyebrow" style="margin-top:20px">The National Directory</div>
      <h1>Explore every Gold Card business</h1>
      <p class="lede" style="margin-top:16px">Search and filter across every state network. Featured, Gold, and Premium businesses — each with its own mini-site.</p>
    </div>
  </div>
  <section style="padding-top:40px">
    <div class="wrap">
      ${DirectoryFilters(filters)}
      <div style="display:grid;grid-template-columns:1fr 300px;gap:26px" class="dir-layout">
        <div>
          <div class="result-count" data-dir-count></div>
          <div class="grid grid-2" data-dir-results></div>
        </div>
        <aside style="display:grid;gap:20px;align-content:start">
          <div class="map-placeholder">
            <span class="pin">📍</span>
            <span>Interactive map</span>
            <small style="font-weight:400">In production, results plot here with pins linked to each business page.</small>
          </div>
          <div class="card" style="padding:22px">
            <h3 style="font-size:16px;margin-bottom:8px">📬 Local deals inbox</h3>
            <p class="card-desc" style="margin-bottom:14px">Get hidden gems and deals for your city — free, curated, never spammy.</p>
            ${EmailCapture({ cta: "Sign Up", placeholder: "you@email.com" })}
          </div>
          <div class="card" style="padding:22px">
            <h3 style="font-size:16px;margin-bottom:8px">🏪 Own a business?</h3>
            <p class="card-desc" style="margin-bottom:14px">Get your own page in this directory — built for you, from $65/month.</p>
            <a class="btn btn-gold btn-sm btn-block" href="#/join">Get Listed</a>
          </div>
        </aside>
      </div>
    </div>
  </section>
  <style>@media (max-width: 920px) { .dir-layout { grid-template-columns: 1fr !important; } }</style>
  ${Footer()}`;

  return {
    html,
    seo: {
      title: "Business Directory — Search Every Gold Card Business | U.S. Gold Card",
      description: "Search the full U.S. Gold Card directory by state, city, category, and deals. Every business has its own SEO-built mini-site with offers, menus, and direct contact.",
      canonical: SITE.domain + "/directory"
    },
    after: initDirectory
  };
}

/* ---------------- DEALS ---------------- */
function pageDeals() {
  const deals = BUSINESSES.filter(b => b.offer);
  const byType = t => deals.filter(b => b.offer.type === t);
  const dealSection = (title, list, alt) => list.length ? `
  <section class="${alt ? "alt" : ""}">
    <div class="wrap">
      <div class="section-head"><h2>${title}</h2></div>
      <div class="grid grid-2">${list.map(DealCard).join("")}</div>
    </div>
  </section>` : "";

  const html = `
  ${Header("#/deals")}
  <div class="hero compact">
    <div class="wrap">
      ${Breadcrumbs([["#/", "Home"], [null, "Deals"]])}
      <div class="eyebrow" style="margin-top:20px">The Offer Network</div>
      <h1>Local deals worth leaving the house for</h1>
      <p class="lede" style="margin-top:16px">Every deal below is a real offer from a Gold Card business — birthday clubs, family nights, new-customer specials, and catering discounts across the network.</p>
      <div class="chip-row" style="margin-top:22px">
        ${STATES.filter(s => s.live).map(s => `<a class="chip gold" href="#/states/${s.slug}">${s.name}</a>`).join("")}
        ${CATEGORIES.slice(0, 5).map(c => `<a class="chip" style="background:rgba(250,246,238,.1);border-color:rgba(250,246,238,.2);color:var(--paper)" href="#/categories/${c.slug}">${c.icon} ${c.name}</a>`).join("")}
      </div>
    </div>
  </div>
  ${dealSection("🍽️ Restaurant deals", byType("restaurant"), false)}
  ${dealSection("🛍️ Retail deals", byType("retail"), true)}
  ${dealSection("🔧 Service deals", byType("service"), false)}
  ${dealSection("🎂 Family & birthday offers", [...byType("family")], true)}
  ${dealSection("🥘 Catering offers", byType("catering"), false)}
  <section class="dark">
    <div class="wrap two-col">
      <div>
        <div class="eyebrow">Birthday Club</div>
        <h2>Free stuff on your birthday. Seriously.</h2>
        <p class="lede" style="margin-top:12px">Join once, and birthday offers from salons, dessert bars, family fun centers, and restaurants across the network land in your inbox during your birthday month.</p>
        <div style="margin-top:22px">${EmailCapture({ placeholder: "Email + we'll ask your birthday month next", cta: "Join the Birthday Club" })}</div>
      </div>
      <div class="grid" style="gap:14px">
        ${LoyaltyOfferCard("🎂", "Birthday dessert at Brooklyn Dessert Bar", "A free plated dessert during your birthday week.", "New York")}
        ${LoyaltyOfferCard("💇", "Birthday treatment at Golden Hour Salon", "Free deep-conditioning treatment in your birthday month.", "Utah")}
        ${LoyaltyOfferCard("🎡", "Birthday jump pass at Adventure Zone", "A free jump pass every birthday year for club kids.", "Texas")}
      </div>
    </div>
  </section>
  <section>
    <div class="wrap">
      <div class="cta-band">
        <div>
          <div class="eyebrow on-dark" style="color:var(--gold-bright)">For Businesses</div>
          <h2>Your offer belongs on this page</h2>
          <p>Every Gold Card plan includes an offer — and your own offer page built to rank for "your business + deals." We write it, publish it, and promote it in campaigns.</p>
        </div>
        <div class="btn-row">
          <a class="btn btn-gold" href="#/join">Submit an Offer — Get Listed</a>
        </div>
      </div>
    </div>
  </section>
  ${Footer()}`;

  return {
    html,
    seo: {
      title: "Local Deals & Offers — Restaurants, Retail, Services & Birthday Clubs | U.S. Gold Card",
      description: "Browse real local deals across the U.S. Gold Card network: restaurant family nights, retail discounts, service specials, catering offers, and birthday club perks.",
      canonical: SITE.domain + "/deals"
    }
  };
}

/* ---------------- 404 ---------------- */
function page404() {
  return {
    html: `
    ${Header("")}
    <section style="min-height:50vh;display:flex;align-items:center">
      <div class="wrap" style="text-align:center">
        <div class="eyebrow" style="justify-content:center">404</div>
        <h1>That page isn't on the network</h1>
        <p class="lede" style="margin:14px auto 26px">Try the directory — or head back home.</p>
        <div class="btn-row" style="justify-content:center">
          <a class="btn btn-gold" href="#/">Go Home</a>
          <a class="btn btn-outline" href="#/directory">Open the Directory</a>
        </div>
      </div>
    </section>
    ${Footer()}`,
    seo: { title: "Page Not Found | U.S. Gold Card", description: "This page could not be found.", noindex: true }
  };
}

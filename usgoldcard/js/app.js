/* ============================================================
   U.S. GOLD CARD — Router, SEO head manager, interactions
   Hash routing mirrors the production URL structure:
     #/states/utah/cities/midvale/categories/restaurants
     #/utah/midvale/fajita-grill[/offers|/menu]
   ============================================================ */

const app = document.getElementById("app");

/* ---------- head / SEO manager ---------- */
function setHead(seo) {
  document.title = seo.title || SITE.name;
  const ensure = (sel, create) => {
    let el = document.head.querySelector(sel);
    if (!el) { el = create(); document.head.appendChild(el); }
    return el;
  };
  const meta = (name, content, attr = "name") => {
    const el = ensure(`meta[${attr}="${name}"]`, () => { const m = document.createElement("meta"); m.setAttribute(attr, name); return m; });
    el.setAttribute("content", content || "");
  };
  meta("description", seo.description);
  meta("robots", seo.noindex ? "noindex, nofollow" : "index, follow");
  meta("og:title", seo.ogTitle || seo.title, "property");
  meta("og:description", seo.ogDescription || seo.description, "property");
  meta("og:type", "website", "property");
  const link = ensure('link[rel="canonical"]', () => { const l = document.createElement("link"); l.rel = "canonical"; return l; });
  link.href = seo.canonical || SITE.domain + "/";
  document.querySelectorAll('script[data-jsonld]').forEach(s => s.remove());
  if (seo.jsonld) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.dataset.jsonld = "1";
    s.textContent = JSON.stringify(seo.jsonld);
    document.head.appendChild(s);
  }
}

/* ---------- router ---------- */
function parseQuery(qs) {
  const params = {};
  (qs || "").split("&").forEach(p => { const [k, v] = p.split("="); if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || ""); });
  return params;
}

function route() {
  const raw = (location.hash || "#/").slice(1);
  const [pathPart, queryPart] = raw.split("?");
  const params = parseQuery(queryPart);
  const seg = pathPart.split("/").filter(Boolean);
  let page;

  if (seg.length === 0 || pathPart === "/" || seg[0] === "home") page = pageHome();
  else if (seg[0] === "states" && seg.length === 1) page = pageStates();
  else if (seg[0] === "states" && seg.length === 2) page = pageState(seg[1]);
  else if (seg[0] === "states" && seg[2] === "cities" && seg.length === 4) page = pageCity(seg[1], seg[3]);
  else if (seg[0] === "states" && seg[2] === "cities" && seg[4] === "categories" && seg.length === 6) page = pageCityCategory(seg[1], seg[3], seg[5]);
  else if (seg[0] === "states" && seg[2] === "categories" && seg.length === 4) page = pageStateCategory(seg[1], seg[3]);
  else if (seg[0] === "cities" && seg.length === 1) page = pageCities();
  else if (seg[0] === "categories" && seg.length === 1) page = pageCategories();
  else if (seg[0] === "categories" && seg.length === 2) page = pageCategory(seg[1]);
  else if (seg[0] === "directory") page = pageDirectory(params);
  else if (seg[0] === "deals") page = pageDeals();
  else if (seg[0] === "business" && seg.length === 1) page = pageBusiness();
  else if (seg[0] === "pricing") page = pagePricing();
  else if (seg[0] === "seo") page = pageSeo();
  else if (seg[0] === "email-program") page = pageEmailProgram();
  else if (seg[0] === "loyalty") page = pageLoyalty();
  else if (seg[0] === "state-partners") page = pageStatePartners();
  else if (seg[0] === "join") page = pageJoin(params);
  else if (seg[0] === "sitemap") page = pageSitemap();
  else if (seg[0] === "admin" && seg[1] === "campaigns") page = pageAdminCampaigns();
  else if (seg[0] === "admin") page = pageAdmin();
  else if (seg.length === 3 || seg.length === 4) {
    /* business mini-site: /:state/:city/:slug[/offers|/menu] */
    const b = findBusiness(seg[2]);
    if (b && b.state === seg[0] && b.city === seg[1]) {
      if (seg[3] === "offers") page = pageBusinessOffers(b);
      else if (seg[3] === "menu") page = pageBusinessMenu(b);
      else if (seg.length === 3) page = pageBusinessProfile(b);
    }
  }
  if (!page) page = page404();

  app.innerHTML = page.html;
  setHead(page.seo || {});
  window.scrollTo({ top: 0, behavior: "instant" });
  bindInteractions();
  if (page.after) page.after();
}

/* ---------- global interactions ---------- */
function bindInteractions() {
  /* mobile nav */
  const toggle = app.querySelector("[data-nav-toggle]");
  const nav = app.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  /* demo forms */
  app.querySelectorAll("[data-demo-form]").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const msg = form.dataset.success || "Thanks! Your request has been received. (Prototype demo — no data is sent.)";
      const wrap = form.closest("[data-form-wrap]") || form.parentElement;
      const note = document.createElement("div");
      note.className = "form-success";
      note.textContent = msg;
      form.style.display = "none";
      wrap.appendChild(note);
    });
  });

  /* demo alerts (directions, external links, admin actions) */
  app.querySelectorAll("[data-demo-alert]").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      alert(el.dataset.demoAlert);
    });
  });

  /* hero search → directory with filters */
  const heroSearch = app.querySelector("[data-hero-search]");
  if (heroSearch) {
    heroSearch.addEventListener("submit", e => {
      e.preventDefault();
      const q = document.getElementById("hero-q").value.trim();
      const st = document.getElementById("hero-state").value;
      const cat = document.getElementById("hero-cat").value;
      const parts = [];
      if (q) parts.push(`q=${encodeURIComponent(q)}`);
      if (st) parts.push(`state=${st}`);
      if (cat) parts.push(`category=${cat}`);
      location.hash = `#/directory${parts.length ? "?" + parts.join("&") : ""}`;
    });
  }

  /* spotlight rotation */
  const rotBtn = app.querySelector("[data-rotate-spotlight]");
  if (rotBtn) {
    rotBtn.addEventListener("click", () => {
      const slot = app.querySelector("[data-spotlight-slot]");
      const pool = BUSINESSES.filter(b => b.homepageRotation);
      const picks = [...pool].sort(() => Math.random() - .5).slice(0, 3);
      slot.innerHTML = picks.map(b => BusinessCard(b)).join("");
    });
  }

  /* admin toggles (visual demo only) */
  app.querySelectorAll("[data-toggle]").forEach(t => {
    t.addEventListener("click", () => t.classList.toggle("on"));
  });

  /* smooth-scroll anchors */
  app.querySelectorAll("[data-scroll]").forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id.startsWith("#") && !id.startsWith("#/")) {
        e.preventDefault();
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ---------- directory logic ---------- */
function initDirectory() {
  const q = document.getElementById("dir-q");
  const st = document.getElementById("dir-state");
  const ct = document.getElementById("dir-city");
  const cat = document.getElementById("dir-cat");
  const deals = document.getElementById("dir-deals");
  const sort = document.getElementById("dir-sort");
  const results = app.querySelector("[data-dir-results]");
  const count = app.querySelector("[data-dir-count]");
  if (!results) return;

  function apply() {
    let list = [...BUSINESSES];
    const term = q.value.trim().toLowerCase();
    if (term) list = list.filter(b =>
      b.name.toLowerCase().includes(term) ||
      b.tags.join(" ").toLowerCase().includes(term) ||
      b.subcategory.toLowerCase().includes(term) ||
      b.shortDescription.toLowerCase().includes(term) ||
      findCity(b.city).name.toLowerCase().includes(term)
    );
    if (st.value) list = list.filter(b => b.state === st.value);
    if (ct.value) list = list.filter(b => b.city === ct.value);
    if (cat.value) list = list.filter(b => b.category === cat.value);
    if (deals.value) list = list.filter(b => !!b.offer);

    const v = sort.value;
    if (v === "featured") list.sort((a, b) => (b.featured - a.featured) || (TIER_PRICE[b.tier] - TIER_PRICE[a.tier]));
    else if (v === "newest") list.sort((a, b) => b.id - a.id);
    else if (v === "deals") list.sort((a, b) => (!!b.offer - !!a.offer));
    else if (v === "popular") list.sort((a, b) => b.emailSignupCount - a.emailSignupCount);
    else if (v === "restaurants") list.sort((a, b) => (b.category === "restaurants") - (a.category === "restaurants"));
    else if (v === "local-shops") list.sort((a, b) => (["local-shops", "antiques"].includes(b.category)) - (["local-shops", "antiques"].includes(a.category)));
    else if (v === "services") {
      const svc = x => ["home-services", "professional-services", "catering", "salons", "fitness-wellness"].includes(x.category);
      list.sort((a, b) => svc(b) - svc(a));
    }

    count.textContent = `${list.length} business${list.length === 1 ? "" : "es"} · every result is a full Gold Card mini-site`;
    results.innerHTML = list.length
      ? list.map(b => BusinessCard(b)).join("")
      : `<div class="card" style="padding:30px;grid-column:1/-1;text-align:center">
           <h3>No matches — yet.</h3>
           <p class="card-desc" style="margin-top:8px">That's a founding opportunity. ${esc(SITE.copy.earlyMarket)}</p>
           <div style="margin-top:14px"><a class="btn btn-gold btn-sm" href="#/join">Claim the Spot</a></div>
         </div>`;
  }

  [q, st, ct, cat, deals, sort].forEach(el => {
    el.addEventListener("input", apply);
    el.addEventListener("change", apply);
  });
  apply();
}

/* ---------- admin table filters ---------- */
function initAdminFilters() {
  const q = document.getElementById("adm-q");
  const st = document.getElementById("adm-state");
  const ct = document.getElementById("adm-city");
  const cat = document.getElementById("adm-cat");
  const status = document.getElementById("adm-status");
  if (!q) return;
  function apply() {
    const term = q.value.trim().toLowerCase();
    app.querySelectorAll("[data-adm-row]").forEach(row => {
      const ok =
        (!term || row.dataset.name.includes(term)) &&
        (!st.value || row.dataset.state === st.value) &&
        (!ct.value || row.dataset.city === ct.value) &&
        (!cat.value || row.dataset.cat === cat.value) &&
        (!status.value || row.dataset.status === status.value);
      row.style.display = ok ? "" : "none";
    });
  }
  [q, st, ct, cat, status].forEach(el => { el.addEventListener("input", apply); el.addEventListener("change", apply); });
}

window.addEventListener("hashchange", route);
route();

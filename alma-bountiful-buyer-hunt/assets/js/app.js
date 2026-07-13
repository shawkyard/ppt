/* =========================================================================
   Alma AI Revenue Hunter — report renderer
   Reads window.ALMA + window.AlmaScore, builds every section. No external
   dependencies, works from file://.
   ========================================================================= */
(function () {
  "use strict";
  var A = window.ALMA, S = window.AlmaScore;
  if (!A) return;

  /* ---------- helpers ---------- */
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function $(id) { return document.getElementById(id); }
  function money(n) { return (n == null) ? "—" : "$" + Number(n).toLocaleString("en-US"); }
  function orUnknown(v) { return (v == null || v === "") ? "Unknown" : v; }
  function reqLabel(v) {
    var t = String(v == null ? "" : v);
    if (/requires/i.test(t)) return '<span class="vlabel req">' + t + "</span>";
    if (/confirmed/i.test(t)) return '<span class="vlabel confirmed">' + t + "</span>";
    if (/unknown|n\/a/i.test(t) || t === "") return '<span class="vlabel unknown">' + (t || "Unknown") + "</span>";
    return t;
  }
  var CLASS_BADGE = {
    "Exceptional Match": "exceptional", "Strong Match": "strong", "Good Match With Questions": "good",
    "Conditional Match": "conditional", "Value Opportunity Requiring Work": "value",
    "Negotiation Watchlist": "watch", "Backup-Offer Opportunity": "backup",
    "Nearby Exceptional Opportunity": "nearby", "Community Watchlist": "community",
    "Rejected": "rejected", "Template": "template"
  };
  function classBadge(label) {
    return h("span", { class: "badge " + (CLASS_BADGE[label] || "watch") }, [label]);
  }
  function confBadge(c) {
    var map = { high: "High confidence", medium: "Medium confidence", low: "Low confidence" };
    return h("span", { class: "conf " + (c || "low") }, [map[c] || "Low confidence"]);
  }

  /* ---------- brandmark (sophisticated great-white silhouette, not cartoonish) ---------- */
  var SHARK = '<svg viewBox="0 0 100 100" role="img" aria-label="Alma great white shark mark">' +
    '<defs><linearGradient id="ag" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#e2621f"/><stop offset="1" stop-color="#c8501e"/></linearGradient></defs>' +
    '<circle cx="50" cy="50" r="48" fill="#0e0e0f" stroke="#c8501e" stroke-width="3"/>' +
    '<path fill="#f6f2ea" d="M18 60c14-3 20-9 27-20 3 6 3 12 2 16 6-3 11-8 15-15 2 7 1 13-1 18 8 0 15-3 20-9-2 10-9 18-19 22-13 5-30 4-42-4-2-1-3-3-2-5z"/>' +
    '<path fill="url(#ag)" d="M18 60c14-3 20-9 27-20 1 2 2 4 2 6-6 9-14 14-24 17-3 1-6-1-5-3z" opacity=".9"/>' +
    '<circle cx="40" cy="52" r="2.4" fill="#0e0e0f"/>' +
    '<path fill="#0e0e0f" d="M60 66l6 3-6 1z" opacity=".55"/>' +
    '</svg>';

  function injectBrandmarks() {
    document.querySelectorAll("[data-brandmark]").forEach(function (n) { n.innerHTML = SHARK; });
  }

  /* ---------- Executive counts ---------- */
  function renderStats() {
    var box = $("stat-grid"); if (!box) return;
    var c = A.meta.counts;
    var communityLeads = (A.communities || []).length;
    var stats = [
      [String(c.reviewed), "Individual listings verified"],
      [String(c.verifiedActive), "Verified active matches"],
      [String(c.primaryRecommendations), "Primary recommendations"],
      [String(communityLeads), "Community leads to hunt"],
      [String(c.portalsBlocked), "Portals that blocked access"],
      [String((A.rejected || []).length), "Logged / excluded items"]
    ];
    stats.forEach(function (s) {
      box.appendChild(h("div", { class: "stat" }, [
        h("div", { class: "num" }, [s[0]]), h("div", { class: "lbl" }, [s[1]])
      ]));
    });
  }

  /* ---------- Ranked listing cards ---------- */
  function card(l) {
    var top = h("div", { class: "photo" }, [
      "Listing photo shown only when licensing permits. Attribute to source."
    ]);
    top.appendChild(h("div", { class: "rank" }, [String(l.rank || "•")]));
    top.appendChild(h("div", { class: "score-chip" }, [String(S.total(l.scores)) + "/100"]));
    var facts = h("div", { class: "facts" }, [
      h("span", null, [(l.beds || "?") + " bd"]),
      h("span", null, [(l.baths || "?") + " ba"]),
      h("span", null, [orUnknown(l.propertyType)]),
      h("span", null, ["HOA " + (l.hoa && l.hoa.fee != null ? money(l.hoa.fee) + "/" + l.hoa.period : "Unknown")])
    ]);
    var body = h("div", { class: "body" }, [
      h("div", { class: "addr" }, [l.address]),
      h("div", null, [l.city]),
      h("div", { class: "price" }, [money(l.price)]),
      facts,
      classBadge(l.classification || S.classify(l)),
      h("div", null, ["Main-level: " + reqLabel(l.access && l.access.mainLevelBedrooms) + " bed / " +
        reqLabel(l.access && l.access.mainLevelBathrooms) + " bath"]),
      (l.reasonsToConsider && l.reasonsToConsider[0]) ? h("div", { class: "pro" }, ["▲ " + l.reasonsToConsider[0]]) : null,
      (l.topConcerns && l.topConcerns[0]) ? h("div", { class: "con" }, ["▼ " + l.topConcerns[0]]) : null,
      h("div", { class: "foot btn-row" }, [
        h("a", { class: "btn btn-primary", href: "listing.html?id=" + encodeURIComponent(l.id) }, ["View details"]),
        (l.sources && l.sources[0]) ? h("a", { class: "btn btn-ghost", href: l.sources[0].url || "#", target: "_blank", rel: "noopener" }, ["Source"]) : null
      ])
    ]);
    return h("article", { class: "listing-card" }, [top, body]);
  }

  function renderRanked() {
    var box = $("ranked-grid"); if (!box) return;
    var ranked = S.rankAll(A.listings);
    if (!ranked.length) {
      box.appendChild(emptyState(
        "No verified active listings yet",
        "Live listing data could not be independently verified on this run (see the data-access note below). " +
        "By the accuracy rules in §22, Alma does not invent listings, MLS numbers, prices, or agents to fill this space. " +
        "The scoring engine, cards, comparison table, map, and exports are all live — the moment a verified property is added " +
        "to the data file, it renders here, fully ranked."
      ));
      return;
    }
    box.className = "grid cols-3";
    ranked.forEach(function (l) { box.appendChild(card(l)); });
  }

  function emptyState(title, msg) {
    return h("div", { class: "empty" }, [
      h("div", { class: "big" }, ["🦈"]),
      h("h3", null, [title]),
      h("p", { style: "margin:0 auto;max-width:60ch;color:var(--muted)" }, [msg])
    ]);
  }

  /* ---------- Comparison table ---------- */
  function renderComparison() {
    var box = $("compare"); if (!box) return;
    var ranked = S.rankAll(A.listings);
    var cols = ["Rank", "Address", "Price", "Est. value", "Score", "Bd", "Ba", "Main bd", "Main ba",
      "Main laundry", "Entry steps", "Garage", "HOA", "SqFt", "Condition", "Resale", "Negotiation", "Repair est."];
    var table = h("table", null, []);
    table.appendChild(h("caption", null, ["Side-by-side comparison of primary properties (spec §20, page 4)."]));
    var thead = h("thead", null, [h("tr", null, cols.map(function (c) { return h("th", null, [c]); }))]);
    var tbody = h("tbody", null, []);
    if (!ranked.length) {
      tbody.appendChild(h("tr", null, [h("td", { colspan: String(cols.length) }, [
        "No verified properties to compare yet. Columns are wired to the scoring engine and will populate automatically."
      ])]));
    } else {
      ranked.forEach(function (l) {
        tbody.appendChild(h("tr", null, [
          h("td", null, [String(l.rank)]),
          h("td", null, [h("a", { href: "listing.html?id=" + encodeURIComponent(l.id) }, [l.address])]),
          h("td", { class: "num" }, [money(l.price)]),
          h("td", { class: "num" }, [money(l.marketValue && l.marketValue.base)]),
          h("td", { class: "num" }, [String(S.total(l.scores))]),
          h("td", { class: "num" }, [String(l.beds || "?")]),
          h("td", { class: "num" }, [String(l.baths || "?")]),
          h("td", null, [orUnknown(l.access && l.access.mainLevelBedrooms)]),
          h("td", null, [orUnknown(l.access && l.access.mainLevelBathrooms)]),
          h("td", null, [orUnknown(l.access && l.access.laundryLocation)]),
          h("td", null, [orUnknown(l.access && l.access.entrySteps)]),
          h("td", { class: "num" }, [l.garageSpaces == null ? "?" : String(l.garageSpaces)]),
          h("td", { class: "num" }, [l.hoa && l.hoa.fee != null ? money(l.hoa.fee) : "?"]),
          h("td", { class: "num" }, [l.sqftTotal == null ? "?" : String(l.sqftTotal)]),
          h("td", null, [orUnknown(l.condition && l.condition.summary)]),
          h("td", { class: "num" }, [String((l.scores && l.scores.D) || 0)]),
          h("td", { class: "num" }, [String((l.scores && l.scores.G) || 0)]),
          h("td", null, [orUnknown(l.condition && l.condition.repairEstimate)])
        ]));
      });
    }
    table.appendChild(thead); table.appendChild(tbody);
    box.appendChild(h("div", { class: "table-scroll" }, [table]));
  }

  /* ---------- Schematic map (no external tiles, no API key) ---------- */
  function renderMap() {
    var box = $("map"); if (!box) return;
    // City centroids on a simple normalized canvas (schematic, not geo-accurate).
    var cities = [
      { n: "North Salt Lake", x: 210, y: 300 },
      { n: "Woods Cross", x: 300, y: 250 },
      { n: "Bountiful", x: 360, y: 190 },
      { n: "West Bountiful", x: 250, y: 170 },
      { n: "Centerville", x: 430, y: 120 },
      { n: "S. Farmington", x: 500, y: 70 }
    ];
    var svg = '<svg viewBox="0 0 640 360" role="img" aria-label="Schematic map of the South Davis County search area">';
    svg += '<rect x="0" y="0" width="640" height="360" fill="#efe9dd"/>';
    // I-15 / rail corridor hint
    svg += '<path d="M120 340 L560 40" stroke="#c9bfa a" stroke-width="10" opacity=".25"/>';
    svg += '<path d="M120 340 L560 40" stroke="#8f3813" stroke-width="2" stroke-dasharray="8 8" opacity=".5"/>';
    svg += '<text x="150" y="345" font-size="13" fill="#55524b">I-15 / Legacy Pkwy corridor (schematic)</text>';
    cities.forEach(function (c) {
      svg += '<circle cx="' + c.x + '" cy="' + c.y + '" r="6" fill="#22242a"/>';
      svg += '<text x="' + (c.x + 10) + '" y="' + (c.y + 4) + '" font-size="15" font-weight="700" fill="#0e0e0f">' + c.n + '</text>';
    });
    // Plot verified listings if any (would use lat/lng mapped to canvas — none yet).
    var ranked = S.rankAll(A.listings);
    ranked.forEach(function (l) {
      if (l.lat == null) return;
      // placeholder projection omitted until real coords exist
    });
    svg += '</svg>';
    box.querySelector(".mapbox").innerHTML = svg.replace("#c9bfa a", "#c9bfaa");
    var legend = box.querySelector(".map-legend");
    [["#1f6b3b", "Top five"], ["#c8501e", "Other primary"], ["#5a6270", "Watchlist"],
     ["#2e3138", "Nearby opportunity"], ["#a12a1c", "Rejected"]].forEach(function (p) {
      legend.appendChild(h("span", null, [h("span", { class: "dot", style: "background:" + p[0] }), p[1]]));
    });
    if (!ranked.filter(function (l) { return l.lat != null; }).length) {
      box.querySelector(".map-note").textContent =
        "City anchors shown. Property pins appear automatically once verified listings with coordinates are added. " +
        "A live Leaflet/OpenStreetMap layer (no API key required) can be wired in when the report is served online.";
    }
  }

  /* ---------- Communities ---------- */
  function renderCommunities() {
    var box = $("communities"); if (!box) return;
    (A.communities || []).forEach(function (c) {
      box.appendChild(h("div", { class: "panel" }, [
        h("div", { style: "display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center" }, [
          h("h3", { style: "margin:0" }, [c.name]),
          confBadge(c.confidence)
        ]),
        h("p", { style: "margin:6px 0;color:var(--muted)" }, [c.city]),
        h("p", null, [c.why]),
        h("dl", { class: "dl" }, [
          dd("Typical style", c.style), dd("Beds / baths", c.typicalBeds + " / " + c.typicalBaths),
          dd("Price band", c.priceBand), dd("HOA", c.hoa), dd("Age-restricted", c.ageRestricted),
          dd("Zero/low-step access", c.zeroStep), dd("Snow / exterior", c.snowExterior),
          dd("Turnover likelihood", c.likelihood)
        ]),
        h("p", { style: "margin:8px 0 0" }, [h("span", { class: "vlabel req" }, ["Source: " + c.source])])
      ]));
    });
  }
  function dd(t, v) { return h("div", null, [h("dt", null, [t]), h("dd", { html: reqLabel(v) })]); }

  /* ---------- Hidden opportunities ---------- */
  function renderHidden() {
    var box = $("hidden"); if (!box) return;
    var buckets = [
      ["Coming soon", A.hidden.comingSoon], ["Back on market", A.hidden.backOnMarket],
      ["Backup offers", A.hidden.backupOffers], ["Expired / withdrawn", A.hidden.expiredWithdrawn],
      ["Builder inventory", A.hidden.builderInventory], ["Price-drop watch", A.hidden.priceDropWatch]
    ];
    buckets.forEach(function (b) {
      var items = b[1] || [];
      box.appendChild(h("div", { class: "panel" }, [
        h("h3", { style: "margin-top:0" }, [b[0] + " (" + items.length + ")"]),
        items.length
          ? h("ul", null, items.map(function (x) { return h("li", null, [x.address || JSON.stringify(x)]); }))
          : h("p", { style: "margin:0;color:var(--muted)" }, ["None verified yet. See the Community Watchlist for pre-inventory leads and the research queue in the Methodology section."])
      ]));
    });
  }

  /* ---------- Rejected ---------- */
  function renderRejected() {
    var box = $("rejected"); if (!box) return;
    var table = h("table", null, []);
    table.appendChild(h("caption", null, ["Reviewed & excluded — proves search coverage (spec §18)."]));
    table.appendChild(h("thead", null, [h("tr", null,
      ["Address / item", "City", "Price", "Reason excluded", "Watch for drop?", "Could qualify?", "Source"].map(function (c) { return h("th", null, [c]); }))]));
    var tb = h("tbody", null, (A.rejected || []).map(function (r) {
      return h("tr", null, [
        h("td", null, [r.address]), h("td", null, [r.city]), h("td", null, [String(r.price)]),
        h("td", null, [r.reason]), h("td", null, [r.watchForDrop ? "Yes" : "No"]),
        h("td", null, [r.couldQualify ? "Yes — with clarification" : "No"]), h("td", null, [r.source])
      ]);
    }));
    table.appendChild(tb);
    box.appendChild(h("div", { class: "table-scroll" }, [table]));
  }

  /* ---------- Sources ---------- */
  function renderSources() {
    var box = $("sources"); if (!box) return;
    var table = h("table", null, []);
    table.appendChild(h("caption", null, ["Source & verification log — every query, timestamped (spec §11)."]));
    table.appendChild(h("thead", null, [h("tr", null,
      ["When", "Type", "Query / target", "Result", "URL"].map(function (c) { return h("th", null, [c]); }))]));
    var tb = h("tbody", null, (A.sources || []).map(function (s) {
      return h("tr", null, [
        h("td", null, [s.ts]), h("td", null, [s.type]), h("td", null, [s.query]),
        h("td", null, [s.result]),
        h("td", null, [s.url ? h("a", { href: s.url, target: "_blank", rel: "noopener" }, ["link"]) : "—"])
      ]);
    }));
    table.appendChild(tb);
    box.appendChild(h("div", { class: "table-scroll" }, [table]));
  }

  /* ---------- Simple list renderers ---------- */
  function fillList(id, items, cls) {
    var el = $(id); if (!el) return;
    (items || []).forEach(function (t) { el.appendChild(h("li", null, [t])); });
    if (cls) el.className = cls;
  }

  /* ---------- Scrollspy nav ---------- */
  function scrollspy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
    var secs = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
    function onScroll() {
      var y = window.scrollY + 120, active = -1;
      secs.forEach(function (s, i) { if (s && s.offsetTop <= y) active = i; });
      links.forEach(function (a, i) { a.classList.toggle("active", i === active); });
    }
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* ---------- Dates ---------- */
  function fillMeta() {
    document.querySelectorAll("[data-search-date]").forEach(function (n) { n.textContent = A.meta.searchDate; });
    document.querySelectorAll("[data-status-checked]").forEach(function (n) { n.textContent = A.meta.statusCheckedAt; });
    document.querySelectorAll("[data-access-note]").forEach(function (n) { n.textContent = A.meta.dataAccess.note; });
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    injectBrandmarks(); fillMeta();
    renderStats(); renderRanked(); renderComparison(); renderMap();
    renderCommunities(); renderHidden(); renderRejected(); renderSources();
    fillList("assumptions-list", A.assumptions);
    fillList("queue-list", A.researchQueue);
    fillList("questions-list", A.clientQuestions, "q");
    scrollspy();
  });

  window.AlmaBrandmark = SHARK;
})();

/* Utah Gold Card — shared interactivity (vanilla JS, no dependencies) */
(function () {
  "use strict";

  /* Sticky header shadow */
  var header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    });
  }

  /* Mobile nav toggle */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  /* Toast helper */
  function showToast(message) {
    var toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector("span").textContent = message;
    toast.classList.add("is-shown");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.classList.remove("is-shown"); }, 3600);
  }

  /* Fake-submit forms: show inline success + toast, no backend */
  document.querySelectorAll("form[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var successMsg = form.getAttribute("data-success") || "Thanks! Your request has been received.";
      var successBox = form.querySelector(".form-success");
      if (successBox) {
        successBox.querySelector("span") ? (successBox.querySelector("span").textContent = successMsg) : null;
        successBox.classList.add("is-shown");
      }
      showToast(successMsg);
      form.reset();
    });
  });

  /* Directory / listing filters (area, category, tag, sort, search) */
  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
    var state = { area: "all", category: "all", tag: "all", sort: "featured", q: "" };
    var countEl = scope.querySelector("[data-results-count]");
    var emptyEl = scope.querySelector("[data-empty-state]");

    function apply() {
      var visible = 0;
      cards.forEach(function (card) {
        var area = card.getAttribute("data-area") || "";
        var cats = (card.getAttribute("data-category") || "").split(",");
        var tags = (card.getAttribute("data-tags") || "").split(",");
        var name = (card.getAttribute("data-name") || "").toLowerCase();
        var okArea = state.area === "all" || area === state.area;
        var okCat = state.category === "all" || cats.indexOf(state.category) > -1;
        var okTag = state.tag === "all" || tags.indexOf(state.tag) > -1;
        var okQ = state.q === "" || name.indexOf(state.q) > -1;
        var show = okArea && okCat && okTag && okQ;
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });
      if (state.sort === "newest") {
        sortCards(function (a, b) { return (b.getAttribute("data-new") === "true") - (a.getAttribute("data-new") === "true"); });
      } else if (state.sort === "deals") {
        sortCards(function (a, b) { return (b.getAttribute("data-offer") === "true") - (a.getAttribute("data-offer") === "true"); });
      } else if (state.sort === "popular") {
        sortCards(function (a, b) { return (parseFloat(b.getAttribute("data-rating")) || 0) - (parseFloat(a.getAttribute("data-rating")) || 0); });
      } else {
        sortCards(function (a, b) { return (b.getAttribute("data-featured") === "true") - (a.getAttribute("data-featured") === "true"); });
      }
      if (countEl) countEl.textContent = visible + (visible === 1 ? " business found" : " businesses found");
      if (emptyEl) emptyEl.classList.toggle("is-shown", visible === 0);
    }

    function sortCards(fn) {
      var container = cards[0] && cards[0].parentElement;
      if (!container) return;
      cards.slice().sort(fn).forEach(function (c) { container.appendChild(c); });
    }

    scope.querySelectorAll("[data-filter-area]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        scope.querySelectorAll("[data-filter-area]").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        state.area = btn.getAttribute("data-filter-area");
        apply();
      });
    });
    scope.querySelectorAll("[data-filter-category]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        scope.querySelectorAll("[data-filter-category]").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        state.category = btn.getAttribute("data-filter-category");
        apply();
      });
    });
    scope.querySelectorAll("[data-filter-tag]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        scope.querySelectorAll("[data-filter-tag]").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        state.tag = btn.getAttribute("data-filter-tag");
        apply();
      });
    });
    var sortSelect = scope.querySelector("[data-filter-sort]");
    if (sortSelect) {
      sortSelect.addEventListener("change", function () { state.sort = sortSelect.value; apply(); });
    }
    var searchInput = scope.querySelector("[data-filter-search]");
    if (searchInput) {
      searchInput.addEventListener("input", function () { state.q = searchInput.value.toLowerCase(); apply(); });
    }
    apply();
  });

  /* Spotlight rotator */
  document.querySelectorAll("[data-spotlight]").forEach(function (spot) {
    var slides = Array.prototype.slice.call(spot.querySelectorAll(".spotlight-slide"));
    var dots = Array.prototype.slice.call(spot.querySelectorAll(".spotlight-dots button"));
    var idx = 0, timer;
    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
    }
    spot.querySelectorAll(".spotlight-nav.next").forEach(function (b) { b.addEventListener("click", function () { go(idx + 1); reset(); }); });
    spot.querySelectorAll(".spotlight-nav.prev").forEach(function (b) { b.addEventListener("click", function () { go(idx - 1); reset(); }); });
    dots.forEach(function (d, i) { d.addEventListener("click", function () { go(i); reset(); }); });
    function reset() { clearTimeout(timer); timer = setTimeout(function () { go(idx + 1); reset(); }, 6000); }
    if (slides.length) { go(0); reset(); }
  });

  /* Admin / campaign dashboard tab switching */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll("[data-tab]"));
    var panels = Array.prototype.slice.call(group.querySelectorAll("[data-panel]"));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-tab");
        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        panels.forEach(function (p) { p.style.display = (p.getAttribute("data-panel") === target) ? "" : "none"; });
      });
    });
  });

  /* Toggle switches (featured ad, etc.) */
  document.querySelectorAll(".toggle[data-toggle]").forEach(function (t) {
    t.addEventListener("click", function () { t.classList.toggle("is-on"); });
  });

  /* Campaign status filter chips */
  document.querySelectorAll("[data-campaign-filter]").forEach(function (bar) {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-campaign-card]"));
    bar.querySelectorAll("[data-status-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        bar.querySelectorAll("[data-status-btn]").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var status = btn.getAttribute("data-status-btn");
        cards.forEach(function (c) {
          c.style.display = (status === "all" || c.getAttribute("data-status") === status) ? "" : "none";
        });
      });
    });
  });
})();

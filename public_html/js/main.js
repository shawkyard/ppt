/* B2B Local Sales Machine — prototype interactions */
(function () {
  "use strict";

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  /* ---- Video placeholders (prototype only) ---- */
  document.querySelectorAll(".video-ph").forEach(function (v) {
    v.addEventListener("click", function () {
      alert("▶  Video placeholder\n\nIn the live site this plays the explainer video. This is a clickable prototype, so the video is not embedded yet.");
    });
  });

  /* ---- Demo forms: never actually submit ---- */
  document.querySelectorAll("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = f.querySelector(".form-note");
      if (note) {
        note.style.display = "block";
        note.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        alert("✅ Thanks! In the live platform this lead is captured and routed to the business. (Prototype — nothing was sent.)");
      }
      f.reset();
    });
  });

  /* ---- Filter / selector chips (visual demo) ---- */
  document.querySelectorAll("[data-chipgroup]").forEach(function (group) {
    group.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        if (group.getAttribute("data-chipgroup") === "multi") {
          chip.classList.toggle("active");
        } else {
          group.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
          chip.classList.add("active");
        }
      });
    });
  });

  /* ---- Directory live text search (client-side demo) ---- */
  var search = document.querySelector("[data-dirsearch]");
  if (search) {
    search.addEventListener("input", function () {
      var q = search.value.toLowerCase().trim();
      document.querySelectorAll("[data-biz]").forEach(function (card) {
        var hay = card.getAttribute("data-biz").toLowerCase();
        card.style.display = hay.indexOf(q) > -1 ? "" : "none";
      });
    });
  }

  /* ---- Campaign builder wizard ---- */
  var wizard = document.querySelector("[data-wizard]");
  if (wizard) {
    var panels = wizard.querySelectorAll(".wpanel");
    var steps = document.querySelectorAll(".wizard-steps .ws");
    var idx = 0;
    var show = function (i) {
      idx = Math.max(0, Math.min(panels.length - 1, i));
      panels.forEach(function (p, n) { p.classList.toggle("active", n === idx); });
      steps.forEach(function (s, n) {
        s.classList.toggle("active", n === idx);
        s.classList.toggle("done", n < idx);
      });
      wizard.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    wizard.querySelectorAll("[data-next]").forEach(function (b) {
      b.addEventListener("click", function () { show(idx + 1); });
    });
    wizard.querySelectorAll("[data-prev]").forEach(function (b) {
      b.addEventListener("click", function () { show(idx - 1); });
    });
    steps.forEach(function (s, n) {
      s.addEventListener("click", function () { show(n); });
    });
    show(0);
  }

  /* ---- Message studio: generate drafts ---- */
  var gen = document.querySelector("[data-generate]");
  if (gen) {
    gen.addEventListener("click", function () {
      var out = document.querySelector("[data-msgout]");
      if (out) {
        out.style.display = "block";
        out.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  /* ---- ROI slider (revenue example) ---- */
  var slider = document.querySelector("[data-roi]");
  if (slider) {
    var render = function () {
      var clients = parseInt(slider.value, 10);
      var mrr = 4000;
      var monthly = clients * mrr;
      var annual = monthly * 12;
      var fmt = function (n) { return "$" + n.toLocaleString("en-US"); };
      document.querySelector("[data-roi-clients]").textContent = clients;
      document.querySelector("[data-roi-monthly]").textContent = fmt(monthly);
      document.querySelector("[data-roi-annual]").textContent = fmt(annual);
    };
    slider.addEventListener("input", render);
    render();
  }

  /* ---- Year in footer ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

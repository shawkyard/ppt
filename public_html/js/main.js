/* Fajita Grill — shared site behavior */
(function () {
  "use strict";

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    });
    var close = nav.querySelector(".nav-close");
    if (close) {
      close.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    }
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  // Dropdown (tap support on touch devices)
  document.querySelectorAll(".nav-drop > button").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var drop = btn.parentElement;
      drop.classList.toggle("open");
      btn.setAttribute("aria-expanded", drop.classList.contains("open") ? "true" : "false");
    });
  });
  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-drop.open").forEach(function (d) {
      if (!d.closest(".nav.open")) d.classList.remove("open");
    });
  });

  // Inquiry forms: compose an email via mailto until a form service is connected.
  // See docs/HOSTINGER-DEPLOYMENT.md for connecting a real form endpoint.
  document.querySelectorAll("form[data-inquiry]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var to = form.getAttribute("data-inquiry-to") || "";
      var subject = form.getAttribute("data-inquiry-subject") || "Website inquiry — Fajita Grill";
      var lines = [];
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (!field.name || field.type === "submit") return;
        lines.push(field.name + ": " + field.value);
      });
      var body = encodeURIComponent(lines.join("\n"));
      if (to) {
        window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + body;
      }
      window.setTimeout(function () { window.location.href = "thank-you.html"; }, 400);
    });
  });

  // Real photos: if an image file hasn't been uploaded yet, fall back to its
  // labeled placeholder slot (or the FG monogram for the header logo).
  function imgFailed(img) {
    img.hidden = true;
    var n = img.nextElementSibling;
    if (n && (n.classList.contains("img-slot") || n.classList.contains("brand-mark"))) {
      n.hidden = false;
    }
  }
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.classList.contains("real-img")) imgFailed(t);
  }, true);
  // Images that failed before this script ran won't fire the listener — sweep them now.
  document.querySelectorAll("img.real-img").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) imgFailed(img);
  });

  // Respect reduced-motion preference for the background hero video
  var heroVideo = document.querySelector(".hero-video-bg");
  if (heroVideo && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroVideo.pause();
  }

  // Current year in footer
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

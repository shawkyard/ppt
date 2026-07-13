/* =========================================================================
   Alma AI Revenue Hunter — Scoring & Ranking Engine (spec §15)
   Pure functions. Given a listing record it returns the 0–100 total from the
   eight weighted components A–H, plus a classification suggestion and the
   ranking sort key. No network, no side effects.
   ========================================================================= */
(function (root) {
  "use strict";

  var MAX = { A: 25, B: 20, C: 15, D: 15, E: 10, F: 7, G: 5, H: 3 };

  // Clamp a component to its ceiling.
  function cap(v, k) { v = Number(v) || 0; return Math.max(0, Math.min(v, MAX[k])); }

  // Total 0–100 from a scores object {A..H}.
  function total(scores) {
    if (!scores) return 0;
    return ["A", "B", "C", "D", "E", "F", "G", "H"]
      .reduce(function (sum, k) { return sum + cap(scores[k], k); }, 0);
  }

  // Suggested classification from total + hard gates. Ranking must never let a
  // cheaper home outrank a more suitable one (spec §15 ranking rules), so the
  // gate checks come first.
  function classify(listing) {
    if (!listing) return "Rejected";
    if (listing.isTemplate) return "Template";
    var m = mandatory(listing);
    if (!m.ok) return "Rejected";
    var t = total(listing.scores);
    if (t >= 88) return "Exceptional Match";
    if (t >= 78) return "Strong Match";
    if (t >= 68) return "Good Match With Questions";
    if (t >= 58) return "Conditional Match";
    if (t >= 45) return "Value Opportunity Requiring Work";
    return "Rejected";
  }

  // Hard mandatory gates (spec §2 / §24). Returns {ok, fails[]}.
  function mandatory(l) {
    var fails = [];
    if (l.price != null && l.price > 500000) fails.push("Over $500,000");
    if (l.beds != null && l.beds < 2) fails.push("Fewer than 2 bedrooms");
    if (l.baths != null && l.baths < 2) fails.push("Fewer than 2 bathrooms");
    // main-level bedroom mandatory (assumption default). Only fail on a
    // confirmed negative, never on Unknown.
    var mlb = String((l.access && l.access.mainLevelBedrooms) || "").toLowerCase();
    if (/\bnone\b|no main|0 main|zero main/.test(mlb)) fails.push("No main-level bedroom");
    return { ok: fails.length === 0, fails: fails };
  }

  // Confidence label passthrough with a sane default.
  function confidence(l) {
    return (l && l.confidence) ? l.confidence : "low";
  }

  // Comparable ranking sort: suitability (B) → mandatory compliance → total →
  // value (C) → resale (D) → negotiation (G). Returns negative if a ranks first.
  function rankCmp(a, b) {
    var am = mandatory(a).ok ? 1 : 0, bm = mandatory(b).ok ? 1 : 0;
    // suitability first
    var as = cap(a.scores && a.scores.B, "B"), bs = cap(b.scores && b.scores.B, "B");
    if (bs !== as) return bs - as;
    if (bm !== am) return bm - am;
    var at = total(a.scores), bt = total(b.scores);
    if (bt !== at) return bt - at;
    var av = cap(a.scores && a.scores.C, "C"), bv = cap(b.scores && b.scores.C, "C");
    if (bv !== av) return bv - av;
    var ad = cap(a.scores && a.scores.D, "D"), bd = cap(b.scores && b.scores.D, "D");
    if (bd !== ad) return bd - ad;
    var ag = cap(a.scores && a.scores.G, "G"), bg = cap(b.scores && b.scores.G, "G");
    return bg - ag;
  }

  // Rank an array in place-safe copy; assigns .rank (1-based) and returns it.
  function rankAll(listings) {
    var arr = (listings || []).filter(function (l) { return l && !l.isTemplate; }).slice();
    arr.sort(rankCmp);
    arr.forEach(function (l, i) { l.rank = i + 1; });
    return arr;
  }

  root.AlmaScore = {
    MAX: MAX, total: total, classify: classify, mandatory: mandatory,
    confidence: confidence, rankCmp: rankCmp, rankAll: rankAll
  };
})(window);

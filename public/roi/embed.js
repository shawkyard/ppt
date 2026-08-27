/*
 * Loyalty ROI Calculator — one-line embed
 *
 * Client sites paste:
 *
 *   <script src="https://YOUR-HOST/roi/embed.js" async
 *           data-brand="Acme Rewards"
 *           data-color="0f766e"
 *           data-logo="https://acme.com/logo.png"
 *           data-cta="Send me my report"
 *           data-lead-webhook="https://acme.com/api/leads"></script>
 *
 * The script replaces itself with a responsive iframe pointing at the hosted
 * calculator, keeps the iframe's height in sync, and re-emits captured leads
 * as a `roi-lead` CustomEvent on `window` so the host page can push them to
 * its own CRM/analytics.
 */
(function () {
  var script = document.currentScript;
  if (!script) return;

  var base = script.src.replace(/embed\.js.*$/, 'calculator.html');
  var params = new URLSearchParams();
  var map = {
    brand: 'brand', sub: 'sub', color: 'color', ink: 'ink', logo: 'logo',
    cta: 'cta', leadWebhook: 'leadWebhook', powered: 'powered'
  };
  Object.keys(map).forEach(function (key) {
    var attr = 'data-' + key.replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); });
    var v = script.getAttribute(attr);
    if (v) params.set(map[key], v);
  });

  var iframe = document.createElement('iframe');
  iframe.src = base + (params.toString() ? '?' + params.toString() : '');
  iframe.style.width = '100%';
  iframe.style.border = '0';
  iframe.style.display = 'block';
  iframe.style.minHeight = '640px';
  iframe.setAttribute('title', 'Loyalty ROI Calculator');
  iframe.setAttribute('loading', 'lazy');
  script.parentNode.insertBefore(iframe, script);

  var origin = new URL(base).origin;
  window.addEventListener('message', function (e) {
    if (e.origin !== origin || e.source !== iframe.contentWindow) return;
    var d = e.data || {};
    if (d.type === 'roi-resize' && typeof d.height === 'number') {
      iframe.style.height = Math.max(400, Math.min(d.height, 4000)) + 'px';
      iframe.style.minHeight = '0';
    } else if (d.type === 'roi-lead') {
      try {
        window.dispatchEvent(new CustomEvent('roi-lead', { detail: d.payload }));
      } catch (err) {}
    }
  });
})();

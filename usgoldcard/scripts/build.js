#!/usr/bin/env node
/* Build script for the U.S. Gold Card prototype.
   1. Generates sitemap.xml from the live data model (same logic as the in-app /sitemap view).
   2. Bundles the whole app into dist/usgoldcard-demo.html — one self-contained file
      that can be emailed, hosted anywhere, or opened from disk. */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(root, f), "utf8");

/* -- load the data model -- */
const ctx = {};
vm.createContext(ctx);
const { SITE, STATES, CITIES, CATEGORIES, BUSINESSES } = vm.runInContext(
  read("js/data.js") + "\n;({ SITE, STATES, CITIES, CATEGORIES, BUSINESSES });", ctx);

/* -- sitemap.xml -- */
const urls = ["/", "/states", "/cities", "/categories", "/directory", "/deals",
  "/business", "/pricing", "/seo", "/email-program", "/loyalty", "/state-partners", "/join"];
STATES.forEach(s => {
  urls.push(`/states/${s.slug}`);
  CATEGORIES.forEach(c => urls.push(`/states/${s.slug}/categories/${c.slug}`));
});
CITIES.forEach(c => {
  urls.push(`/states/${c.state}/cities/${c.slug}`);
  CATEGORIES.forEach(cat => urls.push(`/states/${c.state}/cities/${c.slug}/categories/${cat.slug}`));
});
BUSINESSES.forEach(b => {
  const base = `/${b.state}/${b.city}/${b.slug}`;
  urls.push(base, `${base}/offers`, `${base}/menu`);
});
const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE.domain}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(root, "sitemap.xml"), xml);
console.log(`sitemap.xml — ${urls.length} URLs`);

/* -- single-file demo bundle -- */
const css = read("css/style.css");
const js = ["js/data.js", "js/components.js", "js/pages.js", "js/pages-biz.js", "js/pages-minisite.js", "js/app.js"]
  .map(f => `/* ==== ${f} ==== */\n${read(f)}`)
  .join("\n\n");
const html = read("index.html")
  .replace(/<link rel="stylesheet"[^>]*>/, `<style>\n${css}\n</style>`)
  .replace(/(  <script src="js\/[^"]+"><\/script>\n?)+/g, `<script>\n${js.replace(/<\/script>/g, "<\\/script>")}\n</script>\n`);
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist", "usgoldcard-demo.html"), html);
console.log(`dist/usgoldcard-demo.html — ${(html.length / 1024).toFixed(0)} KB`);

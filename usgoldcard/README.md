# U.S. Gold Card — Clickable Prototype

A complete, clickable web prototype for **U.S. Gold Card**: a national local business
directory, mini-site platform, offer network, lead-capture system, local SEO engine,
and done-for-you marketing platform — with state-level brands (Utah Gold Card,
Nebraska Gold Card, …) rolling up into one national network.

**No build step, no dependencies.** Open `index.html` in a browser (or serve the
folder statically) and everything works. `dist/usgoldcard-demo.html` is the same app
bundled into a single self-contained file for easy sharing.

## What's inside

```
index.html            App shell
css/style.css         Design system (black / charcoal / gold / warm off-white)
js/data.js            Data model: 10 states, 20 cities, 9 categories, pricing tiers,
                      campaigns, and 15 sample businesses with full per-page SEO objects
js/components.js      Reusable components (Header, BusinessCard, StateCard, DealCard,
                      PricingCard, ComparisonTable, FAQAccordion, SEO panel, JSON-LD builder…)
js/pages.js           Public pages: home, states, cities, state, city, categories,
                      category, state+category, city+category, directory, deals
js/pages-biz.js       Marketing pages: /business /pricing /seo /email-program
                      /loyalty /state-partners /join /sitemap
js/pages-minisite.js  The 3-page business mini-sites + /admin + /admin/campaigns
js/app.js             Hash router, SEO head manager (title/meta/canonical/JSON-LD),
                      directory & admin filtering, interactions
robots.txt            Public indexable, /admin and /admin/campaigns disallowed
sitemap.xml           358 URLs generated from the data model
scripts/build.js      Regenerates sitemap.xml and dist/usgoldcard-demo.html
```

## URL structure

Hash routes mirror the production URL plan (`usgoldcard.com/utah/midvale/fajita-grill`):

- `#/` `#/states` `#/cities` `#/categories` `#/directory` `#/deals`
- `#/states/utah` · `#/states/utah/cities/midvale` · `#/categories/restaurants`
- `#/states/utah/categories/restaurants` · `#/states/utah/cities/midvale/categories/restaurants`
- `#/utah/midvale/fajita-grill` + `/offers` + `/menu` — every business gets 3 SEO-built pages
- `#/business` `#/pricing` `#/seo` `#/email-program` `#/loyalty` `#/state-partners` `#/join`
- `#/admin` and `#/admin/campaigns` (noindex, robots-disallowed)

The concept also supports state-brand domains (`utahgoldcard.com/fajita-grill`) and
subdomains (`fajita-grill.utahgoldcard.com`); the prototype uses the national structure.

## SEO model

Every business carries a `seo` object (title, description, H1, local keywords, FAQs,
schema type, canonical, OG tags, image alt, state/city/category intros, nearby cities,
related categories, search intents) plus distinct `seo.offers` and `seo.menu` blocks —
three unique pages per business, each self-canonical. The router writes real
`<title>`, meta description, robots, OG tags, canonical link, and JSON-LD
(Restaurant / Store / HealthAndBeautyBusiness / HomeAndConstructionBusiness /
ProfessionalService / LocalBusiness — never fake reviews) into the document head on
every navigation. Each business page shows its build in the "Under the Hood" panel.

## Rebuild derived files

```
node scripts/build.js   # regenerates sitemap.xml and dist/usgoldcard-demo.html
```

# Alma Loyalty — Website

The public marketing site for **Alma Loyalty**, powered by **Alma AI OS™** —
a new category: **Loyalty ROI Intelligence & Decisioning**.

The site answers one question in many ways: *can a loyalty program create
incremental profit for this business, what must be true for that to happen, and
which decisions will improve the outcome?* It is **vendor-first** (loyalty
software and service companies) and **brand-second** (companies running or
planning a program).

## Stack

React 18 + Vite + Tailwind CSS + React Router. No backend; static SPA that
builds to `dist/` (deployable to Cloudflare Pages, Netlify, Vercel, etc.).
`public/_redirects` maps `/* → /index.html` so client-side routes resolve on
deep-link and refresh.

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Design system

Derived from the approved reference: warm near-black + ivory alternating bands,
a burnt-orange accent, a high-contrast **editorial serif** (Fraunces) for
headlines with a single highlighted word, and **Inter** for body/UI. All tokens
live in `tailwind.config.js`; swap the values there to re-theme. Fonts load from
Google Fonts (see `index.html`).

## Structure

```
src/
  content/        site nav/footer, solution-page data, calculators, glossary, FAQs, role matrices
  components/     Layout, Header (mega-menu), Footer, Estimator, SolutionPage template, shared UI + sections
  pages/          Home, Platform, WhyROI, Methodology, DataConfidence, CalculatorLibrary,
                  EstimatorPage, ForVendors, ForBrands, ProgramMatcher, Resources, Glossary,
                  FaqPage, About, Contact, Security, Sitemap, Legal, NotFound
```

Most product / outcome / channel pages are rendered by a single data-driven
template (`components/SolutionPage.jsx`) fed by `content/solutions.js`, so new
pages are added as data, not duplicated markup.

## Key routes

- `/` home · `/estimator` Loyalty Opportunity Estimator (interactive) · `/calculators` model library
- `/platform` · `/why-loyalty-roi` · `/methodology` · `/data-confidence`
- `/for-vendors` (+ `/pre-scope`, `/account-prioritization`, `/sales-toolkit`, `/white-label`, `/roi-reports`, `/portfolio`, `/integrations`)
- `/for-brands` (+ `/business-case`, `/active-membership`, `/purchase-frequency`, `/average-order-value`, `/retention`, `/audience-strategy`) · `/program-matcher`
- `/solutions/*` (`roi-audit`, `loyalty-games`, `consulting`) · `/channels/*` (`ecommerce`, `retail`, `omnichannel`, `restaurant`, `subscription`, `b2b`)
- `/resources` · `/glossary` · `/faq` · `/about` · `/contact` · `/security` · `/sitemap` · `/privacy` · `/terms` · `/accessibility`

## Integrity notes (must stay true)

Per the brand brief, the site deliberately does **not** publish, and these
remain **approval-gated** until ownership confirms them:

- Exact pricing, minimum orders, or two-vendor exclusivity terms
- The "1,200 metrics" benchmark count and the "20,000 programs monitored" figure
- Named customer logos, testimonials, case-study results, named integrations,
  security certifications, or data-provider names
- Loyalty-game prize amounts, and any specific "11 years" claim beyond the
  general "more than a decade" wording on the About page

All ROI figures are shown as **ranges with a confidence level**, never as a
guarantee, and demonstration data is labeled as illustrative. Legal pages are
placeholders for counsel review.

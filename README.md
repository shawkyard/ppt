# B2B Local Sales Machine

**Real offers. Better-fit customers. More sales.**

> "We are in business to help you make more money. Period."

A premium, standardized B2B sales platform + clickable web-app prototype. It is a **curated,
Utah-first B2B local sales network** — not an instant self-serve directory. Businesses **apply**,
we **review and vet** them, we **build** the listing, and the owner **approves before it goes live**.
It helps B2B service companies win better-fit customers through real-value offers, standardized
premium mini-sites, ICP audience pages, LeadGen tools, and AI-assisted prospecting.

One website. One platform. One system.

**Positioning:** application + approval based, full-service setup included. Listing CTAs read
"Apply for a Free Listing" / "Request Your Free Listing", each with microcopy: *"Every business is
reviewed before publishing. We only list real businesses that serve other businesses."*

## What's in here

Static HTML/CSS/JS prototype — no build step. Upload the **contents** of `public_html/` to Hostinger.

### Public / marketing site
| Page | File |
|------|------|
| Homepage (11 sections, hero video, full-system illustration) | `index.html` |
| How It Works (7-step system) | `how-it-works.html` |
| Directory marketplace + searchable explore | `directory.html` |
| LeadGen Machine (public + responsible-outreach/compliance) | `leadgen.html` |
| Pricing (mini-site + LeadGen + bundles + credit costs) | `pricing.html` |
| ROI examples (interactive revenue calculator) | `roi.html` |
| Claim / list a business (upgrade flow) | `claim.html` |
| 404 | `404.html` |

### Standardized company mini-site (demo: "Northgate IT")
| Page | File |
|------|------|
| Main company page — all 20 standardized sections | `company/index.html` |
| Audience page — full 12-part formula (dental offices) | `company/audience-dental.html` |

Every paid company follows the **same layout and section order** — only logo, colors, photos,
offers, and copy change. That's how the network scales to thousands of businesses while staying
clean, premium, and easy to manage.

### LeadGen web-app (clickable dashboard prototype)
| Screen | File |
|--------|------|
| Overview (stats + credits) | `dashboard/leadgen.html` |
| Campaign Builder (9-step wizard) | `dashboard/leadgen/campaign-builder.html` |
| Results (researched companies + fit scores) | `dashboard/leadgen/results.html` |
| Message Studio (generate + approve drafts, statuses) | `dashboard/leadgen/message-studio.html` |
| Reports (charts + campaign performance) | `dashboard/leadgen/reports.html` |

### Admin
| Screen | File |
|--------|------|
| Platform admin console (businesses, offers, pages, credits, revenue, templates) | `admin.html` |

### Shared
- `css/style.css` — the full design system (one consistent look across every page)
- `js/main.js` — nav, video placeholders, demo forms, filters, wizard, ROI slider
- `assets/favicon.svg` — brand mark (Gold Card + growth arrow)

## Brand architecture
- **Gold Card** = the stored/real value mechanism (each business brings a real offer, not a fake coupon).
- **B2B Local Sales Machine** = the marketplace + sales system.
- **Company mini-sites** = standardized premium sales pages.
- **Audience pages** = one page per buyer type (farming + landing pages).
- **LeadGen tools** = the hunting side.
- **ICP matching** = the secret sauce.

## Design
White / warm off-white backgrounds, charcoal text, dark premium sections, burnt-orange accents,
gold accents for value/offers. Friendly cartoon-style SVG illustrations, rounded cards, soft
shadows, consistent section order. Mobile-first responsive. Fonts: Plus Jakarta Sans + Inter.

## Prototype notes
- Videos are **placeholders** (click to see a note). Forms are **demo-only** — nothing is sent.
- All prices, credit costs, stats, and revenue figures are **placeholders / examples, not guarantees.**
- `dashboard/` and `admin.html` are disallowed in `robots.txt`.

## Before launch
1. Replace `https://example.com` in `robots.txt` and `sitemap.xml` with the live domain.
2. Drop in real explainer/Alma videos and business photos/logos.
3. Wire the lead forms and claim form to a real inbox/CRM.
4. Set real pricing and confirm credit costs.

#!/usr/bin/env python3
"""
Utah Gold Card — static site generator.

This is the scalable SEO data model referenced on the business-owner page:
every business, area, and category lives in one data structure below, and
every page (business profile / offers / menu, city page, category page,
city+category landing page) is generated from it — including page-level
metadata, JSON-LD structured data, breadcrumbs, internal links, and the
XML sitemap. Adding a new business to BUSINESSES and re-running this
script produces a fully wired set of SEO pages automatically.

Run:  python3 build/generate_site.py
"""
import os
import re
import json
import html
from datetime import date
from urllib.parse import quote as urlquote

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
SITE_URL = "https://utahgoldcard.com"
TODAY = "2026-07-04"

# ------------------------------------------------------------------
# Icon set (minimal line icons, 24x24, stroke=currentColor)
# ------------------------------------------------------------------
ICONS = {
    "utensils": '<path d="M6 2v7a2 2 0 0 0 2 2v11M6 2v7a2 2 0 0 1-2 2v0M6 2v0M18 2v20M18 2c-2.2 0-4 2.7-4 6s1.8 6 4 6"/>',
    "coffee": '<path d="M4 8h13a3 3 0 0 1 0 6h-1M4 8v8a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V8M4 8V5h9v3"/>',
    "pizza": '<path d="M2 5l10 17L22 5a20 20 0 0 0-20 0z"/><circle cx="12" cy="10" r="1"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/>',
    "leaf": '<path d="M4 20c8 0 16-8 16-16-8 0-16 8-16 16z"/><path d="M4 20c0-6 4-10 10-12"/>',
    "cake": '<path d="M4 21h16v-7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v7z"/><path d="M2 21h20M9 11V7M15 11V7M12 11V6"/><circle cx="9" cy="4" r="1"/><circle cx="12" cy="3" r="1"/><circle cx="15" cy="4" r="1"/>',
    "bag": '<path d="M6 7h12l1 14H5L6 7z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
    "scissors": '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5L20 20M20 4L8.5 15.5"/>',
    "users": '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17.5" cy="9" r="2.6"/><path d="M15 13a5.5 5.5 0 0 1 6.5 6.6"/>',
    "truck": '<path d="M2 7h11v10H2z"/><path d="M13 10h4l4 3v4h-8z"/><circle cx="6" cy="19" r="1.7"/><circle cx="17" cy="19" r="1.7"/>',
    "clock": '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.2 2"/>',
    "wrench": '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.8-.8-.8-2.8 2.6-2.6z"/>',
    "mountain": '<path d="M3 20l6-11 4 6 2-3 6 8H3z"/><circle cx="8" cy="6" r="1.6"/>',
    "map-pin": '<path d="M20 10.5c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10.5" r="2.7"/>',
    "phone": '<path d="M5 4h4l1.5 5-2.5 2a13 13 0 0 0 6 6l2-2.5 5 1.5v4a2 2 0 0 1-2.2 2A18 18 0 0 1 3 5.2 2 2 0 0 1 5 4z"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    "star": '<path d="M12 3l2.7 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.3 6.5 20.4l1.1-6.3L3 9.7l6.3-.9z"/>',
    "gift": '<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M3 9h18v4H3z"/><path d="M12 21V9M12 9c-2-3-7-3-7 0 0 1.7 3 1.5 7 0zM12 9c2-3 7-3 7 0 0 1.7-3 1.5-7 0z"/>',
    "camera": '<path d="M4 8h3l2-2.5h6L17 8h3a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 8z"/><circle cx="12" cy="13.5" r="3.5"/>',
    "check": '<path d="M20 6L9 17l-5-5"/>',
    "check-circle": '<circle cx="12" cy="12" r="9.5"/><path d="M8 12.3l2.7 2.7L16.5 9"/>',
    "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    "chevron-down": '<path d="M6 9l6 6 6-6"/>',
    "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
    "close": '<path d="M6 6l12 12M18 6L6 18"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    "award": '<circle cx="12" cy="8" r="5.5"/><path d="M8.5 13l-2 8 5.5-3 5.5 3-2-8"/>',
    "chart": '<path d="M4 20V10M12 20V4M20 20v-7"/><path d="M2 20h20"/>',
    "shield": '<path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9"/>',
    "spark": '<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/>',
    "target": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    "layers": '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 8l9 5 9-5"/>',
    "globe": '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 2.6 4.3 6 4.3 9.5s-1.5 6.9-4.3 9.5c-2.8-2.6-4.3-6-4.3-9.5S9.2 5.1 12 2.5z"/>',
    "sun": '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    "route": '<circle cx="6" cy="19" r="2.3"/><circle cx="18" cy="5" r="2.3"/><path d="M6 16.7V13a4 4 0 0 1 4-4h4a4 4 0 0 0 4-4"/>',
    "badge-percent": '<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.6"/><circle cx="17" cy="17" r="2.6"/>',
    "instagram": '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1"/>',
    "facebook": '<path d="M14 21v-8h3l.5-3.5H14V7.2c0-1 .3-1.7 1.8-1.7H18V2.3c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.8H8V13h3v8z"/>',
    "linkedin": '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8.5" r="1.4"/><path d="M8 11.5v6M12.5 17.5v-3.7c0-1.7 1-2.6 2.3-2.6 1.2 0 2 .8 2 2.6v3.7"/>',
}


def icon(name, css_class=""):
    path = ICONS.get(name, ICONS["star"])
    cls = f' class="{css_class}"' if css_class else ""
    return f'<svg{cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{path}</svg>'


def esc(s):
    return html.escape(str(s), quote=True)


def slug_title(s):
    return s.replace("-", " ").title()


# ------------------------------------------------------------------
# AREAS
# ------------------------------------------------------------------
AREAS = {
    "ogden": {
        "name": "Ogden", "region": "Weber County", "lat": 41.2230, "lng": -111.9738,
        "blurb": "A historic mountain-gateway city built around Historic 25th Street, known for independent shops, coffeehouses, and easy access to the Ogden Valley.",
        "theme": "antiques",
    },
    "salt-lake-city": {
        "name": "Salt Lake City", "region": "Salt Lake County", "lat": 40.7608, "lng": -111.8910,
        "blurb": "Utah's capital and largest metro area, home to a dense mix of restaurants, salons, and specialty shops across dozens of walkable neighborhoods.",
        "theme": "salon",
    },
    "midvale": {
        "name": "Midvale", "region": "Salt Lake County", "lat": 40.6111, "lng": -111.8990,
        "blurb": "A centrally located Salt Lake Valley city along the State Street corridor, popular for fast lunches, family dinners, and office catering.",
        "theme": "mexican",
    },
    "provo": {
        "name": "Provo", "region": "Utah County", "lat": 40.2338, "lng": -111.6585,
        "blurb": "A university town in Utah County with a fast-growing food and retail scene serving students, families, and young professionals.",
        "theme": "healthy",
    },
    "layton": {
        "name": "Layton", "region": "Davis County", "lat": 41.0602, "lng": -111.9711,
        "blurb": "A family-oriented Davis County suburb with a strong mix of family dining, entertainment, and weekend activities.",
        "theme": "family",
    },
    "park-city": {
        "name": "Park City", "region": "Summit County", "lat": 40.6461, "lng": -111.4980,
        "blurb": "A resort town along Historic Main Street known for destination dining, boutique shopping, and a steady flow of visitors year-round.",
        "theme": "dessert",
    },
    "st-george": {
        "name": "St. George", "region": "Washington County", "lat": 37.0965, "lng": -113.5684,
        "blurb": "A red-rock-country hub in southern Utah, built around outdoor adventure, tourism, and a growing year-round local population.",
        "theme": "adventure",
    },
}
AREA_ORDER = ["ogden", "salt-lake-city", "midvale", "provo", "layton", "park-city", "st-george"]

# ------------------------------------------------------------------
# CATEGORIES
# ------------------------------------------------------------------
CATEGORIES = {
    "restaurants": {
        "name": "Restaurants", "icon": "utensils",
        "blurb": "Local restaurants, cafes, and fast-casual spots serving breakfast, lunch, and dinner across Utah.",
        "theme": "mexican",
    },
    "mexican-food": {
        "name": "Mexican Food", "icon": "utensils",
        "blurb": "Tacos, fajitas, and Mexican kitchens serving fast lunches and full family dinners.",
        "theme": "tacos",
    },
    "halal-friendly": {
        "name": "Halal-Friendly", "icon": "utensils",
        "blurb": "Halal-friendly kitchens across Utah serving Mediterranean, Mexican, and Middle Eastern menus.",
        "theme": "halal",
    },
    "catering": {
        "name": "Catering", "icon": "truck",
        "blurb": "Office lunch catering, event catering, and full-service menus for groups of any size.",
        "theme": "catering",
    },
    "salons": {
        "name": "Salons", "icon": "scissors",
        "blurb": "Hair, beauty, and wellness studios offering color, cuts, and styling across Utah.",
        "theme": "salon",
    },
    "local-shops": {
        "name": "Local Shops", "icon": "bag",
        "blurb": "Independent boutiques and specialty retailers carrying Utah-made goods and curated finds.",
        "theme": "boutique",
    },
    "home-services": {
        "name": "Home Services", "icon": "wrench",
        "blurb": "Licensed local contractors and home repair crews serving Utah homeowners.",
        "theme": "homeservices",
    },
    "family-fun": {
        "name": "Family Fun", "icon": "users",
        "blurb": "Family entertainment, indoor play centers, and weekend activities for kids and parents.",
        "theme": "family",
    },
    "antiques-specialty-retail": {
        "name": "Antiques & Specialty Retail", "icon": "clock",
        "blurb": "Antique shops, estate finds, and specialty retailers with one-of-a-kind inventory.",
        "theme": "antiques",
    },
    "events-attractions": {
        "name": "Events & Attractions", "icon": "mountain",
        "blurb": "Local attractions, guided tours, and events across Utah's cities and red rock country.",
        "theme": "adventure",
    },
}
CATEGORY_ORDER = ["restaurants", "mexican-food", "halal-friendly", "catering", "salons",
                  "local-shops", "home-services", "family-fun", "antiques-specialty-retail", "events-attractions"]

ALL_TAGS = ["family-friendly", "date-night", "catering", "halal-friendly", "breakfast", "lunch", "dinner",
            "local-favorite", "discount", "loyalty-offer", "birthday-club", "new-this-month"]
TAG_LABEL = {t: t.replace("-", " ").title() if t != "date-night" else "Date Night" for t in ALL_TAGS}
TAG_LABEL["local-favorite"] = "Local Favorite"
TAG_LABEL["new-this-month"] = "New This Month"

# ------------------------------------------------------------------
# BUSINESSES — the scalable per-business data model.
# Every business gets: profile info, tags/categories, hours, a menu or
# services list, a gallery, and (for the 5 flagship examples) fully
# hand-authored unique SEO copy. Every other business gets unique SEO
# copy generated from its own data by auto_seo() below.
# ------------------------------------------------------------------
BUSINESSES = []

BUSINESSES.append({
    "slug": "fajita-grill", "name": "Fajita Grill", "city": "midvale",
    "address": "7680 S State St", "zip": "84047",
    "phone_display": "(801) 555-0142", "phone_tel": "+18015550142",
    "categories": ["restaurants", "mexican-food", "halal-friendly", "catering"],
    "tags": ["halal-friendly", "family-friendly", "catering", "local-favorite", "dinner", "lunch"],
    "theme": "mexican", "icon": "utensils", "tier": 2, "featured": True,
    "offer": "Free chips & queso with any entree purchase this month",
    "rating": 4.8, "review_count": 216, "price_range": "$$",
    "description": "Sizzling fajitas, Mediterranean plates, and halal-friendly favorites in Midvale — a local go-to for family dinners, fast lunches, and full-tray catering.",
    "highlights": ["Halal-friendly meats prepared fresh daily", "Full catering trays for offices & events",
                   "Sizzling fajita platters for two or the whole table", "Family meal bundles that feed 4-6"],
    "hours_display": [("Mon – Thu", "11:00 AM – 9:00 PM"), ("Fri – Sat", "11:00 AM – 9:30 PM"), ("Sun", "12:00 PM – 8:00 PM")],
    "hours_schema": ["Mo-Th 11:00-21:00", "Fr-Sa 11:00-21:30", "Su 12:00-20:00"],
    "schema_type": "Restaurant", "serves_cuisine": ["Mexican", "Mediterranean"], "area_served": None,
    "menu_kind": "menu",
    "menu": [
        ("Sizzling Fajitas", [
            {"name": "Steak Fajitas", "desc": "Grilled steak, peppers & onions, warm tortillas", "price": "$16.99", "tags": []},
            {"name": "Chicken Fajitas", "desc": "Halal-friendly grilled chicken, peppers & onions", "price": "$15.49", "tags": ["halal"]},
            {"name": "Shrimp Fajitas", "desc": "Garlic-lime shrimp, peppers & onions", "price": "$17.99", "tags": []},
            {"name": "Fajitas Trio", "desc": "Steak, chicken & shrimp for the table", "price": "$19.99", "tags": []},
        ]),
        ("Mediterranean Favorites", [
            {"name": "Halal Chicken Shawarma Plate", "desc": "Marinated shawarma, rice, garlic sauce", "price": "$13.99", "tags": ["halal"]},
            {"name": "Mediterranean Mezze Platter", "desc": "Hummus, baba ganoush, falafel, pita", "price": "$12.49", "tags": ["halal"]},
            {"name": "Lamb Kofta Plate", "desc": "Halal-friendly grilled lamb kofta, rice, salad", "price": "$15.99", "tags": ["halal"]},
        ]),
        ("Mexican Favorites", [
            {"name": "Street Tacos (3)", "desc": "Choice of steak, chicken, or veggie", "price": "$10.99", "tags": []},
            {"name": "Enchiladas Rojas", "desc": "Rolled corn tortillas, red sauce, cheese", "price": "$12.99", "tags": []},
            {"name": "Loaded Nachos", "desc": "Beans, cheese, pico, jalapeno, sour cream", "price": "$11.49", "tags": []},
        ]),
        ("Family Meals & Catering Trays", [
            {"name": "Family Fajita Bundle", "desc": "Feeds 4-6, includes tortillas & sides", "price": "$54.99", "tags": ["family"]},
            {"name": "Catering Tray — Shawarma & Rice", "desc": "Feeds 10-12, halal-friendly", "price": "$89.99", "tags": ["halal", "catering"]},
            {"name": "Taco Bar Catering Kit", "desc": "Feeds 15, build-your-own taco station", "price": "$109.99", "tags": ["catering"]},
        ]),
    ],
    "gallery_alts": [
        "Sizzling fajita platter with grilled steak, peppers and onions at Fajita Grill in Midvale, Utah",
        "Halal-friendly grilled chicken plate served at Fajita Grill Midvale",
        "Fresh Mediterranean mezze plate with hummus and pita at Fajita Grill",
        "Family meal bundle to-go tray from Fajita Grill in Midvale, Utah",
        "Catering tray of fajitas prepared for a Midvale office lunch by Fajita Grill",
        "Interior dining area of Fajita Grill restaurant in Midvale, Utah",
    ],
    "flagship": True,
    "seo": {
        "main": {
            "title": "Fajita Grill Midvale Utah | Mexican, Mediterranean, Halal-Friendly Food & Catering",
            "description": "Discover Fajita Grill in Midvale, Utah on Utah Gold Card. View menu highlights, catering options, halal-friendly choices, local offers, hours, directions, and contact information.",
            "h1": "Fajita Grill in Midvale, Utah",
            "og_title": "Fajita Grill | Midvale's Mexican, Mediterranean & Halal-Friendly Kitchen",
            "og_description": "Sizzling fajitas, Mediterranean plates, halal-friendly options, and full-tray catering in Midvale, Utah. See hours, offers, and the menu on Utah Gold Card.",
        },
        "offers": {
            "title": "Fajita Grill Offers & Deals in Midvale, Utah | Utah Gold Card",
            "description": "See current deals, birthday club perks, catering specials, and local offers from Fajita Grill in Midvale. Sign up for email updates and Utah Gold Card local deals.",
            "h1": "Current Offers from Fajita Grill in Midvale",
            "og_title": "Fajita Grill Offers | Midvale, Utah",
            "og_description": "Current deals, catering specials, and birthday club perks from Fajita Grill in Midvale, Utah.",
        },
        "menu": {
            "title": "Fajita Grill Menu | Sizzling Fajitas, Mediterranean & Halal-Friendly Dishes — Midvale, UT",
            "description": "Browse the Fajita Grill menu: sizzling fajita platters, Mediterranean favorites, halal-friendly options, family meals, and catering trays in Midvale, Utah.",
            "h1": "The Fajita Grill Menu in Midvale",
            "og_title": "Fajita Grill Menu | Midvale, Utah",
            "og_description": "Fajita platters, Mediterranean favorites, halal-friendly dishes, family meals, and catering trays.",
        },
        "h2s": ["Mexican, Mediterranean & Halal-Friendly Food in Midvale", "Why Locals Visit Fajita Grill",
                "Featured Menu Highlights", "Catering, Family Meals & Group Orders",
                "Current Offers from Fajita Grill", "Visit Fajita Grill in Midvale", "Frequently Asked Questions"],
        "local_keywords": ["fajita grill midvale utah", "mexican restaurant midvale ut", "halal food midvale utah",
                           "mediterranean restaurant near me", "catering midvale utah", "fajitas near midvale"],
        "faqs": [
            ("Is Fajita Grill halal-friendly?", "Yes. Fajita Grill prepares halal-friendly meat options across its Mexican and Mediterranean menus, clearly marked for guests who keep halal."),
            ("Does Fajita Grill offer catering in Midvale and the Salt Lake Valley?", "Yes. Fajita Grill offers full catering trays, family meal bundles, and group order packages for offices, parties, and events throughout Midvale and the surrounding Salt Lake Valley."),
            ("What are Fajita Grill's hours in Midvale?", "Fajita Grill is open Monday–Thursday 11 AM–9 PM, Friday–Saturday 11 AM–9:30 PM, and Sunday 12–8 PM."),
            ("Does Fajita Grill have vegetarian or family meal options?", "Yes. Alongside sizzling fajita platters, Fajita Grill offers vegetarian Mediterranean plates and family meal bundles that serve four to six people."),
        ],
        "city_seo_intro": "Midvale, Utah sits in the heart of the Salt Lake Valley along the State Street corridor — and Fajita Grill has become one of its most talked-about lunch and dinner spots.",
        "category_seo_intro": "Mexican and Mediterranean food lovers across the Salt Lake Valley come to Fajita Grill for sizzling fajitas, halal-friendly plates, and catering-sized portions.",
        "nearby_areas": ["salt-lake-city", "provo"],
        "primary_search_intent": "fajita grill midvale",
        "secondary_search_intents": ["mexican food midvale utah", "halal restaurant midvale", "catering midvale utah", "mediterranean food salt lake valley"],
    },
})

BUSINESSES.append({
    "slug": "ogden-coffee-house", "name": "Ogden Coffee House", "city": "ogden",
    "address": "2401 Historic 25th St", "zip": "84401",
    "phone_display": "(801) 555-0118", "phone_tel": "+18015550118",
    "categories": ["restaurants"],
    "tags": ["breakfast", "local-favorite", "family-friendly"],
    "theme": "coffee", "icon": "coffee", "tier": 1, "featured": True,
    "offer": "Buy one espresso drink, get a house-made pastry half off",
    "rating": 4.7, "review_count": 189, "price_range": "$",
    "description": "A historic 25th Street coffeehouse in Ogden serving small-batch espresso, house-baked pastries, and hearty breakfast plates.",
    "highlights": ["Small-batch espresso roasted in-house", "Fresh pastries baked every morning",
                   "Cozy historic 25th Street storefront", "Grab-and-go breakfast for the morning commute"],
    "hours_display": [("Mon – Fri", "6:30 AM – 4:00 PM"), ("Sat – Sun", "7:00 AM – 3:00 PM")],
    "hours_schema": ["Mo-Fr 06:30-16:00", "Sa-Su 07:00-15:00"],
    "schema_type": "CafeOrCoffeeShop", "serves_cuisine": ["Coffee", "Breakfast & Brunch"], "area_served": None,
    "menu_kind": "menu",
    "menu": [
        ("Espresso & Coffee", [
            {"name": "House Latte", "desc": "Espresso, steamed milk, house blend", "price": "$4.75", "tags": []},
            {"name": "Cappuccino", "desc": "Espresso, steamed milk, deep foam", "price": "$4.50", "tags": []},
            {"name": "Cold Brew", "desc": "Slow-steeped 18 hours", "price": "$4.25", "tags": []},
            {"name": "Drip Coffee", "desc": "Rotating single-origin roast", "price": "$3.25", "tags": []},
        ]),
        ("Breakfast", [
            {"name": "Breakfast Sandwich", "desc": "Egg, cheddar, choice of bacon or sausage on a fresh roll", "price": "$7.50", "tags": ["breakfast"]},
            {"name": "Avocado Toast", "desc": "Sourdough, smashed avocado, chili flake", "price": "$8.95", "tags": ["breakfast"]},
            {"name": "Overnight Oats", "desc": "Oats, seasonal fruit, honey", "price": "$6.50", "tags": ["breakfast"]},
        ]),
        ("Pastries & Grab-and-Go", [
            {"name": "Butter Croissant", "desc": "Baked fresh each morning", "price": "$3.95", "tags": []},
            {"name": "Morning Muffin", "desc": "Rotating seasonal flavor", "price": "$3.50", "tags": []},
            {"name": "House Granola Cup", "desc": "Yogurt, granola, honey", "price": "$4.95", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Latte art on a cappuccino at Ogden Coffee House on Historic 25th Street",
        "Fresh-baked pastry case at Ogden Coffee House in Ogden, Utah",
        "Breakfast sandwich and drip coffee at Ogden Coffee House",
        "Historic 25th Street storefront of Ogden Coffee House in Ogden",
        "Barista pouring espresso at Ogden Coffee House Ogden Utah",
        "Cozy seating area inside Ogden Coffee House",
    ],
    "flagship": True,
    "seo": {
        "main": {
            "title": "Ogden Coffee House | Coffee, Espresso & Breakfast in Ogden, Utah",
            "description": "Visit Ogden Coffee House on Historic 25th Street in Ogden, Utah on Utah Gold Card. See espresso drinks, breakfast plates, local offers, hours, and directions.",
            "h1": "Ogden Coffee House on Historic 25th Street",
            "og_title": "Ogden Coffee House | Historic 25th Street, Ogden UT",
            "og_description": "Small-batch espresso, house-baked pastries, and breakfast plates on Historic 25th Street in Ogden, Utah.",
        },
        "offers": {
            "title": "Ogden Coffee House Deals & Offers | Ogden, Utah Coffee Shop",
            "description": "Current espresso and pastry offers, birthday club perks, and email signup from Ogden Coffee House on Historic 25th Street in Ogden, Utah.",
            "h1": "Current Offers from Ogden Coffee House",
            "og_title": "Ogden Coffee House Offers | Ogden, Utah",
            "og_description": "Current espresso and pastry deals from Ogden Coffee House on Historic 25th Street.",
        },
        "menu": {
            "title": "Ogden Coffee House Menu | Espresso, Drip Coffee & Breakfast — Ogden, UT",
            "description": "Browse the Ogden Coffee House menu: espresso drinks, drip coffee, breakfast sandwiches, and fresh-baked pastries in Ogden, Utah.",
            "h1": "The Ogden Coffee House Menu",
            "og_title": "Ogden Coffee House Menu | Ogden, Utah",
            "og_description": "Espresso, drip coffee, breakfast sandwiches, and fresh-baked pastries on Historic 25th Street.",
        },
        "h2s": ["Coffee & Breakfast on Historic 25th Street in Ogden", "Why Locals Start Their Morning Here",
                "Featured Espresso & Breakfast Picks", "Pastries, Grab-and-Go & Group Orders",
                "Current Offers from Ogden Coffee House", "Visit Ogden Coffee House in Ogden", "Frequently Asked Questions"],
        "local_keywords": ["ogden coffee house", "coffee shop ogden utah", "25th street ogden coffee",
                           "breakfast ogden utah", "espresso ogden ut", "best coffee ogden"],
        "faqs": [
            ("Where is Ogden Coffee House located?", "Ogden Coffee House is located at 2401 Historic 25th Street in downtown Ogden, Utah, in the heart of the historic 25th Street district."),
            ("Does Ogden Coffee House serve breakfast all day?", "Ogden Coffee House serves a full breakfast menu from open until 11 AM on weekdays and until noon on weekends, alongside espresso and pastries available all day."),
            ("Can I order ahead from Ogden Coffee House?", "Guests can call ahead to place a pickup order, and group or office coffee orders can be arranged directly with the shop."),
            ("Does Ogden Coffee House have decaf or non-dairy options?", "Yes. Ogden Coffee House offers decaf espresso and oat, almond, and soy milk alternatives for any drink on the menu."),
        ],
        "city_seo_intro": "Ogden's Historic 25th Street is one of Utah's most walkable downtown districts, and Ogden Coffee House anchors its morning rush.",
        "category_seo_intro": "For coffee, espresso, and breakfast in Ogden, Ogden Coffee House is a Utah Gold Card local favorite for regulars and first-time visitors alike.",
        "nearby_areas": ["layton", "salt-lake-city"],
        "primary_search_intent": "ogden coffee house",
        "secondary_search_intents": ["coffee shop ogden utah", "breakfast 25th street ogden", "espresso near me ogden"],
    },
})

BUSINESSES.append({
    "slug": "golden-hour-salon", "name": "Golden Hour Salon", "city": "salt-lake-city",
    "address": "412 E 900 South", "zip": "84111",
    "phone_display": "(801) 555-0187", "phone_tel": "+18015550187",
    "categories": ["salons"],
    "tags": ["local-favorite", "loyalty-offer"],
    "theme": "salon", "icon": "scissors", "tier": 2, "featured": True,
    "offer": "20% off your first color service",
    "rating": 4.9, "review_count": 142, "price_range": "$$$",
    "description": "A boutique hair and beauty studio in Salt Lake City offering color, cuts, and blowouts with a loyalty program for regulars.",
    "highlights": ["Color specialists on staff", "Boutique studio near 9th & 9th",
                   "Loyalty punch card for repeat guests", "Simple online-style booking request form"],
    "hours_display": [("Tue – Fri", "9:00 AM – 6:00 PM"), ("Sat", "9:00 AM – 4:00 PM"), ("Sun – Mon", "Closed")],
    "hours_schema": ["Tu-Fr 09:00-18:00", "Sa 09:00-16:00"],
    "schema_type": "HealthAndBeautyBusiness", "serves_cuisine": None, "area_served": None,
    "menu_kind": "services",
    "menu": [
        ("Color Services", [
            {"name": "Full Balayage", "desc": "Hand-painted, dimensional color", "price": "$185+", "tags": []},
            {"name": "Root Touch-Up", "desc": "Single-process color refresh", "price": "$95+", "tags": []},
            {"name": "Fashion Color Add-On", "desc": "Vivid or pastel accent color", "price": "$45+", "tags": []},
        ]),
        ("Cuts & Styling", [
            {"name": "Precision Cut", "desc": "Consultation + shampoo + style", "price": "$65", "tags": []},
            {"name": "Blowout", "desc": "Wash and full styling finish", "price": "$45", "tags": []},
            {"name": "Special Occasion Style", "desc": "Updo or event-ready styling", "price": "$75", "tags": []},
        ]),
        ("Treatments", [
            {"name": "Deep Conditioning Treatment", "desc": "Restorative moisture treatment", "price": "$35", "tags": []},
            {"name": "Scalp Treatment", "desc": "Exfoliating scalp reset", "price": "$40", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Balayage color result at Golden Hour Salon in Salt Lake City",
        "Blowout styling station at Golden Hour Salon SLC",
        "Salon interior at Golden Hour Salon near 9th and 9th",
        "Precision haircut finish at Golden Hour Salon Salt Lake City",
        "Color bar and styling tools at Golden Hour Salon",
        "Front entrance of Golden Hour Salon in Salt Lake City",
    ],
    "flagship": True,
    "seo": {
        "main": {
            "title": "Golden Hour Salon Salt Lake City | Hair Color, Cuts & Blowouts",
            "description": "Discover Golden Hour Salon in Salt Lake City on Utah Gold Card. See services, stylist highlights, current offers, hours, and contact information for this boutique hair studio.",
            "h1": "Golden Hour Salon in Salt Lake City, Utah",
            "og_title": "Golden Hour Salon | Salt Lake City Hair & Color Studio",
            "og_description": "Boutique hair color, cuts, and blowouts near 9th & 9th in Salt Lake City. See services, offers, and hours on Utah Gold Card.",
        },
        "offers": {
            "title": "Golden Hour Salon Offers & Loyalty Perks | Salt Lake City",
            "description": "See current color and styling offers, loyalty punch card details, and email signup from Golden Hour Salon in Salt Lake City, Utah.",
            "h1": "Current Offers from Golden Hour Salon",
            "og_title": "Golden Hour Salon Offers | Salt Lake City",
            "og_description": "Current color and styling offers and loyalty perks from Golden Hour Salon in Salt Lake City.",
        },
        "menu": {
            "title": "Golden Hour Salon Services & Pricing | Salt Lake City Hair Salon",
            "description": "Browse services and pricing at Golden Hour Salon: color, cuts, blowouts, and styling in Salt Lake City, Utah.",
            "h1": "Services at Golden Hour Salon",
            "og_title": "Golden Hour Salon Services | Salt Lake City",
            "og_description": "Color, cuts, blowouts, and treatments at Golden Hour Salon in Salt Lake City.",
        },
        "h2s": ["Hair Color, Cuts & Blowouts Near 9th & 9th in Salt Lake City", "Why Locals Choose Golden Hour Salon",
                "Featured Salon Services", "Loyalty & Repeat Guest Perks",
                "Current Offers from Golden Hour Salon", "Visit Golden Hour Salon in Salt Lake City", "Frequently Asked Questions"],
        "local_keywords": ["golden hour salon salt lake city", "hair salon salt lake city utah",
                           "hair color salt lake city", "blowout bar slc", "best salon 9th and 9th"],
        "faqs": [
            ("Where is Golden Hour Salon located in Salt Lake City?", "Golden Hour Salon is located at 412 E 900 South in Salt Lake City, near the 9th & 9th neighborhood."),
            ("Does Golden Hour Salon offer loyalty rewards?", "Yes. Golden Hour Salon offers a loyalty punch card through Utah Gold Card that rewards repeat color and styling guests."),
            ("How do I request an appointment at Golden Hour Salon?", "Guests can submit a booking request through the offers page, and the Golden Hour Salon team will follow up to confirm a time."),
            ("What hair services does Golden Hour Salon specialize in?", "Golden Hour Salon specializes in color correction, balayage, precision cuts, and blowouts for everyday and special-occasion styling."),
        ],
        "city_seo_intro": "Salt Lake City's 9th & 9th neighborhood is known for its independent boutiques and studios — Golden Hour Salon is one of its most-booked hair studios.",
        "category_seo_intro": "For hair color, cuts, and blowouts in Salt Lake City, Golden Hour Salon is a Utah Gold Card featured salon known for detail-oriented styling.",
        "nearby_areas": ["midvale", "provo"],
        "primary_search_intent": "golden hour salon salt lake city",
        "secondary_search_intents": ["hair salon salt lake city utah", "balayage slc", "hair color near 9th and 9th"],
    },
})

BUSINESSES.append({
    "slug": "heritage-clock-antiques", "name": "Heritage Clock & Antiques", "city": "ogden",
    "address": "153 Historic 25th St", "zip": "84401",
    "phone_display": "(801) 555-0163", "phone_tel": "+18015550163",
    "categories": ["antiques-specialty-retail"],
    "tags": ["local-favorite", "new-this-month"],
    "theme": "antiques", "icon": "clock", "tier": 1, "featured": False,
    "offer": "10% off any clock repair or restoration this month",
    "rating": 4.6, "review_count": 58, "price_range": "$$",
    "description": "A Historic 25th Street shop in Ogden specializing in antique clocks, vintage furniture, and one-of-a-kind estate finds.",
    "highlights": ["In-house clock repair and restoration", "Rotating estate-sale inventory",
                   "Vintage furniture and home decor", "Appraisal consultations by appointment"],
    "hours_display": [("Tue – Sat", "10:00 AM – 5:00 PM"), ("Sun – Mon", "Closed")],
    "hours_schema": ["Tu-Sa 10:00-17:00"],
    "schema_type": "AntiqueStore", "serves_cuisine": None, "area_served": None,
    "menu_kind": "services",
    "menu": [
        ("Clock Repair & Restoration", [
            {"name": "Mantel Clock Service", "desc": "Cleaning, oiling & timing adjustment", "price": "$85+", "tags": []},
            {"name": "Grandfather Clock Restoration", "desc": "Full mechanical restoration", "price": "$250+", "tags": []},
            {"name": "Wall Clock Tune-Up", "desc": "Movement cleaning & regulation", "price": "$60+", "tags": []},
        ]),
        ("Featured Pieces", [
            {"name": "1920s Oak Grandfather Clock", "desc": "Restored, working chime", "price": "$1,450", "tags": []},
            {"name": "Mid-Century Walnut Sideboard", "desc": "Original hardware, refinished top", "price": "$625", "tags": []},
            {"name": "Vintage Brass Wall Clock", "desc": "Serviced movement, ready to hang", "price": "$185", "tags": []},
        ]),
        ("Appraisals & Estate Services", [
            {"name": "Single-Item Appraisal", "desc": "Verbal valuation, in-store", "price": "$40", "tags": []},
            {"name": "Full Estate Consultation", "desc": "On-site collection review", "price": "By appointment", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Restored grandfather clock at Heritage Clock & Antiques in Ogden",
        "Vintage furniture display inside Heritage Clock & Antiques Ogden",
        "Antique clock repair workbench at Heritage Clock & Antiques",
        "Estate glassware collection at Heritage Clock & Antiques Ogden Utah",
        "Historic 25th Street storefront of Heritage Clock & Antiques",
        "Vintage decor shelf at Heritage Clock & Antiques",
    ],
    "flagship": True,
    "seo": {
        "main": {
            "title": "Heritage Clock & Antiques Ogden Utah | Antique Clocks, Furniture & Estate Finds",
            "description": "Explore Heritage Clock & Antiques on Historic 25th Street in Ogden, Utah on Utah Gold Card. See featured pieces, clock repair services, current offers, hours, and directions.",
            "h1": "Heritage Clock & Antiques in Ogden, Utah",
            "og_title": "Heritage Clock & Antiques | Ogden, Utah",
            "og_description": "Antique clocks, vintage furniture, and estate finds on Historic 25th Street in Ogden, Utah.",
        },
        "offers": {
            "title": "Heritage Clock & Antiques Offers | Ogden, Utah Antique Shop Deals",
            "description": "See current discounts on clock repair, restoration, and antique furniture from Heritage Clock & Antiques on Historic 25th Street in Ogden, Utah.",
            "h1": "Current Offers from Heritage Clock & Antiques",
            "og_title": "Heritage Clock & Antiques Offers | Ogden, Utah",
            "og_description": "Current clock repair and restoration discounts from Heritage Clock & Antiques in Ogden.",
        },
        "menu": {
            "title": "Heritage Clock & Antiques Services & Featured Pieces | Ogden, UT",
            "description": "Browse clock repair services, restoration work, and featured antique and estate pieces at Heritage Clock & Antiques in Ogden, Utah.",
            "h1": "Services & Featured Pieces at Heritage Clock & Antiques",
            "og_title": "Heritage Clock & Antiques Services | Ogden, Utah",
            "og_description": "Clock repair, restoration, and featured antique pieces at Heritage Clock & Antiques.",
        },
        "h2s": ["Antique Clocks, Furniture & Estate Finds on Historic 25th Street", "Why Collectors Visit Heritage Clock & Antiques",
                "Featured Pieces & Clock Repair Services", "Estate Finds, Appraisals & Custom Requests",
                "Current Offers from Heritage Clock & Antiques", "Visit Heritage Clock & Antiques in Ogden", "Frequently Asked Questions"],
        "local_keywords": ["heritage clock and antiques ogden", "antique shop ogden utah", "clock repair ogden ut",
                           "estate finds ogden", "vintage furniture ogden utah"],
        "faqs": [
            ("Does Heritage Clock & Antiques repair clocks?", "Yes. Heritage Clock & Antiques offers in-house repair and restoration for mantel clocks, grandfather clocks, and wall clocks."),
            ("Where is Heritage Clock & Antiques located?", "Heritage Clock & Antiques is located at 153 Historic 25th Street in Ogden, Utah, along the historic downtown shopping district."),
            ("Does Heritage Clock & Antiques buy estate collections?", "Heritage Clock & Antiques regularly evaluates estate collections and individual pieces — call ahead to schedule a consultation."),
            ("What kind of inventory does Heritage Clock & Antiques carry?", "Inventory rotates regularly and includes antique clocks, vintage furniture, glassware, and estate-sale decor."),
        ],
        "city_seo_intro": "Ogden's Historic 25th Street built its reputation on independent shops, and Heritage Clock & Antiques is one of its longest-standing specialty retailers.",
        "category_seo_intro": "Collectors across northern Utah visit Heritage Clock & Antiques for antique clocks, vintage furniture, and estate finds you won't find in a chain store.",
        "nearby_areas": ["salt-lake-city", "layton"],
        "primary_search_intent": "heritage clock and antiques ogden",
        "secondary_search_intents": ["antique shop ogden utah", "clock repair ogden", "estate sale finds ogden utah"],
    },
})

BUSINESSES.append({
    "slug": "wasatch-home-repair", "name": "Wasatch Home Repair", "city": "ogden",
    "address": "1220 Washington Blvd", "zip": "84404",
    "phone_display": "(801) 555-0199", "phone_tel": "+18015550199",
    "categories": ["home-services"],
    "tags": ["local-favorite", "discount"],
    "theme": "homeservices", "icon": "wrench", "tier": 1, "featured": False,
    "offer": "$25 off any repair job over $150",
    "rating": 4.8, "review_count": 97, "price_range": "$$",
    "description": "Licensed handyman and home repair crew serving Ogden and Weber County — drywall, painting, fixture repair, and small remodels.",
    "highlights": ["Licensed & insured local crew", "Free on-site estimates",
                   "Same-week scheduling for small jobs", "Serving Ogden & greater Weber County"],
    "hours_display": [("Mon – Fri", "8:00 AM – 6:00 PM"), ("Sat", "9:00 AM – 2:00 PM"), ("Sun", "Closed")],
    "hours_schema": ["Mo-Fr 08:00-18:00", "Sa 09:00-14:00"],
    "schema_type": "HomeAndConstructionBusiness", "serves_cuisine": None, "area_served": ["Ogden, UT", "Weber County, UT"],
    "menu_kind": "services",
    "menu": [
        ("Repairs", [
            {"name": "Drywall Patch & Repair", "desc": "Holes, cracks & texture matching", "price": "$95+", "tags": []},
            {"name": "Fixture & Door Repair", "desc": "Hinges, handles, light fixtures", "price": "$75+", "tags": []},
            {"name": "Deck & Fence Repair", "desc": "Board replacement & structural fixes", "price": "$120+", "tags": []},
        ]),
        ("Painting", [
            {"name": "Interior Room Painting", "desc": "Prep, paint & cleanup, per room", "price": "$250+", "tags": []},
            {"name": "Exterior Touch-Up", "desc": "Trim, siding & door touch-up", "price": "$300+", "tags": []},
        ]),
        ("Small Remodels", [
            {"name": "Bathroom Refresh", "desc": "Fixtures, paint & vanity swap", "price": "Quote-based", "tags": []},
            {"name": "Basement Room Refresh", "desc": "Paint, trim & flooring touch-up", "price": "Quote-based", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Drywall patch repair completed by Wasatch Home Repair in Ogden",
        "Interior painting project by Wasatch Home Repair crew",
        "Fixture and door repair job in Ogden by Wasatch Home Repair",
        "Small remodel in progress by Wasatch Home Repair Ogden Utah",
        "Wasatch Home Repair crew truck serving Weber County",
        "Finished small remodel by Wasatch Home Repair",
    ],
    "flagship": True,
    "seo": {
        "main": {
            "title": "Wasatch Home Repair Ogden Utah | Handyman, Repairs & Small Remodels",
            "description": "Discover Wasatch Home Repair serving Ogden, Utah on Utah Gold Card. See services, service area, current offers, and how to request a free estimate.",
            "h1": "Wasatch Home Repair in Ogden, Utah",
            "og_title": "Wasatch Home Repair | Ogden, Utah Handyman",
            "og_description": "Licensed handyman and home repair crew serving Ogden and Weber County, Utah. See services, offers, and free estimates on Utah Gold Card.",
        },
        "offers": {
            "title": "Wasatch Home Repair Offers & Discounts | Ogden, Utah Handyman",
            "description": "See current repair discounts, free estimate requests, and email signup from Wasatch Home Repair, serving Ogden and Weber County, Utah.",
            "h1": "Current Offers from Wasatch Home Repair",
            "og_title": "Wasatch Home Repair Offers | Ogden, Utah",
            "og_description": "Current repair discounts and free estimate offers from Wasatch Home Repair.",
        },
        "menu": {
            "title": "Wasatch Home Repair Services & Pricing | Ogden, Utah Handyman",
            "description": "Browse handyman and home repair services from Wasatch Home Repair: drywall, painting, fixture repair, and small remodels in Ogden, Utah.",
            "h1": "Services from Wasatch Home Repair",
            "og_title": "Wasatch Home Repair Services | Ogden, Utah",
            "og_description": "Drywall, painting, fixture repair, and small remodels from Wasatch Home Repair in Ogden.",
        },
        "h2s": ["Handyman & Home Repair Serving Ogden and Weber County", "Why Homeowners Call Wasatch Home Repair",
                "Featured Repair & Remodel Services", "Free Estimates & Scheduling",
                "Current Offers from Wasatch Home Repair", "Service Area Around Ogden, Utah", "Frequently Asked Questions"],
        "local_keywords": ["wasatch home repair ogden", "handyman ogden utah", "home repair weber county",
                           "drywall repair ogden ut", "small remodel ogden utah"],
        "faqs": [
            ("What areas does Wasatch Home Repair serve?", "Wasatch Home Repair serves Ogden and greater Weber County, including same-week scheduling for smaller repair jobs."),
            ("Does Wasatch Home Repair offer free estimates?", "Yes. Wasatch Home Repair provides free on-site estimates for repair and small remodel projects before any work begins."),
            ("Is Wasatch Home Repair licensed and insured?", "Yes. Wasatch Home Repair is a licensed and insured home repair crew serving homeowners throughout the Ogden area."),
            ("What kind of jobs does Wasatch Home Repair handle?", "Wasatch Home Repair handles drywall repair, interior and exterior painting, fixture and door repair, and small home remodels."),
        ],
        "city_seo_intro": "Ogden homeowners rely on local, licensed crews for repairs — Wasatch Home Repair is a Utah Gold Card-listed handyman service serving the greater Ogden area.",
        "category_seo_intro": "From drywall patches to small remodels, Wasatch Home Repair is a trusted home services provider for Ogden and Weber County homeowners.",
        "nearby_areas": ["layton", "salt-lake-city"],
        "primary_search_intent": "wasatch home repair ogden",
        "secondary_search_intents": ["handyman ogden utah", "home repair weber county utah", "drywall repair ogden"],
    },
})

# ---- Remaining businesses: unique SEO copy is generated by auto_seo() ----

BUSINESSES.append({
    "slug": "wasatch-family-pizza", "name": "Wasatch Family Pizza", "city": "layton",
    "address": "1876 N Fairfield Rd", "zip": "84041",
    "phone_display": "(801) 555-0126", "phone_tel": "+18015550126",
    "categories": ["restaurants"], "tags": ["family-friendly", "dinner", "local-favorite"],
    "theme": "pizza", "icon": "pizza", "tier": 1, "featured": False,
    "offer": "Kids eat free with any large pizza purchase, Tuesday nights",
    "rating": 4.6, "review_count": 134, "price_range": "$$",
    "description": "Family-style pizzeria in Layton serving hand-tossed pies, calzones, and a weekly kids-eat-free dinner night.",
    "highlights": ["Hand-tossed dough made fresh daily", "Weekly kids-eat-free dinner night",
                   "Family combo deals that feed 4-6", "Gluten-free crust available"],
    "hours_display": [("Mon – Sun", "11:00 AM – 9:30 PM")], "hours_schema": ["Mo-Su 11:00-21:30"],
    "schema_type": "Restaurant", "serves_cuisine": ["Pizza", "American"], "area_served": None,
    "menu_kind": "menu",
    "menu": [
        ("Signature Pizzas", [
            {"name": "Wasatch Supreme", "desc": "Pepperoni, sausage, peppers, onions, olives", "price": "$21.99", "tags": []},
            {"name": "Pepperoni Classic", "desc": "House sauce, mozzarella, pepperoni", "price": "$16.99", "tags": []},
            {"name": "BBQ Chicken", "desc": "BBQ sauce, chicken, red onion, cilantro", "price": "$19.99", "tags": []},
        ]),
        ("Family Combos", [
            {"name": "Family Night Bundle", "desc": "2 large pizzas, salad & breadsticks — feeds 4-6", "price": "$39.99", "tags": ["family"]},
        ]),
        ("Calzones & Sides", [
            {"name": "Meat Lovers Calzone", "desc": "Pepperoni, sausage, ham, mozzarella", "price": "$12.99", "tags": []},
            {"name": "Garlic Knots", "desc": "Half dozen, garlic butter, parmesan", "price": "$6.99", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Hand-tossed pepperoni pizza at Wasatch Family Pizza in Layton, Utah",
        "Family night pizza bundle from Wasatch Family Pizza",
        "Meat lovers calzone at Wasatch Family Pizza Layton",
        "Kids-eat-free dinner night at Wasatch Family Pizza",
        "Dining room at Wasatch Family Pizza in Layton, Utah",
        "Fresh garlic knots at Wasatch Family Pizza",
    ],
})

BUSINESSES.append({
    "slug": "salt-city-tacos", "name": "Salt City Tacos", "city": "salt-lake-city",
    "address": "845 S 300 W", "zip": "84101",
    "phone_display": "(801) 555-0104", "phone_tel": "+18015550104",
    "categories": ["restaurants", "mexican-food"], "tags": ["lunch", "local-favorite", "discount"],
    "theme": "tacos", "icon": "utensils", "tier": 1, "featured": False,
    "offer": "Taco Tuesday: 3 tacos for $9 all day",
    "rating": 4.7, "review_count": 261, "price_range": "$",
    "description": "Fast-casual taco counter in downtown Salt Lake City known for a rotating salsa bar and a weekday lunch rush.",
    "highlights": ["Rotating house-made salsa bar", "Fast counter service for lunch rushes",
                   "Weekly Taco Tuesday special", "Vegetarian and carne asada options"],
    "hours_display": [("Mon – Sat", "10:30 AM – 9:00 PM"), ("Sun", "Closed")], "hours_schema": ["Mo-Sa 10:30-21:00"],
    "schema_type": "Restaurant", "serves_cuisine": ["Mexican"], "area_served": None,
    "menu_kind": "menu",
    "menu": [
        ("Tacos", [
            {"name": "Carne Asada Taco", "desc": "Grilled steak, onion, cilantro", "price": "$3.75", "tags": []},
            {"name": "Al Pastor Taco", "desc": "Marinated pork, pineapple", "price": "$3.75", "tags": []},
            {"name": "Veggie Taco", "desc": "Grilled seasonal vegetables, queso fresco", "price": "$3.25", "tags": []},
        ]),
        ("Plates", [
            {"name": "Burrito Bowl", "desc": "Rice, beans, choice of protein, salsa bar", "price": "$10.99", "tags": []},
            {"name": "Quesabirria Plate", "desc": "Crispy birria tacos with consomme", "price": "$13.99", "tags": []},
        ]),
        ("Sides", [
            {"name": "Chips & Salsa Bar", "desc": "Rotating house-made salsas", "price": "$4.50", "tags": []},
            {"name": "Elote", "desc": "Grilled corn, crema, cotija, chili", "price": "$4.25", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Carne asada street tacos at Salt City Tacos in downtown Salt Lake City",
        "Salsa bar at Salt City Tacos Salt Lake City",
        "Quesabirria plate with consomme at Salt City Tacos",
        "Lunch rush counter service at Salt City Tacos",
        "Elote street corn at Salt City Tacos Salt Lake City",
        "Storefront of Salt City Tacos in downtown Salt Lake City",
    ],
})

BUSINESSES.append({
    "slug": "provo-fresh-bowls", "name": "Provo Fresh Bowls", "city": "provo",
    "address": "1200 S University Ave", "zip": "84601",
    "phone_display": "(801) 555-0177", "phone_tel": "+18015550177",
    "categories": ["restaurants"], "tags": ["lunch", "family-friendly"],
    "theme": "healthy", "icon": "leaf", "tier": 1, "featured": False,
    "offer": "Free add-on topping with any bowl purchase",
    "rating": 4.5, "review_count": 88, "price_range": "$$",
    "description": "Build-your-own grain and greens bowls near Utah Valley University, built for fast, healthy lunches.",
    "highlights": ["Build-your-own bowl format", "Fresh, local produce where possible",
                   "Quick order-ahead for students & staff", "Vegan and high-protein bowl options"],
    "hours_display": [("Mon – Sat", "10:00 AM – 8:00 PM"), ("Sun", "11:00 AM – 6:00 PM")],
    "hours_schema": ["Mo-Sa 10:00-20:00", "Su 11:00-18:00"],
    "schema_type": "Restaurant", "serves_cuisine": ["Healthy", "American"], "area_served": None,
    "menu_kind": "menu",
    "menu": [
        ("Signature Bowls", [
            {"name": "Harvest Grain Bowl", "desc": "Farro, roasted veggies, tahini", "price": "$10.99", "tags": []},
            {"name": "Southwest Chicken Bowl", "desc": "Rice, black beans, corn, chicken", "price": "$11.49", "tags": []},
            {"name": "Vegan Power Bowl", "desc": "Quinoa, chickpeas, greens, avocado", "price": "$10.49", "tags": []},
        ]),
        ("Build Your Own", [
            {"name": "Base + 2 Toppings + Protein", "desc": "Choose your base, toppings & protein", "price": "$9.99+", "tags": []},
        ]),
        ("Add-Ons", [
            {"name": "Avocado", "desc": "Sliced fresh avocado", "price": "+$1.50", "tags": []},
            {"name": "Extra Protein", "desc": "Chicken, tofu, or salmon", "price": "+$2.50", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Harvest grain bowl at Provo Fresh Bowls near Utah Valley University",
        "Build-your-own bowl station at Provo Fresh Bowls",
        "Vegan power bowl with quinoa and avocado at Provo Fresh Bowls",
        "Fresh produce prep at Provo Fresh Bowls Provo Utah",
        "Southwest chicken bowl at Provo Fresh Bowls",
        "Counter service at Provo Fresh Bowls in Provo",
    ],
})

BUSINESSES.append({
    "slug": "park-city-dessert-bar", "name": "Park City Dessert Bar", "city": "park-city",
    "address": "605 Main St", "zip": "84060",
    "phone_display": "(435) 555-0155", "phone_tel": "+14355550155",
    "categories": ["restaurants"], "tags": ["date-night", "local-favorite"],
    "theme": "dessert", "icon": "cake", "tier": 2, "featured": True,
    "offer": "Complimentary dessert flight for two with any bottle of wine",
    "rating": 4.9, "review_count": 176, "price_range": "$$$",
    "description": "A Main Street dessert bar in Park City pairing small-batch pastries and dessert flights with wine and coffee — a favorite date-night stop.",
    "highlights": ["Small-batch pastry chef on site", "Dessert flights built for sharing",
                   "Wine and coffee pairing menu", "Steps from Park City's historic Main Street"],
    "hours_display": [("Wed – Mon", "2:00 PM – 10:00 PM"), ("Tue", "Closed")], "hours_schema": ["We-Mo 14:00-22:00"],
    "schema_type": "Restaurant", "serves_cuisine": ["Desserts", "Bakery"], "area_served": None,
    "menu_kind": "menu",
    "menu": [
        ("Dessert Flights", [
            {"name": "Classic Trio Flight", "desc": "Three seasonal dessert bites", "price": "$24", "tags": ["date-night"]},
            {"name": "Chocolate Lovers Flight", "desc": "Three chocolate-forward bites", "price": "$26", "tags": ["date-night"]},
        ]),
        ("Pastries", [
            {"name": "Seasonal Fruit Tart", "desc": "Rotating seasonal fruit", "price": "$9", "tags": []},
            {"name": "Dark Chocolate Torte", "desc": "Flourless dark chocolate torte", "price": "$10", "tags": []},
        ]),
        ("Pairings", [
            {"name": "Wine Pairing Add-On", "desc": "Curated pour per flight", "price": "+$14", "tags": []},
            {"name": "Coffee & Espresso", "desc": "Full espresso bar", "price": "$4-$6", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Dessert flight for two at Park City Dessert Bar on Main Street",
        "Dark chocolate torte at Park City Dessert Bar",
        "Wine and dessert pairing at Park City Dessert Bar",
        "Seasonal fruit tart at Park City Dessert Bar Park City Utah",
        "Interior seating at Park City Dessert Bar on Historic Main Street",
        "Pastry case at Park City Dessert Bar",
    ],
})

BUSINESSES.append({
    "slug": "beehive-boutique", "name": "Beehive Boutique", "city": "ogden",
    "address": "2545 Historic 25th St", "zip": "84401",
    "phone_display": "(801) 555-0140", "phone_tel": "+18015550140",
    "categories": ["local-shops"], "tags": ["local-favorite", "new-this-month"],
    "theme": "boutique", "icon": "bag", "tier": 1, "featured": False,
    "offer": "15% off one item for new email subscribers",
    "rating": 4.6, "review_count": 64, "price_range": "$$",
    "description": "A women's clothing and gift boutique on Historic 25th Street in Ogden, curating Utah-made goods and seasonal fashion.",
    "highlights": ["Utah-made gifts and accessories", "Seasonal fashion updated monthly",
                   "Locally owned since day one", "Gift wrapping available in-store"],
    "hours_display": [("Mon – Sat", "10:00 AM – 6:00 PM"), ("Sun", "Closed")], "hours_schema": ["Mo-Sa 10:00-18:00"],
    "schema_type": "Store", "serves_cuisine": None, "area_served": None,
    "menu_kind": "services",
    "menu": [
        ("Apparel", [
            {"name": "Seasonal Dress Collection", "desc": "Rotating seasonal styles", "price": "$48-$95", "tags": []},
            {"name": "Cozy Knit Sweaters", "desc": "Locally curated knitwear", "price": "$42", "tags": []},
        ]),
        ("Gifts & Accessories", [
            {"name": "Utah-Made Candle Line", "desc": "Hand-poured, locally made", "price": "$22", "tags": []},
            {"name": "Statement Jewelry", "desc": "Curated local jewelry makers", "price": "$18-$36", "tags": []},
        ]),
        ("Local Goods", [
            {"name": "Local Artist Print Series", "desc": "Prints from Utah artists", "price": "$30", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Seasonal clothing rack at Beehive Boutique in Ogden",
        "Utah-made gifts display at Beehive Boutique Historic 25th Street",
        "Jewelry and accessories counter at Beehive Boutique Ogden",
        "Storefront window of Beehive Boutique in Ogden, Utah",
        "Gift wrapping station at Beehive Boutique",
        "Local artist prints at Beehive Boutique Ogden",
    ],
})

BUSINESSES.append({
    "slug": "utah-kids-adventure-zone", "name": "Utah Kids Adventure Zone", "city": "layton",
    "address": "745 W Antelope Dr", "zip": "84041",
    "phone_display": "(801) 555-0133", "phone_tel": "+18015550133",
    "categories": ["family-fun", "events-attractions"], "tags": ["family-friendly", "birthday-club"],
    "theme": "family", "icon": "users", "tier": 1, "featured": False,
    "offer": "Free birthday party favor bag with any booked party package",
    "rating": 4.7, "review_count": 152, "price_range": "$$",
    "description": "An indoor family entertainment center in Layton with play zones, arcade games, and birthday party packages for kids of all ages.",
    "highlights": ["Multi-level indoor play structure", "Arcade & prize counter",
                   "Birthday party packages with private rooms", "Toddler-safe play zone available"],
    "hours_display": [("Mon – Sat", "10:00 AM – 8:00 PM"), ("Sun", "11:00 AM – 6:00 PM")],
    "hours_schema": ["Mo-Sa 10:00-20:00", "Su 11:00-18:00"],
    "schema_type": "LocalBusiness", "serves_cuisine": None, "area_served": None,
    "menu_kind": "services",
    "menu": [
        ("Admission", [
            {"name": "General Play Pass", "desc": "All-day access to play structure & arcade", "price": "$14.99", "tags": []},
            {"name": "Toddler Play Pass", "desc": "Ages 3 and under", "price": "$9.99", "tags": []},
        ]),
        ("Birthday Parties", [
            {"name": "Basic Party Package", "desc": "Up to 10 kids, private table", "price": "$199", "tags": ["birthday-club"]},
            {"name": "Deluxe Party Package", "desc": "Up to 15 kids, private room & host", "price": "$299", "tags": ["birthday-club"]},
        ]),
        ("Group & School Visits", [
            {"name": "Group Rate (10+)", "desc": "Discounted per-child group pricing", "price": "$11.99/child", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Indoor play structure at Utah Kids Adventure Zone in Layton",
        "Birthday party room setup at Utah Kids Adventure Zone",
        "Arcade games at Utah Kids Adventure Zone Layton Utah",
        "Toddler play zone at Utah Kids Adventure Zone",
        "Kids playing at Utah Kids Adventure Zone in Layton",
        "Prize counter at Utah Kids Adventure Zone",
    ],
})

BUSINESSES.append({
    "slug": "mountain-view-catering", "name": "Mountain View Catering", "city": "midvale",
    "address": "7402 Union Park Ave", "zip": "84047",
    "phone_display": "(801) 555-0121", "phone_tel": "+18015550121",
    "categories": ["catering"], "tags": ["catering", "local-favorite"],
    "theme": "catering", "icon": "truck", "tier": 1, "featured": False,
    "offer": "10% off your first office catering order",
    "rating": 4.8, "review_count": 71, "price_range": "$$",
    "description": "Full-service event and office catering out of Midvale, serving the Salt Lake Valley with customizable menus for any group size.",
    "highlights": ["Customizable menus for any group size", "Office lunch delivery across the Salt Lake Valley",
                   "Full-service event catering with staff available", "Dietary-friendly menu options on request"],
    "hours_display": [("Mon – Fri", "8:00 AM – 5:00 PM"), ("Weekends", "By appointment for events")],
    "hours_schema": ["Mo-Fr 08:00-17:00"],
    "schema_type": "FoodEstablishment", "serves_cuisine": ["American", "Catering"], "area_served": ["Salt Lake Valley, UT"],
    "menu_kind": "services",
    "menu": [
        ("Office Catering", [
            {"name": "Boxed Lunch Package", "desc": "Individually boxed, per person", "price": "$12.99/person", "tags": ["catering"]},
            {"name": "Buffet Lunch Package", "desc": "Full buffet setup, per person", "price": "$15.99/person", "tags": ["catering"]},
        ]),
        ("Event Catering", [
            {"name": "Full-Service Event Menu", "desc": "Custom menu with serving staff", "price": "Custom quote", "tags": ["catering"]},
            {"name": "Appetizer & Cocktail Hour Package", "desc": "Passed apps, per person", "price": "$9.99/person", "tags": ["catering"]},
        ]),
        ("Add-Ons", [
            {"name": "Dessert Table Add-On", "desc": "Assorted desserts, per person", "price": "$4.99/person", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Office catering buffet setup by Mountain View Catering in Midvale",
        "Boxed lunch catering package from Mountain View Catering",
        "Event catering table by Mountain View Catering Salt Lake Valley",
        "Appetizer display at an event catered by Mountain View Catering",
        "Dessert table add-on by Mountain View Catering",
        "Catering delivery van from Mountain View Catering Midvale Utah",
    ],
})

BUSINESSES.append({
    "slug": "sahara-table", "name": "Sahara Table", "city": "salt-lake-city",
    "address": "220 S 500 E", "zip": "84102",
    "phone_display": "(801) 555-0171", "phone_tel": "+18015550171",
    "categories": ["restaurants", "halal-friendly"], "tags": ["halal-friendly", "dinner", "date-night"],
    "theme": "halal", "icon": "utensils", "tier": 1, "featured": True,
    "offer": "Free baklava dessert with any two entrees",
    "rating": 4.8, "review_count": 103, "price_range": "$$",
    "description": "A halal-friendly Mediterranean kitchen in Salt Lake City serving shawarma, kebabs, and mezze plates for lunch and dinner.",
    "highlights": ["Fully halal-friendly kitchen", "Fresh-baked pita made in-house",
                   "Mezze plates built for sharing", "Late-evening dinner hours"],
    "hours_display": [("Mon – Sun", "11:00 AM – 10:00 PM")], "hours_schema": ["Mo-Su 11:00-22:00"],
    "schema_type": "Restaurant", "serves_cuisine": ["Mediterranean", "Middle Eastern"], "area_served": None,
    "menu_kind": "menu",
    "menu": [
        ("Shawarma & Kebabs", [
            {"name": "Chicken Shawarma Plate", "desc": "Halal-friendly, rice, garlic sauce", "price": "$13.99", "tags": ["halal"]},
            {"name": "Lamb Kebab Plate", "desc": "Halal-friendly grilled lamb, rice, salad", "price": "$16.99", "tags": ["halal"]},
            {"name": "Beef Kofta Plate", "desc": "Halal-friendly, rice, tomato sauce", "price": "$14.99", "tags": ["halal"]},
        ]),
        ("Mezze", [
            {"name": "Hummus & Pita", "desc": "House-made hummus, warm pita", "price": "$6.99", "tags": []},
            {"name": "Mixed Mezze Platter", "desc": "Hummus, tabbouleh, falafel, pita", "price": "$15.99", "tags": []},
        ]),
        ("Desserts", [
            {"name": "Baklava", "desc": "Layered pastry, honey, pistachio", "price": "$4.99", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Halal-friendly chicken shawarma plate at Sahara Table in Salt Lake City",
        "Mixed mezze platter at Sahara Table Salt Lake City",
        "Fresh-baked pita at Sahara Table Mediterranean kitchen",
        "Lamb kebab plate at Sahara Table Salt Lake City Utah",
        "Baklava dessert at Sahara Table",
        "Dining room at Sahara Table in Salt Lake City",
    ],
})

BUSINESSES.append({
    "slug": "red-rock-adventure-co", "name": "Red Rock Adventure Co.", "city": "st-george",
    "address": "1145 S Bluff St", "zip": "84770",
    "phone_display": "(435) 555-0188", "phone_tel": "+14355550188",
    "categories": ["events-attractions", "family-fun"], "tags": ["family-friendly", "local-favorite"],
    "theme": "adventure", "icon": "mountain", "tier": 2, "featured": True,
    "offer": "$10 off any guided red rock tour booked online",
    "rating": 4.9, "review_count": 211, "price_range": "$$$",
    "description": "Guided red rock hiking, biking, and jeep tours based in St. George, built for families, groups, and first-time visitors to southern Utah.",
    "highlights": ["Guided jeep, hiking & biking tours", "Family and beginner-friendly routes",
                   "Group and private tour options", "Local guides with red rock expertise"],
    "hours_display": [("Daily", "7:00 AM – 6:00 PM (seasonal)")], "hours_schema": ["Mo-Su 07:00-18:00"],
    "schema_type": "LocalBusiness", "serves_cuisine": None, "area_served": ["St. George, UT", "Washington County, UT"],
    "menu_kind": "services",
    "menu": [
        ("Guided Tours", [
            {"name": "Red Rock Jeep Tour", "desc": "2.5-hour guided backcountry route", "price": "$89/person", "tags": []},
            {"name": "Family Hiking Tour", "desc": "Beginner-friendly, all ages", "price": "$45/person", "tags": ["family-friendly"]},
            {"name": "Sunset Photography Tour", "desc": "Guided golden-hour hike", "price": "$65/person", "tags": []},
        ]),
        ("Rentals", [
            {"name": "Mountain Bike Rental", "desc": "Half-day rental, helmet included", "price": "$35", "tags": []},
        ]),
        ("Group Bookings", [
            {"name": "Group Tour Rate (8+)", "desc": "Custom group scheduling", "price": "Custom quote", "tags": []},
        ]),
    ],
    "gallery_alts": [
        "Guided jeep tour through red rock terrain near St. George by Red Rock Adventure Co.",
        "Family hiking tour group at Red Rock Adventure Co. St. George",
        "Sunset photography tour in southern Utah red rock country",
        "Mountain bike rental gear at Red Rock Adventure Co.",
        "Guide leading a group hike for Red Rock Adventure Co. in St. George",
        "Red rock landscape near St. George, Utah on a guided tour",
    ],
})

BUSINESS_BY_SLUG = {b["slug"]: b for b in BUSINESSES}
for _b in BUSINESSES:
    _b.setdefault("flagship", False)
    _b.setdefault("seo", None)

# ------------------------------------------------------------------
# SEO helpers — auto-generated (unique per business) SEO fields for
# every business that doesn't have hand-authored "seo" data.
# ------------------------------------------------------------------
THEME_GRADIENTS = {
    "mexican": "linear-gradient(150deg,#8c3420,#c9581f 60%,#e3a13a)",
    "mediterranean": "linear-gradient(150deg,#5c5b25,#8a8a3a 60%,#d8c26a)",
    "halal": "linear-gradient(150deg,#0f4c46,#1f7a6c 60%,#c9a24b)",
    "coffee": "linear-gradient(150deg,#3b2a1e,#5f4530 60%,#c9a24b)",
    "pizza": "linear-gradient(150deg,#6e1f1f,#a3372a 60%,#e3a13a)",
    "tacos": "linear-gradient(150deg,#7a2b12,#c9581f 60%,#e8c15a)",
    "healthy": "linear-gradient(150deg,#274a2e,#4c7a4a 60%,#c9d17a)",
    "dessert": "linear-gradient(150deg,#4a1f3a,#7a3a63 60%,#e3b3c9)",
    "boutique": "linear-gradient(150deg,#3a2430,#7a4a5c 60%,#e3c1a8)",
    "salon": "linear-gradient(150deg,#181818,#3a3230 60%,#e3b3c9)",
    "family": "linear-gradient(150deg,#123a5c,#2f6a8a 60%,#f0d16a)",
    "catering": "linear-gradient(150deg,#241f1a,#4a3f2e 60%,#c9a24b)",
    "antiques": "linear-gradient(150deg,#3a2a18,#6b4a2c 60%,#c9a24b)",
    "homeservices": "linear-gradient(150deg,#20262b,#3d4a52 60%,#9db3bd)",
    "adventure": "linear-gradient(150deg,#1b3a2b,#3d6b45 60%,#e3a13a)",
    "gold": "linear-gradient(150deg,#1a1712,#3a2f1a 60%,#c9a24b)",
}


def theme_style(theme):
    return f"background-image:{THEME_GRADIENTS.get(theme, THEME_GRADIENTS['gold'])};"


CATEGORY_SINGULAR = {
    "Restaurants": "restaurant", "Local Shops": "local shop", "Salons": "salon",
    "Home Services": "home services", "Events & Attractions": "attractions",
}

TYPE_WORD = {
    "Restaurant": ("restaurant", "menu"),
    "CafeOrCoffeeShop": ("coffee shop", "menu"),
    "FoodEstablishment": ("catering company", "catering menu"),
    "HealthAndBeautyBusiness": ("salon", "services"),
    "Store": ("shop", "products"),
    "AntiqueStore": ("antique shop", "featured pieces"),
    "HomeAndConstructionBusiness": ("home services company", "services"),
    "LocalBusiness": ("business", "services"),
}


def hours_sentence(biz):
    return "; ".join(f"{d} {t}" for d, t in biz["hours_display"])


def cat_join(cats):
    joiner = " and " if any("&" in c for c in cats) else " & "
    if len(cats) == 1:
        return cats[0]
    if len(cats) == 2:
        return f"{cats[0]}{joiner}{cats[1]}"
    return ", ".join(cats[:-1]) + f"{joiner}{cats[-1]}"


def auto_seo(biz):
    name = biz["name"]
    city = AREAS[biz["city"]]["name"]
    cats = [CATEGORIES[c]["name"] for c in biz["categories"]]
    primary_cat = cats[0]
    cat_str = cat_join(cats)
    kind_word, listing_word = TYPE_WORD.get(biz["schema_type"], ("business", "services"))
    is_food = biz["menu_kind"] == "menu"

    main = {
        "title": f"{name} {city} Utah | {cat_str}",
        "description": f"Discover {name} in {city}, Utah on Utah Gold Card. See {listing_word}, current offers, hours, directions, and contact information.",
        "h1": f"{name} in {city}, Utah",
        "og_title": f"{name} | {city}, Utah",
        "og_description": biz["description"],
    }
    offers = {
        "title": f"{name} Offers & Deals in {city}, Utah | Utah Gold Card",
        "description": f"See current offers, email signup, and local deals from {name} in {city}, Utah.",
        "h1": f"Current Offers from {name}",
        "og_title": f"{name} Offers | {city}, Utah",
        "og_description": biz["offer"] or f"Current offers and email signup from {name} in {city}, Utah.",
    }
    menu = {
        "title": f"{name} {'Menu' if is_food else 'Services & Pricing'} | {city}, Utah",
        "description": f"Browse {listing_word} from {name} in {city}, Utah, including " +
                        ", ".join(sec[0].lower() for sec in biz["menu"][:3]) + ".",
        "h1": f"The {name} Menu in {city}" if is_food else f"Services at {name}",
        "og_title": f"{name} {'Menu' if is_food else 'Services'} | {city}, Utah",
        "og_description": f"{listing_word.title()} from {name} in {city}, Utah.",
    }
    h2s = [
        f"{cat_str} in {city}",
        f"Why Locals Visit {name}",
        f"Featured {listing_word.title()}",
        f"Offers & Updates from {name}",
        f"Visit {name} in {city}",
        "Frequently Asked Questions",
    ]
    local_keywords = [
        f"{name.lower()} {city.lower()}",
        f"{primary_cat.lower()} {city.lower()} utah",
        f"{primary_cat.lower()} near me",
        f"best {primary_cat.lower()} in {city.lower()}",
    ]
    if len(cats) > 1:
        local_keywords.append(f"{cats[1].lower()} {city.lower()} utah")

    faqs = [
        (f"Where is {name} located?", f"{name} is located at {biz['address']}, {city}, UT {biz['zip']}."),
        (f"What are {name}'s hours?", f"{name} is open {hours_sentence(biz)}."),
    ]
    if biz["offer"]:
        faqs.append((f"Does {name} have any current offers?", f"Yes — {biz['offer']}. Visit the offers page for full details and to sign up for future local deals."))
    if "halal-friendly" in biz["tags"] or "halal-friendly" in biz["categories"]:
        faqs.append((f"Is {name} halal-friendly?", f"Yes. {name} offers halal-friendly options — look for the halal tag on qualifying menu items."))
    if "catering" in biz["tags"] or "catering" in biz["categories"]:
        faqs.append((f"Does {name} offer catering?", f"Yes. {name} offers catering packages for offices, parties, and events — see the menu page for catering options and pricing."))
    if "birthday-club" in biz["tags"] or "loyalty-offer" in biz["tags"]:
        faqs.append((f"Does {name} have a loyalty or birthday program?", f"Yes. {name} participates in the Utah Gold Card loyalty and birthday club program — sign up on the offers page."))
    if len(faqs) < 4:
        cat_singular = CATEGORY_SINGULAR.get(primary_cat, primary_cat.lower())
        faqs.append((f"What makes {name} a local favorite in {city}?", f"{biz['highlights'][0]}, which is one of the reasons {name} is a Utah Gold Card featured {cat_singular} business in {city}."))

    area_order_idx = AREA_ORDER.index(biz["city"])
    nearby_areas = [AREA_ORDER[(area_order_idx + 1) % len(AREA_ORDER)], AREA_ORDER[(area_order_idx + 2) % len(AREA_ORDER)]]

    return {
        "main": main, "offers": offers, "menu": menu, "h2s": h2s,
        "local_keywords": local_keywords, "faqs": faqs,
        "city_seo_intro": f"{AREAS[biz['city']]['blurb']} {name} is one of its Utah Gold Card-listed {cat_str.lower()} businesses.",
        "category_seo_intro": f"{CATEGORIES[biz['categories'][0]]['blurb']} {name} in {city} is featured among them on Utah Gold Card.",
        "nearby_areas": nearby_areas,
        "primary_search_intent": f"{name.lower()} {city.lower()}",
        "secondary_search_intents": local_keywords[1:],
    }


def get_seo(biz):
    return biz["seo"] if biz.get("seo") else auto_seo(biz)


def canonical_url(biz, page):
    if page == "main":
        return f"{SITE_URL}/{biz['slug']}"
    return f"{SITE_URL}/{biz['slug']}/{page}"


def related_businesses(biz, limit=3):
    same_cat = [b for b in BUSINESSES if b["slug"] != biz["slug"] and set(b["categories"]) & set(biz["categories"])]
    same_city = [b for b in BUSINESSES if b["slug"] != biz["slug"] and b["city"] == biz["city"] and b not in same_cat]
    combined = same_cat + same_city
    seen, out = set(), []
    for b in combined:
        if b["slug"] not in seen:
            out.append(b)
            seen.add(b["slug"])
        if len(out) >= limit:
            break
    if len(out) < limit:
        for b in BUSINESSES:
            if b["slug"] != biz["slug"] and b["slug"] not in seen:
                out.append(b)
                seen.add(b["slug"])
            if len(out) >= limit:
                break
    return out


def businesses_in_city(city_slug):
    return [b for b in BUSINESSES if b["city"] == city_slug]


def businesses_in_category(cat_slug):
    return [b for b in BUSINESSES if cat_slug in b["categories"]]


def businesses_in_city_category(city_slug, cat_slug):
    return [b for b in BUSINESSES if b["city"] == city_slug and cat_slug in b["categories"]]


CITY_CATEGORY_COMBOS = []
for _city in AREA_ORDER:
    for _cat in CATEGORY_ORDER:
        if businesses_in_city_category(_city, _cat):
            CITY_CATEGORY_COMBOS.append((_city, _cat))

# ------------------------------------------------------------------
# JSON-LD structured data
# ------------------------------------------------------------------
def parse_price_num(p):
    m = re.match(r"^\$([0-9]+(?:\.[0-9]{2})?)", p.strip())
    return m.group(1) if m else None


def business_entity_jsonld(biz):
    area = AREAS[biz["city"]]
    entity = {
        "@context": "https://schema.org",
        "@type": biz["schema_type"],
        "@id": f"{SITE_URL}/{biz['slug']}#business",
        "name": biz["name"],
        "description": biz["description"],
        "url": f"{SITE_URL}/{biz['slug']}",
        "telephone": biz["phone_tel"],
        "priceRange": biz["price_range"],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": biz["address"],
            "addressLocality": area["name"],
            "addressRegion": "UT",
            "postalCode": biz["zip"],
            "addressCountry": "US",
        },
        "geo": {"@type": "GeoCoordinates", "latitude": area["lat"], "longitude": area["lng"]},
        "openingHours": biz["hours_schema"],
        "image": f"{SITE_URL}/assets/business-photos/{biz['slug']}-cover.jpg",
        "areaServed": biz["area_served"] if biz["area_served"] else area["name"] + ", UT",
        "hasMap": f"https://www.google.com/maps/search/?api=1&query={urlquote(biz['name'] + ' ' + biz['address'] + ' ' + area['name'] + ' UT')}",
        "sameAs": [f"https://www.facebook.com/{biz['slug']}", f"https://www.instagram.com/{biz['slug']}"],
    }
    if biz["serves_cuisine"]:
        entity["servesCuisine"] = biz["serves_cuisine"]
    if biz["menu_kind"] == "menu":
        entity["menu"] = f"{SITE_URL}/{biz['slug']}/menu"
    return entity


def jsonld_main(biz):
    return business_entity_jsonld(biz)


def jsonld_offers(biz):
    entity = business_entity_jsonld(biz)
    offers_list = []
    if biz["offer"]:
        offers_list.append({"@type": "Offer", "name": "Current Local Offer", "description": biz["offer"]})
    if "birthday-club" in biz["tags"]:
        offers_list.append({"@type": "Offer", "name": "Birthday Club", "description": f"Birthday club signup for {biz['name']} guests via Utah Gold Card."})
    if "loyalty-offer" in biz["tags"]:
        offers_list.append({"@type": "Offer", "name": "Loyalty Program", "description": f"Loyalty rewards for repeat {biz['name']} guests via Utah Gold Card."})
    if offers_list:
        entity["makesOffer"] = offers_list
    return entity


def jsonld_menu(biz):
    entity = business_entity_jsonld(biz)
    if biz["menu_kind"] == "menu":
        sections = []
        for sec_name, items in biz["menu"]:
            menu_items = []
            for it in items:
                mi = {"@type": "MenuItem", "name": it["name"], "description": it["desc"]}
                price_num = parse_price_num(it["price"])
                if price_num:
                    mi["offers"] = {"@type": "Offer", "price": price_num, "priceCurrency": "USD"}
                menu_items.append(mi)
            sections.append({"@type": "MenuSection", "name": sec_name, "hasMenuItem": menu_items})
        entity["hasMenu"] = {"@type": "Menu", "@id": f"{SITE_URL}/{biz['slug']}/menu#menu", "hasMenuSection": sections}
    else:
        catalog_items = []
        for sec_name, items in biz["menu"]:
            for it in items:
                catalog_items.append({
                    "@type": "Offer",
                    "itemOffered": {"@type": "Service", "name": it["name"], "description": it["desc"]},
                })
        entity["hasOfferCatalog"] = {"@type": "OfferCatalog", "name": f"{biz['name']} Services", "itemListElement": catalog_items}
    return entity


def jsonld_breadcrumbs(crumbs, root_for_urls):
    items = []
    for i, (label, href) in enumerate(crumbs):
        url = href if href and href.startswith("http") else f"{SITE_URL}/{href}" if href else canonical_from_crumb(crumbs, i)
        items.append({"@type": "ListItem", "position": i + 1, "name": label, "item": url})
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}


def canonical_from_crumb(crumbs, i):
    return SITE_URL + "/"


def jsonld_itemlist(name, biz_list):
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": name,
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "url": f"{SITE_URL}/{b['slug']}", "name": b["name"]}
            for i, b in enumerate(biz_list)
        ],
    }


def jsonld_script(data):
    return f'<script type="application/ld+json">{json.dumps(data, ensure_ascii=False)}</script>'


# ------------------------------------------------------------------
# Page shell: head / header / breadcrumbs / footer / page wrapper
# ------------------------------------------------------------------
NAV_ITEMS = [
    ("Explore", "directory/"), ("Food", "food/"), ("Areas", "areas/"), ("Categories", "categories/"),
    ("Deals", "deals/"), ("For Businesses", "business-owners/"), ("Pricing", "pricing/"),
    ("Email Program", "email-program/"), ("Loyalty", "loyalty/"), ("Advertise", "advertise/"),
]

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E"
           "%3Crect width='100' height='100' rx='22' fill='%230b0b0c'/%3E"
           "%3Ctext x='50' y='68' font-size='58' font-family='Georgia,serif' font-weight='700' "
           "fill='%23c9a24b' text-anchor='middle'%3EG%3C/text%3E%3C/svg%3E")


def head_html(meta, root, robots="index, follow", jsonld_list=None):
    jsonld_list = jsonld_list or []
    jsonld_html = "\n".join(jsonld_script(j) for j in jsonld_list)
    og_type = meta.get("og_type", "website")
    return f"""<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(meta['title'])}</title>
<meta name="description" content="{esc(meta['description'])}">
<link rel="canonical" href="{esc(meta['canonical'])}">
<meta name="robots" content="{robots}">
<link rel="icon" href="{FAVICON}">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="Utah Gold Card">
<meta property="og:title" content="{esc(meta.get('og_title', meta['title']))}">
<meta property="og:description" content="{esc(meta.get('og_description', meta['description']))}">
<meta property="og:url" content="{esc(meta['canonical'])}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(meta.get('og_title', meta['title']))}">
<meta name="twitter:description" content="{esc(meta.get('og_description', meta['description']))}">
<link rel="stylesheet" href="{root}css/style.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
{jsonld_html}"""


def header_html(root, active=None):
    links = []
    for label, href in NAV_ITEMS:
        cls = ' class="is-active"' if label == active else ""
        links.append(f'<a href="{root}{href}"{cls}>{label}</a>')
    mobile_links = []
    for label, href in NAV_ITEMS + [("Join", "join/")]:
        cls = ' class="is-active"' if label == active else ""
        mobile_links.append(f'<a href="{root}{href}"{cls}>{label}</a>')
    return f"""<header class="site-header">
  <div class="wrap nav-bar">
    <a href="{root}" class="brand">
      <span class="brand-mark">G</span>
      <span class="brand-text"><b>Utah Gold Card</b><span>Local Business Directory</span></span>
    </a>
    <nav class="nav-links">{''.join(links)}</nav>
    <div class="nav-cta">
      <a href="{root}join/" class="btn btn-outline btn-sm hide-mobile">Join</a>
      <a href="{root}join/" class="btn btn-gold btn-sm">Get Listed</a>
      <button class="nav-toggle" type="button" aria-label="Menu">{icon('menu')}</button>
    </div>
  </div>
  <div class="mobile-menu">{''.join(mobile_links)}</div>
</header>"""


def breadcrumb_bar(crumbs, root):
    parts = []
    for i, (label, href) in enumerate(crumbs):
        if href is not None:
            parts.append(f'<a href="{root}{href}">{esc(label)}</a>')
        else:
            parts.append(f'<span class="current">{esc(label)}</span>')
        if i < len(crumbs) - 1:
            parts.append('<span class="sep">/</span>')
    return f'<div class="breadcrumb-bar"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb">{"".join(parts)}</nav></div></div>'


def footer_html(root):
    return f"""<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="brand" style="margin-bottom:14px;">
          <span class="brand-mark">G</span>
          <span class="brand-text"><b>Utah Gold Card</b><span>Local Business Directory</span></span>
        </div>
        <p style="max-width:32ch;">Discover Utah restaurants, shops, services, deals, and hidden gems — and help local businesses get found.</p>
        <div class="footer-social gap-8" style="display:flex;">
          <span class="footer-social" title="Facebook">{icon('facebook')}</span>
          <span class="footer-social" title="Instagram">{icon('instagram')}</span>
          <span class="footer-social" title="LinkedIn">{icon('linkedin')}</span>
        </div>
      </div>
      <div><h5>Explore</h5><ul>
        <li><a href="{root}directory/">Directory</a></li>
        <li><a href="{root}food/">Food</a></li>
        <li><a href="{root}deals/">Deals</a></li>
        <li><a href="{root}areas/">Areas</a></li>
        <li><a href="{root}categories/">Categories</a></li>
      </ul></div>
      <div><h5>For Businesses</h5><ul>
        <li><a href="{root}business-owners/">For Businesses</a></li>
        <li><a href="{root}pricing/">Pricing</a></li>
        <li><a href="{root}advertise/">Advertise</a></li>
        <li><a href="{root}join/">Get Listed</a></li>
      </ul></div>
      <div><h5>Programs</h5><ul>
        <li><a href="{root}email-program/">Email Program</a></li>
        <li><a href="{root}loyalty/">Loyalty</a></li>
        <li><a href="{root}fajita-grill/">Featured Mini-Site</a></li>
      </ul></div>
      <div><h5>Get Utah Gold Card Deals</h5>
        <p style="font-size:.85rem;">Join the email list for weekly local deals and new business spotlights.</p>
        <form class="inline-signup" data-demo-form data-success="You're on the list! Watch for Utah's best local deals." style="flex-direction:column;">
          <input type="email" placeholder="you@email.com" required aria-label="Email address">
          <button class="btn btn-gold btn-sm btn-block" type="submit">Subscribe</button>
          <div class="form-success"><span></span></div>
        </form>
      </div>
    </div>
    <div class="footer-internal">
      <span>Platform preview (internal, not indexed):</span>
      <a href="{root}admin-dashboard/">Admin Dashboard</a>
      <a href="{root}campaign-dashboard/">Campaign Dashboard</a>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 Utah Gold Card. All rights reserved.</span>
      <span>Utah&rsquo;s local business directory, mini-sites &amp; email program.</span>
    </div>
  </div>
</footer>
<script src="{root}js/main.js"></script>"""


def page(meta, root, body, breadcrumbs=None, active_nav=None, robots="index, follow", jsonld_list=None):
    bc_html = breadcrumb_bar(breadcrumbs, root) if breadcrumbs else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
{head_html(meta, root, robots, jsonld_list)}
</head>
<body>
{header_html(root, active_nav)}
{bc_html}
<main>
{body}
</main>
{footer_html(root)}
</body>
</html>"""


def write_page(rel_dir, meta, root, body, **kwargs):
    out_dir = os.path.join(ROOT, rel_dir)
    os.makedirs(out_dir, exist_ok=True)
    html_out = page(meta, root, body, **kwargs)
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_out)
    return f"/{rel_dir}/" if rel_dir else "/"

# ------------------------------------------------------------------
# Reusable components
# ------------------------------------------------------------------
def ph_block(theme, icon_name, tag_text="", extra_class=""):
    tag_html = f'<span class="ph-tag">{esc(tag_text)}</span>' if tag_text else ""
    return f'<div class="ph ph-{theme} {extra_class}"><span class="ph-icon">{icon(icon_name)}</span>{tag_html}</div>'


def business_breadcrumbs(biz, current_label=None, root_prefix=""):
    primary_cat = biz["categories"][0]
    crumbs = [
        ("Home", ""), ("Utah Businesses", "directory/"),
        (AREAS[biz["city"]]["name"], f"areas/{biz['city']}/"),
        (CATEGORIES[primary_cat]["name"], f"categories/{primary_cat}/"),
    ]
    if current_label:
        crumbs.append((biz["name"], biz["slug"] + "/"))
        crumbs.append((current_label, None))
    else:
        crumbs.append((biz["name"], None))
    return crumbs


def business_card(biz, root, size="normal"):
    seo = get_seo(biz)
    area = AREAS[biz["city"]]
    tags_html = "".join(f'<span class="tag">{esc(TAG_LABEL.get(t, t))}</span>' for t in biz["tags"][:3])
    offer_badge = f'<span class="badge-offer">Offer</span>' if biz["offer"] else ""
    ribbon = f'<span class="badge-ribbon">{icon("award")} Featured</span>' if biz["featured"] else ""
    tier_label = {1: "Directory Mini-Site", 2: "Subdomain Mini-Site", 3: "Custom Website"}[biz["tier"]]
    stars = "&#9733;" * int(round(biz["rating"]))
    return f"""<article class="card b-card" data-card
  data-name="{esc(biz['name'].lower())}" data-area="{biz['city']}" data-category="{','.join(biz['categories'])}"
  data-tags="{','.join(biz['tags'])}" data-featured="{str(biz['featured']).lower()}" data-offer="{str(bool(biz['offer'])).lower()}"
  data-rating="{biz['rating']}" data-new="{str('new-this-month' in biz['tags']).lower()}">
  <div class="b-card-media">
    {ph_block(biz['theme'], biz['icon'])}
    {ribbon}
    {offer_badge}
  </div>
  <div class="b-card-body">
    <div class="b-card-top">
      <div>
        <h3 style="margin-bottom:2px;"><a href="{root}{biz['slug']}/">{esc(biz['name'])}</a></h3>
        <span class="b-card-city">{icon('map-pin')} {area['name']} &middot; {CATEGORIES[biz['categories'][0]]['name']}</span>
      </div>
    </div>
    <p class="b-card-desc">{esc(biz['description'])}</p>
    <div class="rating-demo"><span class="stars">{stars}</span> {biz['rating']} ({biz['review_count']}) <span class="flag">Demo data</span></div>
    <div class="tag-row">{tags_html}</div>
    <div class="b-card-foot">
      <span class="tier-badge">{tier_label}</span>
      <a href="{root}{biz['slug']}/" class="link-arrow">View Mini-Site {icon('arrow-right')}</a>
    </div>
  </div>
</article>"""


def area_card(city_slug, root):
    area = AREAS[city_slug]
    count = len(businesses_in_city(city_slug))
    return f"""<a href="{root}areas/{city_slug}/" class="a-card ph-{area['theme']}">
  <span class="ph-icon">{icon('map-pin')}</span>
  <div class="a-card-inner">
    <span>{area['region']}</span>
    <h3>{area['name']}</h3>
    <span class="meta-pill">{icon('layers')} {count} listed business{'es' if count != 1 else ''}</span>
  </div>
</a>"""


def category_card(cat_slug, root):
    cat = CATEGORIES[cat_slug]
    count = len(businesses_in_category(cat_slug))
    return f"""<a href="{root}categories/{cat_slug}/" class="cat-card">
  <div class="cat-icon">{icon(cat['icon'])}</div>
  <h3>{cat['name']}</h3>
  <p style="margin-bottom:0;font-size:.88rem;">{cat['blurb']}</p>
  <span class="count">{count} business{'es' if count != 1 else ''} listed</span>
</a>"""


def deal_card(biz, root):
    area = AREAS[biz["city"]]
    return f"""<div class="deal-card">
  <span class="deal-tag">{icon('badge-percent')} Local Offer</span>
  <span class="biz">{esc(biz['name'])} &middot; {area['name']}</span>
  <h4>{esc(biz['offer'])}</h4>
  <p>{esc(biz['description'][:110])}{'...' if len(biz['description']) > 110 else ''}</p>
  <div class="deal-foot">
    <span>{CATEGORIES[biz['categories'][0]]['name']}</span>
    <a href="{root}{biz['slug']}/offers/" class="link-arrow" style="color:var(--gold-bright);">View Offer {icon('arrow-right')}</a>
  </div>
</div>"""


def faq_block(faqs):
    items = "".join(f"""<details class="faq-item"><summary>{esc(q)}<span class="plus">{icon('arrow-right')}</span></summary><p>{esc(a)}</p></details>""" for q, a in faqs)
    return f'<div class="faq-list">{items}</div>'


def gallery_block(biz):
    imgs = "".join(f'<div class="ph ph-{biz["theme"]} ph-square" role="img" aria-label="{esc(alt)}"><span class="ph-icon">{icon(biz["icon"])}</span></div>' for alt in biz["gallery_alts"])
    return f'<div class="gallery-grid">{imgs}</div>'


def stat_tile(icon_name, num, label, trend=None):
    trend_html = f'<span class="trend up">{esc(trend)}</span>' if trend else ""
    return f"""<div class="stat-tile"><div class="top"><div class="icon">{icon(icon_name)}</div>{trend_html}</div>
  <div class="num">{num}</div><div class="label">{label}</div></div>"""


def pill_links(items):
    return '<div class="pill-links">' + "".join(f'<a href="{href}">{esc(label)}</a>' for label, href in items) + '</div>'


def related_list(items):
    rows = "".join(f'<a href="{href}"><span>{esc(label)}</span>{icon("arrow-right")}</a>' for label, href in items)
    return f'<div class="related-list">{rows}</div>'


def spotlight_block(biz_list, root):
    slides, dots = [], []
    for i, b in enumerate(biz_list):
        area = AREAS[b["city"]]
        active = " is-active" if i == 0 else ""
        slides.append(f"""<div class="spotlight-slide{active}">
      <div class="spotlight-info">
        <span class="kicker">Business Spotlight</span>
        <h3>{esc(b['name'])}</h3>
        <p>{esc(b['description'])}</p>
        <div class="flex gap-8 flex-wrap" style="margin-bottom:18px;">
          <span class="meta-pill">{icon('map-pin')} {area['name']}</span>
          <span class="meta-pill">{icon('layers')} {CATEGORIES[b['categories'][0]]['name']}</span>
        </div>
        <a href="{root}{b['slug']}/" class="btn btn-gold btn-sm">View Mini-Site {icon('arrow-right')}</a>
      </div>
      <div class="spotlight-media ph ph-{b['theme']}"><span class="ph-icon">{icon(b['icon'])}</span></div>
    </div>""")
        dots.append(f'<button class="{"is-active" if i == 0 else ""}" aria-label="Slide {i+1}"></button>')
    return f"""<div class="spotlight" data-spotlight>
  {''.join(slides)}
  <button class="spotlight-nav prev" aria-label="Previous">{icon('arrow-right', 'flip')}</button>
  <button class="spotlight-nav next" aria-label="Next">{icon('arrow-right')}</button>
  <div class="spotlight-dots">{''.join(dots)}</div>
</div>"""


def hours_table_html(biz):
    rows = "".join(f"<tr><td>{esc(d)}</td><td>{esc(t)}</td></tr>" for d, t in biz["hours_display"])
    return f'<table class="hours-table">{rows}</table>'


def local_kw_block(keywords):
    return '<div class="local-kw">' + "".join(f"<span>{esc(k)}</span>" for k in keywords) + "</div>"


def menu_section_html(biz, root):
    nav = "".join(f'<a href="#{re.sub(r"[^a-z0-9]+","-",sec.lower())}">{esc(sec)}</a>' for sec, _ in biz["menu"])
    blocks = []
    for sec, items in biz["menu"]:
        anchor = re.sub(r"[^a-z0-9]+", "-", sec.lower())
        rows = []
        for it in items:
            tag_html = "".join(f'<span class="tag tag--gold">{TAG_LABEL.get(t, t.title())}</span>' for t in it.get("tags", []) if t in TAG_LABEL) or \
                       "".join(f'<span class="tag tag--gold">Halal</span>' for t in it.get("tags", []) if t == "halal")
            rows.append(f"""<div class="menu-item">
        <div><div class="name">{esc(it['name'])}</div><div class="desc">{esc(it['desc'])}</div>
        <div class="menu-item-tags">{tag_html}</div></div>
        <div class="price">{esc(it['price'])}</div>
      </div>""")
        blocks.append(f'<h3 id="{anchor}" style="margin-top:36px;">{esc(sec)}</h3>' + "".join(rows))
    return f'<div class="menu-cat-nav">{nav}</div>' + "".join(blocks)

# ------------------------------------------------------------------
# Business pages: main profile / offers / menu (3 SEO-built pages each)
# ------------------------------------------------------------------
def h2_slots(h2s):
    if len(h2s) == 7:
        return {"intro": h2s[0], "why": h2s[1], "featured": h2s[2], "extra": h2s[3], "offers": h2s[4], "visit": h2s[5], "faq": h2s[6]}
    return {"intro": h2s[0], "why": h2s[1], "featured": h2s[2], "extra": None, "offers": h2s[3], "visit": h2s[4], "faq": h2s[5]}


TIER_LABEL = {1: "Directory Mini-Site", 2: "Subdomain Mini-Site", 3: "Custom Domain Website"}


def maps_url(biz):
    area = AREAS[biz["city"]]
    return f"https://www.google.com/maps/search/?api=1&query={urlquote(biz['name'] + ' ' + biz['address'] + ' ' + area['name'] + ' UT')}"


def biz_hero(biz, root, active_tab, seo_main):
    is_food = biz["menu_kind"] == "menu"
    tabs = [("Profile", ""), ("Offers", "offers/"), (("Menu" if is_food else "Services"), "menu/")]
    tabs_html = "".join(
        f'<a href="{root}{biz["slug"]}/{href}" class="{"is-active" if label == active_tab else ""}">{label}</a>'
        for label, href in tabs
    )
    cat_pills = "".join(f'<span class="meta-pill">{icon("layers")} {CATEGORIES[c]["name"]}</span>' for c in biz["categories"])
    return f"""<section class="msite-hero">
  <div class="msite-hero-media" style="{theme_style(biz['theme'])}">
    <div class="wrap msite-hero-content">
      <span class="msite-managed">{icon('shield')} Managed by Utah Gold Card &middot; {TIER_LABEL[biz['tier']]}</span>
      <h1>{esc(seo_main['h1'])}</h1>
      <div class="hero-simple-meta">
        {cat_pills}
        <span class="meta-pill">{icon('map-pin')} {AREAS[biz['city']]['name']}, UT</span>
        <span class="meta-pill">{icon('star')} {biz['rating']} ({biz['review_count']}) demo rating</span>
      </div>
    </div>
  </div>
  <div class="msite-actionbar">
    <div class="wrap msite-actions" style="justify-content:space-between;">
      <div class="flex gap-8 flex-wrap">
        <a href="tel:{biz['phone_tel']}" class="btn btn-gold btn-sm">{icon('phone')} Call {biz['phone_display']}</a>
        <a href="{maps_url(biz)}" class="btn btn-ghost btn-sm" target="_blank" rel="noopener">{icon('map-pin')} Directions</a>
      </div>
      <div class="msite-tabs">{tabs_html}</div>
    </div>
  </div>
</section>"""


def biz_internal_links(biz, root, exclude=""):
    primary_cat = biz["categories"][0]
    seo = get_seo(biz)
    items = [
        (f"{AREAS[biz['city']]['name']} — City Page", f"{root}areas/{biz['city']}/"),
        (f"{CATEGORIES[primary_cat]['name']} — Category Page", f"{root}categories/{primary_cat}/"),
    ]
    for c in biz["categories"][1:]:
        items.append((f"{CATEGORIES[c]['name']} in Utah", f"{root}categories/{c}/"))
    for a in seo["nearby_areas"]:
        items.append((f"Explore {AREAS[a]['name']}", f"{root}areas/{a}/"))
    items.append(("Local Deals Across Utah", f"{root}deals/"))
    items.append(("List Your Business", f"{root}join/"))
    return items


def biz_related_section(biz, root):
    rel = related_businesses(biz, 3)
    cards = "".join(business_card(b, root) for b in rel)
    return f"""<section class="section section--cream section--border-top">
  <div class="wrap">
    <div class="section-head"><span class="kicker">Similar Businesses</span><h2>More Businesses Near {esc(AREAS[biz['city']]['name'])}</h2></div>
    <div class="grid grid-3">{cards}</div>
  </div>
</section>"""


def biz_faq_and_links(biz, root, h2_faq):
    seo = get_seo(biz)
    links = biz_internal_links(biz, root)
    return f"""<section class="section section--paper">
  <div class="wrap two-col">
    <div>
      <span class="kicker">Local Search &amp; FAQ</span>
      <h2>{esc(h2_faq)}</h2>
      {faq_block(seo["faqs"])}
    </div>
    <div class="card" style="padding:26px;">
      <h4>Explore More on Utah Gold Card</h4>
      <p style="font-size:.88rem;">Every {esc(biz['name'])} page links to its city, its category, and nearby Utah Gold Card businesses.</p>
      {related_list(links)}
      <div class="divider"></div>
      <span class="kicker" style="margin-bottom:10px;">Also Searched As</span>
      {local_kw_block(seo["local_keywords"])}
    </div>
  </div>
</section>"""


def generate_business_main(biz):
    root = "../"
    seo_all = get_seo(biz)
    seo = seo_all["main"]
    h2 = h2_slots(seo_all["h2s"])
    crumbs = business_breadcrumbs(biz)
    tags_html = "".join(f'<span class="tag">{esc(TAG_LABEL.get(t, t))}</span>' for t in biz["tags"])
    featured_items = [it for _, items in biz["menu"] for it in items][:4]
    is_food = biz["menu_kind"] == "menu"
    menu_word = "Menu" if is_food else "Services"

    highlight_rows = "".join(
        f'<div class="flex gap-12" style="align-items:flex-start;margin-bottom:16px;"><div class="check-dot done" style="flex-shrink:0;">{icon("check")}</div><p style="margin-bottom:0;">{esc(h)}</p></div>'
        for h in biz["highlights"]
    )
    featured_cards = "".join(
        f"""<div class="card" style="padding:18px;"><h4 style="margin-bottom:4px;">{esc(it['name'])}</h4>
        <p style="font-size:.86rem;margin-bottom:8px;">{esc(it['desc'])}</p><span class="tag tag--gold">{esc(it['price'])}</span></div>"""
        for it in featured_items
    )
    extra_html = ""
    if h2["extra"]:
        extra_sections = biz["menu"][1:3] if len(biz["menu"]) > 1 else biz["menu"]
        extra_body = "".join(
            f'<h4 style="margin-top:18px;">{esc(sec)}</h4><ul style="padding-left:0;list-style:none;">' +
            "".join(f'<li style="padding:6px 0;border-bottom:1px dashed rgba(0,0,0,.08);">{esc(it["name"])} <span style="color:var(--gold-dark);font-weight:700;">{esc(it["price"])}</span></li>' for it in items) +
            "</ul>"
            for sec, items in extra_sections
        )
        extra_html = f"""<section class="section section--cream">
      <div class="wrap">
        <span class="kicker">{esc(biz['name'])}</span>
        <h2>{esc(h2['extra'])}</h2>
        {extra_body}
      </div>
    </section>"""

    review_quotes = f"""<div class="grid grid-2">
      <div class="review-quote"><div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>&ldquo;{esc(biz['highlights'][0])} — exactly why we keep coming back.&rdquo;</p>
        <div class="who">Local Guest <span class="demo-note">&middot; Demo review data</span></div></div>
      <div class="review-quote"><div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>&ldquo;{esc(biz['description'].split('.')[0])}.&rdquo;</p>
        <div class="who">Local Guest <span class="demo-note">&middot; Demo review data</span></div></div>
    </div>"""

    body = biz_hero(biz, root, "Profile", seo)
    body += f"""
<section class="section section--paper">
  <div class="wrap">
    <div class="two-col">
      <div>
        <span class="kicker">{cat_join([CATEGORIES[c]['name'] for c in biz['categories']])}</span>
        <h2>{esc(h2['intro'])}</h2>
        <p class="lede">{esc(seo_all['city_seo_intro'])}</p>
        <p>{esc(seo_all['category_seo_intro'])}</p>
        <div class="tag-row">{tags_html}</div>
      </div>
      <div class="ph ph-{biz['theme']} ph-wide"><span class="ph-icon">{icon(biz['icon'])}</span><span class="ph-tag">{esc(biz['name'])} &middot; {esc(AREAS[biz['city']]['name'])}</span></div>
    </div>
  </div>
</section>
<section class="section section--charcoal">
  <div class="wrap">
    <span class="kicker">The Experience</span>
    <h2>{esc(h2['why'])}</h2>
    <div class="two-col" style="align-items:flex-start;">
      <div>{highlight_rows}</div>
      <div>{review_quotes}</div>
    </div>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div><span class="kicker">{menu_word}</span><h2>{esc(h2['featured'])}</h2></div>
      <a href="{root}{biz['slug']}/menu/" class="link-arrow">See Full {menu_word} {icon('arrow-right')}</a>
    </div>
    <div class="grid grid-4">{featured_cards}</div>
  </div>
</section>
{extra_html}
<section class="section section--dark">
  <div class="wrap">
    <div class="two-col">
      <div>
        <span class="kicker">Offers</span>
        <h2>{esc(h2['offers'])}</h2>
        <p>{esc(biz['offer']) if biz['offer'] else 'Check back for new local offers from ' + biz['name'] + '.'}</p>
        <a href="{root}{biz['slug']}/offers/" class="btn btn-gold">{icon('gift')} View All Offers</a>
      </div>
      <div class="deal-card">
        <span class="deal-tag">{icon('badge-percent')} Featured Offer</span>
        <span class="biz">{esc(biz['name'])}</span>
        <h4>{esc(biz['offer']) if biz['offer'] else 'New offers coming soon'}</h4>
        <p>Sign up for email updates to hear about future Utah Gold Card offers from {esc(biz['name'])}.</p>
      </div>
    </div>
  </div>
</section>
<section class="section section--cream">
  <div class="wrap">
    <span class="kicker">Visit</span>
    <h2>{esc(h2['visit'])}</h2>
    <div class="grid grid-3">
      <div class="card" style="padding:22px;"><h4>Hours</h4>{hours_table_html(biz)}</div>
      <div class="card" style="padding:22px;"><h4>Address &amp; Contact</h4>
        <p style="margin-bottom:6px;">{icon('map-pin', 'link-arrow')} {esc(biz['address'])}<br>{esc(AREAS[biz['city']]['name'])}, UT {esc(biz['zip'])}</p>
        <p style="margin-bottom:14px;">{icon('phone', 'link-arrow')} <a href="tel:{biz['phone_tel']}">{esc(biz['phone_display'])}</a></p>
        <a href="{maps_url(biz)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm btn-block">Get Directions</a>
      </div>
      <div class="map-placeholder"><span>{icon('map-pin')} Map preview &middot; {esc(AREAS[biz['city']]['name'])}, UT</span></div>
    </div>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap">
    <div class="section-head"><span class="kicker">Gallery</span><h2>Photos from {esc(biz['name'])}</h2></div>
    {gallery_block(biz)}
  </div>
</section>
<section class="section section--dark">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">Stay In Touch</span><h2>Get Email Updates from {esc(biz['name'])}</h2>
    <p class="lede" style="margin:0 auto;">Join the email list for offers, birthday club perks, and new menu or service updates.</p></div>
    <form class="inline-signup" style="max-width:520px;margin:0 auto;" data-demo-form data-success="You're on the list for {esc(biz['name'])} updates.">
      <input type="email" placeholder="you@email.com" required aria-label="Email address">
      <button class="btn btn-gold" type="submit">Sign Up</button>
      <div class="form-success"><span></span></div>
    </form>
  </div>
</section>"""
    body += biz_faq_and_links(biz, root, h2["faq"])
    body += biz_related_section(biz, root)

    meta = {"title": seo["title"], "description": seo["description"], "canonical": canonical_url(biz, "main"),
            "og_title": seo["og_title"], "og_description": seo["og_description"]}
    jsonld_list = [jsonld_main(biz), jsonld_breadcrumbs_from_crumbs(crumbs, root)]
    write_page(biz["slug"], meta, root, body, breadcrumbs=crumbs, active_nav=None, jsonld_list=jsonld_list)


def jsonld_breadcrumbs_from_crumbs(crumbs, root):
    items = []
    pos = 1
    path_acc = ""
    for label, href in crumbs:
        if href == "":
            url = SITE_URL + "/"
        elif href is None:
            url = None
        else:
            url = f"{SITE_URL}/{href}"
        if url:
            items.append({"@type": "ListItem", "position": pos, "name": label, "item": url})
            pos += 1
        else:
            items.append({"@type": "ListItem", "position": pos, "name": label})
            pos += 1
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}

def inquiry_form_meta(biz):
    if "catering" in biz["categories"] or "catering" in biz["tags"]:
        return "Catering Inquiry", "Tell us about your event and we'll follow up with a custom catering quote."
    if biz["schema_type"] == "HealthAndBeautyBusiness":
        return "Booking Request", "Request an appointment time and the team will confirm availability."
    if biz["schema_type"] == "HomeAndConstructionBusiness":
        return "Request a Free Estimate", "Tell us about the project and the team will follow up with a free estimate."
    if "events-attractions" in biz["categories"] or "family-fun" in biz["categories"]:
        return "Group &amp; Party Booking", "Tell us your group size and preferred dates and the team will follow up."
    return "Send an Inquiry", "Send a quick message and the team will follow up shortly."


def generate_business_offers(biz):
    root = "../../"
    seo_all = get_seo(biz)
    seo = seo_all["offers"]
    crumbs = business_breadcrumbs(biz, current_label="Offers")
    inquiry_label, inquiry_note = inquiry_form_meta(biz)
    has_loyalty = "loyalty-offer" in biz["tags"] or "birthday-club" in biz["tags"]

    body = biz_hero(biz, root, "Offers", seo)
    body += f"""
<section class="section section--paper">
  <div class="wrap">
    <div class="two-col">
      <div>
        <span class="kicker">Current Offer</span>
        <h2>{esc(seo['h1'])}</h2>
        <p class="lede">{esc(biz['offer']) if biz['offer'] else 'New local offers from ' + biz['name'] + ' are added regularly through Utah Gold Card.'}</p>
        <p>Utah Gold Card collects local deals from dozens of Utah businesses into one place. Signing up below adds you to {esc(biz['name'])}&rsquo;s list and to select Utah Gold Card local-deal emails for {esc(AREAS[biz['city']]['name'])}.</p>
        <div class="pill-note">{icon('badge-percent')} Offers refresh monthly as part of the Utah Gold Card email program</div>
      </div>
      <div class="deal-card">
        <span class="deal-tag">{icon('gift')} Featured Offer</span>
        <span class="biz">{esc(biz['name'])} &middot; {esc(AREAS[biz['city']]['name'])}</span>
        <h4>{esc(biz['offer']) if biz['offer'] else 'Offer coming soon'}</h4>
        <p>{esc(biz['description'][:100])}...</p>
      </div>
    </div>
  </div>
</section>
<section class="section section--dark">
  <div class="wrap">
    <div class="grid grid-3">
      <div class="form-card">
        <h4>{icon('mail','link-arrow')} Email Signup</h4>
        <p style="font-size:.86rem;">Get {esc(biz['name'])} offers and Utah Gold Card local deals by email.</p>
        <form data-demo-form data-success="You're subscribed to {esc(biz['name'])} email offers.">
          <div class="form-field"><input type="email" placeholder="you@email.com" required aria-label="Email"></div>
          <button class="btn btn-gold btn-block" type="submit">Sign Up for Offers</button>
          <div class="form-success"><span></span></div>
        </form>
      </div>
      <div class="form-card">
        <h4>{icon('phone','link-arrow')} SMS Alerts</h4>
        <p style="font-size:.86rem;">Opt in for text alerts on flash offers (placeholder — coming soon to Utah Gold Card).</p>
        <form data-demo-form data-success="You're on the list for SMS alerts (demo).">
          <div class="form-field"><input type="tel" placeholder="(801) 555-0100" aria-label="Mobile number"></div>
          <button class="btn btn-dark btn-block" type="submit">Sign Up for Texts</button>
          <div class="form-success"><span></span></div>
        </form>
      </div>
      <div class="form-card">
        <h4>{icon('gift','link-arrow')} Birthday Club</h4>
        <p style="font-size:.86rem;">Get a birthday perk from {esc(biz['name'])} every year.</p>
        <form data-demo-form data-success="Happy early birthday! You're in the {esc(biz['name'])} birthday club.">
          <div class="form-field"><input type="text" placeholder="Full name" required aria-label="Full name"></div>
          <div class="form-field"><input type="date" aria-label="Birthday" placeholder="Birthday"></div>
          <button class="btn btn-gold btn-block" type="submit">Join Birthday Club</button>
          <div class="form-success"><span></span></div>
        </form>
      </div>
    </div>
  </div>
</section>
<section class="section section--cream">
  <div class="wrap">
    <div class="two-col">
      <div>
        <span class="kicker">{inquiry_label}</span>
        <h2>Get in Touch with {esc(biz['name'])}</h2>
        <p>{inquiry_note}</p>
        <ul style="padding-left:0;list-style:none;">
          <li class="flex gap-8" style="margin-bottom:10px;">{icon('phone','link-arrow')} <a href="tel:{biz['phone_tel']}">{esc(biz['phone_display'])}</a></li>
          <li class="flex gap-8">{icon('map-pin','link-arrow')} {esc(biz['address'])}, {esc(AREAS[biz['city']]['name'])}, UT {esc(biz['zip'])}</li>
        </ul>
      </div>
      <form class="form-card" data-demo-form data-success="Thanks! {esc(biz['name'])} will follow up shortly.">
        <div class="form-grid">
          <div class="form-field"><label>Full Name</label><input type="text" required></div>
          <div class="form-field"><label>Email</label><input type="email" required></div>
          <div class="form-field"><label>Phone</label><input type="tel"></div>
          <div class="form-field"><label>Preferred Date</label><input type="date"></div>
          <div class="form-field full"><label>Details</label><textarea rows="3" placeholder="Group size, event type, or what you need"></textarea></div>
        </div>
        <button class="btn btn-gold btn-block" type="submit">Send Inquiry</button>
        <div class="form-success"><span></span></div>
      </form>
    </div>
  </div>
</section>
{"" if not has_loyalty else f'''<section class="section section--paper">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">Loyalty</span><h2>Loyalty &amp; Repeat Guest Perks</h2>
    <p class="lede" style="margin:0 auto;">{esc(biz["name"])} rewards repeat guests through the Utah Gold Card loyalty program.</p></div>
    <div class="grid grid-2">
      <div class="loy-card"><div class="icon-badge">{icon("award")}</div><h4>Loyalty Signup</h4><p style="font-size:.88rem;">Sign up above by email to start earning repeat-guest perks at {esc(biz["name"])}.</p></div>
      <div class="loy-card"><div class="icon-badge">{icon("gift")}</div><h4>Birthday Club</h4><p style="font-size:.88rem;">Birthday club members get a special perk from {esc(biz["name"])} every year.</p></div>
    </div>
  </div>
</section>'''}"""
    body += biz_faq_and_links(biz, root, "Frequently Asked Questions")
    body += biz_related_section(biz, root)

    meta = {"title": seo["title"], "description": seo["description"], "canonical": canonical_url(biz, "offers"),
            "og_title": seo["og_title"], "og_description": seo["og_description"]}
    jsonld_list = [jsonld_offers(biz), jsonld_breadcrumbs_from_crumbs(crumbs, root)]
    write_page(f"{biz['slug']}/offers", meta, root, body, breadcrumbs=crumbs, jsonld_list=jsonld_list)


def generate_business_menu(biz):
    root = "../../"
    seo_all = get_seo(biz)
    seo = seo_all["menu"]
    crumbs = business_breadcrumbs(biz, current_label=("Menu" if biz["menu_kind"] == "menu" else "Services"))
    is_food = biz["menu_kind"] == "menu"
    inquiry_label, inquiry_note = inquiry_form_meta(biz)

    body = biz_hero(biz, root, "Menu" if is_food else "Services", seo)
    body += f"""
<section class="section section--paper">
  <div class="wrap">
    <div class="section-head"><span class="kicker">{'Menu' if is_food else 'Services & Pricing'}</span><h2>{esc(seo['h1'])}</h2>
    <p class="lede">{esc(seo_all['category_seo_intro'])}</p></div>
    {menu_section_html(biz, root)}
  </div>
</section>
<section class="section section--dark">
  <div class="wrap">
    <div class="two-col">
      <div>
        <span class="kicker">{inquiry_label}</span>
        <h2>{'Catering, Group Orders &amp; Custom Requests' if is_food else 'Book ' + biz['name']}</h2>
        <p>{inquiry_note}</p>
        <a href="{root}{biz['slug']}/offers/" class="btn btn-gold">{icon('gift')} View Current Offers</a>
      </div>
      <form class="form-card" data-demo-form data-success="Thanks! {esc(biz['name'])} will follow up about your request.">
        <div class="form-field"><label>Name</label><input type="text" required></div>
        <div class="form-field"><label>Email</label><input type="email" required></div>
        <div class="form-field"><label>What do you need?</label><textarea rows="3"></textarea></div>
        <button class="btn btn-gold btn-block" type="submit">Send Request</button>
        <div class="form-success"><span></span></div>
      </form>
    </div>
  </div>
</section>"""
    body += biz_faq_and_links(biz, root, "Frequently Asked Questions")
    body += biz_related_section(biz, root)

    meta = {"title": seo["title"], "description": seo["description"], "canonical": canonical_url(biz, "menu"),
            "og_title": seo["og_title"], "og_description": seo["og_description"]}
    jsonld_list = [jsonld_menu(biz), jsonld_breadcrumbs_from_crumbs(crumbs, root)]
    write_page(f"{biz['slug']}/menu", meta, root, body, breadcrumbs=crumbs, jsonld_list=jsonld_list)

# ------------------------------------------------------------------
# Root utility pages
# ------------------------------------------------------------------
COPY_SIMPLE_SYSTEM = ("Most local businesses do not need another complicated marketing platform. They need a simple "
                      "system that gets them found, captures interested customers, and keeps their business in front "
                      "of local buyers. Utah Gold Card does the setup, the pages, the directory placement, and the "
                      "group campaigns for you.")
COPY_STRONGER_TOGETHER = ("When one Utah Gold Card business gets discovered, the whole directory gets stronger. Every "
                          "new restaurant, shop, service provider, offer, and email signup adds more local search "
                          "value and more reasons for customers to come back.")
COPY_THREE_PAGES = ("Every participating business starts with three semi-premium pages: a profile page, an "
                    "offer/lead-capture page, and a menu/services page.")
COPY_SEO_STRATEGY = ("Each Utah Gold Card listing is built as its own search-friendly local business page. That means "
                     "your page is not just buried in a directory. It receives its own title, description, URL, "
                     "city/category structure, offer page, service or menu page, local content, and structured data "
                     "so search engines can understand your business separately.")
COPY_CUSTOMER_SEO = ("Your Utah Gold Card page is built to help customers find your business by name, city, category, "
                     "services, menu items, offers, and local search terms.")
COPY_GROWTH_SEO = ("At the beginning, the directory may only have a small number of businesses. That is why we build "
                   "every listing to stand on its own. As the directory grows, each business benefits from both its "
                   "own page-level SEO and the increasing authority of the Utah Gold Card network.")


def generate_homepage():
    root = ""
    featured = [b for b in BUSINESSES if b["featured"]]
    deal_biz = [b for b in BUSINESSES if b["offer"]][:6]
    area_cards = "".join(area_card(a, root) for a in AREA_ORDER)
    cat_cards = "".join(category_card(c, root) for c in CATEGORY_ORDER)
    biz_cards = "".join(business_card(b, root) for b in BUSINESSES[:8])
    deal_cards = "".join(deal_card(b, root) for b in deal_biz)
    avatars = "".join(f'<span class="mini-avatar" style="background:{c}">{l}</span>' for c, l in
                       [("#e3bf6c", "OC"), ("#c9a24b", "FG"), ("#9c7a2e", "GH"), ("#e8cf8a", "PC")])

    body = f"""
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <span class="hero-badge">{icon('star')} Utah's Local Business Directory</span>
      <h1>Discover Utah's Best Local Restaurants, Shops, Deals &amp; Hidden Gems</h1>
      <p class="lede">Utah Gold Card helps local businesses get discovered while giving Utah residents one beautiful place to find places to eat, shop, visit, and support.</p>
      <div class="hero-ctas">
        <a href="{root}join/" class="btn btn-gold">{icon('spark')} Get Listed</a>
        <a href="{root}deals/" class="btn btn-outline">{icon('gift')} Explore Deals</a>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><b>{len(BUSINESSES)}+</b><span>Utah Businesses</span></div>
        <div class="hero-stat"><b>{len(AREA_ORDER)}</b><span>Utah Cities</span></div>
        <div class="hero-stat"><b>{len(CATEGORY_ORDER)}</b><span>Categories</span></div>
        <div class="hero-stat"><b>10</b><span>Monthly Group Emails</span></div>
      </div>
    </div>
    <div class="search-panel">
      <h3>Find a Utah Local Favorite</h3>
      <p>Search the directory by name, city, or category.</p>
      <div class="search-row">
        <input class="search-input" type="text" placeholder="Search restaurants, shops, services...">
        <a href="{root}directory/" class="btn btn-gold">{icon('search')}</a>
      </div>
      <div class="chip-row" style="margin-bottom:14px;">
        {"".join(f'<a href="{root}areas/{c}/" class="chip">{AREAS[c]["name"]}</a>' for c in AREA_ORDER)}
      </div>
      <div class="chip-row">
        <a href="{root}categories/restaurants/" class="chip">Restaurants</a>
        <a href="{root}categories/mexican-food/" class="chip">Mexican Food</a>
        <a href="{root}categories/halal-friendly/" class="chip">Halal-Friendly</a>
        <a href="{root}categories/catering/" class="chip">Catering</a>
        <a href="{root}categories/salons/" class="chip">Salons</a>
        <a href="{root}categories/local-shops/" class="chip">Retail</a>
        <a href="{root}categories/family-fun/" class="chip">Family Fun</a>
      </div>
      <div class="hero-mini-graphic">{avatars}<span style="margin-left:14px;font-size:.78rem;color:#b6ae9c;align-self:center;">Joined this month across Utah</span></div>
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap">
    <div class="section-head section-head--center">
      <span class="kicker">Business Spotlight</span>
      <h2>Featured Utah Gold Card Businesses</h2>
    </div>
    {spotlight_block(featured, root)}
  </div>
</section>

<section class="section section--cream">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div><span class="kicker">Directory</span><h2>Featured Businesses Across Utah</h2></div>
      <a href="{root}directory/" class="link-arrow">View Full Directory {icon('arrow-right')}</a>
    </div>
    <div class="grid grid-4">{biz_cards}</div>
  </div>
</section>

<section class="section section--dark">
  <div class="wrap">
    <div class="section-head section-head--center">
      <span class="kicker">How It Works</span>
      <h2>How Utah Gold Card Works</h2>
      <p class="lede" style="margin:0 auto;">One shared directory. One traffic engine. Every business gets its own mini-site inside it.</p>
    </div>
    <div class="steps">
      <div class="step"><div class="num">1</div><h3>Get Listed</h3><p>We add your business to the Utah Gold Card directory with city and category placement from day one.</p></div>
      <div class="step"><div class="num">2</div><h3>Get a 3-Page Mini-Site</h3><p>Every business starts with a profile page, an offer/lead-capture page, and a menu or services page.</p></div>
      <div class="step"><div class="num">3</div><h3>Get Promoted</h3><p>Homepage rotation, category and city placement, and group email campaigns keep bringing customers back.</p></div>
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap two-col">
    <div>
      <span class="kicker">For Local Customers</span>
      <h2>One Beautiful Place to Discover Utah</h2>
      <p>Browse restaurants, shops, services, and hidden gems by city or category, save local deals, and hear about new openings before anyone else.</p>
      <ul style="list-style:none;padding-left:0;">
        <li class="flex gap-8" style="margin-bottom:10px;">{icon('check-circle','link-arrow')} Search by city, category, or tag</li>
        <li class="flex gap-8" style="margin-bottom:10px;">{icon('check-circle','link-arrow')} Local deals, loyalty offers &amp; birthday clubs</li>
        <li class="flex gap-8">{icon('check-circle','link-arrow')} New Utah businesses, every month</li>
      </ul>
      <a href="{root}deals/" class="btn btn-dark" style="margin-top:8px;">Explore Deals</a>
    </div>
    <div>
      <span class="kicker">For Business Owners</span>
      <h2>Get Found Without Managing the Tech</h2>
      <p>{COPY_SIMPLE_SYSTEM}</p>
      <a href="{root}business-owners/" class="btn btn-gold" style="margin-top:8px;">Get Your 3-Page Mini-Site</a>
    </div>
  </div>
</section>

<section class="callout" style="margin:0 28px;border-radius:28px;">
  <div class="wrap" style="max-width:900px;text-align:center;">
    <span class="kicker" style="justify-content:center;">Why the Directory Works</span>
    <h2>{COPY_STRONGER_TOGETHER}</h2>
    <p class="pill-note" style="margin-top:12px;">{COPY_THREE_PAGES}</p>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">Areas</span><h2>Featured Utah Areas</h2></div>
    <div class="grid grid-4">{area_cards}</div>
  </div>
</section>

<section class="section section--cream">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">Categories</span><h2>Featured Categories</h2></div>
    <div class="grid grid-5">{cat_cards}</div>
  </div>
</section>

<section class="section section--dark">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div><span class="kicker">Deals</span><h2>Local Deals This Month</h2></div>
      <a href="{root}deals/" class="link-arrow">See All Deals {icon('arrow-right')}</a>
    </div>
    <div class="grid grid-3">{deal_cards}</div>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div><span class="kicker">Pricing</span><h2>Simple Pricing for Every Utah Business</h2></div>
      <a href="{root}pricing/" class="link-arrow">Full Pricing &amp; Comparison {icon('arrow-right')}</a>
    </div>
    <div class="grid grid-3">
      {pricing_card_mini("Directory Mini-Site", "$175", "$95", ["Directory listing + 3-page mini-site", "Lead capture &amp; email signup", "Homepage rotation"], root, "join/")}
      {pricing_card_mini("Subdomain Mini-Site", "$275", "$195", ["Everything in Tier 1", "Dedicated subdomain &amp; featured badge", "Priority placement"], root, "join/", featured=True)}
      {pricing_card_mini("Custom Domain Website", "Custom", "Pricing", ["Full standalone website", "Advanced SEO &amp; automations", "Optional ordering / booking forms"], root, "join/")}
    </div>
  </div>
</section>

<section class="section section--dark">
  <div class="wrap">
    <div class="section-head section-head--center">
      <span class="kicker">Stay In The Know</span>
      <h2>Get Utah's Best Local Deals by Email</h2>
      <p class="lede" style="margin:0 auto;">Join thousands of Utah locals getting weekly restaurant, shop, and service deals.</p>
    </div>
    <form class="inline-signup" style="max-width:520px;margin:0 auto;" data-demo-form data-success="You're on the Utah Gold Card list!">
      <input type="email" placeholder="you@email.com" required aria-label="Email address">
      <button class="btn btn-gold" type="submit">Get Local Deals</button>
      <div class="form-success"><span></span></div>
    </form>
  </div>
</section>"""
    meta = {"title": "Utah Gold Card | Discover Utah Restaurants, Shops, Deals & Local Favorites",
            "description": "Find Utah restaurants, shops, offers, events, local services, and hidden gems. Utah Gold Card helps local businesses get discovered with directory listings, mini-sites, email campaigns, and loyalty offers.",
            "canonical": f"{SITE_URL}/", "og_title": "Utah Gold Card | Utah's Local Business Directory",
            "og_description": "Discover Utah restaurants, shops, deals, and hidden gems — and get your business a 3-page mini-site."}
    jsonld_list = [{
        "@context": "https://schema.org", "@type": "WebSite", "name": "Utah Gold Card", "url": SITE_URL + "/",
        "description": meta["description"],
    }]
    write_page("", meta, root, body, active_nav=None, jsonld_list=jsonld_list)


def pricing_card_mini(name, setup, monthly, features, root, href, featured=False):
    cls = "pricing-card is-featured" if featured else "pricing-card"
    ribbon = '<span class="pricing-ribbon">Most Popular</span>' if featured else ""
    feat_html = "".join(f'<li>{icon("check")} {f}</li>' for f in features)
    return f"""<div class="{cls}">{ribbon}
  <h3>{esc(name)}</h3>
  <div class="price">{esc(setup)} <span>setup</span></div>
  <div class="price-setup">+ {esc(monthly)}/month</div>
  <ul class="feature-list">{feat_html}</ul>
  <a href="{root}{href}" class="btn {'btn-gold' if featured else 'btn-dark'} btn-block">Get Started</a>
</div>"""

def filter_bar_html(extra_sort=True, tag_filter=True):
    area_btns = "".join(f'<button class="filter-btn" data-filter-area="{c}">{AREAS[c]["name"]}</button>' for c in AREA_ORDER)
    cat_btns = "".join(f'<button class="filter-btn" data-filter-category="{c}">{CATEGORIES[c]["name"]}</button>' for c in CATEGORY_ORDER)
    tag_btns = "".join(f'<button class="filter-btn" data-filter-tag="{t}">{TAG_LABEL[t]}</button>' for t in ALL_TAGS)
    sort_html = ("""<div class="filter-sort"><span class="filter-label">Sort</span>
      <select data-filter-sort><option value="featured">Featured</option><option value="newest">Newest</option>
      <option value="deals">Deals</option><option value="popular">Most Popular</option></select></div>""") if extra_sort else ""
    tag_row = f"""<div class="filter-row"><div class="filter-group"><span class="filter-label">Tags</span>
      <button class="filter-btn is-active" data-filter-tag="all">All Tags</button>{tag_btns}</div></div>""" if tag_filter else ""
    return f"""<div class="filter-bar">
      <div class="filter-row">
        <input class="search-input search-input--light" style="flex:1;min-width:220px;" data-filter-search type="text" placeholder="Search businesses by name...">
        {sort_html}
      </div>
      <div class="filter-row"><div class="filter-group"><span class="filter-label">Area</span>
        <button class="filter-btn is-active" data-filter-area="all">All Areas</button>{area_btns}</div></div>
      <div class="filter-row"><div class="filter-group"><span class="filter-label">Category</span>
        <button class="filter-btn is-active" data-filter-category="all">All Categories</button>{cat_btns}</div></div>
      {tag_row}
      <div class="results-count" data-results-count>{len(BUSINESSES)} businesses found</div>
    </div>"""


def generate_directory_page():
    root = "../"
    cards = "".join(business_card(b, root) for b in BUSINESSES)
    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap">
    <span class="kicker">Explore</span>
    <h1>The Utah Gold Card Directory</h1>
    <p class="lede">Search {len(BUSINESSES)} Utah restaurants, shops, services, and hidden gems by city, category, or tag.</p>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap directory-layout" data-filter-scope>
    <div>
      {filter_bar_html()}
      <div class="grid grid-3">{cards}</div>
      <div class="empty-state" data-empty-state><h3>No businesses match those filters yet</h3><p>Try clearing a filter — new Utah businesses join the directory every month.</p></div>
    </div>
    <aside class="sidebar-sticky">
      <div class="map-placeholder"><span>{icon('map-pin')} Map preview of Utah Gold Card businesses</span></div>
      <div class="form-card">
        <h4>Own a Utah Business?</h4>
        <p style="font-size:.86rem;">Get listed with your own 3-page mini-site, lead capture, and email exposure.</p>
        <form data-demo-form data-success="Thanks! Our team will follow up about getting you listed.">
          <div class="form-field"><input type="text" placeholder="Business name" required></div>
          <div class="form-field"><input type="email" placeholder="Email" required></div>
          <button class="btn btn-gold btn-block" type="submit">Get Listed</button>
          <div class="form-success"><span></span></div>
        </form>
      </div>
    </aside>
  </div>
</section>"""
    meta = {"title": "Utah Business Directory | Restaurants, Shops & Services — Utah Gold Card",
            "description": "Browse the full Utah Gold Card directory: restaurants, shops, salons, home services, and more across Ogden, Salt Lake City, Midvale, Provo, Layton, Park City, and St. George.",
            "canonical": f"{SITE_URL}/directory", "og_title": "Utah Gold Card Directory",
            "og_description": "Search Utah's growing local business directory by city, category, and tag."}
    jsonld_list = [jsonld_itemlist("Utah Gold Card Directory", BUSINESSES)]
    write_page("directory", meta, root, body, active_nav="Explore", jsonld_list=jsonld_list)


def generate_food_page():
    root = "../"
    food_biz = [b for b in BUSINESSES if "restaurants" in b["categories"] or "mexican-food" in b["categories"] or "halal-friendly" in b["categories"]]
    cards = "".join(business_card(b, root) for b in food_biz)
    picks = {
        "Family Dinner Picks": [b for b in food_biz if "family-friendly" in b["tags"] or "dinner" in b["tags"]][:3],
        "Fast Lunch Picks": [b for b in food_biz if "lunch" in b["tags"]][:3],
        "Date-Night Picks": [b for b in food_biz if "date-night" in b["tags"]][:3],
        "Halal-Friendly Options": [b for b in food_biz if "halal-friendly" in b["categories"] or "halal-friendly" in b["tags"]][:3],
        "Mexican Restaurants": [b for b in food_biz if "mexican-food" in b["categories"]][:3],
        "Catering & Group Meals": [b for b in BUSINESSES if "catering" in b["categories"] or "catering" in b["tags"]][:3],
    }
    pick_sections = ""
    for label, biz_list in picks.items():
        if not biz_list:
            continue
        pick_sections += f"""<div class="section-head" style="margin-top:36px;margin-bottom:20px;"><h3>{esc(label)}</h3></div>
        <div class="grid grid-3">{''.join(business_card(b, root) for b in biz_list)}</div>"""
    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap">
    <span class="kicker">Food</span>
    <h1>Find Utah Restaurants Worth Talking About</h1>
    <p class="lede">Cuisine, city, and craving — browse Utah Gold Card's featured restaurants, hidden gems, and local favorites.</p>
    <div class="hero-simple-meta">
      <span class="meta-pill">{icon('utensils')} Mexican</span><span class="meta-pill">{icon('utensils')} Mediterranean</span>
      <span class="meta-pill">{icon('utensils')} Halal-Friendly</span><span class="meta-pill">{icon('truck')} Catering</span>
    </div>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap" data-filter-scope>
    {filter_bar_html()}
    <div class="grid grid-3">{cards}</div>
    <div class="empty-state" data-empty-state><h3>No restaurants match those filters</h3><p>Try a different city or category.</p></div>
    {pick_sections}
  </div>
</section>
<section class="callout" style="margin:0 28px;border-radius:28px;">
  <div class="wrap center" style="max-width:760px;">
    <span class="kicker" style="justify-content:center;">For Restaurant Owners</span>
    <h2>Own a Restaurant? Get Listed + Get a 3-Page Website</h2>
    <p>{COPY_THREE_PAGES}</p>
    <a href="{root}join/" class="btn btn-gold">Get My Restaurant Listed</a>
  </div>
</section>"""
    meta = {"title": "Utah Restaurants | Mexican, Halal-Friendly & Local Favorites — Utah Gold Card",
            "description": "Find Utah restaurants worth talking about: Mexican food, Mediterranean, halal-friendly kitchens, catering, and local favorites across Utah cities.",
            "canonical": f"{SITE_URL}/food", "og_title": "Utah Restaurants | Utah Gold Card",
            "og_description": "Browse Utah's featured restaurants by cuisine, city, and craving."}
    jsonld_list = [jsonld_itemlist("Utah Restaurants on Utah Gold Card", food_biz)]
    write_page("food", meta, root, body, active_nav="Food", jsonld_list=jsonld_list)


def generate_deals_page():
    root = "../"
    deal_biz = [b for b in BUSINESSES if b["offer"]]
    groups = {
        "Restaurant Deals": [b for b in deal_biz if "restaurants" in b["categories"]],
        "Family Deals": [b for b in deal_biz if "family-friendly" in b["tags"]],
        "Birthday Offers": [b for b in deal_biz if "birthday-club" in b["tags"] or "loyalty-offer" in b["tags"]],
        "Catering Offers": [b for b in deal_biz if "catering" in b["categories"] or "catering" in b["tags"]],
        "Retail & Service Offers": [b for b in deal_biz if b["categories"][0] in ("local-shops", "home-services", "antiques-specialty-retail", "salons")],
    }
    sections = ""
    for label, biz_list in groups.items():
        if not biz_list:
            continue
        sections += f"""<div class="section-head section-head--split" style="margin-top:40px;">
          <div><h3>{esc(label)}</h3></div></div>
        <div class="grid grid-3">{''.join(deal_card(b, root) for b in biz_list)}</div>"""
    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap">
    <span class="kicker">Deals</span>
    <h1>Local Deals Across Utah</h1>
    <p class="lede">Restaurant specials, family deals, birthday offers, catering discounts, and retail deals from Utah Gold Card businesses.</p>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap">
    <div class="grid grid-3">{''.join(deal_card(b, root) for b in deal_biz)}</div>
    {sections}
  </div>
</section>
<section class="section section--dark">
  <div class="wrap two-col">
    <div>
      <span class="kicker">Get Deals By Email</span>
      <h2>Never Miss a Utah Gold Card Offer</h2>
      <p class="lede">Join the email list for weekly deals from Utah's featured local businesses.</p>
      <form class="inline-signup" data-demo-form data-success="You're subscribed to Utah Gold Card deals!">
        <input type="email" placeholder="you@email.com" required aria-label="Email address">
        <button class="btn btn-gold" type="submit">Get Deals</button>
        <div class="form-success"><span></span></div>
      </form>
    </div>
    <div class="callout" style="padding:32px;">
      <span class="kicker">For Business Owners</span>
      <h3 style="color:var(--white);">Have an Offer to Promote?</h3>
      <p>List your business on Utah Gold Card and submit a deal, birthday club perk, or loyalty offer to be featured here.</p>
      <a href="{root}join/" class="btn btn-gold">Submit an Offer</a>
    </div>
  </div>
</section>"""
    meta = {"title": "Utah Local Deals | Restaurant, Family & Retail Offers — Utah Gold Card",
            "description": "Browse local deals from Utah Gold Card businesses: restaurant specials, family deals, birthday offers, catering discounts, and retail deals across Utah.",
            "canonical": f"{SITE_URL}/deals", "og_title": "Utah Local Deals | Utah Gold Card",
            "og_description": "Restaurant specials, family deals, and retail offers from Utah's featured local businesses."}
    write_page("deals", meta, root, body, active_nav="Deals")

def compare_cell(val):
    if val is True:
        return f'<td>{icon("check", "yes")}</td>'
    if val is False:
        return '<td><span class="no">&mdash;</span></td>'
    return f"<td>{esc(val)}</td>"


COMPARE_ROWS = [
    ("Directory Listing", True, True, True),
    ("3 Semi-Premium Pages", True, True, "5+ Pages"),
    ("Profile Page", True, True, True),
    ("Offer / Lead-Capture Page", True, True, True),
    ("Menu / Services Page", True, True, True),
    ("Photo Gallery", True, "Enhanced", "Enhanced"),
    ("Click-to-Call", True, True, True),
    ("Directions", True, True, True),
    ("Lead Capture Form", True, True, True),
    ("Email Signup", True, True, True),
    ("Birthday Club", "Basic", True, True),
    ("Group Email Campaigns", True, True, True),
    ("Homepage Rotation", "Rotating", "Priority", "Priority"),
    ("Category Placement", True, True, True),
    ("City Placement", True, True, True),
    ("Featured Badge", False, True, True),
    ("Dedicated Subdomain", False, True, False),
    ("Custom Domain", False, False, True),
    ("Advanced SEO", "Basic", "Enhanced", "Advanced"),
    ("Custom Campaigns", False, False, True),
    ("Analytics Summary", False, True, "Advanced"),
]


def generate_pricing_page():
    root = "../"
    rows_html = "".join(
        f"<tr><td>{esc(label)}</td>{compare_cell(t1)}{compare_cell(t2)}{compare_cell(t3)}</tr>"
        for label, t1, t2, t3 in COMPARE_ROWS
    )
    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap center">
    <span class="kicker" style="justify-content:center;">Pricing</span>
    <h1>Simple Pricing for Every Utah Business</h1>
    <p class="lede" style="margin:0 auto;">{COPY_THREE_PAGES}</p>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap">
    <div class="grid grid-3">
      <div class="pricing-card">
        <h3>Directory Mini-Site</h3>
        <div class="price">$175 <span>setup</span></div>
        <div class="price-setup">+ $95/month</div>
        <ul class="feature-list">
          <li>{icon('check')} Utah Gold Card directory listing</li>
          <li>{icon('check')} Three semi-premium pages</li>
          <li>{icon('check')} Profile, offer/lead-capture &amp; menu/services pages</li>
          <li>{icon('check')} Photo gallery, click-to-call &amp; directions</li>
          <li>{icon('check')} Contact form, email &amp; birthday club signup</li>
          <li>{icon('check')} City/category placement + homepage rotation</li>
          <li>{icon('check')} Group email campaign inclusion</li>
          <li>{icon('check')} Basic deal or loyalty placement</li>
        </ul>
        <a href="{root}join/" class="btn btn-dark btn-block">Get Started</a>
      </div>
      <div class="pricing-card is-featured">
        <span class="pricing-ribbon">Most Popular</span>
        <h3>Subdomain Mini-Site</h3>
        <div class="price">$275 <span>setup</span></div>
        <div class="price-setup">+ $195/month</div>
        <ul class="feature-list">
          <li>{icon('check')} Everything in the Directory Mini-Site</li>
          <li>{icon('check')} Dedicated branded subdomain</li>
          <li>{icon('check')} More premium layout + featured badge</li>
          <li>{icon('check')} Priority placement &amp; enhanced gallery</li>
          <li>{icon('check')} Dedicated campaign landing page</li>
          <li>{icon('check')} Monthly offer update</li>
          <li>{icon('check')} Analytics summary</li>
          <li>{icon('check')} Stronger local SEO sections</li>
        </ul>
        <a href="{root}join/" class="btn btn-gold btn-block">Get Started</a>
      </div>
      <div class="pricing-card">
        <h3>Custom Domain Website</h3>
        <div class="price">Custom <span>pricing</span></div>
        <div class="price-setup">Tailored to your project</div>
        <ul class="feature-list">
          <li>{icon('check')} Full standalone website on your own domain</li>
          <li>{icon('check')} Advanced SEO &amp; more pages</li>
          <li>{icon('check')} Custom campaigns &amp; advanced email automations</li>
          <li>{icon('check')} Advanced loyalty program</li>
          <li>{icon('check')} Optional ordering, booking, quote, catering or event forms</li>
          <li>{icon('check')} Optional product showcases</li>
        </ul>
        <a href="{root}join/" class="btn btn-dark btn-block">Request a Quote</a>
      </div>
    </div>
    <div class="card" style="padding:26px;margin-top:26px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
      <div>
        <span class="kicker">Add-On</span>
        <h3 style="margin-bottom:4px;">Premium Feature Ad — $25/month</h3>
        <p style="margin-bottom:0;">Homepage feature slot, category-page feature slot, city-page feature slot, deal spotlight, and campaign highlight when relevant.</p>
      </div>
      <a href="{root}advertise/" class="btn btn-gold">Add Featured Placement</a>
    </div>
  </div>
</section>
<section class="section section--cream">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">Compare Tiers</span><h2>Full Feature Comparison</h2></div>
    <div class="table-wrap">
      <table class="compare">
        <thead><tr><th>Feature</th><th>Directory Mini-Site</th><th>Subdomain Mini-Site</th><th>Custom Domain</th></tr></thead>
        <tbody>{rows_html}</tbody>
      </table>
    </div>
  </div>
</section>
<section class="section section--dark">
  <div class="wrap two-col">
    <div>
      <span class="kicker">Built-In SEO</span>
      <h2>Every Tier Includes Page-Level SEO</h2>
      <p>{COPY_SEO_STRATEGY}</p>
    </div>
    <div class="card" style="padding:26px;">
      <p style="margin-bottom:14px;">{COPY_GROWTH_SEO}</p>
      <a href="{root}business-owners/" class="link-arrow" style="color:var(--gold-bright);">See the full business-owner breakdown {icon('arrow-right')}</a>
    </div>
  </div>
</section>"""
    meta = {"title": "Pricing | Utah Gold Card Directory Listings & Mini-Sites",
            "description": "See Utah Gold Card pricing: Directory Mini-Site ($175 + $95/mo), Subdomain Mini-Site ($275 + $195/mo), Custom Domain Website (custom pricing), and the $25/month Premium Feature Ad.",
            "canonical": f"{SITE_URL}/pricing", "og_title": "Utah Gold Card Pricing",
            "og_description": "Simple, transparent pricing for Utah Gold Card directory listings and mini-sites."}
    write_page("pricing", meta, root, body, active_nav="Pricing")

BIZ_OWNER_FAQS = [
    ("How fast can I get listed on Utah Gold Card?", "Most businesses go from signup to a live directory listing and mini-site within about one to two weeks, depending on tier and how quickly photos and details are provided."),
    ("Do I need to write my own website copy or take my own photos?", "No. Utah Gold Card builds your profile, offer, and menu/services pages for you. Photos can be provided by you, or we can work with placeholders until your official photos are ready."),
    ("Can I upgrade from a Directory Mini-Site to a Subdomain or Custom Domain later?", "Yes. Businesses commonly start with a Directory Mini-Site and upgrade to a Subdomain or Custom Domain Website as they grow — your directory listing and SEO history carry forward."),
    ("How do the group email campaigns work?", "Utah Gold Card sends up to ten group emails per month to the shared local audience. Your business is featured in relevant campaigns automatically based on your category, city, and current offers."),
    ("Do I have to offer a loyalty program or discount?", "No. Offers, loyalty perks, and birthday club signups are optional. Every business still gets full directory placement, a mini-site, and lead capture without running a discount."),
    ("What happens if I want to cancel?", "You can cancel the monthly plan at any time. There is no long-term contract required beyond the initial setup fee for your tier."),
]


def generate_business_owners_page():
    root = "../"
    problems = [
        ("No time to build a website", "Most business owners don't have the time (or interest) to build and maintain their own site, forms, and email tools."),
        ("Hard to show up in local search", "Being buried on page three of Google — or missing from local searches by city and category entirely — costs real customers."),
        ("No simple way to capture leads", "Without a lead form, email signup, or offer page, interested customers have no easy way to become repeat customers."),
        ("No ongoing local promotion", "A one-time website doesn't keep bringing customers back. Businesses need ongoing placement and group marketing exposure."),
    ]
    problem_cards = "".join(f"""<div class="card" style="padding:24px;"><div class="cat-icon" style="margin-bottom:14px;">{icon('target')}</div>
      <h4>{esc(t)}</h4><p style="margin-bottom:0;font-size:.9rem;">{esc(d)}</p></div>""" for t, d in problems)

    builds = [
        ("layers", "Directory Placement", "Your business is placed in the shared Utah Gold Card directory with city and category filters from day one."),
        ("spark", "3-Page Mini-Site", "A profile page, an offer/lead-capture page, and a menu/services page — built and hosted for you."),
        ("mail", "Lead Capture", "Contact forms, email signup, and birthday club signup turn visitors into a list you actually own."),
        ("calendar", "Email Campaigns", "Up to 10 group emails per month feature relevant businesses to the full Utah Gold Card audience."),
        ("star", "Homepage Rotation", "Featured businesses rotate through the Utah Gold Card homepage spotlight automatically."),
        ("map-pin", "City &amp; Category Pages", "Every business appears on its city page and its category page — two more ways to be discovered."),
        ("gift", "Optional Loyalty &amp; Deals", "Birthday club, loyalty perks, and local deals are available any time you want to turn on a promotion."),
        ("globe", "Page-Level SEO", "Every listing gets its own title, description, structured data, and local keywords — not just a shared directory row."),
    ]
    build_cards = "".join(f"""<div class="cat-card"><div class="cat-icon">{icon(i)}</div><h4>{t}</h4><p style="margin-bottom:0;font-size:.88rem;">{d}</p></div>""" for i, t, d in builds)

    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap">
    <span class="hero-badge">{icon('spark')} For Utah Business Owners</span>
    <h1>Get Found on Utah Gold Card — and Get a Beautiful 3-Page Website Without Doing the Work</h1>
    <p class="lede">We build your listing, your mini-site, your offer page, your email signup system, and your local promotion engine. You focus on running the business.</p>
    <div class="hero-ctas"><a href="{root}join/" class="btn btn-gold">{icon('spark')} Get My Business Listed</a>
      <a href="{root}pricing/" class="btn btn-outline">See Pricing</a></div>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">The Problem</span><h2>Local Marketing Shouldn't Be This Hard</h2>
    <p class="lede" style="margin:0 auto;">{COPY_SIMPLE_SYSTEM}</p></div>
    <div class="grid grid-4">{problem_cards}</div>
  </div>
</section>

<section class="section section--cream">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">What We Build For You</span><h2>Everything Included, Fully Managed</h2></div>
    <div class="grid grid-4">{build_cards}</div>
  </div>
</section>

<section class="section section--dark">
  <div class="wrap two-col">
    <div>
      <span class="kicker">How Shared Directory Traffic Works</span>
      <h2>One Directory. Shared Discovery.</h2>
      <p>Instead of a lonely website that only your existing customers find, your business sits inside a shared Utah directory that people are actively browsing by city, category, and deal.</p>
      <p>Every search, every email campaign, and every homepage rotation sends a portion of that shared traffic to your mini-site — traffic you wouldn't get from a standalone site alone.</p>
    </div>
    <div class="callout" style="padding:32px;">
      <span class="kicker">Why Every New Business Makes the Directory Stronger</span>
      <h3 style="color:var(--white);">{COPY_STRONGER_TOGETHER}</h3>
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap two-col">
    <div>
      <span class="kicker">Built to Rank on Its Own</span>
      <h2>Your Page Isn't Just a Directory Row</h2>
      <p>{COPY_SEO_STRATEGY}</p>
      <p class="pill-note">{COPY_CUSTOMER_SEO}</p>
    </div>
    <div class="card" style="padding:26px;">
      <h4>Page-Level SEO, Included</h4>
      <ul class="feature-list">
        <li>{icon('check')} Unique title, description &amp; H1 per page</li>
        <li>{icon('check')} Unique canonical URL for profile, offers &amp; menu pages</li>
        <li>{icon('check')} JSON-LD structured data for your business type</li>
        <li>{icon('check')} Breadcrumbs &amp; internal links to your city and category</li>
        <li>{icon('check')} Local keyword &amp; FAQ sections</li>
      </ul>
      <p style="margin-top:14px;margin-bottom:0;font-size:.85rem;">{COPY_GROWTH_SEO}</p>
    </div>
  </div>
</section>

<section class="section section--cream">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div><span class="kicker">Pricing</span><h2>Choose Your Tier</h2></div>
      <a href="{root}pricing/" class="link-arrow">Full Pricing &amp; Comparison {icon('arrow-right')}</a>
    </div>
    <div class="grid grid-3">
      {pricing_card_mini("Directory Mini-Site", "$175", "$95", ["Directory listing + 3-page mini-site", "Lead capture &amp; email signup", "Homepage rotation"], root, "join/")}
      {pricing_card_mini("Subdomain Mini-Site", "$275", "$195", ["Everything in Tier 1", "Dedicated subdomain &amp; featured badge", "Priority placement"], root, "join/", featured=True)}
      {pricing_card_mini("Custom Domain Website", "Custom", "Pricing", ["Full standalone website", "Advanced SEO &amp; automations", "Optional ordering / booking forms"], root, "join/")}
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">FAQ</span><h2>Business Owner Questions</h2></div>
    <div class="wrap--narrow" style="margin:0 auto;">{faq_block(BIZ_OWNER_FAQS)}</div>
  </div>
</section>

<section class="callout" style="margin:0 28px 60px;border-radius:28px;">
  <div class="wrap center" style="max-width:760px;">
    <h2>Ready to Get Found on Utah Gold Card?</h2>
    <p>Join Fajita Grill, Golden Hour Salon, and a growing list of Utah businesses already listed.</p>
    <a href="{root}join/" class="btn btn-gold">Get My Business Listed</a>
  </div>
</section>"""
    meta = {"title": "For Utah Businesses | Get Listed & Get a 3-Page Mini-Site — Utah Gold Card",
            "description": "Utah Gold Card builds your directory listing, 3-page mini-site, lead capture, and email campaign exposure for you. See pricing and how the shared directory works.",
            "canonical": f"{SITE_URL}/business-owners", "og_title": "Get Found on Utah Gold Card",
            "og_description": "Get listed, get a 3-page mini-site, and get promoted — without managing the technology yourself."}
    write_page("business-owners", meta, root, body, active_nav="For Businesses")

CAMPAIGN_EXAMPLES = [
    ("Best Mexican Food This Weekend", "Featuring Fajita Grill, Salt City Tacos & Sahara Table", "Food Lovers", "utensils"),
    ("Ogden Local Deals", "Coffee, antiques, boutique & home service offers around Ogden", "Ogden Locals", "map-pin"),
    ("Midvale Lunch Picks", "Fast lunch spots for the Midvale & Salt Lake Valley workday crowd", "Lunch Crowd", "utensils"),
    ("Family Dinner Specials", "Kid-friendly deals from Wasatch Family Pizza & more", "Families", "users"),
    ("Birthday Club Offers", "Birthday perks from Golden Hour Salon, Fajita Grill & others", "Birthday Club", "gift"),
    ("Catering for Office Lunches", "Office catering packages from Mountain View Catering & Fajita Grill", "Office Managers", "truck"),
    ("New Local Businesses", "Newly listed Utah Gold Card businesses this month", "All Subscribers", "spark"),
    ("Utah Hidden Gems", "Lesser-known local favorites across every Utah Gold Card city", "Explorers", "mountain"),
]


def generate_email_program_page():
    root = "../"
    steps = [
        ("layers", "We Build the Audience", "Utah Gold Card grows one shared local email list across every participating city and category."),
        ("mail", "We Collect Emails Across the Directory", "Every business page includes an email signup, birthday club, and offer opt-in that feeds the shared list."),
        ("calendar", "We Send Up to 10 Group Emails a Month", "Curated campaigns go out to relevant segments — by city, category, or interest — without any business writing a single email."),
        ("star", "Businesses Get Featured, Automatically", "Your business is included in campaigns that match your category, city, and current offers."),
    ]
    step_cards = "".join(f"""<div class="step"><div class="num">{icon(i)}</div><h3>{t}</h3><p>{d}</p></div>""" for i, t, d in steps)
    campaign_cards = "".join(f"""<div class="campaign-card">
      <div class="icon-badge" style="width:40px;height:40px;border-radius:10px;background:var(--cream);color:var(--gold-dark);display:flex;align-items:center;justify-content:center;">{icon(i)}</div>
      <h4 style="margin-bottom:0;">{t}</h4><p style="font-size:.86rem;margin-bottom:0;">{d}</p>
      <span class="audience">{icon('users')} {a}</span></div>""" for t, d, a, i in CAMPAIGN_EXAMPLES)

    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap">
    <span class="kicker">Email Program</span>
    <h1>Done-For-You Group Email Marketing</h1>
    <p class="lede">Utah Gold Card builds and manages one shared local audience — and features your business in up to 10 group emails a month, without you writing a single one.</p>
    <div class="hero-ctas"><a href="{root}join/" class="btn btn-gold">Get Featured in Campaigns</a></div>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap"><div class="steps">{step_cards}</div></div>
</section>
<section class="section section--cream">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">Campaign Examples</span><h2>Real Campaigns Sent to the Utah Gold Card List</h2></div>
    <div class="grid grid-4">{campaign_cards}</div>
  </div>
</section>
<section class="section section--dark">
  <div class="wrap two-col">
    <div>
      <span class="kicker">For Business Owners</span>
      <h2>Exposure Without Writing a Single Email</h2>
      <p>Your business shows up in the campaigns that match your city, category, and current offers — no copywriting, no scheduling, no email tool to learn.</p>
      <a href="{root}business-owners/" class="btn btn-gold">See What We Build For You</a>
    </div>
    <div>
      <span class="kicker">For Local Customers</span>
      <h2>Deals, Openings &amp; Featured Picks</h2>
      <p>Subscribers get local deals, new business openings, events, and featured picks curated by city and category — not generic spam.</p>
      <form class="inline-signup" data-demo-form data-success="You're on the Utah Gold Card email list!">
        <input type="email" placeholder="you@email.com" required aria-label="Email address">
        <button class="btn btn-gold" type="submit">Subscribe</button>
        <div class="form-success"><span></span></div>
      </form>
    </div>
  </div>
</section>"""
    meta = {"title": "Email Marketing Program | Utah Gold Card Group Campaigns",
            "description": "See how Utah Gold Card's done-for-you email program works: up to 10 group campaigns a month featuring Utah businesses by city, category, and offer.",
            "canonical": f"{SITE_URL}/email-program", "og_title": "Utah Gold Card Email Program",
            "og_description": "Done-for-you group email marketing for Utah local businesses."}
    write_page("email-program", meta, root, body, active_nav="Email Program")


def generate_loyalty_page():
    root = "../"
    loy_biz = [b for b in BUSINESSES if "loyalty-offer" in b["tags"] or "birthday-club" in b["tags"]]
    loy_cards = "".join(f"""<div class="loy-card"><div class="icon-badge">{icon(b['icon'])}</div>
      <h4>{esc(b['name'])}</h4><p style="font-size:.86rem;">{esc(b['offer'] or 'Loyalty perks available')}</p>
      <a href="{root}{b['slug']}/offers/" class="link-arrow">Join &amp; Save {icon('arrow-right')}</a></div>""" for b in loy_biz)
    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap">
    <span class="kicker">Loyalty</span>
    <h1>Turn One-Time Visitors Into Repeat Customers</h1>
    <p class="lede">Digital loyalty, birthday clubs, and email/SMS capture help Utah Gold Card businesses keep customers coming back.</p>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap">
    <div class="grid grid-4">
      <div class="loy-card"><div class="icon-badge">{icon('award')}</div><h4>Digital Loyalty</h4><p style="font-size:.88rem;margin-bottom:0;">A simple loyalty placeholder rewards repeat visits — no app download required.</p></div>
      <div class="loy-card"><div class="icon-badge">{icon('gift')}</div><h4>Birthday Club</h4><p style="font-size:.88rem;margin-bottom:0;">Guests sign up once and get a birthday perk automatically every year.</p></div>
      <div class="loy-card"><div class="icon-badge">{icon('mail')}</div><h4>Email / SMS Capture</h4><p style="font-size:.88rem;margin-bottom:0;">Every mini-site captures emails (and SMS opt-in) to build a list the business owns.</p></div>
      <div class="loy-card"><div class="icon-badge">{icon('badge-percent')}</div><h4>Deal Cards</h4><p style="font-size:.88rem;margin-bottom:0;">Featured offers surface across the homepage, deals page, and category pages.</p></div>
    </div>
  </div>
</section>
<section class="section section--cream">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">Featured Offers</span><h2>Restaurant &amp; Local Business Rewards</h2></div>
    <div class="grid grid-4">{loy_cards}</div>
  </div>
</section>
<section class="callout" style="margin:0 28px 60px;border-radius:28px;">
  <div class="wrap center" style="max-width:760px;">
    <h2>Add Loyalty &amp; Birthday Club to Your Mini-Site</h2>
    <p>Loyalty and deals are optional add-ons available on any Utah Gold Card tier.</p>
    <a href="{root}join/" class="btn btn-gold">Get My Business Listed</a>
  </div>
</section>"""
    meta = {"title": "Loyalty & Birthday Club Program | Utah Gold Card",
            "description": "Turn one-time visitors into repeat customers with Utah Gold Card's digital loyalty, birthday club, and deal card program for Utah businesses.",
            "canonical": f"{SITE_URL}/loyalty", "og_title": "Utah Gold Card Loyalty Program",
            "og_description": "Digital loyalty, birthday clubs, and deal cards for Utah local businesses."}
    write_page("loyalty", meta, root, body, active_nav="Loyalty")

def generate_advertise_page():
    root = "../"
    example_biz = BUSINESSES[0]
    homepage_mock = f"""<div class="card" style="padding:0;overflow:hidden;">
      <div class="ph ph-{example_biz['theme']}" style="aspect-ratio:16/9;"><span class="ph-icon">{icon(example_biz['icon'])}</span>
        <span class="badge-ribbon" style="top:14px;left:14px;">{icon('award')} Featured on Homepage</span></div>
      <div style="padding:18px;"><h4 style="margin-bottom:2px;">{esc(example_biz['name'])}</h4><p style="font-size:.85rem;margin-bottom:0;">Rotates through the homepage spotlight carousel.</p></div>
    </div>"""
    category_mock = f"""<div class="card" style="padding:0;overflow:hidden;">
      <div class="ph ph-salon" style="aspect-ratio:16/9;"><span class="ph-icon">{icon('scissors')}</span>
        <span class="badge-ribbon" style="top:14px;left:14px;">{icon('award')} Featured in Salons</span></div>
      <div style="padding:18px;"><h4 style="margin-bottom:2px;">Golden Hour Salon</h4><p style="font-size:.85rem;margin-bottom:0;">Pinned to the top of the Salons category page.</p></div>
    </div>"""
    city_mock = f"""<div class="card" style="padding:0;overflow:hidden;">
      <div class="ph ph-antiques" style="aspect-ratio:16/9;"><span class="ph-icon">{icon('clock')}</span>
        <span class="badge-ribbon" style="top:14px;left:14px;">{icon('award')} Featured in Ogden</span></div>
      <div style="padding:18px;"><h4 style="margin-bottom:2px;">Heritage Clock &amp; Antiques</h4><p style="font-size:.85rem;margin-bottom:0;">Pinned to the top of the Ogden city page.</p></div>
    </div>"""
    deal_mock = deal_card(BUSINESS_BY_SLUG["park-city-dessert-bar"], root)
    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap">
    <span class="kicker">Advertise</span>
    <h1>Get Seen First With a Premium Feature Ad</h1>
    <p class="lede">For $25/month, put your business in front of more Utah Gold Card visitors with homepage, category, and city feature placement.</p>
    <div class="hero-ctas"><a href="{root}join/" class="btn btn-gold">{icon('spark')} Add Featured Placement</a></div>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">$25/month Add-On</span><h2>One Placement, Five Ways to Get Seen</h2></div>
    <div class="grid grid-5">
      <div class="cat-card"><div class="cat-icon">{icon('star')}</div><h4>Homepage Feature Slot</h4><p style="margin-bottom:0;font-size:.85rem;">Rotate through the homepage spotlight carousel.</p></div>
      <div class="cat-card"><div class="cat-icon">{icon('layers')}</div><h4>Category Feature Slot</h4><p style="margin-bottom:0;font-size:.85rem;">Pin to the top of your category page.</p></div>
      <div class="cat-card"><div class="cat-icon">{icon('map-pin')}</div><h4>City Feature Slot</h4><p style="margin-bottom:0;font-size:.85rem;">Pin to the top of your city page.</p></div>
      <div class="cat-card"><div class="cat-icon">{icon('badge-percent')}</div><h4>Deal Spotlight</h4><p style="margin-bottom:0;font-size:.85rem;">Highlight your current offer on the deals page.</p></div>
      <div class="cat-card"><div class="cat-icon">{icon('mail')}</div><h4>Campaign Highlight</h4><p style="margin-bottom:0;font-size:.85rem;">Get extra placement in relevant group emails.</p></div>
    </div>
  </div>
</section>
<section class="section section--cream">
  <div class="wrap">
    <div class="section-head section-head--center"><span class="kicker">Example Placements</span><h2>What Featured Placement Looks Like</h2></div>
    <div class="grid grid-3">{homepage_mock}{category_mock}{city_mock}</div>
    <div class="grid grid-3" style="margin-top:26px;"><div style="max-width:380px;">{deal_mock}</div></div>
  </div>
</section>
<section class="callout" style="margin:0 28px 60px;border-radius:28px;">
  <div class="wrap center" style="max-width:760px;">
    <h2>Add Featured Placement</h2>
    <p>$25/month. Cancel anytime. Stack it with any Utah Gold Card tier.</p>
    <a href="{root}join/" class="btn btn-gold">Add Featured Placement</a>
  </div>
</section>"""
    meta = {"title": "Advertise on Utah Gold Card | $25/month Premium Feature Ad",
            "description": "Get seen first on Utah Gold Card with a $25/month Premium Feature Ad: homepage, category, and city feature slots plus deal and campaign spotlights.",
            "canonical": f"{SITE_URL}/advertise", "og_title": "Advertise on Utah Gold Card",
            "og_description": "Homepage, category, and city feature placement for $25/month."}
    write_page("advertise", meta, root, body, active_nav="Advertise")


def generate_join_page():
    root = "../"
    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap center">
    <span class="kicker" style="justify-content:center;">Join Utah Gold Card</span>
    <h1>Request My Utah Gold Card Mini-Site</h1>
    <p class="lede" style="margin:0 auto;">Tell us about your business and our team will follow up to build your directory listing and mini-site.</p>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap" style="max-width:820px;">
    <form class="form-card" data-demo-form data-success="Thanks! Your Utah Gold Card request has been received — our team will follow up within one business day.">
      <div class="form-grid">
        <div class="form-field"><label>Business Name</label><input type="text" required></div>
        <div class="form-field"><label>Owner Name</label><input type="text" required></div>
        <div class="form-field"><label>Email</label><input type="email" required></div>
        <div class="form-field"><label>Phone</label><input type="tel" required></div>
        <div class="form-field"><label>Category</label>
          <select required><option value="">Select a category</option>{"".join(f'<option value="{c}">{CATEGORIES[c]["name"]}</option>' for c in CATEGORY_ORDER)}</select>
        </div>
        <div class="form-field"><label>City</label>
          <select required><option value="">Select a city</option>{"".join(f'<option value="{c}">{AREAS[c]["name"]}</option>' for c in AREA_ORDER)}</select>
        </div>
        <div class="form-field"><label>Current Website (if any)</label><input type="text" placeholder="https://"></div>
        <div class="form-field"><label>Interested Tier</label>
          <select><option value="">Not sure yet</option><option>Directory Mini-Site — $175 + $95/mo</option><option>Subdomain Mini-Site — $275 + $195/mo</option><option>Custom Domain Website — Custom Pricing</option></select>
        </div>
        <div class="form-field"><label>Photos Available?</label>
          <select><option>Yes, I have photos ready</option><option>Some — I'll need help</option><option>No, I need photos taken</option></select>
        </div>
        <div class="form-field"><label>Email Campaigns Wanted?</label>
          <select><option>Yes, include me in group campaigns</option><option>Not right now</option></select>
        </div>
        <div class="form-field full"><label>Loyalty / Deals Wanted?</label>
          <select><option>Yes — set up birthday club &amp; loyalty</option><option>Maybe later</option><option>No, not right now</option></select>
        </div>
        <div class="form-field full"><label>Notes</label><textarea rows="4" placeholder="Anything else we should know?"></textarea></div>
      </div>
      <button class="btn btn-gold btn-block" type="submit">Request My Utah Gold Card Mini-Site</button>
      <div class="form-success"><span></span></div>
      <p class="form-note">By submitting, you agree to be contacted by the Utah Gold Card team about your listing.</p>
    </form>
  </div>
</section>
<section class="section section--cream section--border-top">
  <div class="wrap center" style="max-width:700px;">
    <span class="kicker" style="justify-content:center;">Not Ready to Fill Out the Form?</span>
    <h3>See Pricing or Learn How It Works First</h3>
    <div class="flex gap-16" style="justify-content:center;flex-wrap:wrap;margin-top:14px;">
      <a href="{root}pricing/" class="btn btn-outline">See Pricing</a>
      <a href="{root}business-owners/" class="btn btn-outline">For Business Owners</a>
    </div>
  </div>
</section>"""
    meta = {"title": "Join Utah Gold Card | Request Your Business Mini-Site",
            "description": "Request your Utah Gold Card directory listing and 3-page mini-site. Tell us about your business, category, city, and tier interest to get started.",
            "canonical": f"{SITE_URL}/join", "og_title": "Join Utah Gold Card",
            "og_description": "Request your Utah Gold Card directory listing and 3-page mini-site."}
    write_page("join", meta, root, body, active_nav=None)

def generate_admin_dashboard():
    root = "../"
    tier_setup = {1: 175, 2: 275, 3: 0}
    tier_monthly = {1: 95, 2: 195, 3: 0}
    total_setup = sum(tier_setup[b["tier"]] for b in BUSINESSES)
    total_mrr = sum(tier_monthly[b["tier"]] for b in BUSINESSES)
    rows = []
    no_dash = '<span class="no">&mdash;</span>'
    for i, b in enumerate(BUSINESSES):
        leads = 8 + (i * 7) % 41
        signups = 42 + (i * 23) % 130
        status = "active" if i % 6 != 5 else "pending"
        featured_on = b["featured"]
        rows.append(f"""<tr>
      <td><b>{esc(b['name'])}</b><br><span style="color:var(--muted-light);font-size:.78rem;">utahgoldcard.com/{b['slug']}</span></td>
      <td>{TIER_LABEL[b['tier']].replace(' Mini-Site','').replace(' Website','')}</td>
      <td><span class="status-pill {'active' if status=='active' else 'pending'}">{status.title()}</span></td>
      <td>{leads}</td><td>{signups}</td>
      <td>{icon('check','yes') if b['tier']>=1 else ''}</td>
      <td>{icon('check','yes') if b['featured'] else no_dash}</td>
      <td><button class="toggle {'is-on' if featured_on else ''}" data-toggle aria-label="Featured ad toggle"></button></td>
      <td>${tier_monthly[b['tier']]}/mo</td>
    </tr>""")
    onboarding_steps = ["Business info collected", "Photos received", "Profile page built",
                        "Offer / lead-capture page built", "Menu / services page built",
                        "Email signup connected", "Featured ad status set", "Live on directory"]
    onboarding_html = ""
    for b in BUSINESSES[:6]:
        done_count = 8 if b["tier"] >= 1 and not (BUSINESSES.index(b) % 5 == 4) else 6
        items = "".join(
            f'<li><div class="check-dot {"done" if i < done_count else ""}">{icon("check") if i < done_count else ""}</div>{s}</li>'
            for i, s in enumerate(onboarding_steps)
        )
        onboarding_html += f'<div class="card" style="padding:20px;"><h4 style="margin-bottom:10px;">{esc(b["name"])}</h4><ul class="checklist">{items}</ul></div>'

    body = f"""
<section class="section section--dark section--tight">
  <div class="wrap"><span class="kicker">Internal Platform Preview</span>
  <h1 style="font-size:2rem;">Utah Gold Card Admin Dashboard</h1>
  <p class="lede">A visual mockup of the internal tool that manages every business, tier, lead, and campaign — for demo purposes only.</p></div>
</section>
<section class="section section--paper section--tight">
  <div class="wrap">
    <div class="grid grid-4" style="margin-bottom:30px;">
      {stat_tile('layers', str(len(BUSINESSES)), 'Total Businesses', '+2 this month')}
      {stat_tile('users', str(sum(8 + (i*7)%41 for i in range(len(BUSINESSES)))), 'Total Leads', '+18%')}
      {stat_tile('mail', str(sum(42 + (i*23)%130 for i in range(len(BUSINESSES)))), 'Email Signups', '+9%')}
      {stat_tile('chart', f"${total_mrr:,}/mo", 'Monthly Recurring Revenue', '+$195')}
    </div>
    <div class="dash-shell">
      <div class="dash-topbar">
        <div class="dash-tabs" data-tabs>
          <button class="dash-tab is-active" data-tab="businesses">Businesses</button>
          <button class="dash-tab" data-tab="revenue">Revenue</button>
          <button class="dash-tab" data-tab="onboarding">Onboarding</button>
        </div>
        <button class="btn btn-gold btn-sm">{icon('spark')} Add Business</button>
      </div>
      <div class="dash-panel" data-tabs>
        <div data-panel="businesses">
          <div class="table-wrap"><table class="admin-table">
            <thead><tr><th>Business</th><th>Tier</th><th>Status</th><th>Leads</th><th>Email Signups</th><th>Campaigns</th><th>Homepage Rotation</th><th>Featured Ad</th><th>Billing</th></tr></thead>
            <tbody>{''.join(rows)}</tbody>
          </table></div>
        </div>
        <div data-panel="revenue" style="display:none;">
          <div class="grid grid-3" style="margin-bottom:24px;">
            {stat_tile('badge-percent', f"${total_setup:,}", 'Total Setup Fees Collected')}
            {stat_tile('chart', f"${total_mrr:,}/mo", 'Current MRR')}
            {stat_tile('spark', f"${total_mrr*12:,}/yr", 'Projected Annual Recurring')}
          </div>
          <div class="table-wrap"><table class="admin-table">
            <thead><tr><th>Tier</th><th>Businesses</th><th>Setup Fee</th><th>Monthly Fee</th><th>Tier MRR</th></tr></thead>
            <tbody>
              <tr><td>Directory Mini-Site</td><td>{len([b for b in BUSINESSES if b['tier']==1])}</td><td>$175</td><td>$95</td><td>${len([b for b in BUSINESSES if b['tier']==1])*95}/mo</td></tr>
              <tr><td>Subdomain Mini-Site</td><td>{len([b for b in BUSINESSES if b['tier']==2])}</td><td>$275</td><td>$195</td><td>${len([b for b in BUSINESSES if b['tier']==2])*195}/mo</td></tr>
              <tr><td>Custom Domain Website</td><td>{len([b for b in BUSINESSES if b['tier']==3])}</td><td>Custom</td><td>Custom</td><td>&mdash;</td></tr>
            </tbody>
          </table></div>
        </div>
        <div data-panel="onboarding" style="display:none;">
          <div class="grid grid-3">{onboarding_html}</div>
        </div>
      </div>
    </div>
  </div>
</section>"""
    meta = {"title": "Admin Dashboard (Internal Preview) | Utah Gold Card",
            "description": "Internal admin dashboard preview for the Utah Gold Card platform team.",
            "canonical": f"{SITE_URL}/admin-dashboard"}
    write_page("admin-dashboard", meta, root, body, active_nav=None, robots="noindex, nofollow")


def generate_campaign_dashboard():
    root = "../"
    statuses = ["sent", "sent", "sent", "scheduled", "scheduled", "draft", "draft", "draft", "draft", "draft"]
    campaigns = []
    for i, (title, desc, audience, ic) in enumerate(CAMPAIGN_EXAMPLES + [
        ("Park City Date Night Picks", "Dessert Bar & Main Street favorites", "Date Night", "cake"),
        ("Layton Family Weekend", "Family Fun & kid-friendly dinner picks", "Families", "users"),
    ]):
        status = statuses[i % len(statuses)]
        pct = 30 + (i * 11) % 60
        campaigns.append(f"""<div class="campaign-card" data-campaign-card data-status="{status}">
      <div class="flex-between"><span class="status-pill {status}">{status.title()}</span><span class="audience">{icon('users')} {audience}</span></div>
      <h4 style="margin-bottom:0;">{icon(ic)} {title}</h4>
      <p style="font-size:.86rem;margin-bottom:0;">{desc}</p>
      <div class="progress-bar"><span style="width:{pct}%;"></span></div>
      <span style="font-size:.76rem;color:var(--muted);">{'Open rate' if status=='sent' else 'Est. reach'} {pct}%</span>
    </div>""")
    cal_slots_parts = []
    for i in range(12):
        filled_cls = "is-filled" if i < 10 else ""
        if i < 10:
            inner = f'<b style="font-size:.82rem;">{esc(CAMPAIGN_EXAMPLES[i % len(CAMPAIGN_EXAMPLES)][0])}</b>'
        else:
            inner = '<span style="color:var(--muted-light);font-size:.8rem;">Open</span>'
        cal_slots_parts.append(f'<div class="cal-slot {filled_cls}"><div class="date">Slot {i+1}</div>{inner}</div>')
    cal_slots = "".join(cal_slots_parts)
    body = f"""
<section class="section section--dark section--tight">
  <div class="wrap"><span class="kicker">Internal Platform Preview</span>
  <h1 style="font-size:2rem;">Campaign Dashboard</h1>
  <p class="lede">A visual mockup of the internal tool that schedules the 10 monthly Utah Gold Card group email campaigns.</p></div>
</section>
<section class="section section--paper section--tight">
  <div class="wrap">
    <div class="grid grid-4" style="margin-bottom:30px;">
      {stat_tile('calendar', '10', 'Monthly Email Slots')}
      {stat_tile('users', '6', 'Audience Segments')}
      {stat_tile('mail', '3', 'Sent This Month')}
      {stat_tile('chart', '38%', 'Avg. Open Rate', '+4%')}
    </div>
    <div class="dash-shell">
      <div class="dash-topbar">
        <div class="dash-tabs" data-campaign-filter>
          <button class="dash-tab is-active" data-status-btn="all">All</button>
          <button class="dash-tab" data-status-btn="draft">Draft</button>
          <button class="dash-tab" data-status-btn="scheduled">Scheduled</button>
          <button class="dash-tab" data-status-btn="sent">Sent</button>
        </div>
        <button class="btn btn-gold btn-sm">{icon('spark')} New Campaign</button>
      </div>
      <div class="dash-panel">
        <h4 style="margin-bottom:14px;">This Month's Calendar (10 Slots)</h4>
        <div class="cal-grid" style="margin-bottom:30px;">{cal_slots}</div>
        <h4 style="margin-bottom:14px;">Campaigns</h4>
        <div class="grid grid-3">{''.join(campaigns)}</div>
      </div>
    </div>
  </div>
</section>"""
    meta = {"title": "Campaign Dashboard (Internal Preview) | Utah Gold Card",
            "description": "Internal campaign dashboard preview for the Utah Gold Card email program.",
            "canonical": f"{SITE_URL}/campaign-dashboard"}
    write_page("campaign-dashboard", meta, root, body, active_nav=None, robots="noindex, nofollow")

# ------------------------------------------------------------------
# Area (city) pages
# ------------------------------------------------------------------
def generate_areas_hub():
    root = "../"
    cards = "".join(area_card(c, root) for c in AREA_ORDER)
    crumbs = [("Home", ""), ("Utah Businesses", "directory/"), ("Areas", None)]
    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap"><span class="kicker">Areas</span><h1>Utah Gold Card Areas</h1>
  <p class="lede">Browse Utah Gold Card businesses by city — from Ogden to St. George.</p></div>
</section>
<section class="section section--paper">
  <div class="wrap"><div class="grid grid-4">{cards}</div></div>
</section>"""
    meta = {"title": "Utah Cities & Areas | Utah Gold Card Directory",
            "description": "Browse Utah Gold Card businesses by city: Ogden, Salt Lake City, Midvale, Provo, Layton, Park City, and St. George.",
            "canonical": f"{SITE_URL}/areas", "og_title": "Utah Gold Card Areas"}
    write_page("areas", meta, root, body, breadcrumbs=crumbs, active_nav="Areas")


def area_faqs(city_slug):
    area = AREAS[city_slug]
    biz = businesses_in_city(city_slug)
    cats_here = sorted(set(c for b in biz for c in b["categories"]), key=CATEGORY_ORDER.index)
    cat_names = ", ".join(CATEGORIES[c]["name"] for c in cats_here[:4])
    return [
        (f"What businesses are listed in {area['name']}, Utah?", f"Utah Gold Card lists {len(biz)} {area['name']} businesses across categories including {cat_names}."),
        (f"How do I get my {area['name']} business listed on Utah Gold Card?", f"Visit the Join page and submit your business — most {area['name']} businesses go live within one to two weeks."),
        (f"Are there current deals in {area['name']}?", f"Yes — check the deals tagged on {area['name']} business listings below, and visit the Deals page for the full list of current Utah Gold Card offers."),
    ]


def generate_area_page(city_slug):
    root = "../../"
    area = AREAS[city_slug]
    biz = businesses_in_city(city_slug)
    featured = [b for b in biz if b["featured"]] or biz
    restaurants = [b for b in biz if "restaurants" in b["categories"]]
    deals = [b for b in biz if b["offer"]]
    new_biz = [b for b in biz if "new-this-month" in b["tags"]]
    cats_here = sorted(set(c for b in biz for c in b["categories"]), key=CATEGORY_ORDER.index)
    combo_here = [c for c in cats_here if (city_slug, c) in CITY_CATEGORY_COMBOS]
    cat_chip_links = [(CATEGORIES[c]["name"], f"{root}areas/{city_slug}/{c}/" if (city_slug, c) in CITY_CATEGORY_COMBOS else f"{root}categories/{c}/") for c in cats_here]

    crumbs = [("Home", ""), ("Utah Businesses", "directory/"), (area["name"], None)]
    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap">
    <span class="kicker">{area['region']}</span>
    <h1>{esc(area['name'])}, Utah — Local Businesses on Utah Gold Card</h1>
    <p class="lede">{esc(area['blurb'])}</p>
    <div class="hero-simple-meta">
      <span class="meta-pill">{icon('layers')} {len(biz)} listed businesses</span>
      <span class="meta-pill">{icon('badge-percent')} {len(deals)} current deals</span>
    </div>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div><span class="kicker">Featured</span><h2>Featured Businesses in {esc(area['name'])}</h2></div>
      <a href="{root}directory/" class="link-arrow">View Full Directory {icon('arrow-right')}</a>
    </div>
    <div class="grid grid-3">{''.join(business_card(b, root) for b in featured)}</div>
  </div>
</section>
{"" if not restaurants else f'''<section class="section section--cream">
  <div class="wrap"><div class="section-head"><span class="kicker">Food</span><h2>Restaurants in {esc(area["name"])}</h2></div>
  <div class="grid grid-3">{"".join(business_card(b, root) for b in restaurants)}</div></div>
</section>'''}
{"" if not deals else f'''<section class="section section--dark">
  <div class="wrap"><div class="section-head"><span class="kicker">Deals</span><h2>Local Deals in {esc(area["name"])}</h2></div>
  <div class="grid grid-3">{"".join(deal_card(b, root) for b in deals)}</div></div>
</section>'''}
{"" if not new_biz else f'''<section class="section section--paper">
  <div class="wrap"><div class="section-head"><span class="kicker">New This Month</span><h2>New Businesses in {esc(area["name"])}</h2></div>
  <div class="grid grid-3">{"".join(business_card(b, root) for b in new_biz)}</div></div>
</section>'''}
<section class="section section--cream">
  <div class="wrap">
    <div class="section-head"><span class="kicker">Browse by Category</span><h2>Categories in {esc(area['name'])}</h2></div>
    {pill_links(cat_chip_links)}
  </div>
</section>
<section class="section section--paper">
  <div class="wrap two-col">
    <div>
      <span class="kicker">Local Search</span>
      <h2>Why {esc(area['name'])} Locals Use Utah Gold Card</h2>
      <p>{esc(area['blurb'])} Utah Gold Card gives {esc(area['name'])} residents one place to discover restaurants, shops, and services — and gives {esc(area['name'])} business owners a page-level SEO presence built specifically around this city.</p>
      {faq_block(area_faqs(city_slug))}
    </div>
    <div class="card" style="padding:26px;">
      <span class="kicker">Own a Business in {esc(area['name'])}?</span>
      <h3>Get Listed &amp; Get a 3-Page Mini-Site</h3>
      <p style="font-size:.9rem;">{COPY_THREE_PAGES}</p>
      <a href="{root}join/" class="btn btn-gold btn-block">Get My {esc(area['name'])} Business Listed</a>
      <div class="divider"></div>
      <span class="kicker">Nearby Areas</span>
      {related_list([(AREAS[a]["name"], f"{root}areas/{a}/") for a in AREA_ORDER if a != city_slug][:3])}
    </div>
  </div>
</section>"""
    meta = {"title": f"{area['name']} Utah Businesses | Restaurants, Shops & Services — Utah Gold Card",
            "description": f"Discover {area['name']}, Utah restaurants, shops, and services on Utah Gold Card. See featured businesses, local deals, and categories in {area['name']}.",
            "canonical": f"{SITE_URL}/areas/{city_slug}", "og_title": f"{area['name']}, Utah | Utah Gold Card",
            "og_description": area["blurb"]}
    jsonld_list = [jsonld_itemlist(f"Businesses in {area['name']}, Utah", biz), jsonld_breadcrumbs_from_crumbs(crumbs, root)]
    write_page(f"areas/{city_slug}", meta, root, body, breadcrumbs=crumbs, jsonld_list=jsonld_list)

# ------------------------------------------------------------------
# Category pages
# ------------------------------------------------------------------
def generate_categories_hub():
    root = "../"
    cards = "".join(category_card(c, root) for c in CATEGORY_ORDER)
    crumbs = [("Home", ""), ("Utah Businesses", "directory/"), ("Categories", None)]
    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap"><span class="kicker">Categories</span><h1>Browse Utah Gold Card Categories</h1>
  <p class="lede">From restaurants to home services, find Utah businesses by category.</p></div>
</section>
<section class="section section--paper">
  <div class="wrap"><div class="grid grid-5">{cards}</div></div>
</section>"""
    meta = {"title": "Utah Business Categories | Utah Gold Card Directory",
            "description": "Browse Utah Gold Card business categories: restaurants, Mexican food, halal-friendly, catering, salons, local shops, home services, family fun, antiques, and events & attractions.",
            "canonical": f"{SITE_URL}/categories", "og_title": "Utah Gold Card Categories"}
    write_page("categories", meta, root, body, breadcrumbs=crumbs, active_nav="Categories")


def category_faqs(cat_slug):
    cat = CATEGORIES[cat_slug]
    biz = businesses_in_category(cat_slug)
    cities_here = sorted(set(b["city"] for b in biz), key=AREA_ORDER.index)
    city_names = ", ".join(AREAS[c]["name"] for c in cities_here[:4])
    singular = CATEGORY_SINGULAR.get(cat["name"], cat["name"].lower())
    return [
        (f"Which Utah cities have {cat['name'].lower()} listed on Utah Gold Card?", f"Utah Gold Card currently lists {cat['name'].lower()} businesses in {city_names}."),
        (f"How do I list my {singular} business in this category?", f"Visit the Join page and select {cat['name']} as your category — most businesses go live within one to two weeks."),
        (f"Are there deals from {cat['name'].lower()} businesses?", f"Yes — check the offer badges on {cat['name'].lower()} listings below, or visit the Deals page for the full list of current offers."),
    ]


def generate_category_page(cat_slug):
    root = "../../"
    cat = CATEGORIES[cat_slug]
    biz = businesses_in_category(cat_slug)
    featured = [b for b in biz if b["featured"]] or biz
    deals = [b for b in biz if b["offer"]]
    cities_here = sorted(set(b["city"] for b in biz), key=AREA_ORDER.index)
    city_chip_links = [(AREAS[c]["name"], f"{root}areas/{c}/{cat_slug}/" if (c, cat_slug) in CITY_CATEGORY_COMBOS else f"{root}areas/{c}/") for c in cities_here]
    related_cats = [c for c in CATEGORY_ORDER if c != cat_slug][:4]

    crumbs = [("Home", ""), ("Utah Businesses", "directory/"), ("Categories", "categories/"), (cat["name"], None)]
    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap">
    <span class="kicker">Category</span>
    <h1>{esc(cat['name'])} Across Utah</h1>
    <p class="lede">{esc(cat['blurb'])}</p>
    <div class="hero-simple-meta"><span class="meta-pill">{icon('layers')} {len(biz)} listed businesses</span>
    <span class="meta-pill">{icon('map-pin')} {len(cities_here)} Utah cities</span></div>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div><span class="kicker">Featured</span><h2>Featured {esc(cat['name'])}</h2></div>
      <a href="{root}directory/" class="link-arrow">View Full Directory {icon('arrow-right')}</a>
    </div>
    <div class="grid grid-3">{''.join(business_card(b, root) for b in featured)}</div>
  </div>
</section>
{"" if not deals else f'''<section class="section section--dark">
  <div class="wrap"><div class="section-head"><span class="kicker">Deals</span><h2>{esc(cat["name"])} Offers</h2></div>
  <div class="grid grid-3">{"".join(deal_card(b, root) for b in deals)}</div></div>
</section>'''}
<section class="section section--cream">
  <div class="wrap">
    <div class="section-head"><span class="kicker">Browse by City</span><h2>Popular Areas for {esc(cat['name'])}</h2></div>
    {pill_links(city_chip_links)}
    <div class="divider"></div>
    <div class="section-head"><span class="kicker">Related Categories</span><h2 style="font-size:1.4rem;">You Might Also Browse</h2></div>
    {pill_links([(CATEGORIES[c]["name"], f"{root}categories/{c}/") for c in related_cats])}
  </div>
</section>
<section class="section section--paper">
  <div class="wrap two-col">
    <div>
      <span class="kicker">Local Search</span>
      <h2>Frequently Asked Questions</h2>
      {faq_block(category_faqs(cat_slug))}
    </div>
    <div class="card" style="padding:26px;">
      <span class="kicker">Own a {esc(CATEGORY_SINGULAR.get(cat['name'], cat['name']))} Business?</span>
      <h3>Get Listed in {esc(cat['name'])}</h3>
      <p style="font-size:.9rem;">{COPY_THREE_PAGES}</p>
      <a href="{root}join/" class="btn btn-gold btn-block">Get Listed in {esc(cat['name'])}</a>
    </div>
  </div>
</section>"""
    meta = {"title": f"{cat['name']} in Utah | Utah Gold Card",
            "description": f"Browse {cat['name'].lower()} across Utah on Utah Gold Card. {cat['blurb']}",
            "canonical": f"{SITE_URL}/categories/{cat_slug}", "og_title": f"{cat['name']} | Utah Gold Card",
            "og_description": cat["blurb"]}
    jsonld_list = [jsonld_itemlist(f"{cat['name']} in Utah", biz), jsonld_breadcrumbs_from_crumbs(crumbs, root)]
    write_page(f"categories/{cat_slug}", meta, root, body, breadcrumbs=crumbs, jsonld_list=jsonld_list)

# ------------------------------------------------------------------
# City + Category combo landing pages (e.g. /areas/midvale/restaurants/)
# ------------------------------------------------------------------
def generate_combo_page(city_slug, cat_slug):
    root = "../../../"
    area = AREAS[city_slug]
    cat = CATEGORIES[cat_slug]
    biz = businesses_in_city_category(city_slug, cat_slug)
    other_cat_same_city = [c for c in CATEGORY_ORDER if c != cat_slug and businesses_in_city_category(city_slug, c)]
    same_cat_other_cities = [b for b in businesses_in_category(cat_slug) if b["city"] != city_slug][:3]

    crumbs = [("Home", ""), ("Utah Businesses", "directory/"), (area["name"], f"areas/{city_slug}/"), (cat["name"], None)]
    sparse_note = ""
    if len(biz) <= 1:
        sparse_note = f"""<div class="pill-note" style="margin-bottom:24px;">{icon('spark')} {esc(area['name'])} is a growing part of the Utah Gold Card directory — more {esc(cat['name'].lower())} businesses are added every month.</div>"""

    body = f"""
<section class="hero-simple section--dark">
  <div class="wrap">
    <span class="kicker">{esc(area['name'])} &middot; {esc(cat['name'])}</span>
    <h1>{esc(cat['name'])} in {esc(area['name'])}, Utah</h1>
    <p class="lede">{esc(cat['blurb'])} Here's what's listed in {esc(area['name'])} right now.</p>
  </div>
</section>
<section class="section section--paper">
  <div class="wrap">
    {sparse_note}
    <div class="grid grid-3">{''.join(business_card(b, root) for b in biz)}</div>
  </div>
</section>
{"" if not same_cat_other_cities else f'''<section class="section section--cream">
  <div class="wrap"><div class="section-head"><span class="kicker">Nearby</span><h2>More {esc(cat["name"])} Near {esc(area["name"])}</h2></div>
  <div class="grid grid-3">{"".join(business_card(b, root) for b in same_cat_other_cities)}</div></div>
</section>'''}
<section class="section section--dark">
  <div class="wrap">
    <div class="section-head"><span class="kicker">Explore More of {esc(area['name'])}</span><h2>Other Categories in {esc(area['name'])}</h2></div>
    {pill_links([(CATEGORIES[c]["name"], f"{root}areas/{city_slug}/{c}/" if (city_slug, c) in CITY_CATEGORY_COMBOS else f"{root}areas/{city_slug}/") for c in other_cat_same_city] + [("All " + area["name"] + " Businesses", f"{root}areas/{city_slug}/")])}
  </div>
</section>
<section class="section section--paper">
  <div class="wrap two-col">
    <div>
      <span class="kicker">Local Search</span>
      <h2>Frequently Asked Questions</h2>
      {faq_block([
        (f"Are there {cat['name'].lower()} businesses in {area['name']}, Utah?", f"Yes — Utah Gold Card currently lists {len(biz)} {cat['name'].lower()} business{'es' if len(biz)!=1 else ''} in {area['name']}, with more added monthly."),
        (f"How do I get my {area['name']} {CATEGORY_SINGULAR.get(cat['name'], cat['name'].lower())} business listed?", f"Visit the Join page and select {cat['name']} as your category and {area['name']} as your city."),
      ])}
    </div>
    <div class="card" style="padding:26px;">
      <span class="kicker">Own a Business Here?</span>
      <h3>List Your {esc(area['name'])} {esc(CATEGORY_SINGULAR.get(cat['name'], cat['name']))} Business</h3>
      <p style="font-size:.9rem;">{COPY_THREE_PAGES}</p>
      <a href="{root}join/" class="btn btn-gold btn-block">Get Listed</a>
    </div>
  </div>
</section>"""
    meta = {"title": f"{cat['name']} in {area['name']}, Utah | Utah Gold Card",
            "description": f"Find {cat['name'].lower()} in {area['name']}, Utah on Utah Gold Card, plus nearby options and local deals.",
            "canonical": f"{SITE_URL}/areas/{city_slug}/{cat_slug}", "og_title": f"{cat['name']} in {area['name']} | Utah Gold Card",
            "og_description": f"{cat['name']} businesses in {area['name']}, Utah."}
    jsonld_list = [jsonld_itemlist(f"{cat['name']} in {area['name']}, Utah", biz), jsonld_breadcrumbs_from_crumbs(crumbs, root)]
    write_page(f"areas/{city_slug}/{cat_slug}", meta, root, body, breadcrumbs=crumbs, jsonld_list=jsonld_list)

# ------------------------------------------------------------------
# Sitemap + robots.txt
# ------------------------------------------------------------------
def generate_sitemap_and_robots():
    public_paths = ["", "directory", "food", "deals", "business-owners", "pricing",
                    "email-program", "loyalty", "advertise", "join", "areas", "categories"]
    for c in AREA_ORDER:
        public_paths.append(f"areas/{c}")
    for c in CATEGORY_ORDER:
        public_paths.append(f"categories/{c}")
    for city, cat in CITY_CATEGORY_COMBOS:
        public_paths.append(f"areas/{city}/{cat}")
    for b in BUSINESSES:
        public_paths.append(b["slug"])
        public_paths.append(f"{b['slug']}/offers")
        public_paths.append(f"{b['slug']}/menu")

    urls = []
    for p in public_paths:
        loc = f"{SITE_URL}/{p}" if p else f"{SITE_URL}/"
        priority = "1.0" if p == "" else ("0.9" if p in ("directory", "join", "pricing") or (p and "/" not in p and p in BUSINESS_BY_SLUG) else "0.7")
        urls.append(f"  <url><loc>{esc(loc)}</loc><lastmod>{TODAY}</lastmod><priority>{priority}</priority></url>")
    sitemap = ('<?xml version="1.0" encoding="UTF-8"?>\n'
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(urls) + "\n</urlset>\n")
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(sitemap)

    robots = f"""User-agent: *
Allow: /
Disallow: /admin-dashboard/
Disallow: /campaign-dashboard/
Disallow: /build/

Sitemap: {SITE_URL}/sitemap.xml
"""
    with open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8") as f:
        f.write(robots)
    return len(public_paths)


def main():
    generate_homepage()
    generate_directory_page()
    generate_food_page()
    generate_deals_page()
    generate_pricing_page()
    generate_business_owners_page()
    generate_email_program_page()
    generate_loyalty_page()
    generate_advertise_page()
    generate_join_page()
    generate_admin_dashboard()
    generate_campaign_dashboard()

    generate_areas_hub()
    for c in AREA_ORDER:
        generate_area_page(c)

    generate_categories_hub()
    for c in CATEGORY_ORDER:
        generate_category_page(c)

    for city, cat in CITY_CATEGORY_COMBOS:
        generate_combo_page(city, cat)

    for b in BUSINESSES:
        generate_business_main(b)
        generate_business_offers(b)
        generate_business_menu(b)

    n = generate_sitemap_and_robots()
    print(f"Generated site: 12 root pages, {len(AREA_ORDER)+1} area pages, {len(CATEGORY_ORDER)+1} category pages, "
          f"{len(CITY_CATEGORY_COMBOS)} combo pages, {len(BUSINESSES)*3} business pages. Sitemap: {n} URLs.")


if __name__ == "__main__":
    main()

"""
classify.py — best-effort mapping from raw CRM text (an industry label, SIC/NAICS
description, or company blurb) to one of the model's sectors, so a raw export can
self-classify before scoring.

    from classify import guess_sector
    guess_sector("Women's apparel & accessories retailer")   -> "Apparel & Accessories"
    guess_sector("Quick service restaurant / coffee")         -> "QSR / Coffee"
    guess_sector("NAICS 447110 gasoline station with c-store")-> "Convenience & Gas"

It is deliberately simple keyword matching — a triage aid, not magic. Anything it
can't place returns None so you can route those rows to manual review (or default
them). Value segment and sales channel still need your judgment; this only guesses
the sector, which is the field a raw industry code maps to most reliably.
"""

import csv
import os
import re
import sys

# Ordered (sector, keywords). First sector with a keyword hit wins, so put the
# more specific sectors earlier where terms overlap (e.g. "auto parts" before
# generic "auto"; "pharmacy" before "health").
RULES = [
    ("Drug & Pharmacy",       ["pharmacy", "drug store", "drugstore", "chemist", "naics 4461", "prescription"]),
    ("Convenience & Gas",     ["convenience", "c-store", "gas station", "gasoline", "fuel", "naics 447", "petrol"]),
    ("Auto Parts & Accessories", ["auto part", "car part", "aftermarket part", "auto accessor", "naics 4413", "tire retail"]),
    ("Automotive Service & Tires", ["auto service", "oil change", "tire service", "repair shop", "lube", "car wash", "naics 8111"]),
    ("Appliances",            ["appliance", "washer", "refrigerator", "hvac equipment", "naics 443141"]),
    ("Furniture & Home Furnishings", ["furniture", "home furnishing", "mattress", "sofa", "naics 4421", "decor store"]),
    ("Home Improvement & Hardware", ["hardware", "home improvement", "home center", "building material", "lumber", "naics 4441", "tools store"]),
    ("Office Supplies",       ["office supply", "office product", "stationery", "naics 4532"]),
    ("Books & Media",         ["book", "bookstore", "media store", "music store retail", "naics 451211"]),
    ("Music & Instruments",   ["musical instrument", "guitar", "instrument retail", "naics 451140"]),
    ("Craft & Hobby",         ["craft", "hobby", "art supply", "fabric store", "sewing", "naics 451120"]),
    ("Wine, Beer & Spirits",  ["wine", "beer", "spirits", "liquor", "alcohol", "naics 4453", "brewery retail"]),
    ("Baby & Kids",           ["baby", "infant", "children's", "kids apparel", "toddler", "juvenile"]),
    ("Florist & Gifts",       ["florist", "flower", "gift shop", "gift basket", "naics 4531"]),
    ("Casual Dining",         ["casual dining", "restaurant", "sit-down", "grill", "steakhouse", "bar & grill", "naics 7225"]),
    ("QSR / Coffee",          ["quick service", "qsr", "fast food", "coffee", "cafe", "café", "drive-thru", "naics 722513"]),
    ("Fitness & Gym",         ["fitness", "gym", "health club", "yoga", "pilates", "crossfit", "naics 713940"]),
    ("Digital Subscription / Streaming", ["streaming", "saas consumer", "subscription app", "video on demand", "music streaming", "digital media subscription"]),
    ("Hotel / Lodging",       ["hotel", "lodging", "resort", "motel", "hospitality", "vacation rental", "naics 7211"]),
    ("Airline / Travel",      ["airline", "airfare", "flights", "travel agency", "online travel", "cruise", "naics 4811", "tour operator"]),
    ("Pet Care",              ["pet", "veterinary retail", "pet food", "pet supply", "naics 453910"]),
    ("Beauty & Personal Care",["beauty", "cosmetic", "skincare", "makeup", "fragrance", "salon retail", "naics 4461201"]),
    ("Health & Supplements",  ["supplement", "vitamin", "nutrition", "wellness", "nutraceutical"]),
    ("Eyewear",               ["eyewear", "optical", "glasses", "sunglasses", "contact lens", "optometr"]),
    ("Jewelry & Watches",     ["jewelry", "jeweller", "watch", "diamond", "naics 4483"]),
    ("Footwear",              ["footwear", "shoe", "sneaker", "boots retail"]),
    ("Sports & Outdoor",      ["sporting goods", "outdoor", "athletic", "camping", "fishing", "cycling", "ski"]),
    ("Toys & Hobbies",        ["toy", "games retail", "board game", "collectible"]),
    ("Luggage & Travel",      ["luggage", "suitcase", "travel gear", "backpack retail"]),
    ("Consumer Electronics",  ["electronics", "computer", "laptop", "smartphone", "gadget", "consumer tech", "naics 443142"]),
    ("Grocery",               ["grocery", "supermarket", "food retail", "meal kit", "naics 4451"]),
    ("Apparel & Accessories", ["apparel", "clothing", "fashion", "accessories", "boutique clothing", "menswear", "womenswear", "naics 448"]),
    ("Home & Garden",         ["home goods", "garden", "kitchenware", "housewares", "bed & bath", "home decor"]),
    ("General Merchandise",   ["general merchandise", "department store", "discount store", "variety store", "big box", "marketplace", "dollar store", "warehouse club", "mass retail"]),
]


def guess_sector(text):
    """Return a sector name, or None if nothing matched."""
    if not text:
        return None
    t = text.lower()
    for sector, keywords in RULES:
        for kw in keywords:
            # Anchor to a word start (so "ota" won't match "totally") while
            # allowing suffixes (so "book" matches "books"/"bookstore").
            if re.search(r"\b" + re.escape(kw), t):
                return sector
    return None


def _cli():
    """Usage: python3 classify.py input.csv [text_column] > mapped.csv

    Reads a CSV, guesses a `guessed_sector` for each row from the given text
    column (default: 'industry'), and writes the augmented CSV to stdout.
    """
    if len(sys.argv) < 2:
        print(__doc__)
        return
    path = sys.argv[1]
    col = sys.argv[2] if len(sys.argv) > 2 else "industry"
    with open(path, newline="") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        return
    fields = list(rows[0].keys())
    if "guessed_sector" not in fields:
        fields.append("guessed_sector")
    w = csv.DictWriter(sys.stdout, fieldnames=fields)
    w.writeheader()
    hits = 0
    for r in rows:
        g = guess_sector(r.get(col, ""))
        r["guessed_sector"] = g or ""
        hits += bool(g)
        w.writerow(r)
    sys.stderr.write(f"Classified {hits}/{len(rows)} rows ({100*hits/len(rows):.0f}% matched)\n")


if __name__ == "__main__":
    _cli()

/* ============================================================
   U.S. GOLD CARD — Data Model
   States, cities, categories, tiers, deals, campaigns, and
   15 sample businesses with full page-level SEO objects.
   ============================================================ */

const SITE = {
  name: "U.S. Gold Card",
  domain: "https://usgoldcard.com",
  tagline: "Discover America's Local Restaurants, Shops, Services, Deals & Hidden Gems",
  promise: "Get found. Get leads. Get promoted. Without managing the technology yourself.",
  copy: {
    ownerPromise: "Most local businesses do not need another complicated marketing platform. They need a simple system that gets them found, captures interested customers, and keeps their business in front of local buyers. U.S. Gold Card does the setup, the pages, the local SEO structure, the directory placement, and the group campaigns for you.",
    sharedNetwork: "When one U.S. Gold Card business gets discovered, the whole network gets stronger. Every new restaurant, shop, service provider, offer, and email signup adds more local search value and more reasons for customers to come back.",
    pageLevelSeo: "Each paid U.S. Gold Card listing is built as its own search-friendly local business page. That means your business is not just buried in a directory. Your page receives its own title, description, URL, city/state/category structure, offer page, services or menu page, local content, and structured data.",
    emailProgram: "We collect emails across the network and send local, state, category, and national campaigns on behalf of participating businesses. Businesses can be included in promotions without having to write, design, or send the campaigns themselves.",
    earlyMarket: "At the beginning, a state may only have a small number of businesses. That is why every listing is built to stand on its own. As the directory grows, each business benefits from both its own page-level SEO and the increasing authority of the U.S. Gold Card network."
  }
};

/* ---------------- STATES ---------------- */
const STATES = [
  {
    slug: "utah", name: "Utah", abbrev: "UT", brand: "Utah Gold Card",
    tagline: "Discover Local Businesses, Deals & Hidden Gems Across Utah",
    businessCount: 128, subscriberCount: 4820, live: true, partnerOpen: false,
    heroBlurb: "From Salt Lake City taquerias to Ogden antique rows, Utah Gold Card is where Utahns find trusted local restaurants, shops, and services — each with its own search-friendly page.",
    seoIntro: "Utah Gold Card is the Utah network of the national U.S. Gold Card local business directory. Every participating Utah business receives its own SEO-built local business page — not a thin directory listing — organized by city and category so customers along the Wasatch Front and beyond can find restaurants, salons, home services, antiques, and local shops near them. As more Utah businesses join, the network's city pages, category pages, and this state page grow stronger together.",
    featuredCities: ["midvale", "ogden", "salt-lake-city"],
    featuredCategories: ["restaurants", "antiques", "home-services", "salons"]
  },
  {
    slug: "nebraska", name: "Nebraska", abbrev: "NE", brand: "Nebraska Gold Card",
    tagline: "Discover Local Businesses, Deals & Hidden Gems Across Nebraska",
    businessCount: 54, subscriberCount: 1930, live: true, partnerOpen: false,
    heroBlurb: "Omaha family favorites, Lincoln lunch spots, and the local pros Nebraskans trust — all on Nebraska Gold Card, each with its own local SEO page.",
    seoIntro: "Nebraska Gold Card brings the U.S. Gold Card model to the Cornhusker State. Each Nebraska business on the network gets a standalone, search-friendly local business page with its own offers page and menu or services page, placed inside Omaha, Lincoln, and other Nebraska city directories. Early Nebraska members benefit immediately from page-level SEO built to rank for their business name, city, and category — and the state network compounds that value as it grows.",
    featuredCities: ["omaha", "lincoln"],
    featuredCategories: ["restaurants", "home-services", "family-fun"]
  },
  {
    slug: "new-york", name: "New York", abbrev: "NY", brand: "New York Gold Card",
    tagline: "Discover Local Businesses, Deals & Hidden Gems Across New York",
    businessCount: 87, subscriberCount: 3610, live: true, partnerOpen: false,
    heroBlurb: "From Buffalo's Main Street to Brooklyn's dessert scene, New York Gold Card spotlights the local places New Yorkers actually love.",
    seoIntro: "New York Gold Card is the Empire State branch of the U.S. Gold Card network. From Buffalo florists to Brooklyn dessert bars, every participating New York business receives its own SEO-built mini-site inside the network — a main business page, an offers page, and a menu or services page — organized by city and category. That structure helps each business rank on its own while the New York directory grows around it.",
    featuredCities: ["buffalo", "brooklyn"],
    featuredCategories: ["restaurants", "local-shops", "salons"]
  },
  {
    slug: "florida", name: "Florida", abbrev: "FL", brand: "Florida Gold Card",
    tagline: "Discover Local Businesses, Deals & Hidden Gems Across Florida",
    businessCount: 96, subscriberCount: 4110, live: true, partnerOpen: false,
    heroBlurb: "Tampa smoothie bars, Orlando caterers, and the Sunshine State's best-kept local secrets — discover them all on Florida Gold Card.",
    seoIntro: "Florida Gold Card connects Florida customers with trusted local businesses across Tampa, Orlando, and beyond. Every paid Florida listing is built as its own local landing page with unique titles, descriptions, structured data, and internal links to its city, category, and state pages. Whether you run a smoothie bar or an event catering company, your Florida Gold Card page is designed to be found on its own — with the full U.S. Gold Card network behind it.",
    featuredCities: ["tampa", "orlando"],
    featuredCategories: ["restaurants", "catering", "family-fun"]
  },
  {
    slug: "texas", name: "Texas", abbrev: "TX", brand: "Texas Gold Card",
    tagline: "Discover Local Businesses, Deals & Hidden Gems Across Texas",
    businessCount: 142, subscriberCount: 5240, live: true, partnerOpen: false,
    heroBlurb: "Everything's bigger in Texas — including the local businesses on Texas Gold Card, from Austin home pros to Dallas family fun.",
    seoIntro: "Texas Gold Card is the Lone Star State's arm of the U.S. Gold Card national directory. Austin home repair pros, Dallas family entertainment, and local businesses across Texas each receive their own three-page SEO-built mini-site: a main business page, an offers page, and a services or menu page. Each page carries unique metadata, structured data, and city/category placement so Texas businesses get found by name, city, and service — even while the statewide directory is still growing.",
    featuredCities: ["austin", "dallas"],
    featuredCategories: ["home-services", "family-fun", "restaurants"]
  },
  {
    slug: "california", name: "California", abbrev: "CA", brand: "California Gold Card",
    tagline: "Discover Local Businesses, Deals & Hidden Gems Across California",
    businessCount: 0, subscriberCount: 0, live: false, partnerOpen: true,
    heroBlurb: "California Gold Card is launching soon. Founding businesses get premium placement as the network opens.",
    seoIntro: "California Gold Card is opening soon as part of the national U.S. Gold Card network. Founding California businesses receive their own SEO-built local pages from day one — built to rank on their own while the state directory grows.",
    featuredCities: [], featuredCategories: ["restaurants", "local-shops", "salons"]
  },
  {
    slug: "arizona", name: "Arizona", abbrev: "AZ", brand: "Arizona Gold Card",
    tagline: "Discover Local Businesses, Deals & Hidden Gems Across Arizona",
    businessCount: 12, subscriberCount: 480, live: true, partnerOpen: true,
    heroBlurb: "Arizona Gold Card is growing — Phoenix boutiques and desert-city favorites are already on board.",
    seoIntro: "Arizona Gold Card is one of the newest state networks on U.S. Gold Card. Phoenix boutiques and local shops are already live with their own SEO-built pages, and founding Arizona businesses in every category receive stand-alone local landing pages built to rank on their own while the state directory grows around them.",
    featuredCities: ["phoenix"], featuredCategories: ["local-shops", "restaurants"]
  },
  {
    slug: "nevada", name: "Nevada", abbrev: "NV", brand: "Nevada Gold Card",
    tagline: "Discover Local Businesses, Deals & Hidden Gems Across Nevada",
    businessCount: 0, subscriberCount: 0, live: false, partnerOpen: true,
    heroBlurb: "Nevada Gold Card is accepting founding businesses and a state launch partner.",
    seoIntro: "Nevada Gold Card is preparing to launch inside the U.S. Gold Card network. Founding Nevada businesses get first-mover placement with their own SEO-built pages, and the Nevada state partner territory is open.",
    featuredCities: [], featuredCategories: ["restaurants", "family-fun"]
  },
  {
    slug: "idaho", name: "Idaho", abbrev: "ID", brand: "Idaho Gold Card",
    tagline: "Discover Local Businesses, Deals & Hidden Gems Across Idaho",
    businessCount: 0, subscriberCount: 0, live: false, partnerOpen: true,
    heroBlurb: "Idaho Gold Card is coming soon — the territory is open for a founding state partner.",
    seoIntro: "Idaho Gold Card is an open territory in the U.S. Gold Card network. Founding Idaho businesses and a state launch partner can claim first-mover placement across Boise and beyond.",
    featuredCities: [], featuredCategories: ["home-services", "restaurants"]
  },
  {
    slug: "colorado", name: "Colorado", abbrev: "CO", brand: "Colorado Gold Card",
    tagline: "Discover Local Businesses, Deals & Hidden Gems Across Colorado",
    businessCount: 9, subscriberCount: 310, live: true, partnerOpen: true,
    heroBlurb: "Colorado Gold Card is live in Denver — fitness studios and front-range favorites are joining now.",
    seoIntro: "Colorado Gold Card is an early-stage state network on U.S. Gold Card, live in Denver with fitness and wellness businesses already on board. Every founding Colorado listing is built as its own search-friendly local page — designed to rank for its business name, city, and category from day one, with the growing national network behind it.",
    featuredCities: ["denver"], featuredCategories: ["fitness-wellness", "restaurants"]
  }
];

/* ---------------- CITIES ---------------- */
const CITIES = [
  {
    slug: "midvale", name: "Midvale", state: "utah", live: true,
    blurb: "A Salt Lake Valley crossroads with standout family-owned restaurants along State Street.",
    seoIntro: "Midvale, Utah sits in the heart of the Salt Lake Valley, and its State Street corridor is home to some of the valley's best family-owned food. The Midvale Gold Card directory gives each local business its own search-friendly page — so whether you're looking for halal-friendly Mexican food or a caterer for your next office lunch, you'll find a real local page, not a thin listing.",
    nearby: ["salt-lake-city", "ogden", "provo"],
    faqs: [
      { q: "What kinds of businesses are on the Midvale Gold Card directory?", a: "Midvale's directory currently features restaurants, with local shops and services joining as the Utah network grows. Every listed business gets its own SEO-built page with offers and menu or services details." },
      { q: "Are there local deals in Midvale?", a: "Yes — Midvale businesses publish real offers on their Gold Card offer pages, like catering discounts and family dinner specials. Check the Deals page and filter to Midvale." },
      { q: "How does a Midvale business get listed?", a: "Start on the Join page. We build your page, your local SEO structure, your offer page, and your placement in the Midvale and Utah directories for you." }
    ]
  },
  {
    slug: "ogden", name: "Ogden", state: "utah", live: true,
    blurb: "Historic 25th Street charm, antique treasures, great coffee, and trusted local trades.",
    seoIntro: "Ogden, Utah blends railroad-era history with a thriving local scene — antique shops near Historic 25th Street, independent coffee houses, and home-service pros who keep Weber County running. The Ogden Gold Card directory gives each of these businesses its own stand-alone local SEO page, organized by category so Ogden customers can find them by name, service, or neighborhood.",
    nearby: ["salt-lake-city", "midvale", "provo"],
    faqs: [
      { q: "What is the Ogden Gold Card directory?", a: "It's the Ogden section of Utah Gold Card, part of the national U.S. Gold Card network. Each Ogden business gets its own SEO-built page, offers page, and services or showcase page." },
      { q: "Which categories are strongest in Ogden right now?", a: "Ogden currently features coffee and breakfast, antiques and specialty retail, and home services — with more categories opening as businesses join." },
      { q: "Can an Ogden business be featured?", a: "Yes. Premium listings and the $25/month Featured Placement Ad earn priority spots on the Ogden city page, Utah state page, and category pages." }
    ]
  },
  {
    slug: "salt-lake-city", name: "Salt Lake City", state: "utah", live: true,
    blurb: "Utah's capital — salons, studios, and neighborhood favorites from Sugar House to Downtown.",
    seoIntro: "Salt Lake City is Utah's largest market, and its Gold Card directory highlights the neighborhood businesses locals rely on — from 9th & 9th salons to downtown services. Every Salt Lake City listing is built as its own local landing page with unique metadata, structured data, and internal links, so each business can rank for its name, neighborhood, and category.",
    nearby: ["midvale", "ogden", "provo"],
    faqs: [
      { q: "How is Salt Lake City organized on Gold Card?", a: "Businesses are placed by category — salons, restaurants, services, and shops — and each gets its own three-page mini-site inside the Salt Lake City directory." },
      { q: "Do Salt Lake City businesses get email promotion?", a: "Yes. Utah Gold Card subscribers receive local campaigns like 'Utah Family Dinner Picks' that feature participating Salt Lake City businesses." }
    ]
  },
  {
    slug: "provo", name: "Provo", state: "utah", live: false,
    blurb: "Opening soon — founding Provo businesses get first placement.",
    seoIntro: "The Provo Gold Card directory is opening soon as part of Utah Gold Card. Founding Provo businesses receive their own SEO-built pages with first-mover placement in the city directory.",
    nearby: ["midvale", "salt-lake-city", "ogden"], faqs: []
  },
  {
    slug: "omaha", name: "Omaha", state: "nebraska", live: true,
    blurb: "Nebraska's big city with small-town loyalty — family pizza nights and neighborhood pros.",
    seoIntro: "Omaha is Nebraska's largest city, and its Gold Card directory is built around the places Omaha families actually go — neighborhood pizza shops, trusted service companies, and local favorites from Benson to West Omaha. Each Omaha business gets its own search-friendly page, offers page, and menu or services page, placed inside the Omaha and Nebraska directories.",
    nearby: ["lincoln", "bellevue"],
    faqs: [
      { q: "What can I find on the Omaha Gold Card directory?", a: "Family restaurants, home services, and local businesses across Omaha — each with a real local page including hours, offers, menus or services, and directions." },
      { q: "Does Omaha have its own email campaigns?", a: "Yes. 'Omaha Local Deals' is a recurring campaign sent to Omaha-area subscribers featuring participating businesses and their current offers." },
      { q: "How do I list my Omaha business?", a: "Use the Join page. Plans start at $65/month and include your page build, local SEO structure, and Omaha directory placement." }
    ]
  },
  {
    slug: "lincoln", name: "Lincoln", state: "nebraska", live: true,
    blurb: "The capital city's fresh, fast, and healthy side — plus Husker-town local staples.",
    seoIntro: "Lincoln, Nebraska pairs a college-town energy with loyal local customers. The Lincoln Gold Card directory features the city's healthy-eats scene and growing roster of local businesses, each with a stand-alone SEO page built to rank for its name, category, and neighborhood — from the Haymarket to south Lincoln.",
    nearby: ["omaha", "bellevue"],
    faqs: [
      { q: "What's featured in Lincoln right now?", a: "Lincoln's directory currently highlights healthy food, with new categories opening as Nebraska Gold Card grows. Every listing is a full local page, not a thin card." },
      { q: "Can Lincoln businesses join campaigns?", a: "Yes — Lincoln businesses are included in Nebraska Gold Card email campaigns and seasonal statewide promotions." }
    ]
  },
  {
    slug: "bellevue", name: "Bellevue", state: "nebraska", live: false,
    blurb: "Opening soon — Bellevue businesses can claim founding spots now.",
    seoIntro: "The Bellevue Gold Card directory is opening soon within Nebraska Gold Card. Founding Bellevue businesses receive first-mover placement and their own SEO-built pages.",
    nearby: ["omaha", "lincoln"], faqs: []
  },
  {
    slug: "buffalo", name: "Buffalo", state: "new-york", live: true,
    blurb: "The City of Good Neighbors — Main Street shops, florists, and hometown pride.",
    seoIntro: "Buffalo, New York is a city of neighborhoods, and its Gold Card directory celebrates the Main Street businesses that make it the City of Good Neighbors — florists, gift shops, and local stalwarts from Elmwood Village to Hertel Avenue. Each Buffalo listing is its own SEO-built local page with unique metadata and structured data, placed in the Buffalo and New York directories.",
    nearby: ["brooklyn", "rochester"],
    faqs: [
      { q: "What kinds of Buffalo businesses are listed?", a: "Flowers and gifts lead the Buffalo directory today, with restaurants, salons, and services joining as New York Gold Card grows across Western New York." },
      { q: "Do Buffalo businesses get their own pages?", a: "Yes — every paid Buffalo listing is a three-page mini-site: a main business page, an offers page, and a services or showcase page, each with unique SEO." }
    ]
  },
  {
    slug: "brooklyn", name: "Brooklyn", state: "new-york", live: true,
    blurb: "Date-night desserts, borough icons, and blocks full of hidden gems.",
    seoIntro: "Brooklyn's food and small-business scene needs no introduction — but individual Brooklyn businesses still need to be found. The Brooklyn Gold Card directory gives each participating business its own local SEO page built to rank for its name, neighborhood, and specialty, from Williamsburg dessert bars to Park Slope shops, backed by the New York Gold Card network.",
    nearby: ["buffalo", "rochester"],
    faqs: [
      { q: "How does Gold Card help a Brooklyn business stand out?", a: "Brooklyn is crowded online. A Gold Card page gives your business its own titled, structured, internally-linked local page — plus offer promotion and email campaign inclusion — without you managing any technology." },
      { q: "What's featured in Brooklyn now?", a: "Desserts and date-night spots lead the Brooklyn directory, with new categories opening as the New York network grows." }
    ]
  },
  {
    slug: "rochester", name: "Rochester", state: "new-york", live: false,
    blurb: "Opening soon — Rochester founding businesses get first placement.",
    seoIntro: "The Rochester Gold Card directory is opening soon within New York Gold Card. Founding Rochester businesses receive first-mover placement and stand-alone SEO pages.",
    nearby: ["buffalo", "brooklyn"], faqs: []
  },
  {
    slug: "austin", name: "Austin", state: "texas", live: true,
    blurb: "Keep Austin local — trusted home pros and neighborhood favorites across the metro.",
    seoIntro: "Austin, Texas grows fast — and Austin homeowners need pros they can trust. The Austin Gold Card directory features vetted local home services and neighborhood businesses, each with its own SEO-built page covering services, service areas, and current offers, placed inside the Austin and Texas Gold Card directories.",
    nearby: ["dallas", "fort-worth"],
    faqs: [
      { q: "What's on the Austin Gold Card directory?", a: "Home services lead the Austin directory today — repair, maintenance, and improvement pros — with restaurants and shops joining as Texas Gold Card expands." },
      { q: "How do Austin service companies benefit?", a: "Service businesses get a services page listing every job type they handle, a lead form on every page, and placement in Austin home-services searches — built and managed for them." }
    ]
  },
  {
    slug: "dallas", name: "Dallas", state: "texas", live: true,
    blurb: "Big-city family fun and local businesses across the Metroplex.",
    seoIntro: "Dallas families are always looking for the next great local spot — and the Dallas Gold Card directory helps them find it. From indoor family entertainment to neighborhood services, each Dallas business gets a stand-alone local SEO page with structured data, offers, and city/category placement inside the Texas Gold Card network.",
    nearby: ["austin", "fort-worth"],
    faqs: [
      { q: "What's featured in Dallas?", a: "Family fun leads the Dallas directory — kids' entertainment and family outings — with restaurants, services, and shops joining as the network grows." },
      { q: "Can Dallas businesses run birthday offers?", a: "Yes. Birthday club signups are built into Gold Card pages, and Dallas family businesses are natural fits for birthday campaigns." }
    ]
  },
  {
    slug: "fort-worth", name: "Fort Worth", state: "texas", live: false,
    blurb: "Opening soon — Fort Worth founding businesses get first placement.",
    seoIntro: "The Fort Worth Gold Card directory is opening soon within Texas Gold Card. Founding Fort Worth businesses receive first-mover placement and their own SEO-built pages.",
    nearby: ["dallas", "austin"], faqs: []
  },
  {
    slug: "tampa", name: "Tampa", state: "florida", live: true,
    blurb: "Sunshine, smoothies, and the local spots Tampa Bay runs on.",
    seoIntro: "Tampa's health-conscious, outdoor lifestyle powers a strong local scene — and the Tampa Gold Card directory puts it on the map. Each Tampa Bay business gets its own SEO-built page with unique titles, structured data, and internal links, placed in the Tampa and Florida Gold Card directories so locals and visitors can find it by name, neighborhood, or craving.",
    nearby: ["orlando", "st-petersburg"],
    faqs: [
      { q: "What's on the Tampa directory today?", a: "Healthy drinks and eats lead Tampa's directory, with restaurants, services, and shops joining as Florida Gold Card grows across the bay area." },
      { q: "How do Tampa businesses get promoted?", a: "Through their own offer pages, the Florida deals feed, and email campaigns sent to Florida Gold Card subscribers — all built and sent for them." }
    ]
  },
  {
    slug: "orlando", name: "Orlando", state: "florida", live: true,
    blurb: "Beyond the parks — the caterers, planners, and local pros Orlando trusts.",
    seoIntro: "Orlando is more than theme parks — it's a major events town with a deep bench of local pros. The Orlando Gold Card directory features caterers, event specialists, and local businesses, each with a stand-alone SEO page built to rank for its services and service area, backed by the Florida Gold Card network.",
    nearby: ["tampa", "st-petersburg"],
    faqs: [
      { q: "Who should look at the Orlando directory?", a: "Anyone planning an event, office lunch, or celebration in Central Florida — plus locals looking for trusted everyday businesses. Each listing includes services, offers, and direct contact options." },
      { q: "Do Orlando caterers get special placement?", a: "Catering is a featured Orlando category, and catering businesses appear in campaigns like 'Catering for Office Lunches' sent to Florida subscribers." }
    ]
  },
  {
    slug: "st-petersburg", name: "St. Petersburg", state: "florida", live: false,
    blurb: "Opening soon — St. Pete founding businesses get first placement.",
    seoIntro: "The St. Petersburg Gold Card directory is opening soon within Florida Gold Card. Founding St. Pete businesses receive first-mover placement and stand-alone SEO pages.",
    nearby: ["tampa", "orlando"], faqs: []
  },
  {
    slug: "phoenix", name: "Phoenix", state: "arizona", live: true,
    blurb: "Desert-modern boutiques and the local makers Phoenix shops first.",
    seoIntro: "Phoenix's local retail scene is having a moment — desert-modern boutiques, maker markets, and neighborhood shops across the Valley. The Phoenix Gold Card directory gives each of these businesses its own SEO-built local page inside the young-but-growing Arizona Gold Card network, where founding businesses enjoy first-mover visibility.",
    nearby: ["scottsdale"],
    faqs: [
      { q: "Is Arizona Gold Card new?", a: "Yes — Arizona is one of the newest state networks. That's an advantage for founding businesses: your page is built to rank on its own while the directory grows around it." },
      { q: "What's featured in Phoenix?", a: "Local shops and boutiques lead the Phoenix directory, with restaurants and services opening next." }
    ]
  },
  {
    slug: "scottsdale", name: "Scottsdale", state: "arizona", live: false,
    blurb: "Opening soon — Scottsdale founding businesses get first placement.",
    seoIntro: "The Scottsdale Gold Card directory is opening soon within Arizona Gold Card. Founding Scottsdale businesses receive first-mover placement and stand-alone SEO pages.",
    nearby: ["phoenix"], faqs: []
  },
  {
    slug: "denver", name: "Denver", state: "colorado", live: true,
    blurb: "Mile-high wellness, neighborhood studios, and front-range favorites.",
    seoIntro: "Denver's active, wellness-forward culture drives its local economy — and the Denver Gold Card directory reflects it. Fitness studios and front-range favorites each get their own SEO-built local page inside the early-stage Colorado Gold Card network, where founding businesses get outsized visibility as the directory grows.",
    nearby: ["boulder"],
    faqs: [
      { q: "What's on the Denver directory?", a: "Fitness and wellness lead Denver's directory today, with restaurants, shops, and services opening as Colorado Gold Card expands." },
      { q: "Why join early in Denver?", a: "Founding businesses get first-mover category placement, homepage rotation as available, and a page built to rank on its own — before competitors arrive." }
    ]
  },
  {
    slug: "boulder", name: "Boulder", state: "colorado", live: false,
    blurb: "Opening soon — Boulder founding businesses get first placement.",
    seoIntro: "The Boulder Gold Card directory is opening soon within Colorado Gold Card. Founding Boulder businesses receive first-mover placement and stand-alone SEO pages.",
    nearby: ["denver"], faqs: []
  }
];

/* ---------------- CATEGORIES ---------------- */
const CATEGORIES = [
  {
    slug: "restaurants", name: "Restaurants", icon: "🍽️",
    blurb: "Family-owned kitchens, hidden gems, and neighborhood favorites.",
    seoIntro: "Restaurants are the heart of the U.S. Gold Card network. Every restaurant on the network gets its own SEO-built page plus a dedicated menu page and offers page — built to rank for the restaurant's name, cuisine, city, and dishes. Browse by state and city to find family-owned kitchens, halal-friendly options, date-night spots, and hometown favorites near you.",
    related: ["catering", "local-shops", "family-fun"]
  },
  {
    slug: "salons", name: "Salons & Beauty", icon: "💇",
    blurb: "Salons, stylists, and beauty studios your neighbors trust.",
    seoIntro: "Salons and beauty studios on U.S. Gold Card get more than a listing — each receives its own local landing page, a services page listing every treatment, and an offers page for new-client specials. Pages are structured to rank for the salon's name, services, and city, and salons are natural fits for the network's birthday club and loyalty campaigns.",
    related: ["fitness-wellness", "local-shops", "professional-services"]
  },
  {
    slug: "home-services", name: "Home Services", icon: "🔧",
    blurb: "Repair, maintenance, and improvement pros with real local pages.",
    seoIntro: "Home services businesses live and die by local search. Every Gold Card home services listing includes a full services page covering each job type, a lead form on every page, and structured data that tells search engines exactly what the company does and where. Handymen, remodelers, and repair pros get found by service and city — without running their own website.",
    related: ["professional-services", "local-shops", "catering"]
  },
  {
    slug: "local-shops", name: "Local Shops", icon: "🛍️",
    blurb: "Boutiques, gift shops, markets, and Main Street retail.",
    seoIntro: "Local shops give every downtown its character — and U.S. Gold Card gives every shop its own search-friendly page. Boutiques, gift shops, florists, and markets get showcase pages for their products, offer pages for promotions, and placement in city and state shopping guides that bring foot traffic back to Main Street.",
    related: ["antiques", "restaurants", "family-fun"]
  },
  {
    slug: "antiques", name: "Antiques & Specialty", icon: "🕰️",
    blurb: "Antique dealers, collectors' shops, and one-of-a-kind finds.",
    seoIntro: "Antique shops and specialty retailers thrive on discovery — customers who didn't know they were looking until they found you. Gold Card antique listings include showcase pages for signature inventory, unique local SEO for collector search terms, and placement in city guides that put your shop on the map for locals and travelers alike.",
    related: ["local-shops", "restaurants", "family-fun"]
  },
  {
    slug: "family-fun", name: "Family Fun", icon: "🎡",
    blurb: "Kid-approved outings, entertainment, and birthday-party favorites.",
    seoIntro: "Family fun businesses — play centers, entertainment venues, and birthday-party favorites — get Gold Card pages built for how parents actually search: by city, by age range, and by occasion. Each listing includes an offers page for family deals and birthday packages, plus inclusion in family-focused email campaigns.",
    related: ["restaurants", "fitness-wellness", "local-shops"]
  },
  {
    slug: "catering", name: "Catering & Events", icon: "🥘",
    blurb: "Office lunches, weddings, parties, and full-service event pros.",
    seoIntro: "Catering companies win on being found at the moment of planning. Gold Card catering listings include a services page detailing menus and event types, a quote-request lead form on every page, and inclusion in campaigns like 'Catering for Office Lunches' sent to subscribers across the network.",
    related: ["restaurants", "professional-services", "family-fun"]
  },
  {
    slug: "professional-services", name: "Professional Services", icon: "💼",
    blurb: "Accountants, agencies, and the pros who keep local business running.",
    seoIntro: "Professional service providers — from bookkeepers to consultants — get Gold Card pages structured for trust: clear service descriptions, credentials, service areas, and direct contact options, all wrapped in unique local SEO that helps clients find the right pro in their city.",
    related: ["home-services", "salons", "catering"]
  },
  {
    slug: "fitness-wellness", name: "Fitness & Wellness", icon: "🧘",
    blurb: "Studios, gyms, and wellness spaces for every level.",
    seoIntro: "Fitness studios and wellness businesses grow on first visits — and Gold Card pages are built to earn them. Each listing includes a class or services page, intro-offer promotion on a dedicated offers page, and placement in city wellness guides and new-member campaigns across the network.",
    related: ["salons", "family-fun", "restaurants"]
  }
];

/* ---------------- PRICING TIERS ---------------- */
const TIERS = [
  {
    id: "starter", name: "Starter Gold Listing", price: "$65", period: "/month", badge: "GOLD",
    bestFor: "Small businesses that need affordable visibility.",
    features: [
      "Business profile page", "State/city/category placement", "Contact info & click-to-call",
      "Directions", "Lead form", "Basic offer", "Email signup",
      "Basic local SEO fields", "Included in selected local campaigns when available"
    ]
  },
  {
    id: "gold", name: "Gold Mini-Site", price: "$95", period: "/month", badge: "GOLD", popular: true,
    bestFor: "Most local businesses.",
    features: [
      "Three-page mini-site", "Main business profile page", "Offer / lead-capture page",
      "Menu / services / showcase page", "Photo gallery", "City/category placement",
      "Homepage rotation when available", "Email campaign inclusion", "Birthday club signup",
      "Local SEO metadata", "Structured data", "Internal links", "Basic reporting"
    ]
  },
  {
    id: "premium", name: "Premium Gold Mini-Site", price: "$195", period: "/month", badge: "PREMIUM",
    bestFor: "Businesses that want more visibility and stronger promotion.",
    features: [
      "Premium mini-site layout", "Featured badge", "Priority category placement",
      "Priority city placement", "More homepage rotation", "Dedicated campaign landing page",
      "Monthly offer update", "Enhanced gallery", "More advanced page-level SEO",
      "Analytics summary", "Custom CTA sections", "More campaign inclusion"
    ]
  },
  {
    id: "platinum", name: "Platinum Upgrade", price: "Custom", period: "", badge: "PLATINUM", future: true,
    bestFor: "Businesses that want maximum visibility.",
    features: [
      "Premium sponsorship placement", "Advanced SEO expansion", "More pages",
      "Custom campaigns", "Advanced email/SMS automations", "Advanced loyalty offers",
      "Custom domain website option", "Dedicated landing pages", "Video/visual upgrades",
      "More reporting", "Statewide or category sponsorship options"
    ]
  },
  {
    id: "custom-site", name: "Custom Website", price: "Custom", period: " pricing", badge: "CUSTOM",
    bestFor: "Businesses that need a full standalone site.",
    features: [
      "Full standalone website", "Custom domain", "Advanced SEO",
      "Booking, ordering, or ecommerce", "Appointment & quote forms",
      "Catering forms or custom integrations"
    ]
  },
  {
    id: "featured-ad", name: "Featured Placement Ad", price: "$25", period: "/month add-on", badge: "ADD-ON", addon: true,
    bestFor: "Any tier that wants extra placement.",
    features: [
      "State homepage feature slot", "City page feature slot", "Category page feature slot",
      "Deal spotlight", "Campaign highlight when relevant"
    ]
  }
];

/* Comparison table: feature → availability per tier (starter, gold, premium, platinum) */
const COMPARISON = [
  ["Business profile", true, true, true, true],
  ["3-page mini-site", false, true, true, true],
  ["Offer page", "Basic offer", true, true, true],
  ["Services / menu page", false, true, true, true],
  ["Photo gallery", false, true, "Enhanced", true],
  ["Click-to-call", true, true, true, true],
  ["Directions", true, true, true, true],
  ["Lead form", true, true, true, true],
  ["Email signup", true, true, true, true],
  ["Birthday club", false, true, true, true],
  ["State placement", true, true, "Priority", "Sponsorship"],
  ["City placement", true, true, "Priority", "Sponsorship"],
  ["Category placement", true, true, "Priority", "Sponsorship"],
  ["Homepage rotation", false, "When available", "More rotation", "Maximum"],
  ["Campaign inclusion", "Selected local", true, "More campaigns", "Custom campaigns"],
  ["Featured badge", false, false, true, true],
  ["Advanced SEO", "Basic fields", "Full metadata", true, "Expanded"],
  ["Structured data", false, true, true, true],
  ["Analytics", false, "Basic reporting", "Summary", "Advanced"],
  ["Custom campaigns", false, false, "Landing page", true],
  ["Platinum sponsorship", false, false, false, true]
];

const TIER_LABEL = { starter: "Starter Gold", gold: "Gold Mini-Site", premium: "Premium Gold", platinum: "Platinum" };
const TIER_PRICE = { starter: 65, gold: 95, premium: 195, platinum: 395 };

/* ---------------- BUSINESSES ---------------- */
const BUSINESSES = [
  {
    id: 1, slug: "fajita-grill", name: "Fajita Grill",
    state: "utah", city: "midvale", category: "restaurants",
    subcategory: "Mexican · Mediterranean · Halal-Friendly · Catering",
    address: "7680 S State St, Midvale, UT 84047", phone: "(801) 555-0147",
    website: "fajitagrillutah.com",
    shortDescription: "Sizzling Mexican fajitas and Mediterranean plates from two halal-friendly kitchens under one roof in Midvale.",
    longDescription: "Fajita Grill is Midvale's two-kitchens-in-one local favorite: a full Mexican grill turning out sizzling fajitas, street tacos, and loaded burritos, and a Mediterranean kitchen serving gyros, shawarma plates, and fresh-baked pitas — with halal-friendly options across both menus. Family-run and located right on State Street, Fajita Grill has become the Salt Lake Valley's answer for groups that can never agree on one cuisine. Generous portions, scratch salsas, hand-stacked shawarma, and a catering program that handles everything from office lunches to 200-person events.",
    tags: ["Mexican", "Mediterranean", "Halal-Friendly", "Catering", "Family Dinner", "Lunch Specials"],
    image: { hue: 14, emoji: "🌮", label: "Sizzling fajita skillet" },
    gallery: [
      { alt: "Sizzling steak fajitas served on a cast-iron skillet at Fajita Grill in Midvale, Utah", label: "Steak fajitas, still sizzling" },
      { alt: "Hand-stacked chicken shawarma carved to order at Fajita Grill's Mediterranean kitchen", label: "Shawarma carved to order" },
      { alt: "Fresh table-side salsa trio with house-fried chips at Fajita Grill Midvale", label: "Scratch salsa trio" },
      { alt: "Catering spread of fajita bar trays prepared by Fajita Grill for a Salt Lake Valley office lunch", label: "Office fajita bar" },
      { alt: "Family dinner platter with gyros, rice, and grilled vegetables at Fajita Grill", label: "Family gyro platter" },
      { alt: "Fajita Grill storefront on State Street in Midvale, Utah", label: "On State Street, Midvale" }
    ],
    offer: {
      title: "Free Queso + Chips with Any Family Fajita Platter",
      details: "Show your Gold Card offer at checkout and get free queso and chips with any family fajita platter (feeds 4–6). Dine-in or takeout.",
      secondary: "10% off first catering order of $250+ — mention Gold Card when booking.",
      type: "restaurant", tag: "Family Offer"
    },
    featured: true, homepageRotation: true, premiumAd: true,
    tier: "premium", platinumEligible: true,
    hours: ["Mon–Thu 11:00 AM – 9:00 PM", "Fri–Sat 11:00 AM – 10:00 PM", "Sun Closed"],
    highlights: [
      "Two kitchens: full Mexican grill + Mediterranean menu",
      "Halal-friendly options across both menus",
      "Catering for offices, events, and parties up to 200",
      "Scratch salsas and fresh-baked pitas daily",
      "Family platters that feed 4–6"
    ],
    menuLabel: "Menu",
    menuItems: [
      { name: "Sizzling Steak Fajitas", desc: "Marinated flank steak, charred peppers and onions, warm tortillas, all the fixings.", price: "$16.95" },
      { name: "Chicken Shawarma Plate", desc: "Hand-stacked, carved to order, over saffron rice with garlic sauce and fresh pita.", price: "$14.50" },
      { name: "Street Taco Trio", desc: "Three corn tortillas, choice of asada, pollo, or veggie, onion-cilantro, salsa verde.", price: "$10.95" },
      { name: "Beef Gyro Wrap", desc: "Seasoned beef-lamb blend, tzatziki, tomato, onion in a warm pita.", price: "$11.50" },
      { name: "Family Fajita Platter", desc: "Feeds 4–6. Mix of steak and chicken fajitas with rice, beans, and tortillas.", price: "$54.95" },
      { name: "Falafel Bowl", desc: "Crispy falafel over rice and greens with hummus, pickled onions, tahini.", price: "$12.50" },
      { name: "Loaded Carne Asada Burrito", desc: "Grilled steak, rice, beans, queso, guac — a two-hands situation.", price: "$13.95" },
      { name: "Catering Fajita Bar (per person)", desc: "Build-your-own fajita bar with proteins, tortillas, and full salsa spread. 10-person minimum.", price: "$13.95/pp" }
    ],
    emailSignupCount: 412, leadsThisMonth: 38,
    seo: {
      title: "Fajita Grill — Mexican & Mediterranean Restaurant in Midvale, UT | Utah Gold Card",
      description: "Fajita Grill serves sizzling fajitas, shawarma, tacos, and gyros from two halal-friendly kitchens on State Street in Midvale, Utah. See the menu, current offers, hours, and catering options.",
      h1: "Fajita Grill — Mexican & Mediterranean, Halal-Friendly, in Midvale, Utah",
      localKeywords: ["fajitas Midvale UT", "halal Mexican food Salt Lake Valley", "shawarma near Midvale", "Mexican restaurant State Street Midvale", "halal catering Salt Lake City", "Mediterranean food Midvale Utah"],
      faqs: [
        { q: "Is Fajita Grill halal?", a: "Fajita Grill offers halal-friendly options across both its Mexican and Mediterranean menus. Ask the team about specific dishes when ordering." },
        { q: "Does Fajita Grill do catering?", a: "Yes — Fajita Grill caters office lunches, parties, and events up to 200 people, including build-your-own fajita bars and Mediterranean spreads. First-time catering orders of $250+ get 10% off with Gold Card." },
        { q: "Where is Fajita Grill located?", a: "Fajita Grill is at 7680 S State St in Midvale, Utah — on the State Street corridor, minutes from Sandy, Murray, and the rest of the Salt Lake Valley." },
        { q: "What is Fajita Grill best known for?", a: "The sizzling fajita skillets and hand-stacked shawarma — plus family platters that feed 4–6 and satisfy both the taco side and the gyro side of the table." }
      ],
      schemaType: "Restaurant",
      canonicalUrl: "https://usgoldcard.com/utah/midvale/fajita-grill",
      ogTitle: "Fajita Grill · Midvale, UT — Sizzling Fajitas & Shawarma, Halal-Friendly",
      ogDescription: "Two kitchens, one roof: Mexican fajitas and Mediterranean shawarma in Midvale, Utah. Family platters, catering up to 200, and Gold Card offers.",
      imageAltText: "Sizzling steak fajita skillet at Fajita Grill, a halal-friendly Mexican and Mediterranean restaurant in Midvale, Utah",
      stateSeoIntro: "Part of Utah Gold Card — Utah's network of SEO-built local business pages.",
      citySeoIntro: "One of Midvale's standout State Street restaurants, serving the whole Salt Lake Valley.",
      categorySeoIntro: "A featured Utah Gold Card restaurant: two cuisines, halal-friendly, catering-ready.",
      nearbyCities: ["salt-lake-city", "ogden", "provo"],
      relatedCategories: ["catering", "family-fun"],
      primarySearchIntent: "fajita grill midvale",
      secondarySearchIntents: ["halal mexican food near me", "shawarma midvale utah", "fajitas salt lake valley", "halal catering utah"],
      offers: {
        title: "Fajita Grill Offers & Deals — Free Queso, Catering Discount | Midvale, UT",
        description: "Current Fajita Grill deals in Midvale: free queso and chips with family fajita platters, plus 10% off first catering orders of $250+. Claim your Utah Gold Card offer.",
        h1: "Fajita Grill Deals & Offers in Midvale, Utah",
        intro: "Fajita Grill runs real, usable offers through Utah Gold Card — no coupon-clipping required. Show the offer at checkout or mention Gold Card when you book catering. Offers update monthly, so join the email list below to catch the next one."
      },
      menu: {
        title: "Fajita Grill Menu — Fajitas, Shawarma, Tacos & Catering | Midvale, UT",
        description: "Browse the Fajita Grill menu in Midvale, Utah: sizzling steak fajitas, chicken shawarma plates, street tacos, gyro wraps, family platters, and build-your-own catering fajita bars.",
        h1: "Fajita Grill Menu — Midvale, Utah",
        intro: "Two kitchens means one menu that ends every 'where should we eat' debate. The Mexican side brings sizzling fajitas, street tacos, and loaded burritos; the Mediterranean side answers with shawarma, gyros, and falafel — halal-friendly options throughout."
      }
    }
  },
  {
    id: 2, slug: "ogden-coffee-house", name: "Ogden Coffee House",
    state: "utah", city: "ogden", category: "restaurants",
    subcategory: "Coffee · Breakfast",
    address: "2432 Washington Blvd, Ogden, UT 84401", phone: "(801) 555-0221",
    website: "ogdencoffeehouse.com",
    shortDescription: "Small-batch roasts, scratch pastries, and hearty mountain breakfasts near Historic 25th Street.",
    longDescription: "Ogden Coffee House is where Ogden starts its morning — a warm, brick-walled roastery café a block off Historic 25th Street. Beans are roasted in small batches on-site, pastries come out of the oven all morning, and the breakfast menu leans hearty: mountain burritos, sourdough toasts, and a green-chile skillet with a local following. Trailheads are close, parking is easy, and the wifi is fast enough to make it Ogden's unofficial second office.",
    tags: ["Coffee", "Breakfast", "Pastries", "Small-Batch Roaster", "Wifi-Friendly"],
    image: { hue: 28, emoji: "☕", label: "Fresh-roasted pour over" },
    gallery: [
      { alt: "Barista pouring a latte at Ogden Coffee House near Historic 25th Street in Ogden, Utah", label: "Latte art at the bar" },
      { alt: "Small-batch coffee roaster in operation at Ogden Coffee House", label: "Roasted on-site" },
      { alt: "Green chile breakfast skillet served at Ogden Coffee House in Ogden, Utah", label: "The green-chile skillet" },
      { alt: "Fresh pastry case with morning bakes at Ogden Coffee House", label: "Morning pastry case" }
    ],
    offer: {
      title: "Free Pastry with Your First Pound of Beans",
      details: "Buy any pound of small-batch beans, pick any pastry free. One per customer — show your Gold Card offer at the register.",
      type: "restaurant", tag: "New Customer"
    },
    featured: false, homepageRotation: true, premiumAd: false,
    tier: "gold", platinumEligible: false,
    hours: ["Mon–Fri 6:30 AM – 4:00 PM", "Sat–Sun 7:00 AM – 5:00 PM"],
    highlights: [
      "Beans roasted in small batches on-site",
      "Scratch pastry case, baked all morning",
      "Hearty breakfast menu until 2 PM",
      "A block from Historic 25th Street"
    ],
    menuLabel: "Menu",
    menuItems: [
      { name: "Pour Over — Single Origin", desc: "Rotating single-origin, roasted this week, brewed to order.", price: "$4.50" },
      { name: "Honey Lavender Latte", desc: "House-made lavender syrup, local honey, double shot.", price: "$5.75" },
      { name: "Green Chile Breakfast Skillet", desc: "Two eggs, crispy potatoes, roasted green chile, cheddar, sourdough.", price: "$11.50" },
      { name: "Mountain Breakfast Burrito", desc: "Eggs, potatoes, bacon or veggie, smothered optional.", price: "$9.95" },
      { name: "Sourdough Avocado Toast", desc: "House sourdough, smashed avocado, pickled onion, everything spice.", price: "$8.50" },
      { name: "Fresh Bake of the Day", desc: "Ask the counter — croissants, muffins, and seasonal bakes all morning.", price: "$3.75" }
    ],
    emailSignupCount: 268, leadsThisMonth: 12,
    seo: {
      title: "Ogden Coffee House — Small-Batch Coffee & Breakfast in Ogden, UT | Utah Gold Card",
      description: "Ogden Coffee House roasts small-batch beans on-site near Historic 25th Street and serves scratch pastries and hearty breakfasts daily. Menu, hours, and current Gold Card offers.",
      h1: "Ogden Coffee House — Small-Batch Coffee & Breakfast in Ogden, Utah",
      localKeywords: ["coffee shop Ogden UT", "breakfast near Historic 25th Street", "small batch coffee roaster Ogden", "breakfast burrito Ogden Utah", "best latte Ogden"],
      faqs: [
        { q: "Does Ogden Coffee House roast its own beans?", a: "Yes — beans are roasted in small batches on-site, and whole-bean bags are available at the counter. Gold Card members get a free pastry with their first pound." },
        { q: "How late is breakfast served?", a: "The full breakfast menu, including the green-chile skillet and mountain burritos, is served until 2 PM every day." },
        { q: "Is it close to Historic 25th Street?", a: "One block north on Washington Blvd — an easy stop before the shops or after a morning on the trails." }
      ],
      schemaType: "Restaurant",
      canonicalUrl: "https://usgoldcard.com/utah/ogden/ogden-coffee-house",
      ogTitle: "Ogden Coffee House · Ogden, UT — Roasted On-Site, Baked All Morning",
      ogDescription: "Small-batch roastery café a block off Historic 25th Street: scratch pastries, green-chile skillets, and Gold Card offers.",
      imageAltText: "Barista finishing a pour-over of on-site roasted coffee at Ogden Coffee House in Ogden, Utah",
      stateSeoIntro: "Part of Utah Gold Card — Utah's network of SEO-built local business pages.",
      citySeoIntro: "Ogden's morning anchor near Historic 25th Street.",
      categorySeoIntro: "A Utah Gold Card coffee and breakfast favorite in downtown Ogden.",
      nearbyCities: ["salt-lake-city", "midvale"],
      relatedCategories: ["local-shops", "antiques"],
      primarySearchIntent: "ogden coffee house",
      secondarySearchIntents: ["coffee near historic 25th street", "breakfast ogden utah", "coffee roaster ogden"],
      offers: {
        title: "Ogden Coffee House Offers — Free Pastry with First Pound of Beans | Ogden, UT",
        description: "Current Ogden Coffee House deal: buy your first pound of small-batch, on-site-roasted beans and choose any pastry free. See how to claim your Utah Gold Card offer.",
        h1: "Ogden Coffee House Offers & Deals in Ogden, Utah",
        intro: "Ogden Coffee House rotates simple, real offers through Utah Gold Card — the kind you can actually use on your morning stop. Show the offer at the register and you're done."
      },
      menu: {
        title: "Ogden Coffee House Menu — Coffee, Pastries & Breakfast | Ogden, UT",
        description: "See the Ogden Coffee House menu: single-origin pour overs, honey lavender lattes, green-chile skillets, mountain breakfast burritos, and a scratch pastry case baked all morning.",
        h1: "Ogden Coffee House Menu — Ogden, Utah",
        intro: "The menu is short on purpose: coffee roasted this week, pastries baked this morning, and a breakfast lineup built for mountain appetites — served until 2 PM daily."
      }
    }
  },
  {
    id: 3, slug: "heritage-clock-antiques", name: "Heritage Clock & Antiques",
    state: "utah", city: "ogden", category: "antiques",
    subcategory: "Antiques · Specialty Retail · Clock Repair",
    address: "195 Historic 25th St, Ogden, UT 84401", phone: "(801) 555-0389",
    website: "",
    shortDescription: "Three floors of antique clocks, vintage furniture, and railroad-era treasures on Historic 25th Street — with in-house clock repair.",
    longDescription: "Heritage Clock & Antiques has anchored Historic 25th Street for over two decades. Three creaky, wonderful floors hold antique wall and mantel clocks, railroad-era memorabilia, vintage furniture, estate jewelry, and the kind of one-of-a-kind finds that make Ogden's antique row a destination. The back workshop is the real secret: a certified horologist restores and repairs grandfather clocks, cuckoo clocks, and heirloom timepieces for customers across northern Utah.",
    tags: ["Antiques", "Clock Repair", "Vintage Furniture", "Estate Jewelry", "Railroad Memorabilia"],
    image: { hue: 36, emoji: "🕰️", label: "Antique clock wall" },
    gallery: [
      { alt: "Wall of restored antique clocks at Heritage Clock & Antiques on Historic 25th Street in Ogden, Utah", label: "The clock wall" },
      { alt: "Vintage furniture floor at Heritage Clock & Antiques in Ogden", label: "Second-floor furniture" },
      { alt: "Horologist repairing a grandfather clock movement in the Heritage Clock & Antiques workshop", label: "The repair bench" }
    ],
    offer: {
      title: "Free Clock Evaluation + 15% Off First Repair",
      details: "Bring in any heirloom clock for a free evaluation, and take 15% off your first repair or restoration. Mention your Gold Card offer.",
      type: "retail", tag: "Service Offer"
    },
    featured: false, homepageRotation: false, premiumAd: false,
    tier: "starter", platinumEligible: false,
    hours: ["Tue–Sat 10:00 AM – 6:00 PM", "Sun–Mon Closed"],
    highlights: [
      "Three floors on Historic 25th Street",
      "Certified in-house clock repair & restoration",
      "Railroad-era memorabilia and estate jewelry",
      "Buying select estates and collections"
    ],
    menuLabel: "Showcase",
    menuItems: [
      { name: "Antique Wall & Mantel Clocks", desc: "Restored American and European clocks, most with service records from our own bench." },
      { name: "Grandfather Clock Restoration", desc: "Full movement service, case restoration, and house calls for delivery and setup." },
      { name: "Railroad-Era Memorabilia", desc: "Lanterns, signage, timetables, and Ogden Union Station history." },
      { name: "Vintage Furniture", desc: "A rotating second floor of dressers, desks, and mid-century finds." },
      { name: "Estate Jewelry Case", desc: "Curated estate pieces, appraised and priced to move." }
    ],
    emailSignupCount: 96, leadsThisMonth: 7,
    seo: {
      title: "Heritage Clock & Antiques — Antique Shop & Clock Repair in Ogden, UT | Utah Gold Card",
      description: "Heritage Clock & Antiques offers three floors of antiques on Historic 25th Street in Ogden, Utah, plus certified clock repair and restoration. Hours, showcase, and current offers.",
      h1: "Heritage Clock & Antiques — Historic 25th Street, Ogden, Utah",
      localKeywords: ["antique store Ogden UT", "clock repair Ogden Utah", "Historic 25th Street antiques", "grandfather clock restoration northern Utah", "vintage furniture Ogden"],
      faqs: [
        { q: "Does Heritage Clock & Antiques repair clocks?", a: "Yes — a certified horologist repairs and restores grandfather clocks, cuckoo clocks, and heirloom timepieces in the on-site workshop. Evaluations are free with the Gold Card offer." },
        { q: "Do you buy antiques?", a: "Selectively, yes — the shop buys estates and collections, especially clocks, railroad memorabilia, and quality vintage furniture. Call ahead with photos." },
        { q: "Where are you on 25th Street?", a: "At 195 Historic 25th Street, in the heart of Ogden's antique row, a short walk from Union Station." }
      ],
      schemaType: "Store",
      canonicalUrl: "https://usgoldcard.com/utah/ogden/heritage-clock-antiques",
      ogTitle: "Heritage Clock & Antiques · Ogden, UT — Three Floors on Historic 25th",
      ogDescription: "Antique clocks, railroad-era treasures, vintage furniture, and certified clock repair on Ogden's Historic 25th Street.",
      imageAltText: "Wall of restored antique clocks inside Heritage Clock & Antiques on Historic 25th Street in Ogden, Utah",
      stateSeoIntro: "Part of Utah Gold Card — Utah's network of SEO-built local business pages.",
      citySeoIntro: "An anchor of Ogden's Historic 25th Street antique row.",
      categorySeoIntro: "A Utah Gold Card specialty retailer: antiques upstairs, a repair bench in back.",
      nearbyCities: ["salt-lake-city", "midvale"],
      relatedCategories: ["local-shops", "restaurants"],
      primarySearchIntent: "heritage clock antiques ogden",
      secondarySearchIntents: ["clock repair near me ogden", "antique shops historic 25th street", "grandfather clock repair utah"],
      offers: {
        title: "Heritage Clock & Antiques Offers — Free Clock Evaluation | Ogden, UT",
        description: "Current Heritage Clock & Antiques offer in Ogden: free heirloom clock evaluation plus 15% off your first repair or restoration. Claim it through Utah Gold Card.",
        h1: "Heritage Clock & Antiques Offers — Ogden, Utah",
        intro: "If there's a clock in your family that stopped ticking years ago, this is the offer to use: bring it in for a free evaluation, and take 15% off the repair that brings it back."
      },
      menu: {
        title: "Heritage Clock & Antiques Showcase — Clocks, Furniture & Repair | Ogden, UT",
        description: "Browse the Heritage Clock & Antiques showcase: restored antique clocks, railroad-era memorabilia, vintage furniture, estate jewelry, and grandfather clock restoration services in Ogden, Utah.",
        h1: "Inside Heritage Clock & Antiques — What You'll Find",
        intro: "Three floors, one workshop, and no two visits the same. Here's what fills the shop — and what the repair bench can do for your own heirloom."
      }
    }
  },
  {
    id: 4, slug: "golden-hour-salon", name: "Golden Hour Salon",
    state: "utah", city: "salt-lake-city", category: "salons",
    subcategory: "Salon · Beauty · Color Specialists",
    address: "876 E 900 S, Salt Lake City, UT 84105", phone: "(801) 555-0456",
    website: "goldenhourslc.com",
    shortDescription: "A sunlit 9th & 9th salon known for dimensional color, precision cuts, and unhurried appointments.",
    longDescription: "Golden Hour Salon sits in Salt Lake City's 9th & 9th neighborhood, in a plant-filled, sunlit studio designed to feel nothing like a salon assembly line. The team specializes in dimensional color — balayage, lived-in blondes, rich brunettes — alongside precision cuts, curly-hair services, and event styling. Appointments are intentionally unhurried, consultations are honest, and the playlist is very good. New guests get a full consultation before any color decision is made.",
    tags: ["Balayage", "Color Specialists", "Precision Cuts", "Curly Hair", "Bridal & Event Styling"],
    image: { hue: 330, emoji: "💇", label: "Sunlit styling chairs" },
    gallery: [
      { alt: "Sunlit styling stations with plants at Golden Hour Salon in Salt Lake City's 9th & 9th neighborhood", label: "The sunlit studio" },
      { alt: "Stylist painting balayage highlights on a client at Golden Hour Salon, Salt Lake City", label: "Balayage in progress" },
      { alt: "Finished dimensional blonde color styled in loose waves at Golden Hour Salon", label: "Dimensional blonde, finished" },
      { alt: "Bridal updo styling session at Golden Hour Salon in Salt Lake City", label: "Event styling" }
    ],
    offer: {
      title: "New Guest: $25 Off Your First Color Service",
      details: "First visit to Golden Hour? Take $25 off any color service of $100+. Includes a full consultation. Mention your Gold Card offer when booking.",
      secondary: "Birthday club members get a free deep-conditioning treatment during their birthday month.",
      type: "service", tag: "New Client"
    },
    featured: true, homepageRotation: true, premiumAd: true,
    tier: "premium", platinumEligible: true,
    hours: ["Tue–Fri 9:00 AM – 7:00 PM", "Sat 9:00 AM – 5:00 PM", "Sun–Mon Closed"],
    highlights: [
      "Dimensional color specialists — balayage & lived-in blonde",
      "Unhurried appointments with honest consultations",
      "Curly-hair cutting and styling services",
      "Bridal and event styling teams",
      "9th & 9th neighborhood studio"
    ],
    menuLabel: "Services",
    menuItems: [
      { name: "Dimensional Color / Balayage", desc: "Full consultation, custom-painted color, gloss, and style.", price: "from $185" },
      { name: "Precision Haircut & Style", desc: "Cut, wash, and finish — built around your hair, not a template.", price: "from $65" },
      { name: "Curly Cut & Hydration", desc: "Dry curly cut, hydration treatment, and curl styling lesson.", price: "from $95" },
      { name: "Root Touch-Up + Gloss", desc: "Maintenance color with a shine gloss between full services.", price: "from $110" },
      { name: "Bridal / Event Styling", desc: "Trials, day-of styling, and on-location teams for events.", price: "custom" },
      { name: "Deep Conditioning Treatment", desc: "Repairing treatment added to any service — free in your birthday month.", price: "$35" }
    ],
    emailSignupCount: 351, leadsThisMonth: 29,
    seo: {
      title: "Golden Hour Salon — Balayage & Color Specialists in Salt Lake City, UT | Utah Gold Card",
      description: "Golden Hour Salon in Salt Lake City's 9th & 9th specializes in balayage, dimensional color, precision cuts, and curly hair. New guests get $25 off their first color service.",
      h1: "Golden Hour Salon — Color Specialists in Salt Lake City's 9th & 9th",
      localKeywords: ["balayage Salt Lake City", "hair salon 9th and 9th", "color specialist SLC", "curly hair salon Salt Lake City", "bridal hair Salt Lake City"],
      faqs: [
        { q: "Does Golden Hour Salon take new clients?", a: "Yes — new guests start with a full consultation before any color decision, and Gold Card members get $25 off their first color service of $100 or more." },
        { q: "Do you cut curly hair?", a: "Yes. Curly services include a dry curly cut, hydration treatment, and a styling lesson so you can recreate the look at home." },
        { q: "Where is the salon?", a: "In Salt Lake City's 9th & 9th neighborhood at 876 E 900 S, with street parking nearby." },
        { q: "Do you do wedding hair?", a: "Yes — bridal trials, day-of styling, and on-location teams for weddings and events along the Wasatch Front." }
      ],
      schemaType: "HealthAndBeautyBusiness",
      canonicalUrl: "https://usgoldcard.com/utah/salt-lake-city/golden-hour-salon",
      ogTitle: "Golden Hour Salon · Salt Lake City — Dimensional Color, Done Unhurried",
      ogDescription: "Balayage, precision cuts, and curly-hair services in a sunlit 9th & 9th studio. New-guest color offer via Utah Gold Card.",
      imageAltText: "Sunlit styling stations surrounded by plants at Golden Hour Salon in Salt Lake City's 9th & 9th neighborhood",
      stateSeoIntro: "Part of Utah Gold Card — Utah's network of SEO-built local business pages.",
      citySeoIntro: "A 9th & 9th favorite for color that looks grown-in, not painted-on.",
      categorySeoIntro: "A featured Utah Gold Card salon: dimensional color, curly services, event styling.",
      nearbyCities: ["midvale", "ogden"],
      relatedCategories: ["fitness-wellness", "local-shops"],
      primarySearchIntent: "golden hour salon salt lake city",
      secondarySearchIntents: ["balayage near me slc", "best color salon salt lake city", "curly haircut salt lake city"],
      offers: {
        title: "Golden Hour Salon Offers — $25 Off First Color + Birthday Treatment | SLC",
        description: "Golden Hour Salon deals in Salt Lake City: $25 off your first color service of $100+, and a free deep-conditioning treatment during your birthday month for club members.",
        h1: "Golden Hour Salon Offers — Salt Lake City",
        intro: "Two standing offers, both simple: new guests save $25 on their first color service, and birthday-club members get a free deep-conditioning treatment in their birthday month. Book and mention Gold Card."
      },
      menu: {
        title: "Golden Hour Salon Services — Balayage, Cuts, Curly Hair & Bridal | SLC",
        description: "Full service list for Golden Hour Salon in Salt Lake City: dimensional color and balayage, precision cuts, curly cut and hydration, root touch-ups, and bridal or event styling.",
        h1: "Golden Hour Salon Services & Pricing — Salt Lake City",
        intro: "Every service starts with a real consultation. Here's the full list, with starting prices — final quotes depend on hair length, density, and the look you're after."
      }
    }
  },
  {
    id: 5, slug: "wasatch-home-repair", name: "Wasatch Home Repair",
    state: "utah", city: "ogden", category: "home-services",
    subcategory: "Handyman · Repairs · Home Maintenance",
    address: "Serving Ogden & Weber County (mobile)", phone: "(801) 555-0512",
    website: "wasatchhomerepair.com",
    shortDescription: "Licensed, punctual handyman services across Ogden and Weber County — from honey-do lists to full bathroom refreshes.",
    longDescription: "Wasatch Home Repair is the call Ogden homeowners make when the list gets too long. Licensed and insured, the two-truck team handles drywall, fixtures, fencing, decks, door and window repairs, and full bathroom refreshes across Weber County. Same-week scheduling, texted arrival windows, and flat-rate quotes before work starts — no mystery invoices. Winterization packages every fall are a local favorite.",
    tags: ["Handyman", "Drywall", "Decks & Fences", "Bathroom Refresh", "Winterization", "Licensed & Insured"],
    image: { hue: 205, emoji: "🔧", label: "On the job in Ogden" },
    gallery: [
      { alt: "Wasatch Home Repair technician installing a new exterior door on an Ogden home", label: "Door install, done right" },
      { alt: "Refinished deck completed by Wasatch Home Repair in Weber County, Utah", label: "Deck refresh" },
      { alt: "Bathroom fixture upgrade completed by Wasatch Home Repair in Ogden, Utah", label: "Bathroom refresh" }
    ],
    offer: {
      title: "$50 Off Any Job Over $300",
      details: "Book any repair or project over $300 and take $50 off. Flat-rate quote up front. Mention your Gold Card offer when scheduling.",
      secondary: "Fall winterization package: $149 flat (reg. $199) for Gold Card followers.",
      type: "service", tag: "Service Deal"
    },
    featured: false, homepageRotation: false, premiumAd: true,
    tier: "gold", platinumEligible: false,
    hours: ["Mon–Fri 8:00 AM – 6:00 PM", "Sat 9:00 AM – 2:00 PM", "Sun Closed"],
    highlights: [
      "Licensed & insured, two-truck local team",
      "Flat-rate quotes before work starts",
      "Same-week scheduling with texted arrival windows",
      "Serving all of Ogden and Weber County"
    ],
    menuLabel: "Services",
    menuItems: [
      { name: "Handyman / Honey-Do List", desc: "Bundle small repairs into one visit — fixtures, caulk, hardware, patches.", price: "from $95/hr" },
      { name: "Drywall Repair & Texture Match", desc: "Holes, cracks, and water damage, matched to your existing texture.", price: "flat quote" },
      { name: "Deck & Fence Repair", desc: "Board replacement, staining, gates, and post repairs.", price: "flat quote" },
      { name: "Door & Window Repair", desc: "Sticking doors, broken hardware, weather sealing, full replacements.", price: "flat quote" },
      { name: "Bathroom Refresh", desc: "Fixtures, vanities, tile repair, and re-caulking — a new bathroom feel without the remodel.", price: "flat quote" },
      { name: "Fall Winterization Package", desc: "Sprinkler blowout scheduling, hose bibs, weather stripping, furnace filter.", price: "$149" }
    ],
    emailSignupCount: 143, leadsThisMonth: 21,
    seo: {
      title: "Wasatch Home Repair — Handyman & Home Services in Ogden, UT | Utah Gold Card",
      description: "Wasatch Home Repair provides licensed handyman services across Ogden and Weber County: drywall, decks, doors, bathroom refreshes, and winterization. Flat-rate quotes, $50 off jobs over $300.",
      h1: "Wasatch Home Repair — Licensed Handyman Services in Ogden, Utah",
      localKeywords: ["handyman Ogden UT", "home repair Weber County", "drywall repair Ogden", "deck repair Ogden Utah", "winterization service Ogden"],
      faqs: [
        { q: "What areas does Wasatch Home Repair serve?", a: "All of Ogden and Weber County, with same-week scheduling for most jobs and texted arrival windows so you're never waiting around." },
        { q: "Are you licensed and insured?", a: "Yes — fully licensed and insured, and every job gets a flat-rate quote before work starts." },
        { q: "What's the most popular service?", a: "The bundled honey-do visit — knocking out a whole list of small repairs in one trip — and the $149 fall winterization package." },
        { q: "How do I get the $50 discount?", a: "Mention your Gold Card offer when you schedule any job over $300. The discount comes off the flat-rate quote." }
      ],
      schemaType: "HomeAndConstructionBusiness",
      canonicalUrl: "https://usgoldcard.com/utah/ogden/wasatch-home-repair",
      ogTitle: "Wasatch Home Repair · Ogden, UT — Flat-Rate, Licensed, Same-Week",
      ogDescription: "Handyman services across Ogden & Weber County: drywall, decks, doors, bathroom refreshes. $50 off jobs over $300 via Gold Card.",
      imageAltText: "Wasatch Home Repair technician installing an exterior door at a home in Ogden, Utah",
      stateSeoIntro: "Part of Utah Gold Card — Utah's network of SEO-built local business pages.",
      citySeoIntro: "Ogden's flat-rate answer to the growing honey-do list.",
      categorySeoIntro: "A Utah Gold Card home services pro: licensed, insured, and punctual.",
      nearbyCities: ["salt-lake-city", "midvale"],
      relatedCategories: ["professional-services", "local-shops"],
      primarySearchIntent: "wasatch home repair ogden",
      secondarySearchIntents: ["handyman near me ogden", "home repair weber county", "winterization ogden utah"],
      offers: {
        title: "Wasatch Home Repair Offers — $50 Off Jobs Over $300 | Ogden, UT",
        description: "Current Wasatch Home Repair deals in Ogden: $50 off any job over $300 and a $149 fall winterization package for Gold Card followers. Flat-rate quotes up front.",
        h1: "Wasatch Home Repair Deals — Ogden & Weber County",
        intro: "Straightforward offers for straightforward work: $50 off any job over $300, and a $149 winterization package every fall. Mention Gold Card when you schedule."
      },
      menu: {
        title: "Wasatch Home Repair Services — Drywall, Decks, Doors & More | Ogden, UT",
        description: "Full list of Wasatch Home Repair services in Ogden and Weber County: handyman visits, drywall and texture matching, deck and fence repair, door and window work, bathroom refreshes, winterization.",
        h1: "Wasatch Home Repair — Full Service List",
        intro: "If it's on your list, it's probably on this one. Every service is quoted flat-rate before work starts, and small repairs can be bundled into a single visit."
      }
    }
  },
  {
    id: 6, slug: "omaha-family-pizza", name: "Omaha Family Pizza",
    state: "nebraska", city: "omaha", category: "restaurants",
    subcategory: "Pizza · Family Dinner",
    address: "4517 Leavenworth St, Omaha, NE 68106", phone: "(402) 555-0633",
    website: "omahafamilypizza.com",
    shortDescription: "Third-generation pizzeria serving hand-tossed pies, Friday family nights, and Omaha's favorite garlic knots since 1974.",
    longDescription: "Omaha Family Pizza has been feeding Leavenworth Street since 1974 — same family, same dough recipe, three generations in. The pies are hand-tossed, the sauce simmers all day, and the garlic knots have their own local fan club. Friday Family Night packs the dining room with red-checkered tables, arcade machines, and a kids-eat-cheap deal that's been running for decades. Takeout and delivery cover most of central Omaha.",
    tags: ["Pizza", "Family Dinner", "Kids Eat Cheap", "Garlic Knots", "Since 1974", "Delivery"],
    image: { hue: 4, emoji: "🍕", label: "Hand-tossed, since 1974" },
    gallery: [
      { alt: "Hand-tossed pepperoni pizza fresh from the oven at Omaha Family Pizza on Leavenworth Street", label: "The Leavenworth Special" },
      { alt: "Famous garlic knots with house marinara at Omaha Family Pizza in Omaha, Nebraska", label: "The famous knots" },
      { alt: "Family Friday night in the dining room at Omaha Family Pizza with red checkered tablecloths", label: "Friday Family Night" },
      { alt: "Third-generation owner tossing dough at Omaha Family Pizza", label: "Three generations of dough" }
    ],
    offer: {
      title: "Friday Family Night: Kids Eat for $2 with Any Large Pie",
      details: "Every Friday, kids' pizzas are $2 each with any large pizza purchase. Dine-in only. Show your Gold Card offer at the counter.",
      secondary: "Free order of garlic knots with any online order over $30 — code GOLDCARD.",
      type: "restaurant", tag: "Family Offer"
    },
    featured: true, homepageRotation: true, premiumAd: false,
    tier: "premium", platinumEligible: true,
    hours: ["Tue–Thu 11:00 AM – 9:00 PM", "Fri–Sat 11:00 AM – 10:30 PM", "Sun 12:00 PM – 8:00 PM", "Mon Closed"],
    highlights: [
      "Third-generation family recipe since 1974",
      "Friday Family Night with kids-eat-cheap deal",
      "All-day simmered sauce, hand-tossed dough",
      "Delivery across central Omaha"
    ],
    menuLabel: "Menu",
    menuItems: [
      { name: "The Leavenworth Special", desc: "Pepperoni, Italian sausage, mushrooms, green peppers — the 1974 original.", price: "L $19.95" },
      { name: "Famous Garlic Knots (8)", desc: "Hand-rolled, butter-garlic bathed, with all-day marinara.", price: "$6.50" },
      { name: "Classic Cheese", desc: "All-day red sauce, whole-milk mozzarella, hand-tossed crust.", price: "L $14.95" },
      { name: "Omaha Meat Lover's", desc: "Pepperoni, sausage, bacon, ham. Not a light decision.", price: "L $21.95" },
      { name: "Kids' Personal Pizza", desc: "One topping, kid-sized. $2 on Friday Family Night with a large pie.", price: "$5.95" },
      { name: "Family Deal", desc: "Two large one-topping pizzas, garlic knots, and a 2-liter.", price: "$34.95" }
    ],
    emailSignupCount: 388, leadsThisMonth: 26,
    seo: {
      title: "Omaha Family Pizza — Hand-Tossed Pizza Since 1974 | Omaha, NE | Nebraska Gold Card",
      description: "Omaha Family Pizza serves hand-tossed pies, famous garlic knots, and Friday Family Night deals on Leavenworth Street — three generations strong since 1974. Menu, hours, and offers.",
      h1: "Omaha Family Pizza — Three Generations of Hand-Tossed Pies in Omaha",
      localKeywords: ["pizza Omaha NE", "family pizza night Omaha", "garlic knots Omaha", "kids eat free pizza Omaha", "pizza delivery Leavenworth Street"],
      faqs: [
        { q: "What is Friday Family Night?", a: "Every Friday, kids' personal pizzas are $2 each with any large pizza purchase, dine-in. It's been an Omaha tradition for decades — arrive early, the dining room fills up." },
        { q: "Does Omaha Family Pizza deliver?", a: "Yes — delivery covers most of central Omaha, and online orders over $30 get free garlic knots with code GOLDCARD." },
        { q: "How long has Omaha Family Pizza been open?", a: "Since 1974 — same family, same dough recipe, now in its third generation on Leavenworth Street." }
      ],
      schemaType: "Restaurant",
      canonicalUrl: "https://usgoldcard.com/nebraska/omaha/omaha-family-pizza",
      ogTitle: "Omaha Family Pizza · Since 1974 — Friday Family Night & Famous Knots",
      ogDescription: "Third-generation, hand-tossed Omaha pizzeria. Kids eat for $2 on Fridays with any large pie. Nebraska Gold Card offers inside.",
      imageAltText: "Hand-tossed pepperoni pizza fresh from the oven at Omaha Family Pizza, a third-generation pizzeria in Omaha, Nebraska",
      stateSeoIntro: "Part of Nebraska Gold Card — Nebraska's network of SEO-built local business pages.",
      citySeoIntro: "A Leavenworth Street institution and Omaha's Friday-night default.",
      categorySeoIntro: "A featured Nebraska Gold Card restaurant: 50 years of family pizza.",
      nearbyCities: ["lincoln", "bellevue"],
      relatedCategories: ["family-fun", "catering"],
      primarySearchIntent: "omaha family pizza",
      secondarySearchIntents: ["family pizza night omaha", "best garlic knots omaha", "pizza near leavenworth street"],
      offers: {
        title: "Omaha Family Pizza Deals — $2 Kids' Pizzas Friday + Free Knots | Omaha, NE",
        description: "Omaha Family Pizza offers: kids eat for $2 every Friday Family Night with a large pie, and free garlic knots on $30+ online orders with code GOLDCARD.",
        h1: "Omaha Family Pizza Deals & Family Night Offers",
        intro: "Two offers, both built for families: $2 kids' pizzas every Friday night with any large pie, and free garlic knots when your online order tops $30. That's it — no fine print maze."
      },
      menu: {
        title: "Omaha Family Pizza Menu — Pies, Knots & Family Deals | Omaha, NE",
        description: "See the Omaha Family Pizza menu: the 1974 Leavenworth Special, classic cheese, Omaha Meat Lover's, famous garlic knots, kids' pizzas, and the two-pie Family Deal.",
        h1: "Omaha Family Pizza Menu — Omaha, Nebraska",
        intro: "The menu hasn't chased a trend in fifty years, and that's the point: hand-tossed pies, all-day sauce, knots worth the drive, and a Family Deal that feeds everyone for under $35."
      }
    }
  },
  {
    id: 7, slug: "lincoln-fresh-bowls", name: "Lincoln Fresh Bowls",
    state: "nebraska", city: "lincoln", category: "restaurants",
    subcategory: "Healthy Food · Bowls · Smoothies",
    address: "1340 P St, Lincoln, NE 68508", phone: "(402) 555-0718",
    website: "lincolnfreshbowls.com",
    shortDescription: "Build-your-own grain bowls, cold-pressed juices, and post-workout smoothies steps from the Haymarket.",
    longDescription: "Lincoln Fresh Bowls brings fast, genuinely healthy food to downtown Lincoln — build-your-own grain and greens bowls, signature combinations like the Husker Harvest Bowl, cold-pressed juices, and smoothies that earn their protein claims. Everything is prepped fresh each morning, sourced regionally when the season allows, and served fast enough for a downtown lunch break. Steps from the Haymarket and popular with the campus crowd, it's Lincoln's answer to eating well without thinking hard.",
    tags: ["Healthy Food", "Grain Bowls", "Smoothies", "Cold-Pressed Juice", "Vegan Options", "Quick Lunch"],
    image: { hue: 130, emoji: "🥗", label: "Built fresh daily" },
    gallery: [
      { alt: "Colorful build-your-own grain bowl with roasted vegetables at Lincoln Fresh Bowls in Lincoln, Nebraska", label: "The Husker Harvest Bowl" },
      { alt: "Cold-pressed juice lineup in the cooler at Lincoln Fresh Bowls near the Haymarket", label: "Cold-pressed daily" },
      { alt: "Post-workout protein smoothie being blended at Lincoln Fresh Bowls", label: "Protein smoothie bar" }
    ],
    offer: {
      title: "Lunch Punch: Buy 5 Bowls, Get the 6th Free",
      details: "Join the Gold Card digital punch program — five bowls gets your sixth free, tracked automatically with your email.",
      type: "restaurant", tag: "Loyalty Offer"
    },
    featured: false, homepageRotation: true, premiumAd: false,
    tier: "gold", platinumEligible: false,
    hours: ["Mon–Fri 10:00 AM – 8:00 PM", "Sat 10:00 AM – 6:00 PM", "Sun 11:00 AM – 4:00 PM"],
    highlights: [
      "Build-your-own bowls, prepped fresh each morning",
      "Regional sourcing in season",
      "Cold-pressed juices and real-protein smoothies",
      "Steps from the Haymarket — fast downtown lunch"
    ],
    menuLabel: "Menu",
    menuItems: [
      { name: "Husker Harvest Bowl", desc: "Roasted sweet potato, quinoa, kale, corn, black beans, chipotle-lime dressing.", price: "$11.95" },
      { name: "Build-Your-Own Bowl", desc: "Pick a base, protein, four toppings, and a house dressing.", price: "from $10.50" },
      { name: "P Street Protein Smoothie", desc: "Peanut butter, banana, oats, whey or plant protein, oat milk.", price: "$7.95" },
      { name: "Cold-Pressed Green No. 3", desc: "Kale, apple, cucumber, lemon, ginger — pressed this morning.", price: "$6.50" },
      { name: "Mediterranean Bowl", desc: "Falafel, cucumber, tomato, feta, hummus over greens and grains.", price: "$11.50" }
    ],
    emailSignupCount: 204, leadsThisMonth: 9,
    seo: {
      title: "Lincoln Fresh Bowls — Healthy Grain Bowls & Smoothies in Lincoln, NE | Nebraska Gold Card",
      description: "Lincoln Fresh Bowls serves build-your-own grain bowls, cold-pressed juices, and protein smoothies on P Street near the Haymarket. Menu, loyalty punch offer, and hours.",
      h1: "Lincoln Fresh Bowls — Healthy, Fast, Downtown Lincoln",
      localKeywords: ["healthy food Lincoln NE", "grain bowls Lincoln", "smoothies near Haymarket", "healthy lunch downtown Lincoln", "cold pressed juice Lincoln Nebraska"],
      faqs: [
        { q: "Does Lincoln Fresh Bowls have vegan options?", a: "Plenty — the build-your-own format makes most bowls easily vegan, and plant protein is available in every smoothie." },
        { q: "How does the punch program work?", a: "Join through the Gold Card offer page — every bowl purchase is tracked with your email, and your sixth bowl is free. No physical card to lose." },
        { q: "Is it fast enough for a lunch break?", a: "Yes — bowls are prepped fresh each morning and built to order in minutes. Most lunch visits are in and out in under ten." }
      ],
      schemaType: "Restaurant",
      canonicalUrl: "https://usgoldcard.com/nebraska/lincoln/lincoln-fresh-bowls",
      ogTitle: "Lincoln Fresh Bowls · Lincoln, NE — Bowls, Juice & Smoothies on P Street",
      ogDescription: "Build-your-own grain bowls and cold-pressed juice near the Haymarket. Buy 5 bowls, get the 6th free with Nebraska Gold Card.",
      imageAltText: "Build-your-own grain bowl with roasted vegetables and quinoa at Lincoln Fresh Bowls in downtown Lincoln, Nebraska",
      stateSeoIntro: "Part of Nebraska Gold Card — Nebraska's network of SEO-built local business pages.",
      citySeoIntro: "Downtown Lincoln's fast answer to eating well, steps from the Haymarket.",
      categorySeoIntro: "A Nebraska Gold Card healthy-eats spot with a digital loyalty punch.",
      nearbyCities: ["omaha", "bellevue"],
      relatedCategories: ["fitness-wellness", "catering"],
      primarySearchIntent: "lincoln fresh bowls",
      secondarySearchIntents: ["healthy lunch lincoln ne", "smoothie haymarket lincoln", "grain bowl near unl"],
      offers: {
        title: "Lincoln Fresh Bowls Offers — Buy 5 Bowls, 6th Free | Lincoln, NE",
        description: "Lincoln Fresh Bowls' digital punch offer: buy five bowls and your sixth is free, tracked automatically by email through Nebraska Gold Card. Join in seconds.",
        h1: "Lincoln Fresh Bowls Loyalty Offer — Lincoln, Nebraska",
        intro: "One offer, zero friction: sign up once, and every bowl counts toward a free sixth. Your email is the punch card — nothing to carry, nothing to lose."
      },
      menu: {
        title: "Lincoln Fresh Bowls Menu — Bowls, Juices & Smoothies | Lincoln, NE",
        description: "Browse the Lincoln Fresh Bowls menu: the Husker Harvest Bowl, build-your-own bowls, Mediterranean bowl, P Street protein smoothies, and cold-pressed juices made each morning.",
        h1: "Lincoln Fresh Bowls Menu — Downtown Lincoln",
        intro: "Everything on this menu was prepped this morning. Build your own bowl or grab a signature — either way you're out the door in minutes with something that's actually good for you."
      }
    }
  },
  {
    id: 8, slug: "buffalo-main-street-flowers", name: "Buffalo Main Street Flowers",
    state: "new-york", city: "buffalo", category: "local-shops",
    subcategory: "Flowers · Gifts",
    address: "1189 Hertel Ave, Buffalo, NY 14216", phone: "(716) 555-0824",
    website: "buffalomainstflowers.com",
    shortDescription: "Hand-tied bouquets, same-day Buffalo delivery, and a gift shop full of Western New York makers.",
    longDescription: "Buffalo Main Street Flowers is a Hertel Avenue staple: a working flower studio up front, a gift shop of Western New York makers in back, and a delivery van that covers the whole city same-day. Arrangements are hand-tied to order — no foam bricks, no cookie-cutter recipes — and the shop's 'Buffalo Beauty' seasonal bouquet is a running local tradition. Weddings, sympathy work, and standing office arrangements round out a business built on knowing its neighbors by name.",
    tags: ["Flowers", "Same-Day Delivery", "Gifts", "Local Makers", "Weddings", "Sympathy"],
    image: { hue: 300, emoji: "💐", label: "Hand-tied to order" },
    gallery: [
      { alt: "Florist hand-tying a seasonal bouquet at Buffalo Main Street Flowers on Hertel Avenue in Buffalo, New York", label: "Hand-tied at the bench" },
      { alt: "The Buffalo Beauty seasonal bouquet arranged with local blooms at Buffalo Main Street Flowers", label: "The Buffalo Beauty" },
      { alt: "Gift shelf featuring Western New York makers inside Buffalo Main Street Flowers", label: "WNY makers shelf" }
    ],
    offer: {
      title: "Free Same-Day Delivery on Orders $45+",
      details: "Order by 1 PM and delivery anywhere in Buffalo is free on arrangements of $45 or more. Mention your Gold Card offer at checkout.",
      type: "retail", tag: "Retail Deal"
    },
    featured: false, homepageRotation: false, premiumAd: false,
    tier: "gold", platinumEligible: false,
    hours: ["Mon–Fri 9:00 AM – 6:00 PM", "Sat 9:00 AM – 4:00 PM", "Sun Closed"],
    highlights: [
      "Hand-tied arrangements, no cookie-cutter recipes",
      "Same-day delivery across Buffalo (order by 1 PM)",
      "Gift shop of Western New York makers",
      "Weddings, sympathy, and standing office arrangements"
    ],
    menuLabel: "Showcase",
    menuItems: [
      { name: "The Buffalo Beauty", desc: "The shop's signature seasonal bouquet — changes with what's freshest.", price: "from $55" },
      { name: "Designer's Choice", desc: "Tell us the occasion and budget; the bench does the rest.", price: "from $45" },
      { name: "Wedding & Event Florals", desc: "Full-service design from bouquets to installations. Consultations free.", price: "custom" },
      { name: "Standing Office Arrangements", desc: "Weekly or biweekly fresh arrangements for lobbies and offices.", price: "from $40/wk" },
      { name: "WNY Makers Gifts", desc: "Candles, cards, and small-batch goods from Western New York makers.", price: "varies" }
    ],
    emailSignupCount: 176, leadsThisMonth: 14,
    seo: {
      title: "Buffalo Main Street Flowers — Florist & Gifts on Hertel Ave | Buffalo, NY | New York Gold Card",
      description: "Buffalo Main Street Flowers hand-ties bouquets on Hertel Avenue with free same-day Buffalo delivery on $45+ orders. Weddings, sympathy, gifts from WNY makers.",
      h1: "Buffalo Main Street Flowers — Hand-Tied Bouquets on Hertel Avenue",
      localKeywords: ["florist Buffalo NY", "same day flower delivery Buffalo", "Hertel Avenue flower shop", "wedding florist Buffalo", "sympathy flowers Buffalo NY"],
      faqs: [
        { q: "Do you deliver same-day in Buffalo?", a: "Yes — order by 1 PM and same-day delivery anywhere in Buffalo is free on arrangements of $45+, with the Gold Card offer." },
        { q: "Do you do wedding flowers?", a: "Full-service wedding and event design, from bouquets to installations. Consultations are free — bring your inspiration photos." },
        { q: "What's the Buffalo Beauty?", a: "The shop's signature seasonal bouquet — a hand-tied arrangement built from whatever is freshest that week. It's a running Hertel Avenue tradition." }
      ],
      schemaType: "Store",
      canonicalUrl: "https://usgoldcard.com/new-york/buffalo/buffalo-main-street-flowers",
      ogTitle: "Buffalo Main Street Flowers · Hertel Ave — Same-Day Buffalo Delivery",
      ogDescription: "Hand-tied bouquets, WNY maker gifts, and free same-day delivery on $45+ orders via New York Gold Card.",
      imageAltText: "Florist hand-tying a seasonal bouquet at the bench inside Buffalo Main Street Flowers on Hertel Avenue in Buffalo, New York",
      stateSeoIntro: "Part of New York Gold Card — New York's network of SEO-built local business pages.",
      citySeoIntro: "A Hertel Avenue staple that knows its neighbors by name.",
      categorySeoIntro: "A New York Gold Card local shop: working flower studio, maker gifts in back.",
      nearbyCities: ["brooklyn", "rochester"],
      relatedCategories: ["antiques", "restaurants"],
      primarySearchIntent: "buffalo main street flowers",
      secondarySearchIntents: ["florist near hertel ave", "same day flowers buffalo", "buffalo wedding florist"],
      offers: {
        title: "Buffalo Main Street Flowers Offers — Free Same-Day Delivery | Buffalo, NY",
        description: "Current offer from Buffalo Main Street Flowers: free same-day delivery anywhere in Buffalo on hand-tied arrangements of $45+, ordered by 1 PM. Claim via New York Gold Card.",
        h1: "Buffalo Main Street Flowers — Delivery Offer",
        intro: "Flowers are a same-day business — someone's birthday is always today. Order by 1 PM, spend $45+, and delivery anywhere in Buffalo is on the house."
      },
      menu: {
        title: "Buffalo Main Street Flowers Showcase — Bouquets, Weddings & Gifts | Buffalo, NY",
        description: "Explore Buffalo Main Street Flowers' work: the signature Buffalo Beauty bouquet, designer's choice arrangements, wedding florals, standing office arrangements, and WNY maker gifts.",
        h1: "What We Make — Buffalo Main Street Flowers",
        intro: "Every arrangement leaves the bench hand-tied — no foam bricks, no recipe cards. Here's the range, from a $45 designer's choice to full wedding installations."
      }
    }
  },
  {
    id: 9, slug: "brooklyn-dessert-bar", name: "Brooklyn Dessert Bar",
    state: "new-york", city: "brooklyn", category: "restaurants",
    subcategory: "Desserts · Date Night",
    address: "214 Bedford Ave, Brooklyn, NY 11249", phone: "(718) 555-0917",
    website: "brooklyndessertbar.com",
    shortDescription: "A candlelit Williamsburg dessert-only bar: plated desserts, dessert flights, and late-night pours until 1 AM on weekends.",
    longDescription: "Brooklyn Dessert Bar is Williamsburg's answer to the question 'just dessert?' — asked and answered with a full plated-dessert menu, tasting flights, dessert-and-wine pairings, and an espresso program that takes the nightcap seriously. The room is candlelit and intentionally small; the burnt-basque cheesecake sells out most nights; and weekend hours stretch to 1 AM for the after-dinner crowd. Walk-ins welcome, reservations smart.",
    tags: ["Desserts", "Date Night", "Dessert Flights", "Late Night", "Wine Pairings", "Williamsburg"],
    image: { hue: 275, emoji: "🍰", label: "Candlelit & plated" },
    gallery: [
      { alt: "Plated burnt basque cheesecake with torched meringue at Brooklyn Dessert Bar in Williamsburg", label: "The basque cheesecake" },
      { alt: "Candlelit tables and intimate seating inside Brooklyn Dessert Bar on Bedford Avenue", label: "The candlelit room" },
      { alt: "Dessert tasting flight of four miniature plated desserts at Brooklyn Dessert Bar", label: "The tasting flight" },
      { alt: "Espresso martini and chocolate torte pairing at Brooklyn Dessert Bar, Brooklyn NY", label: "Nightcap pairing" }
    ],
    offer: {
      title: "Date Night Flight: Two Flights + Two Pours, $48",
      details: "Sunday–Thursday, two dessert tasting flights and two paired pours for $48 (reg. $62). Mention your Gold Card offer when reserving.",
      secondary: "Birthday club: a free plated dessert during your birthday week.",
      type: "restaurant", tag: "Date Night"
    },
    featured: true, homepageRotation: true, premiumAd: true,
    tier: "premium", platinumEligible: true,
    hours: ["Tue–Thu 5:00 PM – 11:00 PM", "Fri–Sat 5:00 PM – 1:00 AM", "Sun 4:00 PM – 10:00 PM", "Mon Closed"],
    highlights: [
      "Dessert-only menu, plated to order",
      "Tasting flights and wine pairings",
      "Open until 1 AM Friday & Saturday",
      "Candlelit Williamsburg room — reservations smart"
    ],
    menuLabel: "Menu",
    menuItems: [
      { name: "Burnt Basque Cheesecake", desc: "The one that sells out — torched meringue, macerated berries.", price: "$14" },
      { name: "Dessert Tasting Flight", desc: "Four miniatures chosen by the kitchen, changes weekly.", price: "$26" },
      { name: "Valrhona Chocolate Torte", desc: "Flourless, dark, with smoked sea salt and crème fraîche.", price: "$13" },
      { name: "Espresso Martini Nightcap", desc: "House espresso, proper foam, served ice-cold.", price: "$15" },
      { name: "Dessert & Wine Pairing", desc: "Any plated dessert with a matched pour, sommelier's pick.", price: "+$11" },
      { name: "Affogato Royale", desc: "Vanilla bean gelato, double espresso, amaretto crumble.", price: "$11" }
    ],
    emailSignupCount: 467, leadsThisMonth: 33,
    seo: {
      title: "Brooklyn Dessert Bar — Plated Desserts & Late-Night Date Spot | Williamsburg, Brooklyn | New York Gold Card",
      description: "Brooklyn Dessert Bar serves plated desserts, tasting flights, and wine pairings in a candlelit Williamsburg room — open until 1 AM weekends. See the menu and date-night offers.",
      h1: "Brooklyn Dessert Bar — Just Dessert, Done Seriously, in Williamsburg",
      localKeywords: ["dessert bar Brooklyn", "date night Williamsburg", "late night dessert Brooklyn NY", "dessert flight NYC", "basque cheesecake Brooklyn"],
      faqs: [
        { q: "Do I need a reservation?", a: "Walk-ins are welcome, but the room is intentionally small — reservations are smart on weekends, and the Gold Card date-night flight requires one." },
        { q: "How late is Brooklyn Dessert Bar open?", a: "Until 11 PM Tuesday–Thursday, 1 AM Friday and Saturday, and 10 PM Sunday — built for the after-dinner crowd." },
        { q: "What should a first-timer order?", a: "The tasting flight if you can't decide, or the burnt basque cheesecake if you can — it sells out most nights." },
        { q: "Is there a birthday offer?", a: "Yes — birthday club members get a free plated dessert during their birthday week. Sign up through the Gold Card offer page." }
      ],
      schemaType: "Restaurant",
      canonicalUrl: "https://usgoldcard.com/new-york/brooklyn/brooklyn-dessert-bar",
      ogTitle: "Brooklyn Dessert Bar · Williamsburg — Flights, Pairings & 1 AM Weekends",
      ogDescription: "A candlelit dessert-only bar on Bedford Ave. Date-night flight deal ($48 for two) via New York Gold Card.",
      imageAltText: "Plated burnt basque cheesecake with torched meringue served by candlelight at Brooklyn Dessert Bar in Williamsburg",
      stateSeoIntro: "Part of New York Gold Card — New York's network of SEO-built local business pages.",
      citySeoIntro: "Williamsburg's dessert-only date-night room, open late.",
      categorySeoIntro: "A featured New York Gold Card restaurant: plated desserts and serious nightcaps.",
      nearbyCities: ["buffalo", "rochester"],
      relatedCategories: ["local-shops", "catering"],
      primarySearchIntent: "brooklyn dessert bar",
      secondarySearchIntents: ["dessert date night brooklyn", "late night dessert williamsburg", "dessert flight brooklyn"],
      offers: {
        title: "Brooklyn Dessert Bar Offers — $48 Date Night Flight & Birthday Dessert | Williamsburg",
        description: "Brooklyn Dessert Bar deals: two tasting flights plus two paired pours for $48 (Sun–Thu), and a free plated dessert during your birthday week for club members.",
        h1: "Brooklyn Dessert Bar — Date Night & Birthday Offers",
        intro: "The date-night math: two tasting flights, two paired pours, $48 instead of $62, Sunday through Thursday. And when your birthday week arrives, dessert's on the house."
      },
      menu: {
        title: "Brooklyn Dessert Bar Menu — Plated Desserts, Flights & Pairings | Williamsburg",
        description: "The full Brooklyn Dessert Bar menu: burnt basque cheesecake, Valrhona chocolate torte, weekly tasting flights, affogato royale, espresso martinis, and sommelier-picked wine pairings.",
        h1: "Brooklyn Dessert Bar Menu — Williamsburg, Brooklyn",
        intro: "No appetizers, no entrées, no apologies. The menu is dessert from top to bottom, plated to order, with pours matched by someone who takes the assignment seriously."
      }
    }
  },
  {
    id: 10, slug: "austin-home-repair-pros", name: "Austin Home Repair Pros",
    state: "texas", city: "austin", category: "home-services",
    subcategory: "Home Services · Repairs · Remodel-Lite",
    address: "Serving Greater Austin (mobile)", phone: "(512) 555-1042",
    website: "austinhomerepairpros.com",
    shortDescription: "Austin's five-truck repair crew for drywall, fences, smart-home installs, and everything a fast-growing house needs.",
    longDescription: "Austin Home Repair Pros grew from one truck to five by doing the unglamorous things right: showing up on time, quoting flat, and cleaning up after. The crew covers Greater Austin with drywall and paint, fence and gate repair (a Texas essential), door/window service, smart-home and EV-charger installs, and 'remodel-lite' projects — the kitchen refresh that doesn't require living in a construction zone. Online booking, texted ETAs, photo-documented jobs.",
    tags: ["Home Repair", "Fence Repair", "Smart Home Install", "EV Charger", "Drywall & Paint", "Online Booking"],
    image: { hue: 210, emoji: "🛠️", label: "Five trucks, Greater Austin" },
    gallery: [
      { alt: "Austin Home Repair Pros technician repairing a cedar privacy fence at an Austin home", label: "Cedar fence repair" },
      { alt: "Smart thermostat installation by Austin Home Repair Pros in an Austin home", label: "Smart-home install" },
      { alt: "EV charger installed in a garage by Austin Home Repair Pros", label: "EV charger install" },
      { alt: "Kitchen refresh with new fixtures and paint completed by Austin Home Repair Pros", label: "Remodel-lite kitchen" }
    ],
    offer: {
      title: "Free Home Checkup with Any First Job",
      details: "Book any first job and get a 21-point home checkup free — roof line to water heater, with a photo report. Mention your Gold Card offer.",
      secondary: "$100 off EV charger installs booked this quarter.",
      type: "service", tag: "New Customer"
    },
    featured: true, homepageRotation: true, premiumAd: false,
    tier: "premium", platinumEligible: true,
    hours: ["Mon–Fri 7:30 AM – 6:30 PM", "Sat 8:00 AM – 3:00 PM", "Sun Closed"],
    highlights: [
      "Five trucks covering Greater Austin",
      "Flat quotes, texted ETAs, photo-documented jobs",
      "Smart-home and EV-charger certified installers",
      "Remodel-lite: big refresh, no construction zone"
    ],
    menuLabel: "Services",
    menuItems: [
      { name: "Fence & Gate Repair", desc: "Cedar, privacy, and ranch fencing — post repairs, gates, full sections.", price: "flat quote" },
      { name: "Drywall & Interior Paint", desc: "Patches to full rooms, texture-matched and color-matched.", price: "flat quote" },
      { name: "Smart-Home Installs", desc: "Thermostats, doorbells, locks, and cameras — installed and configured.", price: "from $129" },
      { name: "EV Charger Installation", desc: "Level 2 charger installs with panel evaluation. $100 off this quarter.", price: "from $649" },
      { name: "Door & Window Service", desc: "Weather sealing, hardware, sticking doors, glass replacement coordination.", price: "flat quote" },
      { name: "Remodel-Lite Kitchen Refresh", desc: "Fixtures, hardware, paint, backsplash — a new kitchen feel in days, not months.", price: "flat quote" },
      { name: "21-Point Home Checkup", desc: "Roof line to water heater with a photo report. Free with any first job.", price: "$149" }
    ],
    emailSignupCount: 231, leadsThisMonth: 44,
    seo: {
      title: "Austin Home Repair Pros — Home Services & Repairs in Austin, TX | Texas Gold Card",
      description: "Austin Home Repair Pros covers Greater Austin with fence repair, drywall, smart-home and EV-charger installs, and remodel-lite projects. Flat quotes, online booking, free checkup with first job.",
      h1: "Austin Home Repair Pros — Flat-Quote Home Services Across Greater Austin",
      localKeywords: ["home repair Austin TX", "fence repair Austin", "handyman Austin Texas", "EV charger install Austin", "smart home installation Austin"],
      faqs: [
        { q: "What areas do you cover?", a: "All of Greater Austin — five trucks means most neighborhoods get same-week scheduling, with texted ETAs so you're not waiting on a window." },
        { q: "What's the free home checkup?", a: "A 21-point inspection from roof line to water heater, delivered as a photo report — free with any first job through the Gold Card offer, normally $149." },
        { q: "Do you install EV chargers?", a: "Yes — certified Level 2 charger installs including panel evaluation, currently $100 off when booked this quarter." },
        { q: "What is remodel-lite?", a: "The refresh between repair and renovation: fixtures, hardware, paint, and backsplash that transform a kitchen or bath in days without a construction zone." }
      ],
      schemaType: "HomeAndConstructionBusiness",
      canonicalUrl: "https://usgoldcard.com/texas/austin/austin-home-repair-pros",
      ogTitle: "Austin Home Repair Pros · Austin, TX — Five Trucks, Flat Quotes",
      ogDescription: "Fences, drywall, smart-home, EV chargers, remodel-lite. Free 21-point home checkup with any first job via Texas Gold Card.",
      imageAltText: "Austin Home Repair Pros technician repairing a cedar privacy fence at a home in Austin, Texas",
      stateSeoIntro: "Part of Texas Gold Card — Texas's network of SEO-built local business pages.",
      citySeoIntro: "Greater Austin's five-truck crew for everything a fast-growing house needs.",
      categorySeoIntro: "A featured Texas Gold Card home services company: flat quotes, photo-documented jobs.",
      nearbyCities: ["dallas", "fort-worth"],
      relatedCategories: ["professional-services", "local-shops"],
      primarySearchIntent: "austin home repair pros",
      secondarySearchIntents: ["fence repair near me austin", "ev charger installer austin", "home repair company austin tx"],
      offers: {
        title: "Austin Home Repair Pros Offers — Free Home Checkup + $100 Off EV Installs | Austin, TX",
        description: "Current Austin Home Repair Pros deals: a free 21-point home checkup with any first job, and $100 off Level 2 EV charger installations booked this quarter.",
        h1: "Austin Home Repair Pros — Current Offers",
        intro: "Two offers worth acting on: every first job includes a free 21-point home checkup with photo report (a $149 value), and EV charger installs are $100 off through the end of the quarter."
      },
      menu: {
        title: "Austin Home Repair Pros Services — Fences, Drywall, Smart Home & EV | Austin, TX",
        description: "Full services list for Austin Home Repair Pros: fence and gate repair, drywall and paint, smart-home installs, EV charger installation, door and window service, and remodel-lite refreshes.",
        h1: "Austin Home Repair Pros — Full Service List",
        intro: "Everything below is flat-quoted before work starts and photo-documented after it's done. Bundle small jobs into one visit, or book the remodel-lite refresh that skips the construction zone."
      }
    }
  },
  {
    id: 11, slug: "dallas-kids-adventure-zone", name: "Dallas Kids Adventure Zone",
    state: "texas", city: "dallas", category: "family-fun",
    subcategory: "Family Fun · Indoor Play · Birthday Parties",
    address: "8830 N Stemmons Fwy, Dallas, TX 75247", phone: "(214) 555-1177",
    website: "dallaskidsadventure.com",
    shortDescription: "40,000 square feet of climbing structures, trampolines, and toddler zones — Dallas's birthday party headquarters.",
    longDescription: "Dallas Kids Adventure Zone is 40,000 square feet of yes: a four-story climbing structure, trampoline courts, a ninja course, a dedicated toddler town for the under-5 crowd, and party rooms that host more than a thousand birthdays a year. Parents get fast wifi, real espresso, and sight lines to everything. Socks required, energy mandatory, weekday passes cheaper — and the birthday club sends a free jump pass every year.",
    tags: ["Indoor Play", "Trampolines", "Birthday Parties", "Toddler Zone", "Ninja Course", "Party Rooms"],
    image: { hue: 45, emoji: "🎡", label: "40,000 sq ft of yes" },
    gallery: [
      { alt: "Four-story climbing structure inside Dallas Kids Adventure Zone in Dallas, Texas", label: "The four-story climber" },
      { alt: "Kids bouncing on the trampoline courts at Dallas Kids Adventure Zone", label: "Trampoline courts" },
      { alt: "Toddler town soft play area for under-5s at Dallas Kids Adventure Zone", label: "Toddler Town" },
      { alt: "Decorated birthday party room at Dallas Kids Adventure Zone in Dallas", label: "Party room, ready" }
    ],
    offer: {
      title: "Weekday Family Pass: 2 Kids + 2 Adults, $29",
      details: "Monday–Thursday, the family pass covers two kids and two adults for $29 (reg. $44). Show your Gold Card offer at the front desk.",
      secondary: "Birthday club members get a free jump pass every birthday year.",
      type: "family", tag: "Family Offer"
    },
    featured: false, homepageRotation: true, premiumAd: true,
    tier: "gold", platinumEligible: false,
    hours: ["Mon–Thu 10:00 AM – 8:00 PM", "Fri–Sat 9:00 AM – 9:00 PM", "Sun 11:00 AM – 7:00 PM"],
    highlights: [
      "40,000 sq ft: climber, trampolines, ninja course",
      "Dedicated toddler town for under-5s",
      "1,000+ birthday parties hosted per year",
      "Parent lounge with espresso and sight lines"
    ],
    menuLabel: "Attractions & Parties",
    menuItems: [
      { name: "All-Day Play Pass", desc: "Full access to climber, trampolines, and ninja course.", price: "$16.95" },
      { name: "Toddler Town Pass (under 5)", desc: "Soft-play zone built for the smallest adventurers.", price: "$9.95" },
      { name: "Weekday Family Pass", desc: "Two kids + two adults, Monday–Thursday. Gold Card: $29.", price: "$44" },
      { name: "Classic Birthday Package", desc: "Private room, 10 play passes, host, and setup/cleanup.", price: "from $249" },
      { name: "Ultimate Ninja Party", desc: "Ninja-course competition format with medals and a party host.", price: "from $349" }
    ],
    emailSignupCount: 512, leadsThisMonth: 31,
    seo: {
      title: "Dallas Kids Adventure Zone — Indoor Play & Birthday Parties in Dallas, TX | Texas Gold Card",
      description: "Dallas Kids Adventure Zone offers 40,000 sq ft of indoor play: climbing structures, trampolines, ninja course, and toddler town. Weekday family pass $29 with Gold Card.",
      h1: "Dallas Kids Adventure Zone — Indoor Play & Birthday Party HQ in Dallas",
      localKeywords: ["indoor playground Dallas TX", "kids birthday party Dallas", "trampoline park Dallas", "toddler play area Dallas", "family fun Dallas Texas"],
      faqs: [
        { q: "What ages is Adventure Zone for?", a: "Everything from a dedicated under-5 Toddler Town to a ninja course that challenges teenagers. The four-story climber suits most ages in between." },
        { q: "How do birthday parties work?", a: "Private party rooms, play passes for guests, a dedicated host, and full setup/cleanup — packages start at $249 and the venue hosts over a thousand parties a year." },
        { q: "What's the Gold Card weekday deal?", a: "Monday through Thursday, two kids and two adults get in for $29 total instead of $44 — just show the offer at the front desk." }
      ],
      schemaType: "LocalBusiness",
      canonicalUrl: "https://usgoldcard.com/texas/dallas/dallas-kids-adventure-zone",
      ogTitle: "Dallas Kids Adventure Zone — 40,000 Sq Ft of Yes",
      ogDescription: "Climber, trampolines, ninja course, toddler town. Weekday family pass $29 via Texas Gold Card.",
      imageAltText: "Children playing on the four-story climbing structure at Dallas Kids Adventure Zone in Dallas, Texas",
      stateSeoIntro: "Part of Texas Gold Card — Texas's network of SEO-built local business pages.",
      citySeoIntro: "Dallas's birthday-party headquarters and rainy-day rescue.",
      categorySeoIntro: "A Texas Gold Card family fun anchor: 40,000 square feet of it.",
      nearbyCities: ["fort-worth", "austin"],
      relatedCategories: ["restaurants", "fitness-wellness"],
      primarySearchIntent: "dallas kids adventure zone",
      secondarySearchIntents: ["indoor playground dallas", "kids birthday party venue dallas", "trampoline park near me dallas"],
      offers: {
        title: "Dallas Kids Adventure Zone Deals — $29 Weekday Family Pass | Dallas, TX",
        description: "Adventure Zone offers: the weekday family pass covers 2 kids + 2 adults for $29 (Mon–Thu), and birthday club members get a free jump pass every year.",
        h1: "Dallas Kids Adventure Zone — Family Deals & Birthday Club",
        intro: "The weekday pass is the play: two kids, two adults, $29, Monday through Thursday. Add the birthday club and every kid in the family gets a free jump pass each year."
      },
      menu: {
        title: "Dallas Kids Adventure Zone — Attractions & Party Packages | Dallas, TX",
        description: "See every attraction and party package at Dallas Kids Adventure Zone: all-day play passes, Toddler Town, the weekday family pass, classic birthday packages, and the Ultimate Ninja Party.",
        h1: "Attractions & Birthday Packages — Dallas Kids Adventure Zone",
        intro: "Passes for everyday visits, packages for the big day. Here's everything inside the 40,000 square feet — and what it costs to reserve a party room."
      }
    }
  },
  {
    id: 12, slug: "tampa-bay-smoothie-bar", name: "Tampa Bay Smoothie Bar",
    state: "florida", city: "tampa", category: "restaurants",
    subcategory: "Healthy Drinks · Smoothies · Açaí",
    address: "603 S Howard Ave, Tampa, FL 33606", phone: "(813) 555-1290",
    website: "",
    shortDescription: "Fresh-blended smoothies, açaí bowls, and cold brew on SoHo — fuel for Bayshore runners and beach days.",
    longDescription: "Tampa Bay Smoothie Bar sits on South Howard Avenue, catching Bayshore Boulevard runners on their way back and everyone else on their way to the water. The blender lineup is fresh-fruit-first — no syrup shortcuts — with açaí and pitaya bowls built to order, cold brew on tap, and a peanut-butter 'Gasparilla Fuel' smoothie with a local cult following. Grab-and-go, counter seats, and a walk-up window for dogs-in-tow orders.",
    tags: ["Smoothies", "Açaí Bowls", "Cold Brew", "Post-Workout", "Walk-Up Window", "SoHo Tampa"],
    image: { hue: 165, emoji: "🥤", label: "Fresh-fruit-first" },
    gallery: [
      { alt: "Açaí bowl topped with fresh fruit and granola at Tampa Bay Smoothie Bar on South Howard Avenue", label: "Açaí bowl, built to order" },
      { alt: "Smoothies being blended with fresh fruit at Tampa Bay Smoothie Bar in Tampa, Florida", label: "The blender lineup" },
      { alt: "Walk-up window service at Tampa Bay Smoothie Bar on SoHo in Tampa", label: "The walk-up window" }
    ],
    offer: {
      title: "Morning Deal: $2 Off Any Smoothie Before 10 AM",
      details: "Beat the heat and the line — any smoothie is $2 off before 10 AM, every day. Show your Gold Card offer at the register or window.",
      type: "restaurant", tag: "Daily Deal"
    },
    featured: false, homepageRotation: false, premiumAd: false,
    tier: "starter", platinumEligible: false,
    hours: ["Mon–Fri 6:30 AM – 7:00 PM", "Sat–Sun 7:00 AM – 6:00 PM"],
    highlights: [
      "Fresh-fruit-first — no syrup shortcuts",
      "Açaí and pitaya bowls built to order",
      "Walk-up window on South Howard Ave",
      "Opens 6:30 AM for the Bayshore running crowd"
    ],
    menuLabel: "Menu",
    menuItems: [
      { name: "Gasparilla Fuel", desc: "Peanut butter, banana, cacao, cold brew, oat milk — the local cult favorite.", price: "$8.50" },
      { name: "Classic Açaí Bowl", desc: "Açaí blend, granola, banana, strawberry, honey drizzle.", price: "$10.95" },
      { name: "Bayshore Greens", desc: "Spinach, mango, pineapple, ginger, coconut water.", price: "$7.95" },
      { name: "Pitaya Sunrise Bowl", desc: "Dragonfruit blend, kiwi, coconut, hemp seeds.", price: "$11.50" },
      { name: "Cold Brew on Tap", desc: "Slow-steeped, served black or with house oat cream.", price: "$4.75" }
    ],
    emailSignupCount: 89, leadsThisMonth: 5,
    seo: {
      title: "Tampa Bay Smoothie Bar — Smoothies & Açaí Bowls on SoHo | Tampa, FL | Florida Gold Card",
      description: "Tampa Bay Smoothie Bar blends fresh-fruit smoothies, açaí and pitaya bowls, and cold brew on South Howard Ave in Tampa. $2 off any smoothie before 10 AM with Gold Card.",
      h1: "Tampa Bay Smoothie Bar — Fresh-Blended on South Howard Avenue",
      localKeywords: ["smoothies Tampa FL", "açaí bowl Tampa", "smoothie bar SoHo Tampa", "healthy drinks near Bayshore Boulevard", "cold brew Tampa"],
      faqs: [
        { q: "When does the morning deal apply?", a: "Every day before 10 AM, any smoothie is $2 off with the Gold Card offer — perfect timing for the post-Bayshore-run crowd." },
        { q: "Are the smoothies made with fresh fruit?", a: "Fresh-fruit-first, always — no syrup shortcuts. Açaí and pitaya bowls are built to order the same way." },
        { q: "Is there a walk-up window?", a: "Yes — the South Howard walk-up window is made for dogs-in-tow and sandy-feet orders." }
      ],
      schemaType: "Restaurant",
      canonicalUrl: "https://usgoldcard.com/florida/tampa/tampa-bay-smoothie-bar",
      ogTitle: "Tampa Bay Smoothie Bar · SoHo — Açaí Bowls & the Gasparilla Fuel",
      ogDescription: "Fresh-fruit smoothies and bowls on South Howard Ave. $2 off before 10 AM via Florida Gold Card.",
      imageAltText: "Açaí bowl topped with fresh fruit and granola at Tampa Bay Smoothie Bar on South Howard Avenue in Tampa, Florida",
      stateSeoIntro: "Part of Florida Gold Card — Florida's network of SEO-built local business pages.",
      citySeoIntro: "SoHo's fresh-fruit blender bar, catching the Bayshore running crowd.",
      categorySeoIntro: "A Florida Gold Card healthy-drinks stop with a walk-up window.",
      nearbyCities: ["orlando", "st-petersburg"],
      relatedCategories: ["fitness-wellness", "local-shops"],
      primarySearchIntent: "tampa bay smoothie bar",
      secondarySearchIntents: ["acai bowl near bayshore tampa", "smoothies soho tampa", "cold brew south howard"],
      offers: {
        title: "Tampa Bay Smoothie Bar Offers — $2 Off Before 10 AM | Tampa, FL",
        description: "Tampa Bay Smoothie Bar's daily deal: every smoothie is $2 off before 10 AM with the Florida Gold Card offer. Fresh fruit, no syrups, on South Howard Ave.",
        h1: "Tampa Bay Smoothie Bar — Morning Deal",
        intro: "One deal, every single morning: any smoothie, $2 off, before 10 AM. Show the offer at the register — or at the walk-up window if you've got a dog or sandy feet."
      },
      menu: {
        title: "Tampa Bay Smoothie Bar Menu — Smoothies, Bowls & Cold Brew | Tampa, FL",
        description: "See the Tampa Bay Smoothie Bar menu: the Gasparilla Fuel, Bayshore Greens, classic açaí bowls, pitaya sunrise bowls, and slow-steeped cold brew on tap.",
        h1: "Tampa Bay Smoothie Bar Menu — Tampa, Florida",
        intro: "Fresh fruit goes in the blender; syrup bottles don't exist here. Five signatures cover the range — start with the Gasparilla Fuel if you want to understand the cult."
      }
    }
  },
  {
    id: 13, slug: "orlando-event-catering", name: "Orlando Event Catering",
    state: "florida", city: "orlando", category: "catering",
    subcategory: "Catering · Events · Corporate",
    address: "2200 Principal Row, Orlando, FL 32837", phone: "(407) 555-1364",
    website: "orlandoeventcatering.com",
    shortDescription: "Full-service catering for Central Florida corporate events, weddings, and parties — from 20-person lunches to 500-guest galas.",
    longDescription: "Orlando Event Catering has fed Central Florida's biggest moments for fifteen years — conference lunches for 20, weddings for 200, and galas for 500. The kitchen builds custom menus around any brief (stations, plated, buffet, dietary-inclusive), the events team handles rentals, staffing, and timelines, and the tasting room turns menu planning into the best meeting on anyone's calendar. Licensed, insured, and on every major Orlando venue's preferred list.",
    tags: ["Catering", "Corporate Events", "Weddings", "Galas", "Custom Menus", "Tasting Room"],
    image: { hue: 350, emoji: "🥘", label: "Plated for 500" },
    gallery: [
      { alt: "Plated gala dinner service prepared by Orlando Event Catering for a Central Florida event", label: "Gala service, plated" },
      { alt: "Corporate lunch buffet setup by Orlando Event Catering in Orlando, Florida", label: "Corporate lunch spread" },
      { alt: "Wedding reception food stations designed by Orlando Event Catering", label: "Wedding stations" },
      { alt: "Menu tasting session in the Orlando Event Catering tasting room", label: "The tasting room" }
    ],
    offer: {
      title: "Free Tasting for Two + 10% Off First Corporate Order",
      details: "Book a consultation and the tasting room visit is free for two. First corporate orders of $500+ get 10% off. Mention your Gold Card offer.",
      type: "catering", tag: "Catering Offer"
    },
    featured: false, homepageRotation: true, premiumAd: false,
    tier: "premium", platinumEligible: true,
    hours: ["Mon–Fri 9:00 AM – 6:00 PM", "Events staffed 7 days"],
    highlights: [
      "20-person lunches to 500-guest galas",
      "Custom menus: stations, plated, buffet, dietary-inclusive",
      "Full events team: rentals, staffing, timelines",
      "On every major Orlando venue's preferred list"
    ],
    menuLabel: "Services",
    menuItems: [
      { name: "Corporate Lunch Program", desc: "Recurring office lunches with rotating menus, from 20 people.", price: "from $14/pp" },
      { name: "Wedding Catering", desc: "Custom menus, tastings, staffing, and full reception coordination.", price: "from $58/pp" },
      { name: "Gala & Fundraiser Service", desc: "Plated service for up to 500 with synchronized course timing.", price: "custom" },
      { name: "Food Stations & Displays", desc: "Interactive stations — carving, pasta, street-food, dessert walls.", price: "from $22/pp" },
      { name: "Dietary-Inclusive Menus", desc: "Halal, kosher-style, vegan, and allergy-aware menus without the compromise.", price: "custom" }
    ],
    emailSignupCount: 158, leadsThisMonth: 27,
    seo: {
      title: "Orlando Event Catering — Corporate, Wedding & Gala Catering in Orlando, FL | Florida Gold Card",
      description: "Orlando Event Catering serves Central Florida with custom menus for corporate lunches, weddings, and 500-guest galas. Free tasting for two and 10% off first corporate orders.",
      h1: "Orlando Event Catering — Central Florida's Full-Service Caterer",
      localKeywords: ["catering Orlando FL", "corporate catering Orlando", "wedding caterer Central Florida", "gala catering Orlando", "office lunch catering Orlando"],
      faqs: [
        { q: "What size events do you cater?", a: "From 20-person office lunches to 500-guest plated galas — the kitchen and events team scale to the brief, with rentals and staffing handled in-house." },
        { q: "Can we taste the menu first?", a: "Yes — the tasting room is part of every consultation, and it's free for two with the Gold Card offer." },
        { q: "Do you handle dietary requirements?", a: "Dietary-inclusive is a specialty: halal, kosher-style, vegan, and allergy-aware menus designed to taste like the main menu, not an afterthought." },
        { q: "Are you on venue preferred lists?", a: "Orlando Event Catering is on the preferred caterer list at every major Orlando venue — ask your venue coordinator." }
      ],
      schemaType: "ProfessionalService",
      canonicalUrl: "https://usgoldcard.com/florida/orlando/orlando-event-catering",
      ogTitle: "Orlando Event Catering — From Office Lunches to 500-Guest Galas",
      ogDescription: "Custom menus, full events team, tasting room. Free tasting for two via Florida Gold Card.",
      imageAltText: "Plated gala dinner service prepared by Orlando Event Catering for a 500-guest event in Central Florida",
      stateSeoIntro: "Part of Florida Gold Card — Florida's network of SEO-built local business pages.",
      citySeoIntro: "Fifteen years feeding Central Florida's biggest moments.",
      categorySeoIntro: "A Florida Gold Card catering leader: corporate, weddings, and galas.",
      nearbyCities: ["tampa", "st-petersburg"],
      relatedCategories: ["restaurants", "professional-services"],
      primarySearchIntent: "orlando event catering",
      secondarySearchIntents: ["corporate caterer orlando", "wedding catering central florida", "office lunch delivery orlando"],
      offers: {
        title: "Orlando Event Catering Offers — Free Tasting + 10% Off First Corporate Order",
        description: "Orlando Event Catering deals: a free tasting-room visit for two with any consultation, and 10% off first corporate catering orders of $500+ via Florida Gold Card.",
        h1: "Orlando Event Catering — Current Offers",
        intro: "Start with the tasting room — free for two when you book a consultation. And if your company's first order tops $500, take 10% off. Planning an event was never the fun part; the tasting is."
      },
      menu: {
        title: "Orlando Event Catering Services — Corporate, Weddings, Galas & Stations",
        description: "Explore Orlando Event Catering's services: recurring corporate lunch programs, wedding catering with tastings, plated gala service for 500, food stations, and dietary-inclusive menus.",
        h1: "Catering Services & Menus — Orlando Event Catering",
        intro: "Five service lines cover almost every event Central Florida throws. Every engagement starts in the tasting room and ends with a timeline the events team runs to the minute."
      }
    }
  },
  {
    id: 14, slug: "phoenix-boutique-market", name: "Phoenix Boutique Market",
    state: "arizona", city: "phoenix", category: "local-shops",
    subcategory: "Local Shops · Boutique · Makers Market",
    address: "5015 N Central Ave, Phoenix, AZ 85012", phone: "(602) 555-1438",
    website: "phoenixboutiquemarket.com",
    shortDescription: "A desert-modern collective of 30+ Arizona makers — apparel, ceramics, prints, and gifts you can't find anywhere else.",
    longDescription: "Phoenix Boutique Market gathers more than thirty Arizona makers under one desert-modern roof on Central Avenue: small-batch apparel, hand-thrown ceramics, saguaro-and-sunset print art, candles poured in Tempe, and a rotating guest-maker wall that changes monthly. It's the anti-mall — every shelf has a name and a story behind it, and the First Friday events turn the shop into the neighborhood's living room.",
    tags: ["Local Makers", "Boutique", "Gifts", "Ceramics", "First Fridays", "Arizona-Made"],
    image: { hue: 25, emoji: "🌵", label: "30+ Arizona makers" },
    gallery: [
      { alt: "Desert-modern interior with maker goods displayed at Phoenix Boutique Market on Central Avenue", label: "The maker floor" },
      { alt: "Hand-thrown ceramics by Arizona artists at Phoenix Boutique Market in Phoenix", label: "Hand-thrown ceramics" },
      { alt: "First Friday evening event crowd at Phoenix Boutique Market", label: "First Friday nights" }
    ],
    offer: {
      title: "15% Off Your First Visit",
      details: "First time in? Take 15% off everything in your basket. Show your Gold Card offer at the counter.",
      type: "retail", tag: "New Customer"
    },
    featured: false, homepageRotation: true, premiumAd: false,
    tier: "gold", platinumEligible: false,
    hours: ["Tue–Sat 10:00 AM – 7:00 PM", "Sun 11:00 AM – 5:00 PM", "First Fridays until 9:00 PM"],
    highlights: [
      "30+ Arizona makers under one roof",
      "Rotating guest-maker wall, new each month",
      "First Friday events with live makers",
      "Every shelf has a name and a story"
    ],
    menuLabel: "Showcase",
    menuItems: [
      { name: "Arizona-Made Apparel", desc: "Small-batch tees, hats, and desert-wear from Phoenix designers." },
      { name: "Hand-Thrown Ceramics", desc: "Mugs, planters, and tableware from valley studios." },
      { name: "Desert Print Art", desc: "Saguaro, sunset, and midcentury-Phoenix prints in all sizes." },
      { name: "Tempe-Poured Candles", desc: "Creosote-after-rain is the one everyone buys twice." },
      { name: "Guest Maker Wall", desc: "A new Arizona maker takes the wall every month — first look on First Friday." }
    ],
    emailSignupCount: 221, leadsThisMonth: 8,
    seo: {
      title: "Phoenix Boutique Market — Arizona Makers & Local Gifts | Phoenix, AZ | Arizona Gold Card",
      description: "Phoenix Boutique Market brings 30+ Arizona makers together on Central Ave: apparel, ceramics, prints, and candles. First visit 15% off with Arizona Gold Card.",
      h1: "Phoenix Boutique Market — 30+ Arizona Makers on Central Avenue",
      localKeywords: ["local shops Phoenix AZ", "Arizona makers market", "boutique Central Ave Phoenix", "local gifts Phoenix", "First Friday Phoenix shopping"],
      faqs: [
        { q: "What is Phoenix Boutique Market?", a: "A collective shop of more than thirty Arizona makers — apparel, ceramics, prints, candles, and gifts — under one desert-modern roof on Central Avenue." },
        { q: "What happens on First Fridays?", a: "The shop stays open until 9 PM, the month's guest maker debuts on the wall, and makers are often in the shop with their work." },
        { q: "How do I get the first-visit discount?", a: "Show the Arizona Gold Card offer at the counter on your first visit and take 15% off everything in your basket." }
      ],
      schemaType: "Store",
      canonicalUrl: "https://usgoldcard.com/arizona/phoenix/phoenix-boutique-market",
      ogTitle: "Phoenix Boutique Market — The Anti-Mall on Central Ave",
      ogDescription: "30+ Arizona makers: ceramics, apparel, prints, candles. 15% off your first visit via Arizona Gold Card.",
      imageAltText: "Desert-modern interior of Phoenix Boutique Market displaying goods from thirty Arizona makers on Central Avenue",
      stateSeoIntro: "Part of Arizona Gold Card — Arizona's growing network of SEO-built local business pages.",
      citySeoIntro: "The Valley's anti-mall: every shelf has a maker's name on it.",
      categorySeoIntro: "An Arizona Gold Card founding shop and First Friday destination.",
      nearbyCities: ["scottsdale"],
      relatedCategories: ["antiques", "restaurants"],
      primarySearchIntent: "phoenix boutique market",
      secondarySearchIntents: ["arizona made gifts phoenix", "makers market central ave", "local boutique phoenix"],
      offers: {
        title: "Phoenix Boutique Market Offers — 15% Off First Visit | Phoenix, AZ",
        description: "Phoenix Boutique Market's first-visit deal: 15% off everything in your basket, on goods from 30+ Arizona makers. Claim it via Arizona Gold Card.",
        h1: "Phoenix Boutique Market — First-Visit Offer",
        intro: "One clean offer for first-timers: 15% off your whole basket. Fair warning — the creosote candle and a hand-thrown mug have a way of finding their way in."
      },
      menu: {
        title: "Phoenix Boutique Market Showcase — Apparel, Ceramics, Prints & Candles",
        description: "Inside Phoenix Boutique Market: Arizona-made apparel, hand-thrown ceramics, desert print art, Tempe-poured candles, and a monthly rotating guest-maker wall.",
        h1: "What's Inside — Phoenix Boutique Market",
        intro: "Thirty-plus makers means the inventory reads like a map of Arizona's creative scene. Here are the anchors — plus the guest wall that changes every month."
      }
    }
  },
  {
    id: 15, slug: "denver-fitness-studio", name: "Denver Fitness Studio",
    state: "colorado", city: "denver", category: "fitness-wellness",
    subcategory: "Fitness · Wellness · Group Classes",
    address: "3120 Blake St, Denver, CO 80205", phone: "(303) 555-1521",
    website: "denverfitnessstudio.com",
    shortDescription: "Small-group strength, altitude-smart conditioning, and recovery classes in a converted RiNo warehouse.",
    longDescription: "Denver Fitness Studio turned a RiNo warehouse into the neighborhood's training home: small-group strength classes capped at 12, altitude-smart conditioning designed for mile-high lungs, sunrise yoga on the mezzanine, and a recovery room with sauna and cold plunge. Coaches program in four-week blocks, first-timers get a free intro session, and the community WhatsApp probably plans more group hikes than workouts. No contracts — memberships are month-to-month.",
    tags: ["Small-Group Training", "Strength", "Yoga", "Recovery", "Sauna & Cold Plunge", "RiNo Denver"],
    image: { hue: 190, emoji: "🧘", label: "Warehouse strength & recovery" },
    gallery: [
      { alt: "Small-group strength class in the converted warehouse at Denver Fitness Studio in RiNo", label: "Strength block, capped at 12" },
      { alt: "Sunrise yoga class on the mezzanine at Denver Fitness Studio in Denver, Colorado", label: "Mezzanine sunrise yoga" },
      { alt: "Recovery room with sauna and cold plunge at Denver Fitness Studio", label: "Sauna & cold plunge" }
    ],
    offer: {
      title: "Free Intro Session + First Month $99",
      details: "New members get a free small-group intro session, and the first month of unlimited classes is $99 (reg. $159). Mention your Gold Card offer.",
      type: "service", tag: "New Member"
    },
    featured: false, homepageRotation: true, premiumAd: false,
    tier: "gold", platinumEligible: false,
    hours: ["Mon–Fri 5:30 AM – 8:30 PM", "Sat–Sun 7:00 AM – 2:00 PM"],
    highlights: [
      "Small-group classes capped at 12",
      "Altitude-smart conditioning programs",
      "Recovery room: sauna + cold plunge",
      "Month-to-month, no contracts"
    ],
    menuLabel: "Classes & Services",
    menuItems: [
      { name: "Small-Group Strength", desc: "Coached barbell and dumbbell blocks, capped at 12, programmed in 4-week cycles.", price: "from $25/class" },
      { name: "Altitude Conditioning", desc: "Engine-building intervals designed for mile-high training.", price: "from $22/class" },
      { name: "Mezzanine Sunrise Yoga", desc: "Vinyasa and mobility flows as the sun comes up over RiNo.", price: "from $18/class" },
      { name: "Recovery Room Pass", desc: "Sauna + cold plunge circuit, 45 minutes.", price: "$20" },
      { name: "Unlimited Membership", desc: "All classes plus recovery room access. Month-to-month.", price: "$159/mo" }
    ],
    emailSignupCount: 187, leadsThisMonth: 16,
    seo: {
      title: "Denver Fitness Studio — Small-Group Training & Recovery in RiNo | Denver, CO | Colorado Gold Card",
      description: "Denver Fitness Studio offers small-group strength, altitude-smart conditioning, yoga, and a sauna/cold-plunge recovery room in a RiNo warehouse. First month $99 with Gold Card.",
      h1: "Denver Fitness Studio — RiNo's Warehouse Training Home",
      localKeywords: ["fitness studio Denver CO", "small group training RiNo", "gym Blake Street Denver", "cold plunge Denver", "yoga RiNo Denver"],
      faqs: [
        { q: "Are classes really capped at 12?", a: "Yes — every strength and conditioning class caps at 12 so coaches can actually coach. Book through the schedule; popular times fill early." },
        { q: "What is altitude-smart conditioning?", a: "Interval programming adjusted for Denver's elevation — building your engine without redlining mile-high lungs. It's the class visitors feel the next day." },
        { q: "Is there a contract?", a: "No — memberships are month-to-month, and the Gold Card offer makes your first unlimited month $99 with a free intro session." },
        { q: "What's in the recovery room?", a: "A sauna and cold plunge circuit, bookable in 45-minute sessions and included with unlimited membership." }
      ],
      schemaType: "HealthAndBeautyBusiness",
      canonicalUrl: "https://usgoldcard.com/colorado/denver/denver-fitness-studio",
      ogTitle: "Denver Fitness Studio · RiNo — Strength, Altitude Conditioning & Cold Plunge",
      ogDescription: "Small-group training capped at 12 in a converted warehouse. Free intro + first month $99 via Colorado Gold Card.",
      imageAltText: "Small-group strength class training in the converted warehouse gym at Denver Fitness Studio in Denver's RiNo district",
      stateSeoIntro: "Part of Colorado Gold Card — Colorado's growing network of SEO-built local business pages.",
      citySeoIntro: "RiNo's training home: strength, altitude conditioning, and a serious recovery room.",
      categorySeoIntro: "A Colorado Gold Card founding fitness studio in a converted warehouse.",
      nearbyCities: ["boulder"],
      relatedCategories: ["salons", "restaurants"],
      primarySearchIntent: "denver fitness studio",
      secondarySearchIntents: ["small group training denver", "cold plunge rino", "gym near blake street denver"],
      offers: {
        title: "Denver Fitness Studio Offers — Free Intro + First Month $99 | Denver, CO",
        description: "Denver Fitness Studio's new-member deal: a free small-group intro session and your first month of unlimited classes for $99 instead of $159, via Colorado Gold Card.",
        h1: "Denver Fitness Studio — New Member Offer",
        intro: "The on-ramp is simple: one free intro session to learn the room, then a full month of unlimited classes for $99. No contract on the other side — just month-to-month."
      },
      menu: {
        title: "Denver Fitness Studio Classes — Strength, Conditioning, Yoga & Recovery | RiNo",
        description: "Every class and service at Denver Fitness Studio: small-group strength, altitude conditioning, mezzanine sunrise yoga, recovery room passes, and unlimited membership.",
        h1: "Classes & Services — Denver Fitness Studio",
        intro: "Four class types and a recovery room cover the whole training week. Everything is coached, capped, and programmed in four-week blocks — here's the lineup."
      }
    }
  }
];

/* ---------------- CAMPAIGNS (admin) ---------------- */
const CAMPAIGN_SEGMENTS = [
  { id: "all", name: "All U.S. Gold Card subscribers", count: 20410 },
  { id: "utah", name: "Utah subscribers", count: 4820 },
  { id: "nebraska", name: "Nebraska subscribers", count: 1930 },
  { id: "new-york", name: "New York subscribers", count: 3610 },
  { id: "restaurants", name: "Restaurant subscribers", count: 8940 },
  { id: "home-services", name: "Home services subscribers", count: 2870 },
  { id: "birthday", name: "Birthday club", count: 3350 },
  { id: "family", name: "Family deals", count: 4160 },
  { id: "catering", name: "Catering", count: 1490 }
];

const CAMPAIGNS = [
  { id: 1, name: "Best Mexican Food This Weekend", scope: "City", segment: "utah", segmentLabel: "Utah subscribers", date: "Jul 11", status: "scheduled", businesses: ["fajita-grill"], openRate: "—", clicks: "—" },
  { id: 2, name: "Omaha Local Deals", scope: "City", segment: "nebraska", segmentLabel: "Omaha-area subscribers", date: "Jul 8", status: "scheduled", businesses: ["omaha-family-pizza"], openRate: "—", clicks: "—" },
  { id: 3, name: "Utah Family Dinner Picks", scope: "State", segment: "utah", segmentLabel: "Utah subscribers", date: "Jun 27", status: "sent", businesses: ["fajita-grill", "ogden-coffee-house"], openRate: "41.2%", clicks: "486" },
  { id: 4, name: "New York Local Shops", scope: "State", segment: "new-york", segmentLabel: "New York subscribers", date: "Jun 24", status: "sent", businesses: ["buffalo-main-street-flowers"], openRate: "38.7%", clicks: "312" },
  { id: 5, name: "Birthday Club Offers — July", scope: "National", segment: "birthday", segmentLabel: "Birthday club", date: "Jul 1", status: "sent", businesses: ["golden-hour-salon", "brooklyn-dessert-bar", "dallas-kids-adventure-zone"], openRate: "52.4%", clicks: "731" },
  { id: 6, name: "Catering for Office Lunches", scope: "Category", segment: "catering", segmentLabel: "Catering segment", date: "Jul 15", status: "draft", businesses: ["orlando-event-catering", "fajita-grill"], openRate: "—", clicks: "—" },
  { id: 7, name: "New Local Businesses — Mountain West", scope: "Regional", segment: "all", segmentLabel: "UT / CO / AZ subscribers", date: "Jul 18", status: "draft", businesses: ["denver-fitness-studio", "phoenix-boutique-market"], openRate: "—", clicks: "—" },
  { id: 8, name: "Hidden Gems Near You", scope: "National", segment: "all", segmentLabel: "All subscribers", date: "Jul 22", status: "draft", businesses: ["heritage-clock-antiques", "brooklyn-dessert-bar", "phoenix-boutique-market"], openRate: "—", clicks: "—" },
  { id: 9, name: "Home Services Fall Prep", scope: "Category", segment: "home-services", segmentLabel: "Home services subscribers", date: "Jul 25", status: "draft", businesses: ["wasatch-home-repair", "austin-home-repair-pros"], openRate: "—", clicks: "—" },
  { id: 10, name: "Florida Weekend Treats", scope: "State", segment: "all", segmentLabel: "Florida subscribers", date: "Jul 29", status: "draft", businesses: ["tampa-bay-smoothie-bar", "orlando-event-catering"], openRate: "—", clicks: "—" }
];

/* Admin metadata per business (status, billing) */
const ADMIN_META = {
  "fajita-grill":              { status: "Featured", setupFee: 249, checklist: [true, true, true, true, true, true] },
  "ogden-coffee-house":        { status: "Live", setupFee: 149, checklist: [true, true, true, true, true, false] },
  "heritage-clock-antiques":   { status: "Needs photos", setupFee: 99, checklist: [true, true, false, true, false, false] },
  "golden-hour-salon":         { status: "Featured", setupFee: 249, checklist: [true, true, true, true, true, true] },
  "wasatch-home-repair":       { status: "Live", setupFee: 149, checklist: [true, true, true, true, false, true] },
  "omaha-family-pizza":        { status: "Featured", setupFee: 249, checklist: [true, true, true, true, true, true] },
  "lincoln-fresh-bowls":       { status: "Live", setupFee: 149, checklist: [true, true, true, true, true, false] },
  "buffalo-main-street-flowers": { status: "Live", setupFee: 149, checklist: [true, true, true, false, true, false] },
  "brooklyn-dessert-bar":      { status: "Featured", setupFee: 249, checklist: [true, true, true, true, true, true] },
  "austin-home-repair-pros":   { status: "Featured", setupFee: 249, checklist: [true, true, true, true, true, true] },
  "dallas-kids-adventure-zone": { status: "Live", setupFee: 149, checklist: [true, true, true, true, true, false] },
  "tampa-bay-smoothie-bar":    { status: "Needs offer", setupFee: 99, checklist: [true, true, true, false, false, false] },
  "orlando-event-catering":    { status: "Live", setupFee: 249, checklist: [true, true, true, true, true, false] },
  "phoenix-boutique-market":   { status: "Needs SEO review", setupFee: 149, checklist: [true, true, true, true, false, false] },
  "denver-fitness-studio":     { status: "Live", setupFee: 149, checklist: [true, true, true, true, true, false] }
};

const CHECKLIST_STEPS = [
  "Intake form & business details collected",
  "Main business page built & SEO fields written",
  "Offer page live with current promotion",
  "Menu / services / showcase page complete",
  "Photos received & gallery published",
  "First campaign inclusion scheduled"
];

/* ---------------- LOOKUPS ---------------- */
const findState = s => STATES.find(x => x.slug === s);
const findCity = c => CITIES.find(x => x.slug === c);
const findCategory = c => CATEGORIES.find(x => x.slug === c);
const findBusiness = slug => BUSINESSES.find(b => b.slug === slug);
const bizIn = (opts = {}) => BUSINESSES.filter(b =>
  (!opts.state || b.state === opts.state) &&
  (!opts.city || b.city === opts.city) &&
  (!opts.category || b.category === opts.category)
);
const citiesIn = stateSlug => CITIES.filter(c => c.state === stateSlug);
const bizUrl = b => `#/${b.state}/${b.city}/${b.slug}`;
const bizPath = b => `/${b.state}/${b.city}/${b.slug}`;

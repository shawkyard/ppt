# Scarcity Sourcing Agent — High-Value Part-Numbered Components

**Prepared:** 2026-07-07 · **Horizon:** actionable next 24–72h · **Goal:** capital-light broker/resell deals with **$500–$5,000+ gross profit** per transaction.

> **Read this first — honesty about what this document is.**
> I cannot see live marketplace inventory or real-time quotes from inside this session. Every **price, spread, and "current inventory" figure below is an ESTIMATE** built from (a) verified public market conditions as of mid-2026 and (b) known part-number catalogs. Treat them as *hypotheses to confirm with a live quote*, not facts. Part numbers marked ✓ were confirmed against the manufacturer catalog during research; those marked ⚠ are representative of the family and **must be verified in the OEM part catalog before you quote a buyer**. The three biggest ways to lose money in this business are (1) **counterfeit/remarked parts**, (2) **quoting a spread that evaporates when you get a real supplier price**, and (3) **brokering something you can't actually get delivered**. The workflow at the end is built to kill all three before you commit a dollar.

---

## 1. Market context (verified, mid-2026)

The macro picture is *unusually* favorable for scarcity brokering right now because AI datacenter buildout is starving three of our five categories simultaneously:

- **Server DRAM:** DDR5 ECC RDIMM contract prices rose **~100–116%** from early 2025 to Q1 2026; 64GB RDIMM on track to **double** year-over-year. HBM consumed 23% of DRAM wafers in 2026 (up from 8% in 2024). Spot lead times reported **up to a year**; dealers have abandoned fixed pricing. *(Network World, TrendForce via DatacenterDisk, Wccftech.)*
- **Enterprise SSD/NAND:** Enterprise SSD contract prices **+40–50% in Q4 2025**, forecast **+33–38% Q1 2026**, spot jumps to **+60%**. Western Digital publicly "**sold out for calendar 2026**." Lead times **16–20+ weeks**; high-capacity (30TB+) prioritized but still allocation-gated. *(Fusion Worldwide, Comtek, TrendForce.)*
- **800G optics:** 800G+ shipments projected to **more than double** in 2026 (~24M→63M units). **200G EML laser chips in severe shortage**; NVIDIA reportedly assisting suppliers. *(Utmel, MLQ.ai, Introl.)*
- **Power semis (SiC/IGBT):** AEC-Q101 SiC on **52+ week** lead times; spot premiums **40–80% over contract**. Shortages are **SKU-specific**, which is exactly where a broker with the right line item wins. *(Microchip USA, 773 Group.)*
- **Electrical infrastructure:** Not chip-driven but **obsolescence-driven** — discontinued trip units and legacy breaker frames command large premiums from facilities that can't replace the whole switchboard. Steadiest, least-hyped, most repeatable niche.

**Implication:** categories 1–4 are *demand-shock* scarce (fast money, fast-moving prices, higher counterfeit risk). Category 5 is *obsolescence* scarce (slower, but low fraud risk, repeatable, and the easiest place to start as a pure broker).

---

## 2. Ranked opportunity table

| # | Product / Category | Exact part # / search phrase | Scarcity signal | Estimated buyer | Likely source type | Est. value range (per unit unless noted) | Broker-before-buy? | Risk | Recommended next action |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Server memory** — 64GB DDR5-5600 RDIMM | `MTC40F2046S1RC56BD1` ✓ (Micron); alt `MTC40F2046S1RC64BD2` ✓ (6400) | RDIMM prices doubling; 1-yr lead times | System integrators, MSPs, refresh projects | Excess-inventory brokers, refurb enterprise sellers | ~$320–$650/module; lots of 8–32 → **$3k–$20k** | **High** — commodity PN, easy RFQ match | Med (counterfeit/remark) | Post RFQ to 2–3 brokers; get lot photos + label serials |
| 2 | **Enterprise SSD** — 61.44TB U.2 NVMe | Solidigm D5-P5336 `SSDPF2NV614TZ` ⚠ ; alt Kioxia CD8-R, Micron 6500 | WD "sold out 2026"; 16–20wk lead | AI/cloud builders, storage VARs, HPC labs | Allocation resellers, gray-market distys | ~$3.5k–$6k/drive; **$500–$2k spread each** | **Med-High** — but verify authenticity hard | **High** (counterfeit/DOA) | Require SMART/health export + serial before quoting |
| 3 | **Electrical** — obsolete Micrologic trip units | `S164A` ✓ (6.0P LSIG), `S144A` ✓, `S163A` ✓ (Square D) | Discontinued frames; no drop-in replacement | Facilities/plant electricians, MRO, data-center FM | Surplus electrical dealers, decommissioned gear | ~$400–$2,500 each | **High** — pure broker friendly | **Low** | Best first test. Match a stuck RFQ to a surplus dealer |
| 4 | **Power semis** — 1200V IGBT / SiC module | Infineon `FF450R12ME4` ⚠ (IGBT); `FF11MR12W1M1_B11` ⚠ (CoolSiC) | 52wk lead; 40–80% spot premium | Drive repair shops, inverter/OEM maintenance | Franchise distys' excess, EOL stock | ~$120–$900 each; lots **$2k–$15k** | **Med** — datecode-sensitive | Med-High (counterfeit) | Confirm datecode window + tray/reel condition |
| 5 | **Server memory** — 96GB / 128GB DDR5 RDIMM | Samsung `M321R...` ⚠ 96GB; Micron 128GB 2Rx4 ⚠ | Highest $/module scarcity | High-density AI hosts, in-memory DB | Same as #1, thinner supply | ~$800–$2,200/module; **$1k+ spread** | **Med-High** | Med | Verify exact PN in Samsung/Micron catalog first |
| 6 | **Datacenter optics** — 800G OSFP DR8 | NVIDIA `MMS4X00-NM` ⚠ ; Cisco `QDD-800G-DR8` ⚠ | EML chip shortage; demand 2.6x | AI cluster builders, network integrators | Optics resellers, decomm cluster pulls | ~$1.2k–$3k each; reels of 8–16 | **Med** — vendor-coded compat risk | Med (coding/compat) | Confirm target switch OS + coding before quoting |
| 7 | **Datacenter optics** — 400G QSFP-DD DR4 | Cisco `QDD-400G-DR4-S` ⚠ ; Arista `QDD-400G-DR4` ⚠ | 400G still tight as 800G eats capacity | Enterprise/telco upgrades | Excess distys, refurb network sellers | ~$450–$1,100 each | **High** — mature market | Med (compat) | Ask buyer for exact platform + count |
| 8 | **Enterprise SSD** — 30.72TB U.3/E3.S | Samsung `PM1743` ⚠ ; Kioxia CM7-R ⚠ | Allocation-gated, next tier down | Mid-size cloud, VAR, HPC | Allocation resellers | ~$2.2k–$3.8k/drive; **$400–$1.2k spread** | **Med** | High (counterfeit) | Health export + serial pre-quote |
| 9 | **Electrical** — legacy breaker frames/relays | `PowerPacT P-frame`, `SEPAM relay`, `SPD` surplus | Long OEM lead on legacy switchgear | Utilities, campus FM, industrial MRO | Surplus/decomm electrical | ~$500–$4k each | **High** — broker friendly | Low | Second-easiest repeatable niche after #3 |
| 10 | **Power semis** — Intelligent Power Modules | Infineon/onsemi IPM, drive repair PNs ⚠ | Drive-repair demand, EOL SKUs | Motor/drive repair, robotics maintenance | Distys' excess, obsolescence brokers | ~$80–$600 each; lots | **Med** | Med | Bundle with #4 supplier relationships |

*Spread = plausible gross before shipping/insurance/fees. **All figures ESTIMATE — confirm with a live quote before quoting a buyer.***

---

## 3. Detailed opportunity profiles

Each profile carries the full field set requested plus a 1–5 score on all ten criteria. Scoring key: **5 = strongest.**

### Profile A — 64GB DDR5-5600 ECC RDIMM *(Rank 1)*
- **Category:** Server memory (registered ECC DIMM)
- **Manufacturer:** Micron (primary); equivalents from Samsung, SK hynix
- **Part number:** `MTC40F2046S1RC56BD1` ✓ (64GB, DDR5-5600, 2Rx4, PC5-44800R)
- **Alternate PNs:** `MTC40F2046S1RC64BD2` ✓ (DDR5-6400); Samsung `M321R8GA0BB0`-class ⚠; SK hynix `HMCG94AGBRA` ⚠
- **Compatible platforms:** Intel Xeon Scalable Gen4/5 (Sapphire/Emerald Rapids), AMD EPYC Genoa/Bergamo/Turin; Dell R660/R760, HPE DL360/380 Gen11, Supermicro X13/H13
- **Current visible inventory (EST):** thin at authorized; broker lots 8–64 modules circulate
- **Typical listed price (EST):** $320–$650/module depending on speed bin & seller tier
- **Estimated buyer price:** $380–$720/module for verified stock with fast delivery
- **Estimated resale spread:** $40–$180/module → **$3k–$20k per lot** of 8–32
- **Shortage signal:** RDIMM prices doubling YoY; spot lead times up to a year; sellers dropped fixed pricing
- **Buyer types:** system integrators, MSPs building/refreshing fleets, HPC labs, resellers with a stuck BOM line
- **Why urgent:** a server refresh or AI host build **cannot ship** without its DIMMs; one missing line item holds an entire PO. That urgency is the whole trade.
- **Brokerable before purchase?** Yes — commodity PN, easy to match an RFQ to a broker lot and mark up.
- **Authentication:** label photos (Micron FBGA + PN + datecode), serial ranges, ideally SPD readout; buy from sellers who allow inspection/return.
- **Shipping/insurance:** trivial — light, small, high value density; anti-static + insured courier.
- **Export/compliance:** low; standard commercial memory, not restricted. (Confirm end-use if shipping outside US.)
- **Counterfeit risk:** **medium** — remarked/lower-bin modules exist; mitigate with SPD read + reputable seller.
- **Outreach angle:** "I have verified [qty]× `MTC40F2046S1RC56BD1` ready to ship — what's your need and target landed price?"
- **Scores:** Scarcity 5 · Urgency 5 · Value density 5 · Shipping 5 · Authentication 3 · # Buyers 5 · Margin 4 · Brokerability 5 · Compliance 5 · Repeatability 5 → **Total 47/50**

### Profile B — 61.44TB U.2 NVMe Enterprise SSD *(Rank 2)*
- **Category:** Enterprise storage (high-capacity read-intensive NVMe)
- **Manufacturer:** Solidigm (D5-P5336); alts Kioxia, Micron, Samsung
- **Part number:** Solidigm D5-P5336 `SSDPF2NV614TZ` ⚠ (verify exact suffix for 61.44TB U.2)
- **Alternate PNs:** Kioxia CD8-R ⚠, Micron 6500 ION ⚠, Samsung PM9A3 (lower cap) — capacities/interfaces differ, confirm
- **Compatible platforms:** U.2/U.3 NVMe bays in Dell/HPE/Supermicro storage nodes, Ceph/MinIO clusters, AI data-lake tiers
- **Current visible inventory (EST):** allocation-gated; occasional gray-market/decomm lots
- **Typical listed price (EST):** $3,500–$6,000/drive
- **Estimated buyer price:** $4,000–$6,500 for verified, health-checked stock
- **Estimated resale spread:** **$500–$2,000/drive**
- **Shortage signal:** WD "sold out for calendar 2026"; 16–20+ wk lead; enterprise SSD +40–60%
- **Buyer types:** AI/cloud infra builders, storage VARs, HPC/research storage, backup/archive refreshes
- **Why urgent:** capacity per rack-U is the constraint; can't get drives = can't light up the storage node they already bought servers for.
- **Brokerable before purchase?** Possible, but **authentication is the gate** — never broker a drive you can't verify.
- **Authentication:** SMART/health export (power-on hours, wear, reallocated sectors), serial + FW, ideally short SSD benchmark; RMA/return terms.
- **Shipping/insurance:** easy; foam-packed, insured, avoid ESD.
- **Export/compliance:** low; standard commercial storage. Confirm no re-export to restricted end users.
- **Counterfeit/DOA risk:** **high** — relabeled capacity, high-wear "new," DOA. This is where brokers get burned. Health export is non-negotiable.
- **Outreach angle:** "Sourcing verified 61.44TB enterprise NVMe with health reports — how many bays and what's your platform?"
- **Scores:** Scarcity 5 · Urgency 5 · Value density 5 · Shipping 4 · Authentication 2 · # Buyers 4 · Margin 5 · Brokerability 3 · Compliance 5 · Repeatability 4 → **Total 42/50**

### Profile C — Obsolete Square D Micrologic Trip Units *(Rank 3 — best first test)*
- **Category:** Electrical infrastructure (electronic trip units for MCCBs)
- **Manufacturer:** Square D / Schneider Electric
- **Part number:** `S164A` ✓ (Micrologic 6.0P LSIG); alts `S144A` ✓, `S163A` ✓
- **Alternate PNs:** other S-series trip units by frame (P/R-frame PowerPacT); Micrologic 5.0/6.0 variants
- **Compatible platforms:** PowerPacT P- and R-frame molded-case breakers in existing switchboards
- **Current visible inventory (EST):** scattered across surplus/decommission dealers; genuinely stuck buyer RFQs recur
- **Typical listed price (EST):** $400–$2,500 each
- **Estimated buyer price:** $600–$3,000 when the buyer is down and can't wait
- **Estimated resale spread:** **$200–$1,000+ each**
- **Shortage signal:** obsolescence — no drop-in modern replacement without swapping the breaker/switchboard (a far larger, permitted job)
- **Buyer types:** plant/facility electricians, data-center facilities mgmt, hospitals/campuses, industrial MRO
- **Why urgent:** a failed trip unit on a critical feeder = protection is offline; replacing the whole switchgear means downtime + electrician + permits. A used-good trip unit is a **10–100× cheaper** fix, so they pay a premium to get one *today*.
- **Brokerable before purchase?** **Yes — cleanest pure-broker item here.** Match a stuck RFQ to a surplus dealer, take a margin, never touch inventory.
- **Authentication:** photos of nameplate/PN/frame compatibility; visual condition; seller's test/warranty statement. Low tech-fraud surface.
- **Shipping/insurance:** easy; small, rugged, moderate value.
- **Export/compliance:** low.
- **Counterfeit risk:** **low** — little incentive to counterfeit a used trip unit; main risk is wrong-frame mismatch (solved by confirming breaker frame).
- **Outreach angle:** "Do you still need an `S164A` trip unit? I can source a tested unit and ship this week."
- **Scores:** Scarcity 4 · Urgency 5 · Value density 4 · Shipping 5 · Authentication 5 · # Buyers 3 · Margin 4 · Brokerability 5 · Compliance 5 · Repeatability 5 → **Total 45/50**

### Profile D — 1200V IGBT / CoolSiC Power Modules *(Rank 4)*
- **Category:** Power electronics (industrial drive/inverter modules)
- **Manufacturer:** Infineon (also Semikron-Danfoss, onsemi, Mitsubishi)
- **Part number:** `FF450R12ME4` ⚠ (1200V EconoDUAL IGBT); `FF11MR12W1M1_B11` ⚠ (CoolSiC MOSFET module)
- **Alternate PNs:** frame-equivalent EconoDUAL/EasyPACK modules; Mitsubishi CM-series; Semikron SEMiX ⚠
- **Compatible platforms:** VFDs, industrial motor drives, solar/wind inverters, welding/traction, robotics power stages
- **Current visible inventory (EST):** SKU-specific holes; franchise disty excess and EOL stock circulate
- **Typical listed price (EST):** $120–$900/module
- **Estimated buyer price:** $180–$1,300 when a drive is down and the PN is on 52-wk lead
- **Estimated resale spread:** per-unit $60–$400; lots **$2k–$15k**
- **Shortage signal:** SiC on 52+ wk lead; spot premiums 40–80% over contract; SKU-specific gaps
- **Buyer types:** drive/inverter repair shops, OEM maintenance, robotics integrators
- **Why urgent:** a dead module = a dead production line; repair shops pay spot premiums to turn a machine back on.
- **Brokerable before purchase?** Yes, but **datecode & handling matter** — buyers reject old/abused stock.
- **Authentication:** manufacturer datecode/lot, tray/reel condition, MSL handling, ideally curve-trace test; buy from franchise-excess where possible.
- **Shipping/insurance:** easy; ESD/MSL-aware packaging.
- **Export/compliance:** mostly low for standard industrial IGBTs; **verify** — some high-power/SiC and defense-adjacent parts carry ECCN classifications. Screen end user.
- **Counterfeit risk:** **medium-high** — remarked/recycled modules are a known problem; datecode + reputable source is the defense.
- **Outreach angle:** "Sourcing `FF450R12ME4` from franchise-excess with datecodes — quantity and target date?"
- **Scores:** Scarcity 4 · Urgency 4 · Value density 3 · Shipping 4 · Authentication 3 · # Buyers 4 · Margin 4 · Brokerability 3 · Compliance 3 · Repeatability 4 → **Total 36/50**

### Profiles E–J (condensed)
| Profile | PN | Key scores (Sc/Urg/VD/Ship/Auth/Buyers/Margin/Brok/Comp/Rep) | Total |
|---|---|---|---|
| E — 96/128GB DDR5 RDIMM | Samsung `M321R…` ⚠ / Micron 128GB ⚠ | 5/4/5/5/3/3/5/3/5/4 | **42** |
| F — 800G OSFP DR8 | `MMS4X00-NM` ⚠ / `QDD-800G-DR8` ⚠ | 5/4/4/5/2/3/5/3/4/4 | **39** |
| G — 400G QSFP-DD DR4 | `QDD-400G-DR4-S` ⚠ | 4/3/4/5/3/4/3/4/4/5 | **39** |
| H — 30.72TB U.3/E3.S SSD | Samsung `PM1743` ⚠ / Kioxia CM7-R ⚠ | 5/4/5/4/2/4/4/3/5/4 | **40** |
| I — legacy breaker frames/relays | `PowerPacT P-frame`, `SEPAM` ⚠ | 4/4/4/4/5/3/4/5/5/5 | **43** |
| J — Intelligent Power Modules | Infineon/onsemi IPM ⚠ | 3/4/3/4/3/4/3/3/3/4 | **34** |

> Note how the top of the ranked table balances raw score against **how easy it is to *start*.** Profile A (memory) scores highest overall, but Profiles C and I (electrical) are where a first-timer should place the very first broker deal: lowest fraud risk, cleanest pure-broker mechanics, most forgiving of a mistake.

---

## 4. Buyer outreach message (template)

> **Subject:** [PN] in stock — availability + landed price
>
> Hi [Name],
>
> I source scarce enterprise hardware by exact part number and I currently have a line on **[PN — e.g. `MTC40F2046S1RC56BD1`, 64GB DDR5-5600 RDIMM]**.
>
> Before I quote, three quick questions so I don't waste your time:
> 1. **Quantity** you need (and is a partial fill useful)?
> 2. **Target landed price** or the price you're currently being quoted?
> 3. **How soon** — is this holding up a build/PO right now?
>
> I can provide label photos, serials, and (for storage/optics) health/coding reports before you commit, and I ship insured with inspection terms. If the fit's right I'll turn a firm quote around same-day.
>
> Thanks,
> [Your name] · [phone] · [company]

*Tuning: for **electrical/MRO** buyers lead with downtime ("can ship a tested unit this week"); for **integrators** lead with the stuck-BOM angle; for **storage/optics** lead with verification ("health reports / coding confirmed before you pay").*

---

## 5. Supplier verification message (template)

> **Subject:** RFQ + verification — [PN], [qty]
>
> Hi [Name],
>
> Interested in **[qty]× [PN]**. To move fast on my end I need:
>
> 1. **Unit price** at [qty], and price breaks at [next tier].
> 2. **Condition:** new/factory-sealed, OEM-excess, refurbished, or pulls? **Datecode/lot** range?
> 3. **Verification you can provide before payment:** clear photos of labels/PN/serials; for **memory** an SPD readout; for **SSDs** a SMART/health export (power-on hours, wear, reallocated sectors); for **optics** the vendor coding + a diagnostic read; for **power modules** datecode + tray/reel condition.
> 4. **Terms:** lead time, who holds title/when, **return/RMA policy**, and whether you'll accept **escrow or third-party inspection** for the first deal.
> 5. **Traceability:** where did the stock originate (which reduces counterfeit risk)?
>
> I work repeat volume with suppliers who verify cleanly. If this checks out, I'll place the order quickly and come back regularly.
>
> [Your name] · [company] · [phone]

**Red flags that kill a supplier:** refuses serials/photos, won't do escrow on a first deal, price far below market with "must wire today" pressure, stock photos only, no origin/traceability, insists on crypto/irreversible payment. Any one → walk.

---

## 6. 24-hour sourcing workflow

**Hours 0–2 — Pick the lane.** Choose ONE part number to run end-to-end (recommend a Profile C `S164A` trip unit or a Profile A `MTC40F2046S1RC56BD1` lot — highest brokerability). Confirm the exact PN in the OEM catalog. Write down your **walk-away max buy price**.

**Hours 2–5 — Prove demand exists.** Run the top search queries (§7). Find **live buyer signals**: open RFQs, "WTB/looking for" posts, shortage threads, procurement/LinkedIn asks. You want **≥2 real buyers** before sourcing — no demand, no deal. Send the buyer message (§4) to gather quantity + target price. *Sell the appointment, not the product yet.*

**Hours 5–9 — Source against real demand.** Send the supplier message (§5) to 3–5 sources. Require verification artifacts up front. Log every quote in a sheet: PN, source, price, condition, datecode, lead time, verification offered, terms.

**Hours 9–13 — Verify & compute the real spread.** Compare best *verified* supplier price to buyer's target. Subtract shipping, insurance, escrow/fees, and a **counterfeit-risk buffer**. If the true gross clears **$500+** and verification is solid → proceed. If not → drop it, pick the next PN. Discipline here is the whole game.

**Hours 13–18 — Structure the deal capital-light.** Preferred: buyer PO/deposit **before** you pay the supplier, or drop-ship supplier→buyer with you on title briefly. For a first deal with a new supplier, use **escrow or third-party inspection**. Never wire full value to an unverified source against an unconfirmed buyer.

**Hours 18–22 — Close & document.** Firm quote to buyer; on acceptance, execute the pre-agreed structure. Capture serials/photos/health reports in writing on both sides. Ship insured with inspection terms.

**Hours 22–24 — Systematize.** Log outcome, actual margin, cycle time, and every supplier/buyer contact into a CRM/sheet. **The relationships are the asset** — the repeatable money is in becoming the person people ping when a PN goes scarce.

---

## 7. Top 20 search queries to run next

**Memory (1–4)**
1. `MTC40F2046S1RC56BD1 in stock` / `MTC40F2046S1RC64BD2 available`
2. `WTB 64GB DDR5 RDIMM lot` OR `"looking for" DDR5-5600 ECC RDIMM RFQ`
3. `96GB DDR5 RDIMM excess inventory broker`
4. `Samsung M321R 128GB DDR5 RDIMM availability`

**Storage (5–8)**
5. `Solidigm D5-P5336 61.44TB in stock` / `SSDPF2NV614TZ availability`
6. `Kioxia CD8-R 30.72TB U.3 broker excess`
7. `WTB enterprise NVMe 30TB 60TB RFQ`
8. `Micron 6500 ION 30.72TB stock lead time`

**Optics (9–12)**
9. `QDD-800G-DR8 in stock` / `MMS4X00-NM availability`
10. `QDD-400G-DR4-S excess inventory`
11. `800G OSFP transceiver RFQ shortage`
12. `decommissioned 400G/800G optics lot for sale`

**Power semis (13–16)**
13. `FF450R12ME4 in stock franchise excess`
14. `CoolSiC FF11MR12W1M1 availability lead time`
15. `WTB IGBT module drive repair RFQ`
16. `EconoDUAL / EasyPACK IGBT excess inventory datecode`

**Electrical (17–20)**
17. `Square D S164A trip unit in stock` / `S144A / S163A surplus`
18. `WTB Micrologic trip unit obsolete PowerPacT`
19. `surplus electrical Micrologic trip unit dealer`
20. `decommissioned switchgear breaker frame relay for sale`

*Where to run them:* part-number search engines (Octopart, FindChips, oemsecrets, memory.net), broker/excess marketplaces, refurb enterprise sellers, LinkedIn + procurement forums, industry shortage threads, and **established** business listings on eBay (verified seller history only).

---

## 8. Standing rules (do not skip)

- **Confirm the exact PN in the OEM catalog before quoting.** A wrong suffix = wrong part = dead deal or a chargeback.
- **Demand before supply.** Never buy inventory hoping to place it. Two real buyers first.
- **Verify before you pay.** Serials/photos always; SPD (memory), SMART/health (SSD), coding+diagnostic (optics), datecode (power modules).
- **Counterfeit is the #1 loss vector** in memory, SSD, optics, and power modules. Reputable source + verification artifacts + escrow on first deals.
- **Compliance screen** the end user/destination, especially for power semis and anything shipping abroad; walk from anything export-restricted you can't clear.
- **Start where fraud risk is lowest** (electrical trip units / breaker frames), bank a clean win, then scale into memory and storage where the dollars are bigger.
- **The relationships compound.** One verified supplier + one repeat buyer per category beats chasing one-off lots forever.

---

### Sources (market context)
- Network World — *Server memory prices could double by 2026 as AI demand strains supply*
- DatacenterDisk / TrendForce — *2026 Memory Chip Shortage* and *SSD/HDD Price Divergence 2026*
- Wccftech — *RAM Shortage 2026 (DDR5 crisis)*
- Fusion Worldwide — *Enterprise SSD Supply: What Buyers Need to Know*
- Comtek — *Enterprise SSD and NVMe Shortages 2026*
- Utmel / MLQ.ai / Introl — *800G optical transceiver demand & lead times 2025–2026*
- Microchip USA / 773 Group — *Power semiconductor (SiC/IGBT) lead times & shortage 2026*
- Micron part catalog (MTC40F2046S1RC…); Schneider Electric Micrologic trip-unit catalog (S164A/S144A/S163A)

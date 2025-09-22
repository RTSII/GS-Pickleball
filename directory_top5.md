
## Top 5 local directory opportunities (Grand Strand: Pawleys Island • Murrells Inlet • Myrtle Beach)

1. **Pickleball courts, lessons, leagues, and pro shops** → **Top pick**
   Demand rising fast locally; 40,000-sq-ft indoor complex approved for 2026; courts already promoted by the DMO; leagues and tournaments exist but info is fragmented. Competition is light and generic. Monetization via featured listings, clinics, events, and gear affiliates. ([https://www.wmbfnews.com][1])

2. **Fishing charters + on-water experiences (inlet, nearshore, offshore)** → **Runner-up**
   Very high intent and AOV; 160+ local charters listed on a single marketplace; DMO and legacy fleets drive interest; ample providers from Murrells Inlet to Little River. Competing marketplaces exist but a local, tide-aware directory can differentiate. Monetization via leads or booking fees. ([FishingBooker][2])

3. **Golf cart rentals + mobility (street-legal carts, delivery, permits)**
   Many renters and local shops; info scattered across Yelp and Chamber pages; city chair/umbrella concessions are centralized, so carts are the richer niche. Monetize per-lead and seasonal promos. ([Yelp][3])

4. **Golf instruction, club fitting, and repair**
   80+ courses regionally and many teaching pros; dedicated fitters and big-box fit bays; directory can bundle coaches, fittings, and repairs with scheduling. Monetize via featured profiles and lesson booking fees. ([North Myrtle Beach Golf][4])

5. **Vacation-rental host services (cleaning, linens, maintenance, pool, home watch)**
   Thousands of STRs and many PMs; owners need vendor discovery. Competition is generalist; a B2B local directory is under-served. Monetize via subscriptions and per-lead. ([PropertyManagement.com][5])

**Market tailwinds:** 18.2M visitors and \$13.2B direct spend in 2024; fastest-growing senior metro, expanding year-round services demand. ([Myrtle Beach Area CVB Partner Connect][6])

---

## Roadmap — #1 Pick: Pickleball Directory (Grand Strand)

**Positioning**
“Grand Strand Pickleball” covering Pawleys → North Myrtle. Focus on: where to play today, lessons, leagues, clinics, tournaments, and pro shops. Leverage new facility news for launch PR. ([https://www.wmbfnews.com][1])

**Data sources (seed)**

* Public lists of courts (DMO article), league/tournament hubs, local coaches and facilities pages. ([Visit Myrtle Beach][7])

**Entity model**

* Court(Venue): name, type(indoor/outdoor), surfaces, nets, lighting, fees, drop-in times, reservation link, geo, hours.
* Program: league, clinic, ladder, tournament; dates, levels, fees, signup URL.
* Coach: name, credentials (IPTPA/PPTR), service area, rates, contact, reviews.
* Shop: retail/strings/paddles, demo days.
* Event: calendar entries with RSVP/links.

**Acquisition & freshness**

* Scrape and normalize DMO + league/tournament pages; admin UI for manual curation.
* Public submission form with required proof links; moderation queue.
* Weekly checks on key sources; webhook pings for partner updates. ([Visit Myrtle Beach][7])

**Search UX**

* Facets: location radius, indoor/outdoor, drop-in today, level, fee, lights, lessons available, reservation required.
* “Play now” micro-feature: filter by current open hours.
* Map + list with clustering; save favorites; alert me when new league opens.

**Differentiators**

* Real-time “open play” badges; court capacity hints via historical schedules.
* Coach marketplace with instant booking slots.
* Event calendar syndicated to venue sites via embeddable widget.

**Monetization**

* Featured listings and badges.
* Booking fee for lessons/clinics.
* Retail affiliate links for paddles/balls; shop promos.
* Sponsorship from new indoor complex pre-opening. ([https://www.wmbfnews.com][1])

**SEO**

* Landing pages per locality + intent: “Pickleball courts in Pawleys Island,” “Myrtle Beach indoor pickleball,” “Murrells Inlet pickleball lessons.”
* Program schema: `SportsActivityLocation`, `LocalBusiness`, `Event`.

**Stack (lean)**

* Next.js + Postgres + Prisma; Maps: Mapbox; Search: Typesense.
* Scraping: Playwright + CRON; queue: BullMQ + Redis.
* Auth + submissions: NextAuth + hCaptcha; email: Postmark.

**Data schema (core tables)**
`venues(id, name, type, address, lat, lng, indoor, lights, nets, fee, book_url, hours_json, phone)`
`programs(id, venue_id, kind, level_min, level_max, start_dt, end_dt, fee, signup_url)`
`coaches(id, name, creds, areas_json, rates_json, site, phone, email)`
`events(id, venue_id, title, dt_start, dt_end, desc, url)`
`reviews(id, entity_type, entity_id, rating, text, user_id, dt)`

**30/60/90**

* 30: ingest DMO + league/tourney data, 75+ venues, MVP search + map, coach intake live. ([Visit Myrtle Beach][7])
* 60: booking for lessons/clinics, event calendar widget, sponsor package.
* 90: email alerts, “open play now,” PPC tests, venue partner pages.

**KPIs**
Listings coverage, publish-to-verified time, search CTR, booking starts, CPL from paid channels, partner renewals.

---

## Roadmap — #2: Fishing Charters & Water Experiences

**Positioning**
“Grand Strand Charters” focused on Murrells Inlet and Pawleys salt-marsh experiences plus nearshore/offshore. Beat marketplaces on locality, tides, and transparency. ([FishingBooker][2])

**Data sources (seed)**

* Marketplace lists to map supply size; Chamber directory; fleet and DMO articles. ([FishingBooker][2])

**Entity model**

* Operator/Boat: vessel specs, trip types, capacity, license, insurance, target species by season.
* Trip: duration, price range, inclusions, departure ramp, live availability URL.
* Conditions: tides, wind, seas; recommended windows by trip.

**Acquisition & freshness**

* Scrape operator sites and marketplace profiles for static data; direct partner feeds for pricing/availability.
* Pair with NOAA tides + wind layer; auto-flag “go/no-go” windows.

**Search UX**

* Facets: inlet/nearshore/offshore, family-friendly, wheelchair-accessible, live bait, fish targets, private vs shared.
* Murrells Inlet first-class support: ramp pick-lists and parking notes.

**Differentiators**

* Tide-smart recommendations and fish-season guide.
* Verified captain profiles with required docs checklist.
* Transparent total costs and tipping guidance.

**Monetization**

* Pay-per-lead or commission on bookings.
* Featured operator tiers; add-on upsells (photo/video, fish cleaning).
* Cross-sell boat rentals and dolphin/eco tours. ([Getmyboat.com][8])

**SEO**

* “Murrells Inlet redfish charter,” “Pawleys Creek family charter,” “Myrtle Beach offshore tuna trip.”
* Schema: `SportsActivityLocation`, `TouristTrip`, `LocalBusiness`, `Offer`.

**Stack**

* Same core as above; add NOAA/Stormglass API for marine data; calendar sync via iCal ingestion.

**30/60/90**

* 30: 120+ operators indexed with spec-rich profiles; map + filters; inquiry lead forms live. ([FishingBooker][2])
* 60: tide-aware trip suggestions; partner dashboards; review import.
* 90: real-time availability for first 10 partners; PPC against “Murrells Inlet fishing charters.”

**KPIs**
Quote requests per operator, lead-to-book %, refund rate, average booking value, partner churn.

---

## Why these two beat the others

* **Pickleball**: surging participation and facility investment, weak local aggregation today. Lower CAC and clear community hooks. ([https://www.wmbfnews.com][1])
* **Charters**: large, high-intent market with 160+ providers; value-add via tides and safety filters; strong monetization. ([FishingBooker][2])

Background size & spend justify both: 18.2M visitors, \$13.2B direct spend, plus year-round seniors growth. ([Myrtle Beach Area CVB Partner Connect][6])

If you want, I can draft the DB schema files and a Next.js scaffold for either MVP.

[1]: https://www.wmbfnews.com/2025/08/25/40000-square-foot-pickleball-facility-coming-myrtle-beach-area-2026/?utm_source=chatgpt.com "40000-square-foot pickleball facility coming to the Myrtle ..."
[2]: https://fishingbooker.com/destinations/location/us/SC/myrtle-beach?utm_source=chatgpt.com "Top Fishing Charters in Myrtle Beach, SC"
[3]: https://www.yelp.com/search?cflt=golfcartrentals&find_loc=Myrtle+Beach%2C+SC+29577&utm_source=chatgpt.com "THE BEST 10 GOLF CART RENTALS near MYRTLE ..."
[4]: https://www.northmyrtlebeachgolf.com/myrtle-beach-golf-courses.html?utm_source=chatgpt.com "List of Golf Courses in Myrtle Beach, SC"
[5]: https://propertymanagement.com/location/sc/myrtle-beach?utm_source=chatgpt.com "Top Property Managers in Myrtle Beach, South Carolina"
[6]: https://www.myrtlebeachareacvb.com/industry-research?utm_source=chatgpt.com "Industry Research - Myrtle Beach Area CVB Partner Connect"
[7]: https://www.visitmyrtlebeach.com/article/top-pickleball-courts-in-myrtle-beach?utm_source=chatgpt.com "Top Pickleball Courts in Myrtle Beach"
[8]: https://www.getmyboat.com/boat-rental/Myrtle-Beach--SC--United-States/?utm_source=chatgpt.com "Myrtle Beach Boat Rentals [From $125/Hour]"

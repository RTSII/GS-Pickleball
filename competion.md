# roadmap.md

## 0) Objective

Be the go-to Grand Strand pickleball directory for locals and visitors. Prioritize “closest place to play now,” rich venue pages, and trusted freshness. Monetize first via SEO + ads + affiliate links. Add paid partner widgets later.

---

## 1) Market focus and anchors

* Coverage: Pawleys Island → Murrells Inlet → Myrtle Beach, with optional North Myrtle and Georgetown edges.
* Anchor partner targets: Litchfield Pickleball/Litchfield Racquet & Paddle (CourtReserve, 11 courts, live cam). ([LP 2024][1])
* Nearby proof of demand: third-party directory listings for Litchfield and other area courts. ([Pickleheads][2])

---

## 2) Competitive baseline (directories only) → what to match or beat

| Directory          | Core strengths                                                             | What to beat locally                                                                             |
| ------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Pickleheads        | National court DB, games, groups, payments; now USAP’s recommended finder. | Local freshness, venue detail, “open now,” photo density, partner deep links. ([Pickleheads][2]) |
| PicklePlay (UTR)   | Courts, events, club tools under UTR umbrella.                             | Better venue pages, local events aggregation, coach marketplace depth. ([PicklePlay][3])         |
| PlayTime Scheduler | Session scheduling network with maps and alerts.                           | Simpler “tonight” digest and iCal feeds per city/skill.                                          |
| GPN                | Courts, ladders, leagues, lessons directory.                               | Higher update cadence and verified pricing. ([Global Pickleball Network][4])                     |
| Bounce             | SEO court pages and amenities.                                             | Richer media, reservations links, verified stamps. ([Bounce][5])                                 |

---

## 3) Product pillars

1. **Find nearby and “Play now.”**
2. **Rich, verified venue pages** with photos, fees, parking, reservations, skill fit.
3. **Events clearinghouse** with per-city and per-skill iCal.
4. **Coach discovery + lead escrow.**
5. **Partner widgets** for paid tiers (schedule, events, promos).

---

## 4) System design (lean and local-first)

* **Stack:** Next.js + PostgreSQL + PostGIS. Mapbox for tiles. Server cron via Cloud scheduler.
* **Geosearch:** Haversine + PostGIS `ST_DWithin` for “within X miles,” rank = distance then “open\_now” then review score.
* **Open-now engine:** Derive from hours + timezone. When partner exposes CourtReserve, surface deep links and show “updated N min ago.” ([LP 2024][6])
* **Data freshness:** `verified_at`, `verified_by`, and change log per venue. SLA: top-50 venues re-verified ≤7 days.
* **Media:** S3 bucket + WebP variants. Require 6–10 photos per venue, 1 map inset, 1 signage close-up.

---

## 5) Information architecture

* **Pages:**

  * `/` map-first search.
  * `/city/{name}` programmatic hubs: Indoor, Free, Lights, Drop-in, 3.0/3.5/4.0, Lessons.
  * `/venue/{slug}` rich profile with “Book on Club” and “Message coach” CTAs.
  * `/events/{city}` calendar + iCal.
  * `/coaches` filterable directory.
* **Schema.org:** `SportsActivityLocation`, `LocalBusiness`, `Event`, `Course` for clinics.
* **UTM discipline:** All partner outbound links tagged by venue, placement, campaign.

---

## 6) Data model (keys only)

* `venues(id, name, address, geo_point, city, indoor, lights, surface, photos[], phone, website, booking_url, courtreserve_deeplink, fees_note, parking_note, skill_tags[], open_hours_json, verified_at, verified_by)`
* `events(id, venue_id?, city, type, skill, price, starts_at, ends_at, source_url, status)`
* `coaches(id, name, dup r_range, certs[], rate_hour, travel_radius_mi, venues_served[], bio, contact_url)`
* `leads(id, coach_id, user_id, date, hours, escrow_amount, status)`
* `verifications(id, venue_id, field, prev, next, verifier)`

---

## 7) UX spec

* **Search bar:** location autocomplete + “Use my location.”
* **One-tap filters:** Open now, Indoor, Lights, Free, Lessons, Level 3.0/3.5/4.0.
* **Cards:** distance, open-now badge, 3 key amenities, fee snippet, last verified date, two photos.
* **Venue page:** hero gallery, practicals (parking, restrooms), fees table, “Book on Club” (CourtReserve deep link when present), “Tonight at this venue” event strip, coach list. ([LP 2024][6])
* **Events:** per-city iCal and Google Calendar subscribe buttons.
* **Email digest:** daily 3 pm “Tonight drop-ins within 15 miles.”

---

## 8) Partnerships playbook (example: Litchfield by the Sea area)

1. **Identify**: Litchfield Pickleball/Litchfield Racquet & Paddle is already on CourtReserve and lists 11 courts and a live cam. ([LP 2024][1])
2. **Offer**: Free verified listing + photo refresh. Add “Book on Club” with their deep link. Include “updated N min ago” when they ping an endpoint after schedule changes. ([LP 2024][6])
3. **Upsell (Plus):** embeddable schedule widget on their site, featured placement on city page, events feed auto-sync, seasonal promo banners.
4. **Proof:** Pull third-party directory snapshots showing traffic leakage and propose consolidated listing. ([Pickleheads][2])

---

## 9) Content and verification ops

* Seed 30–40 venues with addresses, hours, fee notes, booking links, and 6+ images.
* Weekly verification queue for top-50. Surface “Verified on {date} by {initials}.”
* Community “Suggest an edit.” Moderation SLA 48 hours.
* Photo policy: exteriors, court lines, nets, lighting at dusk, signage, parking.

---

## 10) SEO plan for fast traction

* **Programmatic pages** by city + intent (“Indoor pickleball Myrtle Beach,” “Drop-in Pawleys,” “Pickleball lessons Murrells Inlet”).
* **Skyscraper guides** that beat generic lists with original photos, verified fees, parking, and reservation info.
* **Internal linking**: city → venue → coach → events.
* **Local backlinks**: chambers, parks & rec, resorts, clubs, blogs.
* **Tech**: fast LCP, WebP images, JSON-LD, crawlable iCal pages.

---

## 11) Monetization roadmap

* **v0 (launch):** display ads (AdSense to start), affiliate links to paddles/balls on venue pages, UTM to partner booking.
* **v1 (month 2–3):** Plus listings (featured rank, widget, events auto-sync), sponsor slots on city pages and email digest.
* **v2 (post-PMF):** 10–12% take on coach and clinic bookings with escrow, seasonal sponsor packages.

---

## 12) Gaps vs directories and how we cover them

* **Live feel:** Direct “open now” and “updated N min ago” from partner pings and schedule sync. Competitors show sessions but not venue freshness.
* **Local depth:** Verified fees, parking, reservation mechanics, and photo density for every Grand Strand venue.
* **Actionable calendars:** Per-city iCal feeds and a “tonight” digest; most directories bury events.
* **Partner utility:** Simple embeddable widgets that help clubs sell more without switching systems.

---

## 13) 90-day execution plan

**Weeks 0–2**

* Repo + infra. Postgres + PostGIS. Mapbox.
* Build venue CRUD, photo upload, open-now derivation, search with distance and filters.
* Seed 30–40 venues with photos and booking links.

**Weeks 3–5**

* Events intake + iCal export per city and per skill.
* Coach profiles + lead form + Stripe escrow stub.
* Verification stamps + public changelog.

**Weeks 6–8**

* CourtReserve deep-link support and partner ping endpoint. “Updated N min ago” badge. ([LP 2024][6])
* City pages and three skyscraper guides live.
* Email digest at 3 pm; sign-up on all pages.

**Weeks 9–12**

* Launch Plus listings and partner widgets.
* Outreach to 10 anchor partners starting with Litchfield area.
* Ad placements and affiliate offers tuned from analytics.

---

## 14) KPIs

* **Coverage:** % of known courts listed; % with photos ≥6; % with `verified_at` ≤7 days.
* **Findability:** top-3 rank for “Myrtle Beach pickleball,” “indoor pickleball Myrtle Beach,” and city variations.
* **Engagement:** search → venue CTR, venue → outbound booking CTR, digest open rate, iCal subscribes.
* **Revenue:** paid listings %, GMV from coach/clinic leads, RPM from ads.

---

## 15) Risks and controls

* **Data drift:** hours/fees change. Control with verification SLA and public stamps.
* **Directory gravity:** national sites dominate SEO. Counter with original photos, verified details, and local backlinks.
* **Integration limits:** CourtReserve is link-out only. Provide deep links, optional partner pings, no scraping. ([LP 2024][6])

---

## 16) Immediate next steps (this week)

1. Lock stack and DB schema.
2. Import seed list and geocode.
3. Shoot photo sets for top 12 venues.
4. Build iCal publisher and daily digest.
5. Partner outreach to Litchfield area with free verified listing and widget demo. ([LP 2024][1])

**Definition of done for MVP:** location search with open-now, 30+ rich venue pages, per-city events feeds, first partner widget live, first ad revenue day.

[1]: https://www.litchfieldpickle.com/?utm_source=chatgpt.com "Litchfield Pickleball | pickleball courts in pawleys | South Carolina"
[2]: https://www.pickleheads.com/courts/us/south-carolina/pawleys-island/litchfield-racquet-and-paddle?utm_source=chatgpt.com "Play Pickleball at Litchfield Racquet and Paddle: Court Information | Pickleheads"
[3]: https://pickleplay.com/courts/south-carolina/pawleys-island/litchfield-racquet-and-paddle/?utm_source=chatgpt.com "Play Pickleball at Litchfield Racquet and Paddle in Pawleys Island, South Carolina | Court Details"
[4]: https://www.globalpickleball.network/pickleball-courts/courts/pickleball-court-page/court/2447-litchfield-racquet-and-paddle?utm_source=chatgpt.com "Litchfield Racquet and Paddle - 7 Pickleball Courts in Pawleys Island, SC"
[5]: https://www.bounce.game/court/litchfield-racquet-and-paddle-pawleys-island-south-carolina-us?utm_source=chatgpt.com "Pickleball at Litchfield Racquet and Paddle | Bounce"
[6]: https://www.litchfieldpickle.com/play-with-us?utm_source=chatgpt.com "Play With Us | LP 2024"

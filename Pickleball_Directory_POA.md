Pickleball is the right call for the Grand Strand. Local supply is real and growing (LBTS has tennis/pickleball access; Litchfield Pickleball runs 11 courts nearby). A 40,000-sq-ft indoor complex is slated for 2026, plus another indoor/covered venue is planned. Tourism scale supports monetization. ([litchfieldbythesea][1])

# Action plan: Grand Strand Pickleball Directory

## 0) Goal, scope, success

* Goal: “Where to play today,” “who teaches,” “what to join,” “where to buy,” across Pawleys → North Myrtle.
* Entities: Venues, Courts, Programs (lessons, leagues, clinics), Tournaments/Events, Coaches, Shops.
* 90-day success: 100% coverage of public/club courts from Pawleys to NMB, 25+ coaches listed, 10 partner venues, first paid bookings, unit economics ≥ breakeven on paid leads.
* Market proof: 18.2M visitors and \$13.2B direct spend in 2024. Travel volume supports local discovery products. ([Myrtle Beach Area CVB Partner Connect][2])

## 1) Data sources and ground truth

* Seed: Visit Myrtle Beach court list; Litchfield Pickleball; LBTS amenities; North Myrtle Beach facilities; local tournament calendars. ([Visit Myrtle Beach][3])
* Growth: City parks pages, YMCA and club sites, Facebook groups, DUPR/USAP/pt.com tourneys.
* Validation: Phone/email verification loop; “claim listing” for operators.

## 2) Product surface

* Search + map. Facets: open-now, indoor/outdoor, lights, drop-in times, fee, level, lessons, reservations required.
* “Play now” quick filter using hours + current time.
* Coach and clinic booking.
* Event calendar with filters and iCal export.
* Venue pages with fees, parking notes, reservation links, and “good for 3.0/3.5/4.0” tags.
* Partner widgets: embeddable schedule cards for venues.

## 3) Technical architecture

* Web: Next.js 14 (App Router), React Server Components, Tailwind.
* Data: Postgres + Prisma.
* Search: Typesense or Meilisearch for facets and typo-tolerance.
* Maps: Mapbox GL.
* Queue: BullMQ + Redis for crawls, validations, emails.
* Auth: NextAuth (email + OAuth); hCaptcha on submissions.
* Files: S3-compatible storage (R2).
* Payments: Stripe (listing tiers + booking fees).
* Monitoring: Sentry, Logtail.
* Infra: Vercel (web) + Railway/Fly.io (API/DB), cron workers on Railway.

### Core schema

* `venues(id, name, addr, lat, lng, indoor bool, lights bool, fee_range, book_url, hours_json, phone, email, site, source_url)`
* `courts(id, venue_id, surface, covered bool, dedicated bool, perm_nets bool)`
* `programs(id, venue_id, kind enum['lesson','clinic','league','ladder','tournament'], skill_min, skill_max, start_dt, end_dt, price, signup_url)`
* `coaches(id, name, creds, rating_avg, rate_hour, areas_json, contact_json, site)`
* `shops(id, name, services enum[]['retail','stringing','repairs','demo'], addr, phone, site)`
* `events(id, venue_id, title, start_dt, end_dt, desc, url)`
* `photos(id, entity_type, entity_id, url, credit, rights)`
* `claims(id, entity_type, entity_id, user_id, status)`
* `reviews(id, entity_type, entity_id, rating, text, user_id, dt)`

## 4) AI system design (uses your Windsurf Pro, Google AI Pro, Abacus.ai CodeLLM)

### Agent roles

1. **Crawler/Extractor**

   * Task: Fetch venue/program/coaches pages. Extract hours, fees, reservation links, address, amenities.
   * Tooling: Playwright + Python.
   * Model: Abacus **CodeLLM** for code writing/refactor; **DeepAgent** for multi-step scrape → parse → test; route prompts to best LLM automatically. ([Abacus.AI][4])

2. **Normalizer/Deduper**

   * Task: Normalize fields, geocode, dedupe near-duplicate listings, standardize hours.
   * Model: Gemini 2.5 Pro via Google AI Pro for JSON-in/JSON-out transforms and RAG checks. ([The Verge][5])

3. **Verifier**

   * Task: Create call/email scripts and verify critical fields; summarize responses into change sets.
   * Model: Gemini 2.5 Pro for structured call notes.
   * Optional: Thin Twilio/SMTP loop.

4. **Content generator**

   * Task: Programmatic SEO pages per locality/intent; write 150–300-word unique blurbs; generate FAQs; produce alt text.
   * Model: Gemini 2.5 Pro; throttle and templated prompts for consistency.

5. **Image pipeline**

   * Task: Captioning and alt text for your LBTS photos; duplicate-image detection; quality gate.
   * Model: Gemini Vision in Google AI Pro.

6. **Moderation + Fraud checks**

   * Task: Screen submissions; classify risky text; flag edits.
   * Model: Lightweight text classifier + rule engine.

7. **Analytics agent**

   * Task: Weekly KPI digest; anomaly alerts; suggests experiments.

### Where Windsurf Pro helps

* Use **Windsurf Cascade** to plan and implement multi-file changes and integration tests. Works well for “scaffold Next.js app, add search, add Prisma models” tasks. ([Windsurf][6])

### Why Abacus.ai CodeLLM here

* Low-cost agentic coding, routing to best LLM, and **DeepAgent** for autonomous multi-step code tasks. Good for scraper iteration and data tooling. ([Abacus.AI][4])

### Why Google AI Pro here

* Access to Gemini 2.5 Pro for structured transformations, long-context validation, and image understanding. Current Pro plan exposes these features. ([The Verge][5])

## 5) Content and SEO

* Page types:

  1. City/area + intent (e.g., “Pickleball courts in Pawleys Island”).
  2. Venue pages with full fields, schema.org `LocalBusiness` + `SportsActivityLocation`.
  3. Coaches, shops, lessons, clinics, tournaments.
* Programmatic clusters: “Indoor pickleball Myrtle Beach,” “Drop-in play Pawleys,” “3.0/3.5/4.0 play near me.”
* Internal links: city pages → venues → coaches → events.
* Local links: Chambers, clubs, community centers.
* Reviews: import where permitted or collect natively.

## 6) Partnerships and LBTS use

* **LBTS**: confirm facility usage and brand/photo rights. Create a co-branded LBTS landing page with real-time availability notes and directions. LBTS site already lists tennis/pickleball; Dieter’s LBTS pages note pickleball courts and access details. ([litchfieldbythesea][1])
* **Litchfield Pickleball**: coordinate for featured placement and cross-link; they operate 11 courts on Hawthorn Dr. ([LP 2024][7])
* **City parks**: Midway Park, NMB/J. Bryan Floyd. ([Visit Myrtle Beach][3])
* **Indoor 2026**: Prep sponsorships and pre-opening waitlist with Dink District and The PicklePort. ([WPDE][8])

## 7) Monetization

* Free basic listings.
* \$19–\$49/mo featured profiles for coaches/venues; \$99–\$299/mo for multi-venue clubs.
* 10–15% booking fee on lessons/clinics you transact.
* Retail affiliates (paddles/balls); local sponsor banners.
* Event promotion packages pre-2026 indoor openings.

## 8) Compliance

* Respect site TOS; prefer public/official data.
* Photo rights: obtain LBTS board OK for on-prem photos. Store consent.
* Accessible UX: keyboard nav, color contrast, alt text.
* Privacy: minimal PII; opt-in emails; log compliance.

## 9) Roadmap with checkpoints

### Phase 1 — Week 0–2: MVP spine

**Outcomes**: running app, DB, search, first 30 venues.

* [ ] Repo and environments created.
* [ ] DB + Prisma models migrated.
* [ ] Venue CRUD admin and CSV importer.
* [ ] Map + faceted search (indoor/outdoor/lights/fee).
* [ ] Static seed: Visit MB list, NMB, LP, LBTS. ([Visit Myrtle Beach][3])

**Agent prompts**

* Windsurf Cascade: “Plan and implement a Next.js 14 app with Prisma/Postgres. Models: venues, courts, programs, coaches. Add Mapbox map and Typesense search facets.”
* Abacus CodeLLM: “Write a Playwright scraper for {url}. Extract name, address, hours, fees, amenities, phone, reservation URL. Output JSON. Add unit tests.” ([Abacus.AI][4])

### Phase 2 — Week 3–5: Coverage + quality

**Outcomes**: 75+ venues, 10+ coaches, event calendar.

* [ ] Crawler runs nightly with diffing and moderation queue.
* [ ] Normalizer dedupes and geocodes; verifier queue produces call sheets.
* [ ] Coach listing form with K-factor referral.
* [ ] Events module (leagues/clinics/tournaments).
* [ ] Programmatic city pages for Pawleys, Murrells, MB, NMB.

**Agent prompts**

* Gemini: “Normalize venue JSON to schema. Validate hours format. Produce merge patch with confidence.”
* Gemini Vision: “Generate alt text and captions for uploaded LBTS photos. Return in JSON.”

### Phase 3 — Week 6–8: Transactions + partnerships

**Outcomes**: Paid listings and bookings.

* [ ] Stripe tiers live; coupons for partners.
* [ ] Lessons/clinics checkout, reschedule, refund rules.
* [ ] Partner widgets for venue sites (embed script).
* [ ] LBTS and Litchfield Pickleball co-marketing pages published. ([LP 2024][7])

**Agent prompts**

* Abacus DeepAgent: “Add Stripe subscription tiering and webhooks. Restrict features by plan. Write integration tests.” ([Abacus.AI][9])

### Phase 4 — Week 9–12: Growth + pre-2026 positioning

**Outcomes**: Email alerts, sponsor packages, pre-opening funnels.

* [ ] “Open play now” filter (hours + current time).
* [ ] Email alerts for new leagues near user.
* [ ] Sponsorship kits for Dink District and PicklePort. ([WPDE][8])
* [ ] Press page and outreach list.

## 10) Operating playbooks

### Data freshness SLAs

* Venues: re-crawl weekly; priority venues 48-hour checks.
* Programs: daily.
* Events: ingest as posted; close on end date.

### Moderation

* Score edits by risk; human review for fee/hours/booking link changes.
* Rollback with audit log.

### Support

* Partner dashboard with edit requests and analytics.
* “Report an issue” on every page.

## 11) KPIs and analytics

* Supply: listings coverage %, verified rate, time-to-verify.
* Demand: search CTR, venue page dwell, “call” clicks, bookings.
* Monetization: ARPU, paid/total listings, lead→booking %.
* Growth: email subs, return users, NPS by partner.
* Agent ops: crawl success rate, normalization error rate.

## 12) Pricing draft

* Coaches: \$19/mo Basic, \$39/mo Featured.
* Venues: \$49/mo Featured, \$149/mo Plus (widget + events).
* Transaction fee: 10–15% on lessons/clinics; cap for partners.

## 13) Budget (first 90 days, lean)

* Vercel + DB + Redis + Typesense + Mapbox: \~\$150–\$300/mo.
* Stripe fees: pass-through.
* Domain + email: \~\$20–\$40/mo.
* Misc (proxies, scraping): \~\$50–\$150/mo.
* Your AI tools: already owned.

## 14) Legal checklist

* LBTS board MOU: photo/brand use, safety, scheduling notes.
* Terms, Privacy, Acceptable Use, Venue Terms.
* Copyright policy and DMCA agent.

---

# Ready-to-run task list (copy/paste to your tools)

**Windsurf Pro – project scaffold**
“Create a Next.js 14 App Router project named `grand-strand-pickleball`. Add Prisma with Postgres models: venues, courts, programs, coaches, events, shops, photos, claims, reviews. Seed with example rows. Add Typesense search with facets: `indoor`, `lights`, `fee_range`, `lessons_available`, `open_now`. Add Mapbox GL map with clustering. Add admin pages for CRUD. Add auth with NextAuth (email). Generate unit and e2e tests.”

**Abacus.ai CodeLLM – crawlers** ([Abacus.AI][4])
“Write a Playwright crawler for:

1. [https://www.visitmyrtlebeach.com/article/top-pickleball-courts-in-myrtle-beach](https://www.visitmyrtlebeach.com/article/top-pickleball-courts-in-myrtle-beach)
2. [https://www.nmb.us/500/Pickleball](https://www.nmb.us/500/Pickleball)
3. [https://www.litchfieldpickle.com/](https://www.litchfieldpickle.com/)
   Extract: name, address, lat/lng (geocode via Nominatim), hours, indoor/outdoor, lights, fees, reservation URL, phone, email. Output normalized JSON. Include retries, robots.txt respect, and tests. Save deltas to Postgres through Prisma.”

**Gemini 2.5 Pro – normalizer**
“Given raw venue JSON, validate required fields, coerce hours to ISO 8601 intervals, infer `open_now` for timezone America/New\_York, dedupe by fuzzy name+geo. Return a merge patch with a confidence score. Reject if confidence <0.8.”

**Gemini Vision – photo pipeline**
“Generate alt text, captions, and location tags for these images from LBTS. Output `{photo_id, alt, caption, lat, lng}`. Flag images with faces for consent.”

**Gemini – content**
“Write 180-word unique venue blurbs in a neutral tone. Include parking and reservation tips if known. Return Markdown. Add FAQ with 3 Q\&A.”

**Abacus DeepAgent – payments + plans** ([Abacus.AI][9])
“Add Stripe subscriptions (Basic/Featured/Plus). Gate features server-side. Implement invoices, dunning emails, and webhook tests.”

**Windsurf Cascade – partner widget**
“Build an embeddable JS widget to render a venue’s next 7 days of programs. Provide `<script>` installer and CORS setup. Add signature to prevent misuse.”

---

# Local facts to anchor outreach

* LBTS site lists tennis/pickleball amenities; Dieter’s LBTS pages note pickleball court access for guests. ([litchfieldbythesea][1])
* Litchfield Pickleball operates 11 courts at 97 Hawthorn Dr, Pawleys Island, with CourtReserve for bookings. ([LP 2024][7])
* Visit Myrtle Beach lists top public pickleball courts; NMB manages courts around J. Bryan Floyd. ([Visit Myrtle Beach][3])
* Large indoor complex “Dink District” announced for 2026; The PicklePort also planned with 12 indoor + 6 covered courts. Use both for PR and sponsorship. ([https://www.wmbfnews.com][10])
* Tourism scale: 18.2M visitors and \$13.2B direct spend in 2024. ([Myrtle Beach Area CVB Partner Connect][2])

If you want a codebase starter next, say which DB and which search engine (Typesense or Meilisearch).

[1]: https://www.litchfieldbythesea.com/homeowners?utm_source=chatgpt.com "Homeowners | Litchfield Sea"
[2]: https://www.myrtlebeachareacvb.com/industry-research?utm_source=chatgpt.com "Industry Research - Myrtle Beach Area CVB Partner Connect"
[3]: https://www.visitmyrtlebeach.com/article/top-pickleball-courts-in-myrtle-beach?utm_source=chatgpt.com "Top Pickleball Courts in Myrtle Beach"
[4]: https://codellm.abacus.ai/?utm_source=chatgpt.com "CodeLLM - Abacus.AI"
[5]: https://www.theverge.com/news/670495/google-ai-ultra-plan-pricing-launch-io-2025?utm_source=chatgpt.com "Google reveals $250 per month 'AI Ultra' plan"
[6]: https://windsurf.com/?utm_source=chatgpt.com "Windsurf - The best AI for Coding"
[7]: https://www.litchfieldpickle.com/?utm_source=chatgpt.com "Litchfield Pickleball | pickleball courts in pawleys | South ..."
[8]: https://wpde.com/news/local/pickleball-08-25-2025-dink-district-open-date-location-pickleball-in-myrtle-beach-carolina-forest-ron-k-reynolds-courts-classes-leagues?utm_source=chatgpt.com "40000 sq. ft. pickleball facility coming to Myrtle Beach"
[9]: https://deepagent.abacus.ai/?utm_source=chatgpt.com "DeepAgent - Abacus.AI"
[10]: https://www.wmbfnews.com/2025/08/25/40000-square-foot-pickleball-facility-coming-myrtle-beach-area-2026/?utm_source=chatgpt.com "40000-square-foot pickleball facility coming to the Myrtle ..."

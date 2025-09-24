# Data Model: GS Pickleball v1 Core

## Entities

### Venue
- name, address, geo (lat, lng)
- amenities: indoor (bool), lights (bool)
- fees: range/notes
- hours: multiple intervals/day; overnight splits supported
- booking/contact: url, phone, email
- tags: list of strings

### Program
- kind: lesson | clinic | league | ladder | tournament
- level_min, level_max (USA Pickleball 2.0–5.0, step 0.5)
- start, end (ISO)
- price (USD)
- location_id (Venue ref)
- signup_url
- capacity, remaining (optional)
- status: scheduled | cancelled | moved
- original_time (if moved)

### Coach
- name, credentials, cities_served
- rate, rating (optional)
- verified (bool), evidence_url, evidence_type

### Shop
- services: retail | stringing | repairs | demo
- contact: url/phone/email
- geo: lat, lng
- notes

### Event
- title, start, end, description, url
- exportable as iCal

## Relationships
- Program → Venue (many-to-one)
- Coach ↔ Venue (many-to-many, service areas)
- Shop ↔ Venue (optional association by locality)

## Constraints & Validation
- Level filter integrity: `level_min ≤ value ≤ level_max`
- Timezone-aware open-now computation using venue geo
- Required fields present for public program listing

## Notes
- Supabase Postgres is canonical; Typesense is a read model.
- Indexing jobs: delta every 10 minutes; nightly reconciliation at 02:00 local.

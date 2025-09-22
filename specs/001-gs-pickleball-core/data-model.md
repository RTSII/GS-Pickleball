# Data model

Derived from `prisma/schema.prisma`.

## Entities

### Venue
- id (cuid, PK)
- name, address, city, state, zip?
- lat, lng (float)
- indoor (bool, default false)
- lights (bool, default false)
- feeMin?, feeMax? (int cents)
- bookUrl?, hoursJson?, phone?, email?, site?, sourceUrl?
- tags (string[], default [])
- createdAt, updatedAt

Relations:
- courts: Court[]
- programs: Program[]
- photos: Photo[]
- reviews: Review[]

Indexes:
- @@index([city])
- @@index([lat, lng])

PostGIS (SQL migration):
- computed `geog` geography(Point, 4326) + GiST index (see `prisma/migrations/0001_postgis/steps.sql`)

### Court
- id (cuid, PK)
- venueId (FK → Venue.id)
- surface?
- covered (bool, default false)
- dedicated (bool, default true)
- permNets (bool, default true)

Relation:
- Venue (onDelete: Cascade)

### Program
- id (cuid, PK)
- venueId (FK → Venue.id)
- kind (enum: lesson | clinic | league | ladder | tournament)
- skillMin?, skillMax? (float)
- startTs?, endTs? (datetime)
- price? (int cents)
- signupUrl?
- createdAt, updatedAt

Indexes:
- @@index([venueId, kind])
- @@index([startTs])

### Coach
- id (cuid, PK)
- name
- creds?
- rateHour? (int cents)
- ratingAvg? (float, default 0)
- cities (string[], default [])
- contact? (json)
- site?
- createdAt, updatedAt

### Shop
- id (cuid, PK)
- name
- services (string[]: retail, stringing, repairs, demo)
- address?, phone?, site?
- lat?, lng?
- createdAt, updatedAt

### Event
- id (cuid, PK)
- venueId? (FK → Venue.id, SetNull)
- title
- startTs, endTs (datetime)
- desc?, url?
- createdAt, updatedAt

Indexes:
- @@index([startTs])

### Photo
- id (cuid, PK)
- entityType, entityId
- url
- credit?, rights?
- createdAt

### Claim
- id (cuid, PK)
- entityType, entityId
- email
- status (default "pending")
- createdAt

### Review
- id (cuid, PK)
- entityType, entityId
- rating (int)
- text?, userEmail?
- createdAt

Indexes:
- @@index([entityType, entityId])

## Notes and constraints
- Fee fields are stored as integer cents to avoid floating point issues. Consider a CHECK constraint `feeMin <= feeMax` when both present.
- Hours are stored as JSON; `lib/openNow.ts` derives an `open_now` signal for search index documents.
- Search uses Typesense documents with `_geo: [lat, lng]`, `open_now`, and facet fields.

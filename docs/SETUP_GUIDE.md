# Development Environment Setup Guide

This guide will walk you through setting up your local development environment for the Grand Strand Pickleball project.

## Prerequisites

- Node.js 18-20 (see `package.json > engines`)
- npm (comes with Node.js)
- A Supabase account and project
- A Typesense Cloud account (or local Docker instance)
- A Mapbox account (for maps)

---

## Step 1: Clone and Install

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

---

## Step 2: Configure Supabase

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to finish provisioning

### Get Connection Strings

In your Supabase project dashboard:

1. Click **Settings** (gear icon in sidebar)
2. Click **Database**
3. Scroll to **Connection string**
4. Select **URI** mode
5. Copy the connection string

You'll see two patterns:
- **Transaction Mode** (port 6543) — For connection pooling
- **Direct Connection** (port 5432) — For migrations

### Configure .env File

Create `.env` in the project root:

```bash
# Copy from example
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Supabase API (from Settings > API)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."
```

**Important**: Replace placeholders with actual values from your Supabase project.

### Enable PostGIS Extension

In Supabase SQL Editor, run:

```sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Or run the provided script:
```bash
# In Supabase SQL Editor, copy/paste contents of:
cat sql/0000_enable_extensions.sql
```

### Apply Migrations

```bash
# Apply all migrations
npx prisma migrate deploy

# Or for development (creates migration if needed)
npx prisma migrate dev
```

This will:
- Create all tables (Venue, Program, Coach, etc.)
- Add PostGIS spatial columns
- Create indexes

---

## Step 3: Configure Typesense

### Option A: Typesense Cloud (Recommended)

1. Go to [cloud.typesense.org](https://cloud.typesense.org)
2. Create a new cluster
3. Note your:
   - Host (e.g., `xyz.a1.typesense.net`)
   - Port (usually `443`)
   - Admin API Key
   - Search-only API Key

Add to `.env`:

```env
TYPESENSE_HOST="xyz.a1.typesense.net"
TYPESENSE_PORT="443"
TYPESENSE_PROTOCOL="https"
TYPESENSE_ADMIN_KEY="your-admin-key-here"
TYPESENSE_SEARCH_KEY="your-search-key-here"
```

### Option B: Local Typesense (Docker)

```bash
# Run Typesense locally
docker run -d \
  -p 8108:8108 \
  -v $(pwd)/typesense-data:/data \
  typesense/typesense:27.1 \
  --data-dir /data \
  --api-key=xyz123

# Add to .env
TYPESENSE_HOST="localhost"
TYPESENSE_PORT="8108"
TYPESENSE_PROTOCOL="http"
TYPESENSE_ADMIN_KEY="xyz123"
TYPESENSE_SEARCH_KEY="xyz123"
```

### Create Collections

```bash
npm run typesense:setup
```

This creates three collections: `venues`, `programs`, `coaches`

---

## Step 4: Configure Mapbox (Optional for Phase 1)

1. Go to [mapbox.com](https://mapbox.com)
2. Create account or sign in
3. Go to **Account > Tokens**
4. Create a new token or copy default public token

Add to `.env`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
```

---

## Step 5: Seed Database

Populate with test data:

```bash
npm run seed
```

Expected output:
```
🌱 Starting seed...
🧹 Cleared existing data
✅ Created 10 venues
✅ Created 8 programs
✅ Created 3 coaches

📊 Seed Summary:
   Venues: 10
   Programs: 8
   Coaches: 3

🎉 Seed completed successfully!
```

---

## Step 6: Index Data

Transform database → search index:

```bash
npm run index:full
```

Expected output:
```
Indexed venues: 10
Indexed programs: 8
Indexed coaches: 3
```

---

## Step 7: Verify Setup

### Test Database Connection

```bash
npx tsx scripts/test-db-connection.ts
```

Should show:
```
✅ Database connection successful!

📊 Current database state:
   Venues: 10
   Programs: 8
   Coaches: 3
```

### Test Search API

Start the dev server:
```bash
npm run dev
```

In another terminal:
```bash
# Test venues search
curl "http://localhost:3000/api/search/venues?q=&lat=33.7&lng=-78.9"

# Test programs search
curl "http://localhost:3000/api/search/programs?kind=lesson&level=3.0"
```

Should return JSON with hits.

---

## Step 8: Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Type check
npm run typecheck

# Lint
npm run lint
```

All should pass ✅

---

## Troubleshooting

### "Environment variable not found: DATABASE_URL"

**Solution**: Ensure `.env` file exists and has `DATABASE_URL` set.

```bash
# Check if .env exists
ls -la .env

# Verify DATABASE_URL is set
grep DATABASE_URL .env
```

### "Connection refused" or "Connection timeout"

**Solution**: Check Supabase project is active and firewall/network allows connections.

1. Verify project is running in Supabase dashboard
2. Check connection string is correct
3. Try with `DIRECT_URL` instead of `DATABASE_URL`

### "Table does not exist"

**Solution**: Apply migrations.

```bash
npx prisma migrate deploy
```

### Typesense "404 Not Found"

**Solution**: Create collections first.

```bash
npm run typesense:setup
```

### Search returns no results

**Solution**: Index data.

```bash
npm run index:full
```

### Tests fail with "Cannot find module"

**Solution**: Generate Prisma client.

```bash
npx prisma generate
```

---

## Environment Variables Checklist

Before proceeding, ensure all required variables are set:

### Required
- [x] `DATABASE_URL` — Supabase connection string (pooled)
- [x] `DIRECT_URL` — Supabase connection string (direct)
- [x] `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- [x] `TYPESENSE_HOST` — Typesense host
- [x] `TYPESENSE_ADMIN_KEY` — Typesense admin key
- [x] `TYPESENSE_SEARCH_KEY` — Typesense search key

### Optional
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — For admin operations
- [ ] `NEXT_PUBLIC_MAPBOX_TOKEN` — For maps (Phase 1 later)
- [ ] `LOOKBACK_MINUTES` — Delta indexer window (default: 10)

---

## Quick Start (TL;DR)

```bash
# 1. Install
npm install

# 2. Configure .env with Supabase + Typesense credentials
cp .env.example .env
# Edit .env with your actual values

# 3. Generate Prisma client
npx prisma generate

# 4. Apply migrations (in Supabase SQL Editor or via Prisma)
npx prisma migrate deploy

# 5. Create Typesense collections
npm run typesense:setup

# 6. Seed database
npm run seed

# 7. Index data
npm run index:full

# 8. Start dev server
npm run dev

# 9. Test
curl "http://localhost:3000/api/search/venues?lat=33.7&lng=-78.9"
```

---

## Next Steps

Once setup is complete:

1. ✅ Verify all tests pass: `npm test`
2. ✅ Verify build succeeds: `npm run build`
3. ✅ Open `http://localhost:3000` in browser
4. ✅ Check API endpoints return data
5. 📖 Read `PHASE1_STATUS.md` for development roadmap

---

## Getting Help

- **Documentation**: See `docs/` directory
- **Spec**: `docs/specify.md`
- **Tasks**: `specs/001-gs-pickleball-core/tasks.md`
- **Plan**: `specs/001-gs-pickleball-core/plan.md`

---

**Version**: 1.0.0
**Last Updated**: 2025-10-27

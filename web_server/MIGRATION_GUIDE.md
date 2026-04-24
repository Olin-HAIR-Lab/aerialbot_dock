# Infrastructure Migration Guide

This guide covers how to migrate the Supabase database and Railway backend to a new account. Follow this if ownership of the project is being transferred.

---

## Overview

There are three hosted services to migrate:

| Service | What it hosts | Current owner |
|---|---|---|
| Supabase | PostgreSQL database | Personal account |
| Railway | FastAPI backend | Personal account |
| GitHub Pages | React frontend | Olin-HAIR-Lab org (no migration needed) |

GitHub Pages is tied to the GitHub org repo and requires no migration.

---

## Part 1 — Migrate the Database (Supabase)

### Step 1: Export data from the old project

In the old Supabase account, go to your project and run the following in the **SQL Editor** to export each table as CSV, or use the Table Editor's built-in export button for each table (`sensor_data`, `devices`, `locations`).

Alternatively, use `pg_dump` from a terminal with the old Session Pooler connection string:

```bash
pg_dump "postgresql://postgres.xdzcxzckafnfmotmyscp:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres" \
  --no-owner --no-acl -F p -f aerialbot_dump.sql
```

### Step 2: Create a new Supabase project

1. Log into the new account at [supabase.com](https://supabase.com)
2. Click **New Project** — free tier is sufficient
3. Choose a region close to where Railway will be hosted (e.g. `us-east-1`)
4. Set a strong database password and save it somewhere safe

### Step 3: Apply the schema

In the new project's **SQL Editor**, paste and run the following to recreate the tables:

```sql
CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    model TEXT,
    firmware_version TEXT,
    last_maintenance TEXT,
    install_date TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    latitude FLOAT,
    longitude FLOAT,
    elevation FLOAT,
    area_size FLOAT,
    crop_type TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS sensor_data (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    temperature FLOAT,
    soil_moisture FLOAT,
    humidity FLOAT,
    ph_level FLOAT,
    device_id TEXT REFERENCES devices(id),
    location_id TEXT REFERENCES locations(id),
    battery_level FLOAT,
    signal_strength FLOAT,
    status TEXT
);
```

### Step 4: Import data (if migrating existing data)

If you exported a dump in Step 1, restore it via the new project's Session Pooler connection string:

```bash
psql "postgresql://postgres.[NEW-PROJECT-REF]:[NEW-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres" \
  -f aerialbot_dump.sql
```

### Step 5: Get the new connection string

In the new Supabase project, click **Connect** at the top of the dashboard → select **Session Pooler** → copy the URI. It will look like:

```
postgresql://postgres.[NEW-PROJECT-REF]:[NEW-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

> **Important:** Always use the Session Pooler URL (not the direct connection). Railway is IPv4-only and the direct connection uses IPv6.

---

## Part 2 — Migrate the Backend (Railway)

### Option A: Transfer the existing Railway project (easiest)

Railway supports direct project transfers between accounts:

1. In Railway, open the **aerialbot-dock** project
2. Go to **Settings** → **Danger** → **Transfer Project**
3. Enter the new owner's Railway account email
4. The new owner accepts the transfer in their Railway dashboard

All environment variables, domains, and deployment history transfer automatically. This is the recommended path.

### Option B: Redeploy from scratch on a new account

If a transfer isn't possible:

1. Log into the new Railway account at [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo** → select `Olin-HAIR-Lab/aerialbot_dock`
3. Set **Root Directory** to `web_server/backend`
4. Under **Variables**, add:
   ```
   DATABASE_URL=postgresql://postgres.[NEW-PROJECT-REF]:[NEW-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
   ```
5. Go to **Settings** → **Networking** → **Generate Domain** to get a new public URL

---

## Part 3 — Update the Frontend

Once Railway gives you a new URL, update the frontend to point to it:

1. Edit `web_server/frontend/farm-dashboard/.env.production.local`:
   ```
   REACT_APP_API_URL=https://your-new-railway-url.up.railway.app
   ```

2. Redeploy to GitHub Pages:
   ```bash
   cd web_server/frontend/farm-dashboard
   npm run deploy
   ```

---

## Part 4 — Update the README

Update the **Live URLs** table in `web_server/README.md` to reflect the new Railway URL and Supabase project.

---

## Checklist

- [ ] Data exported from old Supabase project
- [ ] New Supabase project created and schema applied
- [ ] Data imported into new Supabase project
- [ ] Railway project transferred or redeployed
- [ ] `DATABASE_URL` env var updated in Railway with new Supabase Session Pooler URL
- [ ] Backend tested at `/ping` and `/api/data`
- [ ] `REACT_APP_API_URL` updated with new Railway URL
- [ ] Frontend redeployed to GitHub Pages
- [ ] `README.md` Live URLs table updated
- [ ] Old Supabase project paused or deleted

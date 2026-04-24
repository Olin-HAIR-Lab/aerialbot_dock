# Web Server (Farm Dashboard & API)

This directory contains the web server components for the Aerialbot Dock. It is divided into an API backend and a frontend web application dashboard.

## What it Contains

- **/backend**: A Python [FastAPI](https://fastapi.tiangolo.com/) application. It acts as the central data hub. It connects to a Supabase PostgreSQL database to store and retrieve drone telemetry, farm sensor readings, device logs, and location data.
- **/frontend/farm-dashboard**: A [React.js](https://reactjs.org/) application. This is the UI dashboard that farm operators use to visualize the sensor data and system status.

## Architecture

```
Drone/IoT device
      │
      │ POST /api/data
      ▼
Railway (FastAPI backend)  ◄──────► Supabase (PostgreSQL)
      │
      │ GET /api/data (JSON)
      ▼
GitHub Pages (React dashboard)
      │
      ▼
User's browser
```

## Live URLs

| Service | URL |
|---|---|
| Frontend (GitHub Pages) | https://olin-hair-lab.github.io/aerialbot_dock |
| Backend API (Railway) | https://aerialbotdock-production.up.railway.app |
| API Docs | https://aerialbotdock-production.up.railway.app/docs |
| Database | Supabase project `aerialbot-dock` (us-east-1) |

---

## How it Works

1. **IoT Devices / Drones** send sensor data (temperature, moisture, battery) to the **Backend API** via `POST /api/data`.
2. The **Backend API** processes these requests and stores them in the Supabase PostgreSQL database.
3. The **Frontend React App** running in a user's browser fetches data from the Backend API and displays it as a dashboard.

---

## Deployment

### Backend (Railway)

The FastAPI backend is deployed on [Railway](https://railway.app) from the `web_server/backend` directory. Railway auto-deploys on every push to `main`.

**Required environment variable in Railway:**
```
DATABASE_URL=postgresql://postgres.xdzcxzckafnfmotmyscp:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```
Use the **Session Pooler** connection string from Supabase (not the direct connection) — Railway is IPv4 only.

### Frontend (GitHub Pages)

The React app is deployed to GitHub Pages via the `gh-pages` npm package.

**To deploy:**
```bash
cd web_server/frontend/farm-dashboard

# Set the production API URL (gitignored, do not commit)
echo "REACT_APP_API_URL=https://aerialbotdock-production.up.railway.app" > .env.production.local

npm install
npm run deploy
```

This builds the app and pushes to the `gh-pages` branch. GitHub Pages serves it from there automatically.

### Database (Supabase)

The PostgreSQL database is hosted on Supabase (project: `aerialbot-dock`, region: us-east-1). Schema is managed via Supabase migrations.

**Tables:**
- `sensor_data` — drone/IoT sensor readings (temperature, soil moisture, humidity, pH)
- `devices` — registered device registry
- `locations` — field/location registry

---

## Transferring to a New Account

The Supabase and Railway projects are currently under a personal account. If ownership needs to be transferred, see the **[Migration Guide](MIGRATION_GUIDE.md)** for step-by-step instructions.

---

## Local Setup Guide

### Prerequisites
- Python 3.x
- Node.js and npm
- A Supabase account (or local PostgreSQL)

### 1. Backend

```bash
cd web_server/backend

python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Copy and fill in your database URL
cp .env.example .env.local
# Edit .env.local with your Supabase connection string

DATABASE_URL="your-connection-string" uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API runs at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

### 2. Frontend

```bash
cd web_server/frontend/farm-dashboard

npm install

# Uses .env.local which defaults to http://localhost:8000
npm start
```

Dashboard runs at `http://localhost:3000`.

### 3. Utility Scripts

The backend includes helper scripts for testing. Set `API_URL` to point at your target server:

```bash
# Send test sensor data
API_URL=http://localhost:8000 python backend/send_data.py

# Register a device
API_URL=http://localhost:8000 python backend/add_device.py

# Register a location
API_URL=http://localhost:8000 python backend/add_location.py
```

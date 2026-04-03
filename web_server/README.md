# Web Server (Farm Dashboard & API)

This directory contains the web server components for the Aerialbot Dock. It is divided into an API backend and a frontend web application dashboard.

## What it Contains

- **/backend**: A Python [FastAPI](https://fastapi.tiangolo.com/) application. It acts as the central data hub. It connects to a PostgreSQL database to store and retrieve drone telemetry, farm sensor readings, device logs, and location data.
- **/frontend/farm-dashboard**: A [React.js](https://reactjs.org/) application. This is the UI dashboard that farm operators use to visualize the sensor data and system status.

## How it Works

The system operates on a standard **Client-Server architecture**:
1. **IoT Devices / Drones** send sensor data (temperature, moisture, battery) to the **Backend API** via `POST /api/data`.
2. The **Backend API** processes these requests and stores them securely in the PostgreSQL database (`dronedb`).
3. The **Frontend React App** running in a user's browser sends HTTP `GET` requests to the Backend API to fetch the latest sensor data, device statuses, and statistics.
4. The dashboard processes and displays this JSON data graphically.

---

## Hosting and Deployment Strategy

For this to be publicly accessible, it needs to be hosted on the web. A very common setup is to use a cloud provider like **AWS (Amazon Web Services)**.

### 1. Hosting the Backend (AWS Cloud Instance)
The backend should be hosted on a cloud instance, such as an **AWS EC2 (Elastic Compute Cloud) server**. 
- You spin up a Linux instance (like Ubuntu) on AWS.
- You install **PostgreSQL** on the instance (or use AWS RDS).
- You run the FastAPI Python app on the server (typically using `uvicorn` and `gunicorn`, put behind a reverse-proxy like Nginx).
- You assign a static/Elastic IP to this EC2 instance. This IP address (e.g., `http://54.23.xx.xx:80`) is where your frontend will send all its API requests. 

### 2. Hosting the Frontend
Because React compiles down to flat HTML, CSS, and JavaScript files, you have two great options for hosting it:
- **Option A (Static Hosting / Serverless - Recommended):** You can use services specifically designed to host frontend apps like **Vercel**, **Netlify**, or **AWS S3 + CloudFront**. These are often free, incredibly fast, and very easy to set up.
- **Option B (Same Server):** You can host the built frontend files on the *exact same AWS EC2 instance* as your backend, using **Nginx** to route standard web traffic (port 80) to the React files, and API traffic (port 80/api) to the FastAPI server.

---

## Local Setup Guide

If you are just testing the dashboard and API on your computer, follow these steps to run everything locally.

### Prerequisites
- Python 3.x installed
- Node.js and npm installed
- PostgreSQL installed and running locally

### 1. Database Setup
The backend attempts a connection to a local Postgres database with specific credentials. You must create this database and user:
- Database Name: `dronedb`
- User: `droneuser`
- Password: `dockANDdata`
- Port: `5432` *(PostgreSQL default)*

### 2. Running the Backend
Open a terminal and navigate to the backend directory:
```bash
cd web_server/backend

# Create and activate a python virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # on Windows use: venv\Scripts\activate

# Install the necessary pip packages
pip install fastapi "uvicorn[standard]" psycopg2-binary pydantic psutil

# Start the server on localhost port 8000
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*The API is now running and listening for requests at `http://localhost:8000`. You can view the automatic API documentation at `http://localhost:8000/docs`.*

### 3. Running the Frontend
Open a **new** terminal and navigate to the frontend directory:
```bash
cd web_server/frontend/farm-dashboard

# Install React dependencies
npm install

# Start the React development server
npm start
```
*Your browser should automatically open to `http://localhost:3000`. It will now pull data from your local HTTP API!*

from fastapi import FastAPI, HTTPException
import psycopg2
from fastapi.middleware.cors import CORSMiddleware
import os
import psutil

app = FastAPI()

# Database connection
conn = psycopg2.connect(
    dbname="dronedb",
    user="droneuser",
    password="dockANDdata",
    host="localhost",
    port="5432"
)

# Enable CORS (For frontend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/data")
def get_data():
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, timestamp, temperature, soil_moisture, humidity, ph_level FROM sensor_data ORDER BY timestamp DESC LIMIT 10;"
        )
        rows = cur.fetchall()
        cur.close()

        result = [
            {
                "id": row[0],
                "timestamp": row[1].isoformat().replace("T", " "),
                "temperature": row[2] if row[2] is not None else "No data",
                "soil_moisture": row[3] if row[3] is not None else "No data",
                "humidity": row[4] if row[4] is not None else "No data",
                "ph_level": row[5] if row[5] is not None else "No data",
            }
            for row in rows
        ]
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/ping")
def ping():
    """Returns system resource usage (CPU, RAM, Disk)"""
    return {
        "cpu": f"{psutil.cpu_percent()}%",
        "ram": f"{psutil.virtual_memory().percent}%",
        "disk": f"{psutil.disk_usage('/').percent}%",
    }

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a Pydantic model for the incoming sensor data
class SensorDataModel(BaseModel):
    timestamp: str
    sensor_data: dict

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

@app.post("/api/data")
def post_data(data: SensorDataModel):
    try:
        timestamp = data.timestamp
        temperature = data.sensor_data.get("temperature")
        soil_moisture = data.sensor_data.get("soil_moisture")
        humidity = data.sensor_data.get("humidity")
        ph_level = data.sensor_data.get("ph_level")

        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO sensor_data (timestamp, temperature, soil_moisture, humidity, ph_level)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (timestamp, temperature, soil_moisture, humidity, ph_level)
        )
        conn.commit()
        cur.close()
        return {"message": "Data received successfully"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/ping")
def ping():
    """Returns system resource usage (CPU, RAM, Disk)"""
    return {
        "cpu": f"{psutil.cpu_percent()}%",
        "ram": f"{psutil.virtual_memory().percent}%",
        "disk": f"{psutil.disk_usage('/').percent}%",
    }

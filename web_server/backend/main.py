from fastapi import FastAPI, HTTPException
import psycopg2
from fastapi.middleware.cors import CORSMiddleware 

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
    allow_origins=["*"],  # Change this to ["http://localhost:3000"] in production
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
                "timestamp": row[1].isoformat(),  # Convert timestamp to string
                "temperature": row[2],
                "soil_moisture": row[3],
                "humidity": row[4],
                "ph_level": row[5]
            }
            for row in rows
        ]
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

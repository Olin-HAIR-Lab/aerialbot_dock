from fastapi import FastAPI, HTTPException
import psycopg2
import json

app = FastAPI()

# Database connection
conn = psycopg2.connect(
    dbname="dronedb",
    user="droneuser",
    password="dockANDdata",
    host="localhost",
    port="5432"
)

@app.get("/api/data")
def get_data():
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, timestamp, data FROM sensor_data ORDER BY timestamp DESC LIMIT 10;")
        rows = cur.fetchall()
        cur.close()

        result = [
            {
                "id": row[0],
                "timestamp": row[1].isoformat(),  # Convert timestamp to string
                "sensor_data": row[2]
            }
            for row in rows
        ]
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

from fastapi import FastAPI, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import psycopg
from psycopg.rows import dict_row
from fastapi.middleware.cors import CORSMiddleware
import os
import psutil
from datetime import datetime

app = FastAPI(title="Farm Sensor API")

# Database connection function
def get_db_connection():
    database_url = os.environ["DATABASE_URL"]
    conn = psycopg.connect(database_url, row_factory=dict_row)
    return conn

# Models
class SensorDataModel(BaseModel):
    timestamp: str
    device_id: Optional[str] = None
    location_id: Optional[str] = None
    sensor_data: Dict[str, Optional[float]]
    battery_level: Optional[float] = None
    signal_strength: Optional[float] = None
    status: Optional[str] = None

class SensorResponse(BaseModel):
    id: int
    timestamp: str
    temperature: Any
    soil_moisture: Any
    humidity: Any
    ph_level: Any
    device_id: Optional[str] = None
    location_id: Optional[str] = None
    battery_level: Optional[float] = None
    signal_strength: Optional[float] = None
    status: Optional[str] = None

class DeviceModel(BaseModel):
    id: str
    name: str
    type: str
    model: Optional[str] = None
    firmware_version: Optional[str] = None
    last_maintenance: Optional[str] = None
    install_date: Optional[str] = None
    active: bool = True

class LocationModel(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    elevation: Optional[float] = None
    area_size: Optional[float] = None
    crop_type: Optional[str] = None
    active: bool = True

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sensor data endpoints
@app.get("/api/data", response_model=List[SensorResponse])
def get_data(
    limit: int = Query(10, ge=1, le=100),
    device_id: Optional[str] = None,
    location_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = """
            SELECT id, timestamp, temperature, soil_moisture, humidity, ph_level, 
                   device_id, location_id, battery_level, signal_strength, status
            FROM sensor_data
            WHERE 1=1
        """
        params = []
        
        if device_id:
            query += " AND device_id = %s"
            params.append(device_id)
            
        if location_id:
            query += " AND location_id = %s"
            params.append(location_id)
            
        if start_date:
            query += " AND timestamp >= %s"
            params.append(start_date)
            
        if end_date:
            query += " AND timestamp <= %s"
            params.append(end_date)
            
        query += " ORDER BY timestamp DESC LIMIT %s"
        params.append(limit)
        
        cur.execute(query, params)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        # RealDictCursor returns dictionaries, no need for manual conversion
        for row in rows:
            # Format timestamp
            if 'timestamp' in row and row['timestamp']:
                row['timestamp'] = row['timestamp'].isoformat().replace("T", " ")
            
            # Convert None to "No data" for specific fields
            for field in ['temperature', 'soil_moisture', 'humidity', 'ph_level']:
                if field in row and row[field] is None:
                    row[field] = "No data"
                    
        return rows

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/data", status_code=201)
def post_data(data: SensorDataModel):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        timestamp = data.timestamp
        temperature = data.sensor_data.get("temperature")
        soil_moisture = data.sensor_data.get("soil_moisture")
        humidity = data.sensor_data.get("humidity")
        ph_level = data.sensor_data.get("ph_level")
        device_id = data.device_id
        location_id = data.location_id
        battery_level = data.battery_level
        signal_strength = data.signal_strength
        status = data.status

        cur.execute(
            """
            INSERT INTO sensor_data (
                timestamp, temperature, soil_moisture, humidity, ph_level,
                device_id, location_id, battery_level, signal_strength, status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (timestamp, temperature, soil_moisture, humidity, ph_level,
             device_id, location_id, battery_level, signal_strength, status)
        )
        
        inserted_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()
        
        return {"message": "Data received successfully", "id": inserted_id}
    
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Device management endpoints
@app.get("/api/devices", response_model=List[DeviceModel])
def get_devices(active_only: bool = True):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = "SELECT * FROM devices"
        if active_only:
            query += " WHERE active = TRUE"
        
        cur.execute(query)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        return rows
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/devices", response_model=DeviceModel, status_code=201)
def create_device(device: DeviceModel):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute(
            """
            INSERT INTO devices (
                id, name, type, model, firmware_version, 
                last_maintenance, install_date, active
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (
                device.id, device.name, device.type, device.model,
                device.firmware_version, device.last_maintenance,
                device.install_date, device.active
            )
        )
        
        new_device = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return new_device
    
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Location management endpoints
@app.get("/api/locations", response_model=List[LocationModel])
def get_locations(active_only: bool = True):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = "SELECT * FROM locations"
        if active_only:
            query += " WHERE active = TRUE"
        
        cur.execute(query)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        return rows
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/locations", response_model=LocationModel, status_code=201)
def create_location(location: LocationModel):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute(
            """
            INSERT INTO locations (
                id, name, description, latitude, longitude,
                elevation, area_size, crop_type, active
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (
                location.id, location.name, location.description,
                location.latitude, location.longitude, location.elevation,
                location.area_size, location.crop_type, location.active
            )
        )
        
        new_location = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return new_location
    
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# System monitoring endpoint
@app.get("/ping")
def ping():
    """Returns system resource usage (CPU, RAM, Disk)"""
    return {
        "cpu": f"{psutil.cpu_percent()}%",
        "ram": f"{psutil.virtual_memory().percent}%",
        "disk": f"{psutil.disk_usage('/').percent}%",
        "status": "online",
        "timestamp": datetime.now().isoformat()
    }

# Stats and analytics endpoints
@app.get("/api/stats/daily")
def get_daily_stats(
    start_date: str = None,
    end_date: str = None,
    location_id: str = None
):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = """
            SELECT 
                DATE(timestamp) as date,
                COUNT(*) as reading_count,
                AVG(temperature) as avg_temperature,
                MIN(temperature) as min_temperature,
                MAX(temperature) as max_temperature,
                AVG(soil_moisture) as avg_soil_moisture,
                MIN(soil_moisture) as min_soil_moisture,
                MAX(soil_moisture) as max_soil_moisture,
                AVG(humidity) as avg_humidity,
                AVG(ph_level) as avg_ph_level
            FROM sensor_data
            WHERE 1=1
        """
        
        params = []
        
        if start_date:
            query += " AND timestamp >= %s"
            params.append(start_date)
            
        if end_date:
            query += " AND timestamp <= %s"
            params.append(end_date)
            
        if location_id:
            query += " AND location_id = %s"
            params.append(location_id)
            
        query += " GROUP BY DATE(timestamp) ORDER BY date DESC"
        
        cur.execute(query, params)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        return rows
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
import requests
import json
import datetime
import os

def send_sensor_data():
    SERVER_URL = os.environ.get("API_URL", "http://localhost:8000") + "/api/data"
    
    payload = {
        "timestamp": datetime.datetime.now().isoformat(),  # e.g. "2025-02-27T15:00:00"
        "device_id": "device001",
        "location_id": "fieldA",
        "sensor_data": {
            "temperature": 22.1,
            "soil_moisture": 70.5,
            "humidity": 50.3,
            "ph_level": 6.8
        },
        "battery_level": 80.5,
        "signal_strength": 75.4,
        "status": "Normal"                # optional, e.g. "Normal", "Low", or "High"
    }
    
    try:
        # POST the payload as JSON
        response = requests.post(SERVER_URL, json=payload)
        
        # Check status code and print server response
        if response.status_code == 201:
            print("Data sent successfully!")
            print("Server response:", response.json())
        else:
            print("Failed to send data. Status code:", response.status_code)
            print("Server response:", response.text)
    except Exception as e:
        print("Error sending sensor data:", e)

if __name__ == "__main__":
    send_sensor_data()

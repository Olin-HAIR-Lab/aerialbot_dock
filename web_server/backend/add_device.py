#!/usr/bin/env python3
import requests
import os

def add_device():
    SERVER_URL = os.environ.get("API_URL", "http://localhost:8000") + "/api/devices"
    
    # Payload matching the DeviceModel (Make sure to adjust the fields as per your model)
    payload = {
        "id": "dev-200",
        "name": "Soil Probe Mk2",
        "type": "soil_sensor",
        "model": "SPM2",
        "firmware_version": "1.3.2",
        "last_maintenance": "2025-02-20",
        "install_date": "2024-08-15",
        "active": True
    }
    
    try:
        response = requests.post(SERVER_URL, json=payload)
        
        # Check for 201 Created
        if response.status_code == 201:
            print("Device added successfully!")
            print("Server response:", response.json())
        else:
            print("Failed to add device. Status code:", response.status_code)
            print("Server response:", response.text)
    except Exception as e:
        print("Error adding device:", e)


if __name__ == "__main__":
    add_device()

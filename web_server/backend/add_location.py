#!/usr/bin/env python3
import requests
import os

def add_location():
    SERVER_URL = os.environ.get("API_URL", "http://localhost:8000") + "/api/locations"
    
    # Payload matching the LocationModel (Make sure to adjust the fields as per your model)
    payload = {
        "id": "loc-101",
        "name": "Greenhouse #1",
        "description": "Main greenhouse near the barn",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "elevation": 15.5,
        "area_size": 250.0,
        "crop_type": "Tomatoes",
        "active": True
    }
    
    try:
        response = requests.post(SERVER_URL, json=payload)
        
        # Check for 201 Created
        if response.status_code == 201:
            print("Location added successfully!")
            print("Server response:", response.json())
        else:
            print("Failed to add location. Status code:", response.status_code)
            print("Server response:", response.text)
    except Exception as e:
        print("Error adding location:", e)


if __name__ == "__main__":
    add_location()

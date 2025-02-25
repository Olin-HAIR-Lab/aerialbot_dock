import requests
import json

SERVER_URL = "http://3.137.190.193:8000/api/data"

data = {
    "timestamp": "2025-02-25T12:00:00",
    "sensor_data": {
        "temperature": 22.5,
        "soil_moisture": 60.3
    }
}

# Send POST request
response = requests.post(SERVER_URL, json=data)

# Server response
print("Status Code:", response.status_code)
print("Response:", response.json())
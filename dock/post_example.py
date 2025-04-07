import requests
import datetime
import json

def send_sensor_data():
    url = "http://3.131.219.242/api/data"

    payload = {
        "timestamp": datetime.datetime.now().isoformat(),
        "sensor_data": {
            "temperature": 22.5,
            "soil_moisture": 60.3,
            "humidity": 45.0,
            "ph_level": 6.8
        }
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        if response.status_code == 200:
            print("Data sent successfully!")
        else:
            print("Failed to send data, status code:", response.status_code)
            print("Response:", response.text)
    except Exception as e:
        print("Error sending sensor data:", e)

if __name__ == "__main__":
    send_sensor_data()

import requests
import json
import datetime
import socket

def send_sensor_data(payload)->None:
    """
    Sends data payload to AWS server

    Args:
        payload (list): list of sensor data packaged as jsons (dict)
    """
    SERVER_URL = "http://3.131.219.242:8000/api/data"
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


def main()->None:
    """
    Main loop for dock. Waits for connection request, and receives data from the drone.
    Received data then gets sent to AWS server.    
    """   
    
    HOST = '192.168.4.1'
    PORT = 5000
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        print(f"Server listening on {HOST}:{PORT}...")
        while True:
            conn, addr = s.accept() # waits for connection
            with conn:
                print(f"Incoming data from {addr[0]}")
                data = b""
                while True:
                    packet = conn.recv(4096)
                    if not packet:
                        break
                    data += packet

                # Decode JSON to python list/dict
                json_data = json.loads(data.decode('utf-8'))
                print("data received!")

                ## Save to file
                # with open('received_data.json', 'w') as f:
                #     json.dump(json_data, f, indent=2)

if __name__ == "__main__":
    main()

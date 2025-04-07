import socket
import json
import os
import time

HOST = '192.168.4.1'
PORT = 5000

def check_dock_connection() -> bool:
    response = os.system("ping -c 1 -W 1 192.168.4.1 > /dev/null 2>&1")
    return response == 0

def compile_json_to_bytes(filepath: str):
    with open('test_data.json', 'r') as f:
        json_data = json.load(f)

    json_str = json.dumps(json_data)
    json_bytes = json_str.encode('utf-8')
    return json_bytes

def send_data():
    try:
        data = compile_json_to_bytes("test_data.json")
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((HOST, PORT))
            s.sendall(data)
            print("JSON data sent to dock.")
    except Exception as e:
        print(f"Error sending data")

if __name__ == "__main__":
    print("waiting for dock connection")
    while not check_dock_connection():
        time.sleep(2)
    print("connected to dock access point, sending data")
    send_data()

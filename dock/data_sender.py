import socket
import json
import os
import time
from typing import Union, Optional

HOST = '192.168.4.1'
PORT = 5000

def check_dock_connection() -> bool:
    """
    Checks if device is connected to dock's access point.    

    Returns:
        True if connected to dock, False otherwise
    """

    # Send a one-time ping to the dock, will return 0 if dock responds.
    response = os.system("ping -c 1 -W 1 192.168.4.1 > /dev/null 2>&1")
    return response == 0

def compile_json_to_bytes(filepath: Optional[str] = None, raw_json: Optional[Union[dict, list]] = None):
    """
    Converts a JSON object (from a file or directly provided) into UTF-8 encoded bytes.

    Args:
        filepath (str): Path to a JSON file. Used if `raw_json` is not provided.
        raw_json (dict or list): JSON data as a Python dictionary or list.

    Returns:
        json_bytes: The JSON data encoded as UTF-8 bytes.
    """

    if filepath and raw_json:
        raise ValueError("Provide only `filepath` of `raw_json`, not both")
    elif filepath:
        with open(filepath, 'r') as f:
            json_data = json.load(f)
        json_str = json.dumps(json_data)
    elif raw_json:
        json_str = json.dumps(raw_json)
    else:
        raise ValueError("Either `raw_json` or `filepath` must be provided.")

    json_bytes = json_str.encode('utf-8')
    return json_bytes

def send_data(data_bytes)->None:
    """
    Sends data to dock via socket connection
    """
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((HOST, PORT))
            s.sendall(data_bytes)
            print("JSON data sent to dock.")
    except Exception as e:
        print(f"Error sending data")

def main()->None:
    """
    Main loop for drone. Check for connection every 2 seconds and sends data when connection is established.
    """
    print("waiting for dock connection")
    while not check_dock_connection():
        time.sleep(2)
    print("connected to dock access point, sending data")

    json_bytes = compile_json_to_bytes(filepath="fake_data.json")
    send_data(json_bytes)

if __name__ == "__main__":
    main()

from pymavlink import mavutil
import time
from helper import chop_json

# ------------------------ Set up connections --------------------- #

# MAVLink connection settings
DOCK_IP = 'udpout:192.168.35.193:14551'  # Raspberry Pi's IP address
RECEIVER_IP = "udp:0.0.0.0:14552"  # Companion Computer IP address to receive responses 

# Establish MAVLink connections
sender = mavutil.mavlink_connection(DOCK_IP)  # Sends data
receiver = mavutil.mavlink_connection(RECEIVER_IP)  # Listens for responses

print(f"Connected to Raspberry Pi at {DOCK_IP}")
print(f"Listening for responses on {RECEIVER_IP}")
# -------------------------------------------------------------------#

CONNECT_TIMEOUT = 5
json_chunks = chop_json("data/fake_data.json", chunk_size=40)

# Send transfer request to dock
outgoing_data = f"Request:{len(json_chunks)}"
sender.mav.statustext_send(mavutil.mavlink.MAV_SEVERITY_INFO, outgoing_data.encode('ascii'))
print(f"Sent transfer request to dock")

# Wait for confirmation from dock ("1")
print("Waiting for dock confirmation...")
start = time.time()
last_sent = start
while True:
    crnt_time = time.time()
    if crnt_time - start > CONNECT_TIMEOUT:
        raise TimeoutError("Dock did not respond within the timeout period")
        
    if crnt_time - last_sent >= 1:
        outgoing_data = f"Request:{len(json_chunks)}"
        sender.mav.statustext_send(mavutil.mavlink.MAV_SEVERITY_INFO, outgoing_data.encode('ascii'))
        last_sent = crnt_time

    msg = receiver.recv_match(type='STATUSTEXT', blocking=False)
    if msg:
        if msg.text == "ACK":
            print("Received dock confirmation. Starting data transfer")
            break   

# ------------------------ Send Data --------------------- #
chunk_idx = 0
DATA_TIMEOUT = 10
MAX_RETRIES = 10

start_time = time.time()
retries = 0
while chunk_idx < len(json_chunks):
    chunk = json_chunks[chunk_idx]
    crnt_time = time.time()

    # Wait for confirmation msg for `timeout` seconds
    if crnt_time - start_time >= DATA_TIMEOUT:
        raise TimeoutError("Dock did not respond within the timeout period")
        
    if crnt_time - last_sent >= 1:
        if retries >= MAX_RETRIES:
            raise TimeoutError(f"Maximum retries reached on chunk #{chunk_idx + 1}")
        retries += 1
        print(f"Sending chunk {chunk_idx+1} (Attempt {retries}/{MAX_RETRIES})")
        sender.mav.statustext_send(mavutil.mavlink.MAV_SEVERITY_INFO, chunk.encode('ascii'))
        last_sent = crnt_time

    msg = receiver.recv_match(type='STATUSTEXT', blocking=False)
    if msg and msg.text == f"ACK{chunk_idx+1}":
        print(f"Chunk {chunk_idx+1} delivered successfully.")
        chunk_idx += 1  # Move to next chunk
        start_time = time.time()
        retries = 0

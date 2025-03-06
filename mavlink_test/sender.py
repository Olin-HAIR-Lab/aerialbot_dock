from pymavlink import mavutil
import time
from helper import chop_json

# ------------------------ Set up connections --------------------- #

# MAVLink connection settings
DOCK_IP = 'udpout:192.168.33.32:14551'  # Raspberry Pi's IP address
RECEIVER_IP = "udp:0.0.0.0:14552"  # Port to listen for responses

# Establish MAVLink connections
sender = mavutil.mavlink_connection(DOCK_IP)  # Sends data
receiver = mavutil.mavlink_connection(RECEIVER_IP)  # Listens for responses

print(f"Connected to Raspberry Pi at {DOCK_IP}")
print(f"Listening for responses on {RECEIVER_IP}")
# -------------------------------------------------------------------#


json_chunks = chop_json("data/fake_data.json")
# Send transfer request to dock
outgoing_data = "Data Transfer Request"
sender.mav.statustext_send(mavutil.mavlink.MAV_SEVERITY_INFO, outgoing_data.encode('ascii'))
print(f"Sent transfer request to dock")

# Wait for confirmation from dock ("1")
while True:
    msg = receiver.recv_match(type='STATUSTEXT', blocking=True)
    if msg:
        if msg.text == "1":
            print("Received dock confirmation. Starting data transfer")
            break   



# ------------------------ Send Data --------------------- #
chunk_idx = 0
max_retries = 5 
timeout = 2 # seconds

while chunk_idx < len(json_chunks):
    chunk = json_chunks[chunk_idx]
    print(f"Sending chunk {chunk_idx+1}/{len(json_chunks)}")

    retries = 0
    while retries < max_retries:
        sender.mav.statustext_send(mavutil.mavlink.MAV_SEVERITY_INFO, chunk.encode('ascii'))

        # Wait for confirmation msg for `timeout` seconds
        start_time = time.time()
        while time.time() - start_time < timeout:
            msg = receiver.recv_match(type='STATUSTEXT', blocking=True)
            if msg and msg.text == "1":
                print(f"Chunk {chunk_idx+1} delivered successfully.")
                chunk_idx += 1  # Move to next chunk
                break
        # TODO logic needs to be fixed here.
        else:
            # Timeout reached, retry sending the chunk
            retries += 1
            print(f"Retrying chunk {chunk_idx+1} (Attempt {retries}/{max_retries})")

        # If confirmation was received, break out of the retry loop
        if msg and msg.text == "1":
            break
    else:
        print(f"Failed to send chunk {chunk_idx+1} after {max_retries} retries. Aborting.")
        break
            
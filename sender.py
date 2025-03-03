from pymavlink import mavutil
import time

# MAVLink connection settings
DOCK_IP = 'udpout:192.168.33.32:14551'  # Raspberry Pi's IP address
RECEIVER_IP = "udp:0.0.0.0:14552"  # Port to listen for responses

# Establish MAVLink connections
sender = mavutil.mavlink_connection(DOCK_IP)  # Sends data
receiver = mavutil.mavlink_connection(RECEIVER_IP)  # Listens for responses

print(f"Connected to Raspberry Pi at {DOCK_IP}")
print(f"Listening for responses on {RECEIVER_IP}")
print("Sending mock data...")

# Mock data message
outgoing_data = "Data from Laptop"

while True:
    # Send mock data as STATUSTEXT
    sender.mav.statustext_send(mavutil.mavlink.MAV_SEVERITY_INFO, outgoing_data.encode('ascii'))
    print(f"Sent mock data: {outgoing_data}")

    # Listen for response messages
    msg = receiver.recv_match(type='STATUSTEXT', blocking=True)
    if msg:
        received_data = msg.text
        print(f"Response from dock: {received_data}")
    
    time.sleep(1)

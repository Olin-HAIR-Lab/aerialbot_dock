from pymavlink import mavutil
import time

# IP addresses
RECEIVER_IP = 'udp:0.0.0.0:14551'  # Receiving messages at port 14551
COMPANION_IP = 'udpout:192.168.34.71:14552'  # Sending messages to companion PC

# Establish connections
receiver = mavutil.mavlink_connection(RECEIVER_IP)  # Receives messages
sender = mavutil.mavlink_connection(COMPANION_IP)  # Sends messages

print(f"Connected to MAVLink stream (receiver) at {RECEIVER_IP}")
print(f"Connected to companion PC (sender) at {COMPANION_IP}")
print("Waiting for messages...")

while True:
    # Listne for incoming `STATUSTEXT` type message
    msg = receiver.recv_match(type='STATUSTEXT', blocking=True)

    if msg:
        # Extract received text
        received_data = msg.text
        print(f"Received mock data: {received_data}")

        # Send a response to the companion PC
        outgoing_data = "Echo from RaspPi"
        sender.mav.statustext_send(mavutil.mavlink.MAV_SEVERITY_INFO, outgoing_data.encode('ascii'))

    time.sleep(1)

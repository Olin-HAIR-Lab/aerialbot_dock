from pymavlink import mavutil
import time

# Connect rasp pi to mavlink stream
# master = 'udp:192.168.34.71:14551' 
master_ip = 'udp:0.0.0.0:14551' # open to all connections at port 14550
master = mavutil.mavlink_connection(master_ip)

print(f"Connected to MAVLink stream at {master_ip}")
print("Waiting for messages...")

while True:
    # Receive a message
    msg = master.recv_match(blocking=True)
    
    if msg:
        # Print the received message
        received_data = msg.text
        print(f"Received mock data: {received_data}")

    time.sleep(1)

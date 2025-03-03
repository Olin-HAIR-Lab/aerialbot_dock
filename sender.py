from pymavlink import mavutil
import time

# Connect laptop to raspberry pi
rasp_addr = 'udpout:192.168.33.32:14551' # raspberry pi IP address

# Connect to MAVLink using pymavlink
master = mavutil.mavlink_connection(rasp_addr, source_system=1)

print(f"Connected to MAVLink stream at {rasp_addr}")
print("Sending mock data...")

# Create a message to send mock data
mock_data = "Data from Laptop"

while True:
    # Send mock data as STATUSTEXT
    master.mav.statustext_send(mavutil.mavlink.MAV_SEVERITY_INFO, mock_data.encode('ascii'))
    print(f"Sent mock data: {mock_data}")
    
    time.sleep(1)

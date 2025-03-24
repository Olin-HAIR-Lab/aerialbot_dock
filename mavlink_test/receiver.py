from pymavlink import mavutil
import time
import helper

# IP addresses
RECEIVER_IP = 'udp:0.0.0.0:14551'  # Receiving messages at port 14551
COMPANION_IP = 'udpout:192.168.33.124:14552'  # Sending messages to companion PC

# Establish connections
receiver = mavutil.mavlink_connection(RECEIVER_IP)  # Receives messages
sender = mavutil.mavlink_connection(COMPANION_IP)  # Sends messages

print(f"Connected to MAVLink stream (receiver) at {RECEIVER_IP}")
print(f"Connected to companion PC (sender) at {COMPANION_IP}")
print("Waiting for messages...")

outgoing_data = ""
expected_chunk_count, received_chunk_count = 0, 0
chunks = ""

while True:
    # Listen for incoming `STATUSTEXT` type message
    msg = receiver.recv_match(type='STATUSTEXT', blocking=True)

    if msg:
        # Extract received text
        received_data = msg.text
        print(f"Received mock data: {received_data}")
        if received_data.split(":")[0] == "Request": # type: ignore
            outgoing_data = "ACK"
            expected_chunk_count = int(received_data.split(":")[1]) # type: ignore

        else:
            chunk_id, data = received_data.split("|")[0], received_data.split("|")[1] # type: ignore
            next_chunk = received_chunk_count + 1
            if int(chunk_id[0]) == next_chunk:
                outgoing_data = f"ACK{chunk_id.split('/')[0]}"
                received_chunk_count += 1
                chunks += data

        sender.mav.statustext_send(mavutil.mavlink.MAV_SEVERITY_INFO, outgoing_data.encode('ascii'))
    
    if received_chunk_count == expected_chunk_count:
        print("all data received")
        print(chunks)
        helper.rebuild_json(chunks = chunks)
        received_chunk_count = 0
        break

    time.sleep(1)

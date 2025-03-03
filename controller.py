import time
import json
from pymavlink import mavutil
from typing import Union

MavlinkConnection = Union[
    mavutil.mavtcp,
    mavutil.mavtcpin,
    mavutil.mavudp,
    mavutil.mavwebsocket,
    mavutil.mavmcast,
    mavutil.mavserial
]

drone_address = "udp:127.0.0.1:14550"
master: MavlinkConnection = mavutil.mavlink_connection(drone_address) # type: ignore

master.wait_heartbeat() # type: ignore
print("Connected to Drone")

def arm_and_takeoff(altitude = 7):
    master.set_mode('GUIDED')

    master.arducopter_arm()
    master.motors_armed_wait()
    print("Arm ready")

    print("Initiating Takeoff")
    master.mav.command_long_send(
                                    master.target_system, 
                                    master.target_component, 
                                    mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    altitude
                                )


    while True:
        msg = master.recv_match(type="GLOBAL_POSITION_INT", blocking=True)
        alt = msg.relative_alt / 1000.0 #type: ignore
        print(f"Current Altitute: {alt:.2f} m")

        if alt >= altitude * 0.95:
            print("Target altitude reached")
            break
    
        time.sleep(1)

def land():
    print("Initiating Landing")
    master.mav.command_long_send(
                                    master.target_system, 
                                    master.target_component, 
                                    mavutil.mavlink.MAV_CMD_NAV_LAND,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                )




# arm_and_takeoff()
# time.sleep(5)

# land()
while True:
    msg = master.recv_match(type='HEARTBEAT', blocking=True)
    print(msg)



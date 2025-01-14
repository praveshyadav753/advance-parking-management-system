import cv2
import torch
import numpy as np
from datetime import datetime, timedelta
import easyocr
from io import BytesIO
import base64  
from database import insert_parking_record, update_exit_time, get_parking_record, insert_parking_area, update_parking_area_status
from AREAfile import load_parking_areas
from pymongo import MongoClient
from flask_socketio import SocketIO, emit
import threading

# __________________________________________________________________________________________________________________________________________________________________________________-
# Establish connection to MongoDB
client = MongoClient("mongodb://mongo:hmFbkQerVqyRYfgvffTBMBlphAbnmrdR@junction.proxy.rlwy.net:21273")  # Update the connection string as needed
db = client["parkingSystem"]  # Replace "your_database_name" with your actual database name
areas_collection = db["parkingAreas"]  # Replace "parkingAreas" with your collection name
# __________________________________________________________________________________________________________________________________________________________________________________
# Load parking areas
areas = load_parking_areas()
# __________________________________________________________________________________________________________________________________________________________________________________
# Function to store parking areas in the database
def park():
    for area in areas:
        area_id = area['id']
        points = area['points']
        occupied = area['occupied']
        insert_parking_area(area_id, points, occupied)
    print('Parking areas stored successfully')
# __________________________________________________________________________________________________________________________________________________________________________________
# Function to assign a slot for parking
def assign_slot():
    area = areas_collection.find_one({"occupied": False})
    if area:
        assigned_slot = area["id"]
        areas_collection.update_one({"_id": area["_id"]}, {"$set": {"occupied": True}})
        print(assigned_slot)
        return assigned_slot
    else:
        print("No available slots")
        return None
# __________________________________________________________________________________________________________________________________________________________________________________
# Initialize EasyOCR reader
reader = easyocr.Reader(['en'], gpu=False)

# Dictionary to handle the misreading due to similar characters and numbers
dic_char_to_int = {
    'o': '0',
    'I': '1',
    'J': '3',
    'A': '4',
    'G': '6',
    'S': '5'
}

dic_int_to_char = {
    '0': 'o',
    '1': 'I',
    '3': 'J',
    '4': 'A',
    '6': "G",
    '5': 'S'
}

# Function to check the format of a license plate
def is_valid_license_plate(text):
    text = text.replace(" ", "").upper()

    if len(text) != 10:
        return False

    def is_valid_char(c):
        return c.isalpha() or c in dic_char_to_int

    if not (all(is_valid_char(c) for c in text[:2]) and all(is_valid_char(c) for c in text[4:6])):
        return False

    if not all(c.isdigit() or c in dic_int_to_char for c in text[2:4]):
        return False

    if not all(c.isdigit() for c in text[6:]):
        return False

    return True
# __________________________________________________________________________________________________________________________________________________________________________________
# Function to read text from a license plate image
def read_text_from_plate(plate_image): 
    results = reader.readtext(plate_image, detail=0)
    text1 = "".join(results).upper()
    return text1.replace(" ", "")
# __________________________________________________________________________________________________________________________________________________________________________________

# Function to continuously emit frames
def stream_frames(socketio, frame_capture):
    while True:
        ret, frame = frame_capture.read()
        if not ret:
            print("Failed to capture frame. Retrying...")
            continue  # Retry capturing the frame
        
        # Convert frame to byte data for emitting via SocketIO
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            print("Failed to encode frame.")
            continue  # Skip this frame if encoding failed
        
        frame_data = buffer.tobytes()

        # Emit the frame to the frontend (binary data can be base64 encoded if required)
        frame_base64 = base64.b64encode(frame_data).decode('utf-8')
        socketio.emit('frame', {'frame': frame_base64})

# Function to emit parking data when plate is detected
def emit_parking_data(socketio, plate_text, entry_time, entry_date, slot):
    parking_data = {
        'plate_text': plate_text,
        'entry_time': entry_time,
        'entry_date': entry_date,
        'assigned_slot': slot
    }
    socketio.emit('parking_data', parking_data)

# Function to handle the detection logic
def detection(socketio):
    print("detection")
    frame_capture = cv2.VideoCapture(0)
    model_path = "numbplt.pt"
    model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path, force_reload=False)
    plate_text = ""
    entry_time = None
    entry_date = None
    slot = None

    # Start streaming frames continuously
    frame_thread = threading.Thread(target=stream_frames, args=(socketio, frame_capture))
    frame_thread.daemon = True
    frame_thread.start()

    while True:
        ret, image = frame_capture.read()
        if not ret:
            print("Failed to capture image.")
            break

        output = model(image)
        result = np.array(output.pandas().xyxy[0])
        for i in result:
            p1 = (int(i[0]), int(i[1]))
            p2 = (int(i[2]), int(i[3]))
            cv2.rectangle(image, p1, p2, color=(0, 0, 255), thickness=2)

            plate_image = image[int(i[1]):int(i[3]), int(i[0]):int(i[2])]
            plate_image2 = cv2.cvtColor(plate_image, cv2.COLOR_BGR2GRAY)
            _, final_image = cv2.threshold(plate_image2, 170, 255, cv2.THRESH_BINARY_INV)
            
            plate_text = read_text_from_plate(final_image)

            if is_valid_license_plate(plate_text):
                current_time = datetime.now()
                entry_date = current_time.strftime('%Y-%m-%d')
                entry_time = current_time.strftime('%H:%M:%S.%f')

                plate_record = get_parking_record(plate_text)
                if plate_record:
                    entry_time = plate_record['entryTime']
                    exit_time = plate_record['exitTime']
                    if exit_time is None:
                        time_difference = current_time - datetime.strptime(entry_time, '%H:%M:%S.%f')

                        if time_difference > timedelta(minutes=5):
                            update_exit_time(plate_text, current_time, current_time.strftime('%Y-%m-%d'))
                            print(f"Exit recorded for {plate_text} at {current_time.strftime('%I:%M:%S %p')}")
                else:
                    slot = assign_slot()
                    insert_parking_record(plate_text, entry_time, entry_date, assigned_slot=slot)
                    print(f"Entry recorded for {plate_text} at {current_time.strftime('%I:%M:%S %p')}")

                # Insert the details into the database
                # Assuming you have an insert_parking_record function in your database.py to store the parking details
                insert_parking_record(plate_text, entry_time, entry_date, assigned_slot=slot)

                # Emit parking data when valid plate is detected
                emit_parking_data(socketio, plate_text, entry_time, entry_date, slot)

                return

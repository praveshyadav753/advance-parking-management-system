# import cv2
# import torch
# import numpy as np
# from datetime import datetime, timedelta
# import easyocr
# from database import insert_parking_record, update_exit_time,get_parking_record,insert_parking_area,update_parking_area_status
# from AREAfile import load_parking_areas
# from pymongo import MongoClient
# # Establish connection to MongoDB
# client = MongoClient("mongodb://localhost:27017/")  # Update the connection string as needed
# db = client["parkingSystem"]  # Replace "your_database_name" with your actual database name
# areas_collection = db["parkingAreas"]  # Replace "parkingAreas" with your collection name


# areas=load_parking_areas()
# def park():
#     for area in areas:
#                 area_id = area['id']
#                 points = area['points']
#                 occupied = area['occupied']
#                 insert_parking_area(area_id, points, occupied)
#     print('area stored successfully')       
 


# # def assign_slot():
# #     for area in areas:
# #         if not area["occupied"]:
# #             assigned_slot=area["id"]
# #             area['occupied']=True
# #             update_parking_area_status(id,True)
# #             print(assigned_slot)
# #             return assigned_slot

# def assign_slot():
#     # Query MongoDB to find an available slot
#     area = areas_collection.find_one({"occupied": False})
#     if area:
#         assigned_slot = area["id"]
#         # Update the document to mark the slot as occupied
#         areas_collection.update_one({"_id": area["_id"]}, {"$set": {"occupied": True}})
#         print(assigned_slot)
#         return assigned_slot
#     else:
#         print("No available slots")
#         return None
        

# # Initialize EasyOCR reader
# reader = easyocr.Reader(['en'], gpu=False)

# # dic to handle the mis reading due to similar character and numbers
# dic_char_to_int = {
#     'o': '0',
#     'I': '1',
#     'J': '3',
#     'A': '4',
#     'G': '6',
#     'S': '5'
# }

# dic_int_to_char = {
#     '0': 'o',
#     '1': 'I',
#     '3': 'J',
#     '4': 'A',
#     '6': "G",
#     '5': 'S'
# }
# #______________________________________function to check format of licence plate____________________________

# def is_valid_license_plate(text):
#     # Normalize the input by removing spaces and converting to uppercase
#     text = text.replace(" ", "").upper()
    
#     # check the length of text (length of number plate text =10)
#     if len(text) != 10:
#         return False

#     # Function to check if a character is valid (either alphabetic or a specified substitution)
#     def is_valid_char(c):
#         return c.isalpha() or c in dic_char_to_int
    
#     # Check that the first two characters and the characters at positions 5 and 6 are valid
#     if not (all(is_valid_char(c) for c in text[:2]) and all(is_valid_char(c) for c in text[4:6])):
#         return False
    
#     # Check the next two characters (positions 3 and 4) are digits or valid substitutions
#     if not all(c.isdigit() or c in dic_int_to_char for c in text[2:4]):
#         return False
    
#     # Check the last four characters are digits
#     if not all(c.isdigit() for c in text[6:]):
#         return False
    
#     # If all checks pass, return True
#     return True
# #______________________________function to read text _____________________________________

# def read_text_from_plate(plate_image): 
#     results = reader.readtext(plate_image, detail=0)
#     text1="".join(results).upper()
#     return text1.replace(" ","")

# #______________________-__function to detect number plate___________________________
    
# # Modify the detection function to yield frames
# # Modify the detection function to yield frames
# def detection():
#     frame = cv2.VideoCapture(0, cv2.CAP_DSHOW)  # Capture video from default camera
#     model_path = "backend/numbplt.pt"  # Custom model path
#     model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path, force_reload=False)
#     while True:
#         ret, image = frame.read()  # Read a frame from the video capture
#         if not ret:
#             break
#        # print('hello guys')
        
#         # Perform object detection on the captured frame
#         output = model(image)
#         result = np.array(output.pandas().xyxy[0])
        
#         for i in result:
#             p1 = (int(i[0]), int(i[1]))
#             p2 = (int(i[2]), int(i[3]))
#             cv2.rectangle(image, p1, p2, color=(0, 0, 255), thickness=2)  # Draw bounding box

#             # Extract the region containing the license plate
#             plate_image = image[int(i[1]):int(i[3]), int(i[0]):int(i[2])]
#             plate_image2 = cv2.cvtColor(plate_image, cv2.COLOR_BGR2GRAY)
#             _, final_image = cv2.threshold(plate_image2, 170, 255, cv2.THRESH_BINARY_INV)

#             # Read text from the license plate image
#             plate_text = read_text_from_plate(final_image)

#             # Process the license plate text if valid
#             if is_valid_license_plate(plate_text):
#                 current_time = datetime.now()
#                 entry_date = current_time.strftime('%Y-%m-%d')
#                 entry_time = current_time.strftime('%H:%M:%S.%f')

#                 # Check if the plate exists in the database and update exit time if necessary
#                 plate_record = get_parking_record(plate_text)
#                 if plate_record:
#                     entry_time = plate_record['entryTime']
#                     exit_time = plate_record['exitTime']
#                     if exit_time is None:
#                         time_difference = current_time - datetime.strptime(entry_time, '%H:%M:%S.%f')

#                         if time_difference > timedelta(minutes=5):
#                             update_exit_time(plate_text, current_time, current_time.strftime('%Y-%m-%d'))
#                             print(f"Exit recorded for {plate_text} at {current_time.strftime('%I:%M:%S %p')}")
#                 else:
#                     # If it's a new plate, add its entry time
#                     slot = assign_slot()
#                     insert_parking_record(plate_text, entry_time, entry_date, assigned_slot=slot)
#                     print(f"Entry recorded for {plate_text} at {current_time.strftime('%I:%M:%S %p')}")

#             ret, buffer = cv2.imencode('.jpg', image)
#             frame_bytes = buffer.tobytes()
        
#            # Send the frame bytes to connected clients via websockets
#            socketio.emit('frame', frame_bytes)

import cv2
import torch
import numpy as np
from datetime import datetime, timedelta
import easyocr
from database import insert_parking_record, update_exit_time, get_parking_record, insert_parking_area, update_parking_area_status
from AREAfile import load_parking_areas
from pymongo import MongoClient
from flask_socketio import SocketIO

# Establish connection to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Update the connection string as needed
db = client["parkingSystem"]  # Replace "your_database_name" with your actual database name
areas_collection = db["parkingAreas"]  # Replace "parkingAreas" with your collection name

# Load parking areas
areas = load_parking_areas()

# Function to store parking areas in the database
def park():
    for area in areas:
        area_id = area['id']
        points = area['points']
        occupied = area['occupied']
        insert_parking_area(area_id, points, occupied)
    print('Parking areas stored successfully')

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

# Function to read text from a license plate image
def read_text_from_plate(plate_image): 
    results = reader.readtext(plate_image, detail=0)
    text1 = "".join(results).upper()
    return text1.replace(" ", "")

# Function to detect number plates and emit frames via SocketIO
# Function to detect number plates and emit frames via SocketIO
def detection():
    frame = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    model_path = "backend/numbplt.pt"
    model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path, force_reload=False)
    while True:
        ret, image = frame.read()
        if not ret:
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

                # ret, buffer = cv2.imencode('.jpg', image)
                # frame_bytes = buffer.tobytes()
                
                # Emit the frame bytes via SocketIO
                # socketio.emit('frame', frame_bytes)

                # Return detection results
                return {
                    'plate_number': plate_text,
                    'time': entry_time,
                    'date': entry_date,
                    'slot': slot
                }  

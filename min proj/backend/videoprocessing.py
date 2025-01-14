# import cv2
# import numpy as np
# import model
# import json

# def load_yolo_model():
#     # Load and return your YOLO model
#     return model.load_model()

# def load_json_data(file_path):
#     with open(file_path, 'r') as file:
#         return json.load(file)

# def gen_frames(yolo_model, areas):
#     cap = cv2.VideoCapture('videos/carPark.mp4')
#     while True:
#         ret, resized_frame = cap.read()
#         if not ret: 
#             break
#         #resized_frame = cv2.resize(frame, (1080,1360))
#         detected_centers=model.detect_cars(yolo_model,resized_frame)
        
#         update_occupied_status(areas, detected_centers)
        
#         # Draw the areas with updated 'occupied' status
#         draw_areas(resized_frame, areas)
#         #cv2.imshow('parking view', resized_frame)
        
#         # Encode frame in JPEG format
#         ret, buffer = cv2.imencode('.jpg', resized_frame)
#         resized_frame = buffer.tobytes()
        
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + resized_frame + b'\r\n')

# #__________________________________________________________________________________________________________________________
# def is_point_inside_polygon(point, polygon):
#     return cv2.pointPolygonTest(np.array(polygon, dtype=np.int32), point, False) >= 0


# #______________________________________function to check occupency status________________________________________________________

# def update_occupied_status(areas, detected_centers):
#     for area in areas:
#         # Convert area points to a NumPy array for cv2.pointPolygonTest
#         points = np.array(area["points"], dtype=np.int32)
        
#         # Check if any center is inside the polygon defined by area points
#         area["occupied"] = any(
#             is_point_inside_polygon(center, points) for center in detected_centers
#         )

# #function to draw area 
# def draw_areas(resized_frame, areas):
#     for area in areas:
#         points = np.array(area["points"], dtype=np.int32)
#         color = (0, 0, 255) if area["occupied"] else (0, 255, 0)  # Red if occupied, green if not
#         cv2.polylines(resized_frame, [points], isClosed=True, color=color, thickness=2)

# #=======================================function to calculate total number of available slots===========================================================================================______________________________________________________________________________________________________________________________________

# def count_available_slots(areas):
#     # Count the number of available slots
#     available_slots = sum(not area["occupied"] for area in areas)
#     print(f"Total available slots: {available_slots}")
#     return available_slots
# videoprocessing.py




import cv2
import numpy as np
import model
import json
from database import get_collection


areas_collection = get_collection("parkingSystem", "parkingAreas")

def is_point_inside_polygon(point, polygon):
    return cv2.pointPolygonTest(np.array(polygon, dtype=np.int32), point, False) >= 0



# def update_occupied_status(areas, detected_centers):
#     for area in areas:
#         # Convert area points to a NumPy array for cv2.pointPolygonTest
#         points = np.array(area["points"], dtype=np.int32)
        
#         # Check if any center is inside the polygon defined by area points
#         area["occupied"] = any(
#             is_point_inside_polygon(center, points) for center in detected_centers
#         )
areas = list(areas_collection.find())
def update_occupied_status(detected_centers):
    # Fetch areas from the database
    areas = list(areas_collection.find())
    
    # Update occupied status for each area
    for area in areas:
        # Convert area points to a NumPy array for cv2.pointPolygonTest
        points = np.array(area["points"], dtype=np.int32)
        
        # Check if any center is inside the polygon defined by area points
        area["occupied"] = any(
            is_point_inside_polygon(center, points) for center in detected_centers
        )
        
        # Update the area in the database with the modified occupied status
        areas_collection.update_one({"_id": area["_id"]}, {"$set": {"occupied": area["occupied"]}})

def draw_areas(frame):
    areas = list(areas_collection.find())
    for area in areas:
        points = np.array(area["points"], dtype=np.int32)
        color = (0, 0, 255) if area["occupied"] else (0, 255, 0)  # Red if occupied, green if not
        cv2.polylines(frame, [points], isClosed=True, color=color, thickness=2) 
        

def load_yolo_model():
    return model.load_model()

def load_json_data(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def gen_frames(yolo_model, areas):
    cap = cv2.VideoCapture('../vedios/carPark.mp4')
    while True:
        ret, frame = cap.read()
        if not ret: 
            print("error2")
            break
        else:
            detected_centers=model.detect_cars(yolo_model,frame)
            
            update_occupied_status( detected_centers)
            
            draw_areas(frame)
            
            #cv2.imshow('parking view', frame)
            
            
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            



    
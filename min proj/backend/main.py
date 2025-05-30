import cv2
import numpy as np
from backend.AREAfile import load_parking_areas, save_parking_areas #file module import json
from pynput.keyboard import Key, Listener #input key from keyboard
import model

yolo_model = model.load_model()
areas = load_parking_areas()
current_area = []
selected_area_index = None  # Index of the currently selected area
delete_pressed = False  # Flag to indicate delete key press
global mode 
#__________________________________________________________________________________________________________________________

#function to check if point selected using mouse is within polygon if it is within then it return
# 1 and -1 if outside the polygon.
def is_point_inside_polygon(point, polygon):
    return cv2.pointPolygonTest(np.array(polygon, dtype=np.int32), point, False) >= 0


def on_press(key):
    global delete_pressed
    if key == Key.delete:  # Detect delete key press
        delete_pressed = True
        
        # Start listening to keyboard events in a separate thread
listener = Listener(on_press=on_press)
listener.start()

#______________________________________end of function________________________________________________________
        
#function for mouse click

mode = 'auto'  # Can be 'manual' or 'auto'
auto_area_size = (105, 45)  # Width and height for automatic mode, adjust as needed
    #a for auto mode for area and m for manual area selaction all point
def mark_point(event, x, y, flags, param):
    global current_area, selected_area_index, mode, areas
    if event == cv2.EVENT_LBUTTONDOWN:
        clicked_point = (x, y)
        found_area = False

        # Check if clicked inside an existing area
        for index, area in enumerate(areas):
            if is_point_inside_polygon(clicked_point, np.array(area["points"], dtype=np.int32)):
                selected_area_index = index
                found_area = True
                print(f"Area {area['id']} selected.")
                break

        if not found_area:
            selected_area_index = None  # Deselect if clicked outside any area

        # Handling auto mode for adding a new area
        if mode == 'auto' and len(current_area) == 0 and not found_area:
            w, h = auto_area_size  # Default size for auto mode
            new_area = {
                "id": max([area.get("id", 0) for area in areas], default=0) + 1,
                "points": [(x, y), (x + w, y), (x + w, y + h), (x, y + h)],
                "occupied": False
            }
            areas.append(new_area)
            print(f"Auto-defined area added with ID {new_area['id']}")

        # Handling manual mode for adding new points to the current area
        elif mode == 'manual' and not found_area:
            if len(current_area) < 4:  # Ensure only 4 points are added
                current_area.append(clicked_point)
                print(f"Point added: {clicked_point}")
                if len(current_area) == 4:
                    new_area = {
                        "id": max([area.get("id", 0) for area in areas], default=0) + 1,
                        "points": current_area,
                        "occupied": False
                    }
                    areas.append(new_area)
                    current_area = []  # Reset for the next area
                    print(f"Manual-defined area added with ID {new_area['id']}")


#__________________________________________________________________________________________________________
#function to draw area 
def draw_areas(resized_frame, areas, current_area, detected_centers):
    global selected_area_index  # Ensure selected_area_index is accessible
    
    # Iterate through each area and draw it
    for index, area in enumerate(areas):
        # Correctly access 'points' from the 'area' dictionary
        points = np.array(area["points"], dtype=np.int32)
        
        # Update 'occupied' status based on detected centers
        area["occupied"] = any(is_point_inside_polygon(center, points) for center in detected_centers)
        
        # Determine the color based on the 'occupied' status and selection
        if index == selected_area_index:
            color = (255, 0, 0)  # Blue for selected area
        else:
            color = (0, 0, 255) if area["occupied"] else (0, 255, 0)  # Red if occupied, green if not
        
        # Draw the area
        cv2.polylines(resized_frame, [np.array(area["points"], dtype=np.int32)], isClosed=True, color=color, thickness=2)

    # Draw the current area being defined
    if current_area:
        # Draw circles for each point in the current area
        for point in current_area:
            cv2.circle(resized_frame, point, 3, (0, 255, 255), -1)  # Use a different color, e.g., cyan, for points being currently defined
        
        # Connect points with lines if there are at least 2 points
        if len(current_area) >= 2:  # Ensure this is >= 2 to draw lines between points
            cv2.polylines(resized_frame, [np.array(current_area, dtype=np.int32)], isClosed=False, color=(255, 255, 0), thickness=2)  # Yellow lines

        # If forming a complete polygon (manual mode completion), close it
        if len(current_area) == 4:  # Assuming 4 points needed for a complete area
            cv2.polylines(resized_frame, [np.array(current_area, dtype=np.int32)], isClosed=True, color=(255, 255, 0), thickness=2)  # Close the polygon

#=======================================function to calculate total number of available slots===========================================================================================______________________________________________________________________________________________________________________________________

def count_available_slots(areas):
    # Count the number of available slots
    available_slots = sum(not area["occupied"] for area in areas)
    print(f"Total available slots: {available_slots}")
    return available_slots
#=======================================function to find and assign slots:==================================================================================================


#...............................main body......................................................
# CCTV camera stream URL (RTSP format example)
#stream_url = 'rtsp://username:password@camera_ip_address:port/stream_path'

cap = cv2.VideoCapture('vedios/carPark.mp4')
cv2.namedWindow('parking view')
cv2.setMouseCallback('parking view', mark_point)

while True:
    ret, resized_frame = cap.read()
    if not ret:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  
        break
   # resized_frame = cv2.resize(frame, (1080,1360))
    detected_centers=model.detect_cars(yolo_model,resized_frame)
    
    if delete_pressed:
        if selected_area_index is not None:
            del areas[selected_area_index]
            print(f"Deleted area: {selected_area_index}")
            selected_area_index = None  # Reset selected area index
        delete_pressed = False  # Reset f
    #print(f"Areas structure before drawing: {areas}")

    draw_areas(resized_frame, areas, current_area,detected_centers)
    cv2.imshow('parking view', resized_frame)
    
    key = cv2.waitKey(50) & 0xFF
    if key == 27:  # ESC key to exit
        save_parking_areas(areas)
        break
    elif key == ord('n'):
        if current_area:
            areas.append(current_area)
            current_area = []
            print("New area started")
    elif key == ord('d') and current_area:
        deleted_point = current_area.pop()
        print(f"Deleted point: {deleted_point}")
    
    elif key ==ord('a'):
        mode='auto'
        print('Switched to auto mode')
    elif key == ord('m'):
        mode='manual'
        print('switched to manual mode ')
    elif key==ord('s'):
        save_parking_areas(areas)            
count_available_slots()    
print(f"Detected {len(detected_centers)} cars")
#print(f"available slots:{}")
           
save_parking_areas(areas)
cap.release()
cv2.destroyAllWindows()

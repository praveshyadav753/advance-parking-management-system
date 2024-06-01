import cv2
import torch

# Load the YOLOv5 model
model = toload('cardetect.pt')

# Open a video file or a streaming video
video_path = 'vedios/carPark.mp4'  # Replace with the path to your video
cap = cv2.VideoCapture(video_path)

# Check if video opened successfully
if not cap.isOpened():
    print("Error opening video stream or file")

# Define the class ID for cars (may need adjustment based on your model's dataset)
car_class_id = 0

while cap.isOpened():
    # Capture frame-by-frame
    ret, resized_frame = cap.read()
    if ret:
        # Perform detection
        #resized_frame = cv2.resize(frame, (640,640))
        results = model(resized_frame)
        
        # Extract detection results
        detections = results.xyxy[0]  # Detections are stored in a tensor

        # Iterate through detections and calculate the center point of cars
        for detection in detections:
            x1, y1, x2, y2, conf, cls_id = detection[:6]
            if int(cls_id) == car_class_id:  # Check if the detected object is a car
                # Calculate the center point
                cx = int((x1 + x2) / 2)
                cy = int((y1 + y2) / 2)
                
                # Optionally, draw the center point on the frame
                cv2.circle(resized_frame, (cx, cy), radius=5, color=(0, 255, 0), thickness=-1)
                
                print(f"Car detected at center: ({cx}, {cy})")

        # Display the resulting frame
       
        cv2.imshow('Frame', resized_frame   )

        # Press Q on keyboard to exit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    else:
        break

# When everything done, release the video capture object
cap.release()

# Closes all the frames
cv2.destroyAllWindows()

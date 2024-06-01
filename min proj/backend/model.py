
import cv2
import torch
import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath 

model_path = r"backend/best.pt"  

def load_model():
   # model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
    
     cpu_or_cuda = "cpu"  #choose device; "cpu" or "cuda"(if cuda is available)
    # device = torch.device(cpu_or_cuda)
     model = torch.hub.load('ultralytics/yolov5', 'custom', path= model_path, force_reload=False)
    # model = model.to(device)
     return model

# Perform car detection on a frame and return center points of detected cars
def detect_cars(model, frame):
    results = model(frame)
    #print(results)
    detections = results.xyxy[0]  # Detections are stored in a tensor
    center_points = []
    #print(detections)

    for detection in detections:     # Calculate the center point
            x1, y1, x2, y2, conf, cls_id = detection[:6]
            cx = int((x1 + x2) / 2)
            cy = int((y1 + y2) / 2)
            #print(cx,cy)
            center_points.append((cx, cy))
    return center_points
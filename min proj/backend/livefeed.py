import cv2
from flask import Flask, Response
import imutils

camera = cv2.VideoCapture(0)

def generate_frames():
    while True:
        # Read a frame from the camera
        ret, frame = camera.read()

        if not ret:
            break

        # Resize frame for better performance (optional)
        frame = imutils.resize(frame, width=640)

        # Convert the frame to JPEG
        ret, jpeg = cv2.imencode('.jpg', frame)

        if not ret:
            continue

        # Yield the frame in the MJPEG format
        frame = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

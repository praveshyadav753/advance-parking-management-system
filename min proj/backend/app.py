from database import init_db, clear_parking_records,clear_parking_areas
from number_plate import detection
import threading
from flask import Flask, render_template, send_from_directory, Response, jsonify, request
import os
from flask_cors import CORS
from videoprocessing import gen_frames, load_yolo_model, load_json_data 
import base64
import cv2
from flask_pymongo import PyMongo
from flask_socketio import SocketIO

template_dir = os.path.abspath('frontend/templates')
static_dir = os.path.abspath('frontend/static')
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.config["MONGO_URI"] = "mongodb://localhost:27017/parkingSystem"
socketio = SocketIO(app)
mongo = PyMongo(app)

# Initialize the PyMongo instance
init_db(app)

CORS(app)

# Load YOLO model and parking areas JSON path
yolo_model = load_yolo_model()
json_file_path = os.path.join(os.getcwd(), 'parking_areas.json')  
detection_thread = threading.Thread(target=detection)
detection_thread.daemon = True  # Daemonize the thread so it automatically exits when the main thread exits
detection_thread.start()

@app.route('/')
def index():
    return render_template('index.html')

# SocketIO event handler for client connection
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    
# SocketIO event handler for client disconnection
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')    

@app.route('/video')
def video():
    # areas = load_json_data(json_file_path)  # Reload areas data on each request to ensure it's up-to-date
    # return Response(gen_frames(yolo_model, areas), mimetype='multipart/x-mixed-replace; boundary=frame')
    areas = mongo.db.parkingAreas.find()
    return Response(gen_frames(yolo_model, areas), mimetype='multipart/x-mixed-replace; boundary=frame')





def capture_frame(video_path='vedios/carPark.mp4'):
    cap = cv2.VideoCapture(video_path)
    success, frame = cap.read()
    cap.release()
    return frame if success else None

@app.route('/frame')
def get_frame():
    frame = capture_frame()
    if frame is not None:
        _, buffer = cv2.imencode('.jpg', frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')
        return jsonify({"frame": "data:image/jpeg;base64," + frame_base64})
    return jsonify({"error": "Failed to capture frame"}), 404

@app.route('/video_feed')
def video_feed():
    plate_data = detection()
    return jsonify(plate_data)
   # return Response(detection(), mimetype='multipart/x-mixed-replace; boundary=frame')
# @socketio.on('frame_bytes')
# def send_frame():
#     detection(socketio)  # Pass the socketio object as an argument



@app.route('/get_all_parking_records', methods=['GET'])
def get_all_parking_records():
    parking_records = mongo.db.parkingRecords.find()  # Retrieve all records from the parkingRecords collection
    records_list = list(parking_records)  # Convert cursor to list of dictionaries
    
    # Convert ObjectId to string for each record
    for record in records_list:
        record['_id'] = str(record['_id'])

    return jsonify(records_list)

@app.route('/parking_records', methods=['DELETE'])
def delete_parking_records():
    try:
        # Clear all parking records
        clear_parking_records()
        return jsonify({'message': 'All parking records deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_all_parking_areas', methods=['GET'])
def get_all_parking():
    parking_areas = mongo.db.parkingAreas.find()  # Retrieve all records from the parkingRecords collection
    records_list1 = list(parking_areas)  # Convert cursor to list of dictionaries
    
    # Convert ObjectId to string for each record
    for record in records_list1:
        record['_id'] = str(record['_id'])

    return jsonify(records_list1)
@app.route('/parking_areas', methods=['DELETE'])
def delete_parking_areas():
    try:
        # Clear all parking records
        clear_parking_areas()
        return jsonify({'message': 'All parking records deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

from flask import current_app

@app.route('/history')
def history():
    # Fetch parking records from the database
    parking_records = mongo.db.parkingRecords.find()
    records_list = list(parking_records)
    for record in records_list:
        record['_id'] = str(record['_id'])
    return jsonify(records_list)


    

if __name__ == '__main__':
    #app.run(debug=True, port=5501)
    
    socketio.run(app, debug=True, port=5501)
    

import threading
from flask import Flask, render_template, send_from_directory, Response, jsonify, request
import os
from flask_cors import CORS
import base64
import cv2
from io import BytesIO
from flask_pymongo import PyMongo
from flask_socketio import SocketIO
from pymongo import MongoClient
from .number_plate import detection
from .videoprocessing import gen_frames, load_yolo_model, load_json_data
from .database import clear_parking_records, clear_parking_areas, add_user, verify_login, get_mongo_client


# Setup directories for templates and static files
template_dir = os.path.abspath('../frontend/templates')
static_dir = os.path.abspath('../frontend/static')
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

# Initialize SocketIO and enable CORS
CORS(app)
# socketio=SocketIO(app)
socketio = SocketIO(app, cors_allowed_origins="*")
# socketio = SocketIO(app, cors_allowed_origins="http://127.0.0.1:5001")
app.config["MONGO_URI"] = "mongodb://mongo:hmFbkQerVqyRYfgvffTBMBlphAbnmrdR@junction.proxy.rlwy.net:21273"

# Load YOLO model and parking areas JSON path
yolo_model = load_yolo_model()
json_file_path = os.path.join(os.getcwd(), 'parking_areas.json')  

# Start detection thread
detection_thread = threading.Thread(target=detection, args=(socketio,))
detection_thread.daemon = True  # Ensure the thread exits when the main thread exits
detection_thread.start()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET'])
def register():
    username = "root123"
    password = "medicapsuniversity"

    if add_user(username, password):
        return jsonify({'success': True, 'message': 'User registered successfully.'})
    else:
        return jsonify({'success': False, 'message': 'User already exists.'})

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if verify_login(username, password):
        session['username'] = username
        return jsonify({'success': True, 'message': 'Login successful.'})
    else:
        return jsonify({'success': False, 'message': 'Invalid username or password.'})

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
    db = get_mongo_client()
    areas = db.parkingAreas.find()
    return Response(gen_frames(yolo_model, areas), mimetype='multipart/x-mixed-replace; boundary=frame')

def capture_frame(video_path='../vedios/carPark.mp4'):
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
        return jsonify({"frame1": "data:image/jpeg;base64," + frame_base64})
    return jsonify({"error": "Failed to capture frame"}), 404

# @app.route('/api/detection/<read>', methods=['GET'])
# def detection_api(read=False):
#    detection_allow(socketio,read,port=5000)
  
    
@app.route('/api/detection/<read>', methods=['GET'])
def detection_api():
   detection(socketio)
  
    



@app.route('/get_all_parking_records', methods=['GET'])
def get_all_parking_records():
    db = get_mongo_client()
    parking_records = db.parkingRecords.find()  # Retrieve all records from the parkingRecords collection
    records_list = list(parking_records)  # Convert cursor to list of dictionaries
    for record in records_list:
        record['_id'] = str(record['_id'])  # Convert ObjectId to string

    return jsonify(records_list)

@app.route('/parking_records', methods=['DELETE'])
def delete_parking_records():
    try:
        clear_parking_records()
        return jsonify({'message': 'All parking records deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_all_parking_areas', methods=['GET'])
def get_all_parking_areas():
    db = get_mongo_client()
    parking_areas = db.parkingAreas.find()
    areas_list = list(parking_areas)
    for area in areas_list:
        area['_id'] = str(area['_id'])  # Convert ObjectId to string
    return jsonify(areas_list)

@app.route('/clear_parking_areas', methods=['DELETE'])
def delete_parking_areas():
    try:
        clear_parking_areas()
        return jsonify({'message': 'All parking areas cleared successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/history')
def history():
    # Fetch parking records from the database
    db=get_mongo_client()
    parking_records = db.parkingRecords.find()
    records_list = list(parking_records)
    for record in records_list:
        record['_id'] = str(record['_id'])
    return jsonify(records_list)    

# Error handling for routes that are not defined
@app.errorhandler(404)
def page_not_found(error):
    return jsonify({'error': 'Route not found'}), 404


import warnings
warnings.filterwarnings("ignore", category=FutureWarning)


# Run the application
if __name__ == '__main__':
    socketio.run(app, debug=True,port=5001)

from datetime import datetime
# from app import get_mongo_client 
from werkzeug.security import generate_password_hash, check_password_hash
from flask import  request, jsonify
import random



client=None

def get_mongo_client():
    global client
    global db
    if client is None:
        client = MongoClient("mongodb://mongo:hmFbkQerVqyRYfgvffTBMBlphAbnmrdR@junction.proxy.rlwy.net:21273") 
        db = client["parkingSystem"]
    return db
def generate_user_id(username):
    """
    Generate a userId in the format:
    PI{year}{first two letters of username}{random 4-digit number}
    """
    year = datetime.datetime.now().year  # Current year
    username_prefix = username[:2].upper() if len(username) >= 2 else username.upper() + "X"
    random_number = random.randint(1000, 9999)  # Generate a random 4-digit number
    return f"PI{year}{username_prefix}{random_number}"
          

def add_user(username, password):
    db= get_mongo_client()
    users = db.users
    
    # if "username" not in data or not data["username"]:
    #     return jsonify({"error": "Username is required"}), 400

    # Generate userId
    user_id = generate_user_id(username)

    # Define the user schema
    # user = {
    #     "userId": user_id,
    #      "username": user_id[-2:]
    #     "firstName": data.get("firstName", None),
    #     "lastName": data.get("lastName", None),
    #     "email": data.get("email", None),
    #     "phoneNumber": data.get("phoneNumber", None),
    #      "password": user_id
    # }
    # Check if the user already exists
    if users.find_one({'username': username}):
        print(f"User {username} already exists. Skipping insertion.")
        return False

    # Hash the password before storing it
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    # Insert new user
    user = {
        'username': username,
        'password': hashed_password
    }
    users.insert_one(user)
    print(f"User {username} created successfully.")
    return True


def update_user(user_id):
    db= get_mongo_client()
    try:
        # Parse the incoming JSON payload
        data = request.json

        # Validate if at least one field is provided for update
        if not data:
            return jsonify({"error": "No data provided to update"}), 400

        # Allowed fields to update
        allowed_fields = {"firstName", "lastName", "email", "phoneNumber"}

        # Filter the data to only include allowed fields
        update_data = {key: value for key, value in data.items() if key in allowed_fields}

        # Check if there are valid fields to update
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400

        # Update the document in MongoDB
        result = db.users.update_one(
            {"userId": user_id},  # Filter by userId
            {"$set": update_data}  # Update only specified fields
        )

        if result.matched_count == 0:
            return jsonify({"error": f"No user found with userId: {user_id}"}), 404

        return jsonify({
            "message": "User updated successfully",
            "modifiedCount": result.modified_count
        }), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# ----------------------------------------------------------------------------------------------------
def verify_login(username, password):
    db= get_mongo_client()
    users = db.users

    # Find the user by username
    user = users.find_one({'username': username})

    if user and check_password_hash(user['password'], password):
        print(f"User {username} logged in successfully.")
        return True
    else:
        print(f"Invalid login attempt for user {username}.")
        return False    

def insert_parking_record(vehicle_number, entry_time, entry_date, assigned_slot, exit_time=None, exit_date=None, owner_name=None,mobile_number=None):
    db= get_mongo_client()
    parking_records =db.parkingRecords

    # If no exit time is provided, assume the vehicle is still parked
    if exit_time is None:
        exit_time = None
        exit_date = None

    # Check if a record with the same vehicle plate and no exit time exists
    existing_record = parking_records.find_one({'vehicleNumber': vehicle_number, 'exitTime': None})
    if existing_record:
        print(f"Record already exists for vehicle plate {vehicle_number}. Skipping insertion.")
        return existing_record['_id']  # Return the existing record's ID

    # If no existing record, insert a new record
    record = {
        'vehicleNumber': vehicle_number,
        'entryTime': entry_time,
        'entryDate': entry_date,
        'exitTime': exit_time,
        'exitDate': exit_date,
        'assignedSlot': assigned_slot,
        'ownerName': owner_name,
        'Contact': mobile_number,
    }
    return parking_records.insert_one(record).inserted_id

def update_exit_time(vehicle_number, exit_time, exit_date):
    db= get_mongo_client()
    parking_records = db.parkingRecords
    return parking_records.update_one(
        {'vehicleNumber': vehicle_number},
        {'$set': {'exitTime': exit_time, 'exitDate': exit_date}}
    ).modified_count

def clear_parking_records():
    db= get_mongo_client()
    parking_records = db.parkingRecords
    result = parking_records.delete_many({})
    print(f"{result.deleted_count} records deleted.")
    
def find_parking_record_by_vehicle_number(vehicle_number):
    db= get_mongo_client()
    parking_records = db.parkingRecords
    return parking_records.find_one({'vehicleNumber': vehicle_number})

def get_parking_record(vehicle_number):
    db= get_mongo_client()
    parking_records = db.parkingRecords
    return parking_records.find_one({'vehicleNumber': vehicle_number})


#-------------------------------------------------------------------------
def insert_parking_area(area_id, points, occupied=False):
    parking_areas = db.parkingAreas
    area = {
        'id': area_id,
        'points': points,
        'occupied': occupied
    }
    return parking_areas.insert_one(area).inserted_id
def update_parking_area_status(area_id, occupied):
    db= get_mongo_client()
    parking_areas = db.parkingAreas
    return parking_areas.update_one(
        {'id': area_id},
        {'$set': {'occupied': occupied}}
    ).modified_count

def get_all_parking_areas():
    db= get_mongo_client()
    parking_areas = db.parkingAreas
    return parking_areas.find()
def clear_parking_areas():
    db= get_mongo_client()
    parking_records = db.parkingAreas
    result = parking_records.delete_many({})
    print(f"{result.deleted_count} records deleted.")
    
from pymongo import MongoClient

def get_database_connection(database_name):
    client = MongoClient("mongodb://mongo:hmFbkQerVqyRYfgvffTBMBlphAbnmrdR@junction.proxy.rlwy.net:21273")
    return client[database_name]

def get_collection(database_name, collection_name):
    db = get_database_connection(database_name)
    return db[collection_name]
    
    
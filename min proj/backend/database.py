from flask_pymongo import PyMongo
from datetime import datetime

mongo = None

def init_db(app):
    global mongo
    mongo = PyMongo(app)

def insert_parking_record(vehicle_number, entry_time, entry_date, assigned_slot, exit_time=None, exit_date=None, owner_name=None):
    parking_records = mongo.db.parkingRecords

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
        'ownerName': owner_name
    }
    return parking_records.insert_one(record).inserted_id

def update_exit_time(vehicle_number, exit_time, exit_date):
    parking_records = mongo.db.parkingRecords
    return parking_records.update_one(
        {'vehicleNumber': vehicle_number},
        {'$set': {'exitTime': exit_time, 'exitDate': exit_date}}
    ).modified_count

def clear_parking_records():
    parking_records = mongo.db.parkingRecords
    result = parking_records.delete_many({})
    print(f"{result.deleted_count} records deleted.")
    
def find_parking_record_by_vehicle_number(vehicle_number):
    parking_records = mongo.db.parkingRecords
    return parking_records.find_one({'vehicleNumber': vehicle_number})

def get_parking_record(vehicle_number):
    parking_records = mongo.db.parkingRecords
    return parking_records.find_one({'vehicleNumber': vehicle_number})


#-------------------------------------------------------------------------
def insert_parking_area(area_id, points, occupied=False):
    parking_areas = mongo.db.parkingAreas
    area = {
        'id': area_id,
        'points': points,
        'occupied': occupied
    }
    return parking_areas.insert_one(area).inserted_id
def update_parking_area_status(area_id, occupied):
    parking_areas = mongo.db.parkingAreas
    return parking_areas.update_one(
        {'id': area_id},
        {'$set': {'occupied': occupied}}
    ).modified_count

def get_all_parking_areas():
    parking_areas = mongo.db.parkingAreas
    return parking_areas.find()
def clear_parking_areas():
    parking_records = mongo.db.parkingAreas
    result = parking_records.delete_many({})
    print(f"{result.deleted_count} records deleted.")
    
from pymongo import MongoClient

def get_database_connection(database_name):
    client = MongoClient("mongodb://localhost:27017/")
    return client[database_name]

def get_collection(database_name, collection_name):
    db = get_database_connection(database_name)
    return db[collection_name]
    
    
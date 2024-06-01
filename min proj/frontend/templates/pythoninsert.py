'vehicleNumber': vehicle_number,
        'entryTime': entry_time,
        'entryDate': entry_date,
        'exitTime': exit_time,
        'exitDate': exit_date,
        'assignedSlot': assigned_slot,
        'ownerName': owner_name


        from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')

# Select database
db = client['parkingSystem']

# Select collection
collection = db['parkingRecord']

# Define data to insert
data_to_insert = [
    { 
        "vehicleNumber": "MP11ZA8841",
        "entryTime": "2:08 PM",
        "entryDate": "2024-04-21",
        "exitTime": "3:00 AM",
        "exitDate": "2024-04-22",
        "assignedSlot": 3,
        "ownerName": "ANANT SHUKLA"
    },
    { 
        "vehicleNumber": "MP41ZE8681",
        "entryTime": "3:08 PM",
        "entryDate": "2024-05-21",
        "exitTime": "3:00 AM",
        "exitDate": "2024-05-22",
        "assignedSlot": 1,
        "ownerName": "KAILASH SHUKLA"
    },
    { 
        "vehicleNumber": "UP23ZW5679",
        "entryTime": "5:56 PM",
        "entryDate": "2024-04-20",
        "exitTime": "3:00 AM",
        "exitDate": "2024-05-22",
        "assignedSlot": 41,
        "ownerName": "AATMARAM BHIDE"
    },
    { 
        "vehicleNumber": "UK13PE4581",
        "entryTime": "12:10 AM",
        "entryDate": "2024-04-11",
        "exitTime": "6:00 AM",
        "exitDate": "2024-04-11",
        "assignedSlot": 8,
        "ownerName": "TONY STARK"
    },
    { 
        "vehicleNumber": "MP13MW2711",
        "entryTime": "01:08 PM",
        "entryDate": "2024-04-28",
        "exitTime": "9:00 AM",
        "exitDate": "2024-04-29",
        "assignedSlot": 6,
        "ownerName": "JAITHALAL GADA"
    }
]

# Insert data into collection
result = collection.insert_many(data_to_insert)

# Print the inserted document IDs
print("Inserted IDs:", result.inserted_ids)

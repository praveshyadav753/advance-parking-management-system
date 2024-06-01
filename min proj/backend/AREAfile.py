import json

# File to store parking area data
file_name = 'parking_areas.json'

def load_parking_areas():
    try:
        with open(file_name, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []  # Return an empty list if the file doesn't exist or is empty

def save_parking_areas(parking_areas):
    with open(file_name, 'w') as file:
        json.dump(parking_areas, file)


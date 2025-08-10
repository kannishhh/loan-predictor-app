import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USER_FILE = os.path.join(BASE_DIR, 'data', 'users.json')

def load_json_file(filepath):
    if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
        return []
    with open(filepath, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            print(f"Warning: {filepath} is empty or malformed. Returning empty list.")
            return []

def load_users():
    return load_json_file(USER_FILE)

def is_user_admin(email):
    
    users = load_users()
    user = next((u for u in users if u["email"] == email), None)
    return user and user.get("is_admin", False)

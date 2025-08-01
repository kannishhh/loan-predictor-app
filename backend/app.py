import json
import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from datetime import datetime, timedelta # Import datetime and timedelta

# For password hashing (install: pip install Werkzeug)
from werkzeug.security import generate_password_hash, check_password_hash

# For JWT (install: pip install Flask-JWT-Extended)
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token

# Import your existing blueprints (assuming they handle their own routes)
from routes.admin_stats import admin_stats_bp
from routes.admin_feedback import feedback_bp
from routes.admin_predictions import predictions_bp
from routes.admin_users import admin_users

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# --- JWT Configuration ---
app.config["JWT_SECRET_KEY"] = "your_super_secret_jwt_key_here" # CHANGE THIS TO A STRONG, RANDOM KEY!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1) # Token valid for 1 hour
jwt = JWTManager(app)

# Register your blueprints
app.register_blueprint(admin_stats_bp)
app.register_blueprint(feedback_bp)
app.register_blueprint(predictions_bp)
app.register_blueprint(admin_users)

# Load the model, scaler, and label encoder
try:
    model = joblib.load('models/random_forest_model.pkl')
    scaler = joblib.load('models/scaler.pkl')
    label_encoder = joblib.load('models/label_encoder.pkl')
except FileNotFoundError as e:
    print(f"Error loading model files: {e}. Ensure 'models/' directory and files exist.")
    model = None
    scaler = None
    label_encoder = None

# Define feature columns (same as in the dataset, excluding 'not.fully.paid')
columns = ['credit.policy', 'purpose', 'int.rate', 'installment', 'log.annual.inc',
           'dti', 'fico', 'days.with.cr.line', 'revol.bal', 'revol.util',
           'inq.last.6mths', 'delinq.2yrs', 'pub.rec']

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

USER_FILE = os.path.join(BASE_DIR, 'data', 'users.json')
HISTORY_FILE = os.path.join(BASE_DIR, 'data', 'history.json')
LOGIN_HISTORY_FILE = os.path.join(BASE_DIR, 'data', 'login_history.json') # New file for login records

# --- Helper Functions for JSON Files ---
def load_json_file(filepath):
    if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
        return []
    with open(filepath, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            print(f"Warning: {filepath} is empty or malformed. Returning empty list.")
            return []

def save_json_file(data, filepath):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=4) # Use indent for readability

def load_users():
    return load_json_file(USER_FILE)

def save_users(users):
    save_json_file(users, USER_FILE)

def load_history():
    return load_json_file(HISTORY_FILE)

def save_history(history):
    save_json_file(history, HISTORY_FILE)

def load_login_history():
    return load_json_file(LOGIN_HISTORY_FILE)

def save_login_history(login_history):
    save_json_file(login_history, LOGIN_HISTORY_FILE)

# --- Admin User Check (Crucial for Admin Routes) ---
def is_user_admin(email):
    users = load_users()
    user = next((u for u in users if u["email"] == email), None)
    return user and user.get("is_admin", False) # Default to False if not set

# --- Authentication Routes ---

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    users = load_users()
    if any(u["email"] == email for u in users):
        return jsonify({"error": "User already exists"}), 400

    # IMPORTANT: Hash the password in a real application!
    # hashed_password = generate_password_hash(password)
    hashed_password = password # Placeholder for demo, REPLACE THIS!

    users.append({
        "email": email,
        "password": hashed_password,
        "is_admin": False, # New users are not admins by default
        "created_at": datetime.now().isoformat() # Store creation timestamp
    })
    save_users(users)
    return jsonify({"message": "Signup successful"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    users = load_users()
    user = next((u for u in users if u["email"] == email), None)

    # IMPORTANT: Check hashed password in a real application!
    # if user and check_password_hash(user["password"], password):
    if user and user["password"] == password: # Placeholder for demo, REPLACE THIS!
        # Record login event
        login_history = load_login_history()
        login_history.append({
            "email": email,
            "timestamp": datetime.now().isoformat()
        })
        save_login_history(login_history)

        access_token = create_access_token(identity=email)
        return jsonify({"message": "Login successful", "access_token": access_token}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/admin-login", methods=["POST"])
def admin_login():
    data = request.get_json()
    email = data.get("email") # Using 'email' for admin ID
    password = data.get("password")

    users = load_users()
    admin_user = next((u for u in users if u["email"] == email and u.get("is_admin", False)), None)

    # IMPORTANT: Check hashed password in a real application!
    # if admin_user and check_password_hash(admin_user["password"], password):
    if admin_user and admin_user["password"] == password: # Placeholder for demo, REPLACE THIS!
        access_token = create_access_token(identity=email)
        return jsonify({"message": "Admin login successful", "access_token": access_token}), 200
    return jsonify({"error": "Invalid admin credentials"}), 401

# --- Prediction Route ---
@app.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    if model is None or scaler is None or label_encoder is None:
        return jsonify({'error': 'Model not loaded. Server configuration error.'}), 500

    try:
        data = request.get_json()
        current_user_email = get_jwt_identity()

        if not current_user_email:
            return jsonify({'error': 'Authentication required to make a prediction.'}), 401

        # Validate all required columns are present
        for col in columns:
            if col not in data:
                return jsonify({'error': f"Missing data for required field: {col}"}), 400

        input_data = {}
        for col in columns:
            if col == 'purpose':
                # Handle cases where purpose might not be in the original encoder classes
                try:
                    input_data[col] = label_encoder.transform([data[col]])[0]
                except ValueError:
                    # If purpose is not in the encoder, you might want to handle it gracefully
                    # For now, we return an error, which is reasonable.
                    return jsonify({'error': f"Invalid purpose: {data[col]}. Must be one of {list(label_encoder.classes_)}"}), 400
            else:
                try:
                    # Ensure the value is not None or empty string before converting to float
                    value = data.get(col)
                    if value is None or value == '':
                         return jsonify({'error': f"Field '{col}' cannot be empty."}), 400
                    input_data[col] = float(value)
                except (ValueError, TypeError):
                    return jsonify({'error': f"Invalid number format for field: {col}"}), 400

        df = pd.DataFrame([input_data], columns=columns)

        numerical_cols = ['int.rate', 'installment', 'log.annual.inc', 'dti', 'fico',
                          'days.with.cr.line', 'revol.bal', 'revol.util', 'inq.last.6mths',
                          'delinq.2yrs', 'pub.rec']
        df[numerical_cols] = scaler.transform(df[numerical_cols])

        prediction = model.predict(df)[0]
        probability_non_repaid = model.predict_proba(df)[0][1]

        result = 'Loan Likely to be Repaid' if prediction == 0 else 'Loan at Risk of Non-Repayment'
        confidence_value = (1 - probability_non_repaid) * 100 if prediction == 0 else probability_non_repaid * 100
        confidence = f"{confidence_value:.2f}%"

        entry = {
            "email": current_user_email,
            "input": data,
            "result": result,
            "confidence": confidence,
            "timestamp": datetime.now().isoformat()
        }
        history = load_history()
        history.append(entry)
        save_history(history)

        return jsonify({'result': result, 'confidence': confidence})

    except Exception as e:
        print(f"Prediction error: {e}")
        # Return a more generic error to the user for security
        return jsonify({'error': 'An unexpected error occurred during prediction.'}), 500

# --- History Routes ---
@app.route("/history", methods=["GET", "DELETE"])
@jwt_required(optional=True) # Allow access without JWT, but get identity if present
def history():
    current_user_email = get_jwt_identity() # Get email from JWT if logged in
    email_param = request.args.get("email") # Get email from query param

    # Prioritize JWT identity if present, otherwise use query param
    # This is important if you want to restrict history to logged-in users only
    # For now, we'll allow query param for simplicity, but a real app would restrict.
    target_email = current_user_email if current_user_email else email_param

    if not target_email:
        return jsonify({"error": "User email required for history"}), 400

    if request.method == "GET":
        history_data = load_history()
        user_history = [h for h in history_data if h.get("email") == target_email]
        # Sort history by timestamp (newest first)
        user_history.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return jsonify(user_history)
    elif request.method == "DELETE":
        # Ensure only the owner can delete their history (if JWT is used)
        if current_user_email and current_user_email != target_email:
             return jsonify({"error": "Unauthorized to clear this history"}), 403

        history_data = load_history()
        new_history = [h for h in history_data if h.get("email") != target_email]
        save_history(new_history)
        return jsonify({"message": "History cleared successfully"})

# --- New Admin Dashboard Data Endpoints (Protected) ---

@app.route('/admin/dashboard/recent-signups', methods=['GET'])
@jwt_required()
def get_recent_signups():
    current_user_email = get_jwt_identity()
    if not is_user_admin(current_user_email):
        return jsonify({"message": "Access Forbidden: Not an admin"}), 403

    limit = request.args.get('limit', 5, type=int)
    users = load_users()
    # Filter out admins from signups, sort by created_at (newest first)
    recent_signups = sorted(
        [u for u in users if not u.get("is_admin", False)],
        key=lambda x: x.get("created_at", ""),
        reverse=True
    )[:limit]
    return jsonify(recent_signups)

@app.route('/admin/dashboard/recent-logins', methods=['GET'])
@jwt_required()
def get_recent_logins():
    current_user_email = get_jwt_identity()
    if not is_user_admin(current_user_email):
        return jsonify({"message": "Access Forbidden: Not an admin"}), 403

    limit = request.args.get('limit', 5, type=int)
    login_history = load_login_history()
    # Sort by timestamp (newest first)
    recent_logins = sorted(
        login_history,
        key=lambda x: x.get("timestamp", ""),
        reverse=True
    )[:limit]
    return jsonify(recent_logins)

@app.route('/admin/dashboard/recent-predictions', methods=['GET'])
@jwt_required()
def get_recent_predictions_admin(): # Renamed to avoid conflict with blueprint route if any
    current_user_email = get_jwt_identity()
    if not is_user_admin(current_user_email):
        return jsonify({"message": "Access Forbidden: Not an admin"}), 403

    limit = request.args.get('limit', 5, type=int)
    history_data = load_history()
    # Sort by timestamp (newest first)
    recent_predictions = sorted(
        history_data,
        key=lambda x: x.get("timestamp", ""),
        reverse=True
    )[:limit]
    return jsonify(recent_predictions)

# --- Admin Users Management (from blueprint, ensure it's protected) ---
# Assuming your admin_users blueprint will handle /admin/users and /admin/users/delete
# Make sure those routes in your blueprint are also protected with @jwt_required()
# and check for admin status using is_user_admin(get_jwt_identity())

# --- Admin Predictions (from blueprint, ensure it's protected) ---
# Your existing /admin/predictions route in predictions_bp will need protection
# and to load from history.json (or a dedicated predictions.json if you have one)
# Make sure it's protected with @jwt_required() and checks for admin status.
# The `get_all_predictions` in your original app.py was trying to read from users.json
# for predictions, which seems incorrect. It should read from history.json.

# Example for admin_predictions blueprint (routes/admin_predictions.py)
# You need to ensure this is correctly implemented and protected:
# from flask import Blueprint, jsonify, request
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from app import load_history, is_user_admin # Import necessary functions from app.py

# predictions_bp = Blueprint('predictions_bp', __name__)

# @predictions_bp.route("/admin/predictions", methods=["GET"])
# @jwt_required()
# def get_all_predictions_admin_panel():
#     current_user_email = get_jwt_identity()
#     if not is_user_admin(current_user_email):
#         return jsonify({"message": "Access Forbidden: Not an admin"}), 403

#     try:
#         all_predictions_data = load_history() # Load from history.json
#         # You might want to format this data for the frontend if needed
#         # For example, if you need a 'user' field instead of 'email' from history entry
#         formatted_predictions = []
#         for pred in all_predictions_data:
#             formatted_predictions.append({
#                 "id": pred.get("id", str(uuid.uuid4())), # Add an ID if not present
#                 "user": pred.get("email", "N/A"),
#                 "date": pred.get("timestamp", "N/A"),
#                 "status": pred.get("result", "N/A"), # Map result to status
#                 "model": "N/A" # You don't store model name in history.json, might need to add it
#             })
#         formatted_predictions.sort(key=lambda x: x.get("date", ""), reverse=True) # Sort by date
#         return jsonify({"success": True, "data": formatted_predictions})
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)}), 500


if __name__ == '__main__':
    # Ensure data directories and files exist on startup
    os.makedirs(os.path.join(BASE_DIR, 'data'), exist_ok=True)
    for f_path in [USER_FILE, HISTORY_FILE, LOGIN_HISTORY_FILE]:
        if not os.path.exists(f_path):
            with open(f_path, 'w') as f:
                json.dump([], f) # Initialize with empty list

    # IMPORTANT: Create an initial admin user if users.json is empty
    users = load_users()
    if not any(u.get("is_admin", False) for u in users):
        print("No admin user found. Creating a default admin user.")
        users.append({
            "email": "admin@example.com",
            "password": "adminpass", # REPLACE THIS WITH A HASHED PASSWORD!
            "is_admin": True,
            "created_at": datetime.now().isoformat()
        })
        save_users(users)
        print("Default admin user 'admin@example.com' with password 'adminpass' created.")


    app.run(debug=True, port=5000)

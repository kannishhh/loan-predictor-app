from flask import Blueprint,jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import os
from utils import is_user_admin

admin_users = Blueprint("admin_users", __name__)

USERS_FILE = "data/users.json"
PREDICTIONS_FILE = "data/predictions.json"

@admin_users.route("/api/admin/users", methods= ["GET"])
@jwt_required()
def get_users():
    current_user_email = get_jwt_identity()
    if not is_user_admin(current_user_email):
        return jsonify({"error": "Admin access required"}), 403

    if not os.path.exists(USERS_FILE):
        return jsonify([])
    
    with open(USERS_FILE, "r") as file:
        users = json.load(file)

    return jsonify(users)

@admin_users.route("/api/admin/users/delete/<email>", methods=["DELETE"])
@jwt_required()
def delete_user(email):
    current_user_email = get_jwt_identity()
    if not is_user_admin(current_user_email):
        return jsonify({"error": "Admin access required"}), 403

    if not os.path.exists(USERS_FILE):
        return jsonify({"success":False, "message": "User file not found"}), 404
    
    with open (USERS_FILE, "r") as file:
        users= json.load(file)

    new_users = [u for u in users if u["email"] != email]
    if len(new_users) == len(users):
        return jsonify({"success":False, "message": "User not Found"}),404
    
    with open(USERS_FILE, "w") as file:
        json.dump(new_users ,file, indent=2)

    return jsonify({"success":True, "message": "User deleted"})

@admin_users.route("/api/admin/users/reset/<email>", methods=["PUT"])
@jwt_required()
def reset_predictions(email):
    current_user_email = get_jwt_identity()
    if not is_user_admin(current_user_email):
        return jsonify({"error": "Admin access required"}), 403
        
    if not os.path.exists(PREDICTIONS_FILE):
        return jsonify({"success": False, "message": "No prediction file"}), 404
    
    with open(PREDICTIONS_FILE, "r") as file:
        predictions = json.load(file)

    predictions[email] = []

    with open(PREDICTIONS_FILE, "w")as file:
        json.dump(predictions, file, indent=2)

    return jsonify({"success": True, "message": "Prediction rest"})

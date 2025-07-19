from flask import Blueprint,jsonify, request
import json
import os

admin_users = Blueprint("admin_users", __name__)

USERS_FILE = "data/users.json"
PREDICTIONS_FILE = "data/predictions.json"

@admin_users.route("/api/admin/users", methods= ["GET"])
def get_users():
    if not os.path.exists(USERS_FILE):
        return jsonify([])
    
    with open(USERS_FILE, "r") as file:
        users = json.load(file)

    return jsonify(users)

@admin_users.route("/api/admin/users/delete/<email>", methods=["DELETE"])
def delete_user(email):
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
def reset_predictions(email):
    if not os.path.exists(PREDICTIONS_FILE):
        return jsonify({"success": False, "message": "No prediction file"}), 404
    
    with open(PREDICTIONS_FILE, "r") as file:
        predictions = json.load(file)

    predictions[email] = []

    with open(PREDICTIONS_FILE, "w")as file:
        json.dump(predictions, file, indent=2)

    return jsonify({"success": True, "message": "Prediction rest"})


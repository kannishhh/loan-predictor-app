from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import os

from utils import is_user_admin 

predictions_bp = Blueprint("predictions", __name__)

@predictions_bp.route("/api/admin/predictions", methods=["GET"])
@jwt_required()
def get_all_predictions():
    current_user_email = get_jwt_identity()
    if not is_user_admin(current_user_email):
        return jsonify({"error": "Admin access required"}), 403

    try:
        history_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'history.json')
        
        if not os.path.exists(history_path):
            return jsonify([])

        with open(history_path, "r") as f:
            prediction_data = json.load(f)
        
        prediction_data.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        return jsonify(prediction_data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

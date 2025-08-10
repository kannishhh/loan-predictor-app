from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import os
from utils import is_user_admin

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/api/admin/feedback", methods=["GET"])
@jwt_required()
def get_all_feedback():
    current_user_email = get_jwt_identity()
    if not is_user_admin(current_user_email):
        return jsonify({"error": "Admin access required"}), 403
        
    try:
        feedback_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'feedback.json')
        if not os.path.exists(feedback_path):
            return jsonify([])
        
        with open(feedback_path, "r") as f:
            feedback_data = json.load(f)
            return jsonify(feedback_data)
    
    except Exception as e:
        return jsonify({"error":str(e)}), 500

from flask import Blueprint, jsonify
import json
import os

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/api/admin/feedback", methods=["GET"])
def get_all_feedback():
    try:
        if not os.path.exists("feedback.json"):
            return jsonify([])
        
        with open("feedback.json", "r") as f:
            feedback_data = json.load(f)
            return jsonify(feedback_data)
    
    except Exception as e:
        return jsonify({"error":str(e)}), 500
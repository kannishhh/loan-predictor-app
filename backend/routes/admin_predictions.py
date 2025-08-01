from flask import Blueprint, jsonify
import json
import os

predictions_bp = Blueprint("predictions", __name__)

@predictions_bp.route("/api/admin/predictions", methods=["GET"])
def get_all_predictions():
    try:
        if not os.path.exists("data/history.json"):
            return jsonify([])

        with open("data/history.json", "r") as f:
            prediction_data = json.load(f)
        return jsonify(prediction_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

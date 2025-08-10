from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils import is_user_admin

admin_stats_bp = Blueprint('admin_stats', __name__)

@admin_stats_bp.route('/api/admin/model-stats', methods=['GET'])
@jwt_required()
def get_model_stats():
    current_user_email = get_jwt_identity()
    if not is_user_admin(current_user_email):
        return jsonify({"error": "Admin access required"}), 403
        
    stats = {
        "accuracy": 0.89,
        "precision": 0.87,
        "recall": 0.85,
        "f1_score":0.86,
        "total_prediction":140,
        "last_trained":"2025-07-12"
    }
    return jsonify(stats)

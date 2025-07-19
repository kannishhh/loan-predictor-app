from flask import Blueprint, jsonify

admin_stats_bp = Blueprint('admin_stats', __name__)

@admin_stats_bp.route('/api/admin/model-stats', methods=['GET'])
def get_model_stats():
    stats = {
        "accuracy": 0.89,
        "precision": 0.87,
        "recall": 0.85,
        "f1_score":0.86,
        "total_prediction":140,
        "last_trained":"2025-07-12"
    }
    return jsonify(stats)
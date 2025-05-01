from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from .monitoring import MonitoringDashboard
import redis
from flask_cors import CORS

monitoring_bp = Blueprint('monitoring', __name__)
CORS(monitoring_bp)

# Configuración de Redis
redis_conn = redis.Redis(host='localhost', port=6379, db=0)
dashboard = MonitoringDashboard(redis_conn)

@monitoring_bp.route('/api/monitoring/report', methods=['GET'])
@jwt_required()
def get_monitoring_report():
    try:
        report = dashboard.generate_report()
        return jsonify(report), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@monitoring_bp.route('/api/monitoring/history/<int:hours>', methods=['GET'])
@jwt_required()
def get_historical_metrics(hours):
    try:
        if hours < 1 or hours > 72:
            return jsonify({'error': 'El rango debe ser entre 1 y 72 horas'}), 400
        
        data = dashboard.get_historical_metrics(hours)
        return jsonify({
            'hours': hours,
            'data_points': len(data),
            'metrics': data
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
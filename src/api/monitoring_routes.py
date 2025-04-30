from flask import Blueprint, jsonify, request
from src.pos.monitoring import MonitoringDashboard
import redis
from datetime import datetime

monitoring_bp = Blueprint('monitoring', __name__)
redis_conn = redis.Redis(host='localhost', port=6379, db=0)
dashboard = MonitoringDashboard(redis_conn)

@monitoring_bp.route('/metrics', methods=['GET'])
def get_realtime_metrics():
    return jsonify(dashboard.generate_report())

@monitoring_bp.route('/metrics/historical', methods=['GET'])
def get_historical_metrics():
    hours_back = request.args.get('hours', default=24, type=int)
    return jsonify({
        'historical_data': dashboard.get_historical_metrics(hours_back),
        'circuit_breakers': dashboard.circuit_breaker_states
    })
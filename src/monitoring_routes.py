import logging
import os
import tenacity
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from .monitoring_dashboard import MonitoringDashboard
import redis
from flask_cors import CORS
from integrations.airtable.client import AirtableClient

logger = logging.getLogger(__name__)

monitoring_bp = Blueprint('monitoring', __name__)
CORS(monitoring_bp)

# Configuración de Redis
def create_dashboard():
    redis_conn = redis.Redis(host='localhost', port=6379, db=0)
    return MonitoringDashboard(redis_conn)

def create_airtable():
    # Configuración desde variables de entorno
    api_key = os.getenv('AIRTABLE_API_KEY')
    base_id = os.getenv('AIRTABLE_BASE_ID')
    
    if not api_key or not base_id:
        logger.error('Faltan variables de entorno para Airtable')
        raise ValueError('Configuración de Airtable incompleta')
    logger.debug(f"Conectando a Airtable - Base ID: {base_id}")
    logger.info("Configurando política de reintentos (3 intentos con backoff exponencial)")
    
    # Configurar reintentos exponenciales
    retry_decorator = tenacity.retry(
        stop=tenacity.stop_after_attempt(3),
        wait=tenacity.wait_exponential(multiplier=1, min=2, max=10),
        retry=tenacity.retry_if_exception_type(Exception),
        before_sleep=tenacity.before_sleep_log(logger, logging.WARNING)
    )
    
    # Crear cliente con configuración
    client = AirtableClient(
        api_key=api_key,
        base_id=base_id,
        timeout=30,
        headers={'User-Agent': 'GastroFlow/1.0'}
    )
    client.get_records = retry_decorator(client.get_records)
    
    table_name = os.getenv('AIRTABLE_TABLE_NAME')
    if not table_name:
        logger.error('Variable AIRTABLE_TABLE_NAME no configurada')
        raise ValueError('Nombre de tabla no especificado')
    
    return client

@monitoring_bp.record
def setup_dependencies(state):
    app = state.app
    app.config.setdefault('REDIS_CONNECTION', create_dashboard().redis)
    app.config.setdefault('MONITORING_DASHBOARD', create_dashboard())
    app.config.setdefault('AIRTABLE_CLIENT', create_airtable())

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

@monitoring_bp.route('/api/monitoring/airtable-test', methods=['GET'])
@jwt_required()
def test_airtable_connection():
    try:
        records = airtable_client.get_records()
        return jsonify(records), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
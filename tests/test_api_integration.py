import pytest
import json
from flask import Flask
from unittest.mock import Mock, patch
from requests.exceptions import Timeout
from flask_jwt_extended import create_access_token, JWTManager
from src.monitoring_routes import monitoring_bp
from integrations.airtable.client import AirtableClient
import tenacity


@pytest.fixture
def client():
    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = 'test-secret'
    JWTManager(app)
    # Configurar mocks antes de registrar el blueprint
    with app.app_context():
        app.config['MONITORING_DASHBOARD'] = Mock()
        app.config['REDIS_CONNECTION'] = Mock()
    app.register_blueprint(monitoring_bp)
    return app.test_client()

@pytest.fixture
def valid_token(client):
    with client.application.app_context():
        return create_access_token(identity='admin')

def test_get_report_authorized(client, valid_token):
    response = client.get('/api/monitoring/report', headers={'Authorization': f'Bearer {valid_token}'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'redis_memory' in data

def test_get_report_unauthorized(client):
    response = client.get('/api/monitoring/report')
    assert response.status_code == 401

def test_historical_metrics_valid(client, valid_token):
    response = client.get('/api/monitoring/history/24', headers={'Authorization': f'Bearer {valid_token}'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'data_points' in data

def test_historical_invalid_range(client, valid_token):
    response = client.get('/api/monitoring/history/0', headers={'Authorization': f'Bearer {valid_token}'})
    assert response.status_code == 400

# Mocks para dependencias
@patch('monitoring_routes.redis.Redis')
@patch('monitoring_routes.MonitoringDashboard')
def test_dependencies(mock_monitoring, mock_redis):
    mock_redis_instance = Mock()
    mock_redis_instance.info.return_value = {'used_memory': 1024}
    mock_redis.return_value = mock_redis_instance

    mock_dashboard_instance = Mock()
    mock_dashboard_instance.generate_report.return_value = {'redis_memory': 1024}
    mock_dashboard_instance.get_historical_metrics.return_value = []
    mock_monitoring.return_value = mock_dashboard_instance
    return mock_monitoring, mock_redis

@patch('monitoring_routes.airtable_client')
def test_airtable_connection_success(mock_airtable_client, client, valid_token):
    mock_airtable_client.get_records.return_value = {'records': [{'id': 'test'}]}
    response = client.get('/api/monitoring/airtable-test', headers={'Authorization': f'Bearer {valid_token}'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'records' in data
    assert len(data['records']) > 0


@patch('monitoring_routes.create_airtable')
def test_airtable_missing_env_vars(mock_create, client, valid_token):
    mock_create.side_effect = ValueError('Configuración de Airtable incompleta')
    response = client.get('/api/monitoring/airtable-test', headers={'Authorization': f'Bearer {valid_token}'})
    assert response.status_code == 500
    assert 'Configuración' in response.json['error']

@patch('monitoring_routes.create_airtable')
def test_airtable_auth_failure(mock_create, client, valid_token):
    mock_client = Mock()
    mock_client.get_records.side_effect = Exception('Invalid API key')
    mock_create.return_value = mock_client
    response = client.get('/api/monitoring/airtable-test', headers={'Authorization': f'Bearer {valid_token}'})
    assert response.status_code == 500
    data = json.loads(response.data)
    assert 'error' in data


@patch('monitoring_routes.airtable_client')
def test_airtable_invalid_response(mock_airtable_client, client, valid_token):
    mock_airtable_client.get_records.side_effect = ValueError('Invalid response structure')
    response = client.get('/api/monitoring/airtable-test', headers={'Authorization': f'Bearer {valid_token}'})
    assert response.status_code == 500
    data = json.loads(response.data)
    assert 'error' in data


@patch('monitoring_routes.airtable_client')
def test_airtable_timeout(mock_airtable_client, client, valid_token):
    mock_airtable_client.get_records.side_effect = Timeout('Connection timed out')
    response = client.get('/api/monitoring/airtable-test', headers={'Authorization': f'Bearer {valid_token}'})
    assert response.status_code == 500
    data = json.loads(response.data)
    assert 'error' in data
    assert 'Connection timed out' in data['error']


@patch('monitoring_routes.create_dashboard')
@patch('monitoring_routes.create_airtable')
def test_dependencies(mock_airtable, mock_dashboard):
    mock_dashboard.return_value = Mock()
    mock_airtable.return_value = Mock()
    
    with client.application.app_context():
        assert isinstance(client.application.config['MONITORING_DASHBOARD'], Mock)
        assert isinstance(client.application.config['AIRTABLE_CLIENT'], Mock)


@patch('tenacity.retry')
def test_airtable_retry_policy(mock_retry):
    # Verificar configuración de reintentos
    mock_retry.assert_called_with(
        stop=tenacity.stop_after_attempt(3),
        wait=tenacity.wait_exponential(multiplier=1, min=2, max=10),
        retry=tenacity.retry_if_exception_type(Exception),
        before_sleep=tenacity.before_sleep_log(logging.getLogger(), logging.WARNING)
    )
import pytest
import json
from src.pos.monitoring_routes import monitoring_bp
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    from flask import Flask
    app = Flask(__name__)
    app.register_blueprint(monitoring_bp)
    app.config['JWT_SECRET_KEY'] = 'testing_key'
    return app.test_client()

@pytest.fixture
def valid_token():
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
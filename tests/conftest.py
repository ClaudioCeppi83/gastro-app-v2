import pytest
import sys
from pathlib import Path
from flask import Flask
from flask_jwt_extended import JWTManager

# Agregar directorio raíz al path de Python
sys.path.insert(0, str(Path(__file__).parent.parent))

# Intenta importar el blueprint desde la ubicación conocida
try:
    from src.monitoring_routes import monitoring_bp
except ImportError:
    # Si falla, intenta una ruta alternativa o maneja el error
    # Esto es una suposición, ajusta según la estructura real de tu proyecto
    try:
        from src.monitoring_routes import monitoring_bp
    except ImportError:
        monitoring_bp = None
        print("Advertencia: No se pudo importar monitoring_bp. Asegúrate de que la ruta de importación sea correcta.")

@pytest.fixture(scope='session')
def app():
    """Session-wide test `Flask` application."""
    _app = Flask(__name__)
    _app.config['TESTING'] = True
    _app.config['JWT_SECRET_KEY'] = 'super-secret-test-key'  # Clave secreta para pruebas
    JWTManager(_app)

    # Registra el blueprint si se importó correctamente
    if monitoring_bp:
        _app.register_blueprint(monitoring_bp)
    else:
        # Puedes decidir lanzar un error o continuar sin el blueprint
        print("Error: monitoring_bp no está disponible, las pruebas que dependen de él fallarán.")
        # raise ImportError("No se pudo encontrar monitoring_bp para registrar.")

    # Configuración adicional de la app si es necesaria

    return _app

@pytest.fixture
def client(app):
    return app.test_client()
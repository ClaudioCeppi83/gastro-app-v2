import unittest
from unittest.mock import patch
import requests_mock
from src.pos.logging import setup_logging

class TestN8nIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.logger = setup_logging()
        
    @requests_mock.Mocker()
    def test_creacion_orden_exitosa(self, mock):
        mock.post('https://api.n8n.example.com/v1/ordenes', status_code=201)
        response = self._simular_envio_orden()
        
        # Validar estructura del payload
        payload = response.json()
        self.assertIn('id', payload)
        self.assertIn('items', payload)
        for item in payload['items']:
            self.assertIn('producto_id', item)
            self.assertIn('cantidad', item)
        
        self.logger.log_transaction("Prueba exitosa: Orden creada", "Test")

    def test_validacion_payload_invalido(self):
        with requests_mock.Mocker() as mock:
            mock.post('https://api.n8n.example.com/v1/ordenes', status_code=400, json={
                'error': 'VALIDATION_ERROR',
                'message': 'Falta campo requerido: id'
            })
            
            with self.assertRaises(Exception) as context:
                self.session.post(
                    'https://api.n8n.example.com/v1/ordenes',
                    json={'items': [{'producto_id': '1'}]}  # Payload incompleto
                )
            
            self.logger.log_error(context.exception, "Test", 
                                detalles="Payload inválido: falta campo 'cantidad'")
    def test_error_conexion_n8n(self):
        with requests_mock.Mocker() as mock:
            mock.post('https://api.n8n.example.com/v1/ordenes', status_code=500)
            
            with self.assertRaises(Exception) as context:
                self._simular_envio_orden()
            
            self.assertTrue('Error en comunicación con n8n' in str(context.exception))
            self.logger.log_error(context.exception, "Test")

    def _simular_envio_orden(self):
        # Simular implementación real del cliente API
        import requests
        return requests.post(
            'https://api.n8n.example.com/v1/ordenes',
            json={'id': 'test-123', 'items': [{'producto_id': '1', 'cantidad': 2}]}
        )

if __name__ == '__main__':
    unittest.main()
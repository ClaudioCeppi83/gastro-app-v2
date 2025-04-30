import logging
from typing import Dict, Any
from datetime import datetime

class MonitoringDashboard:
    def __init__(self, redis_conn):
        self.redis = redis_conn
        self.logger = logging.getLogger('monitoring')
        self.circuit_breaker_states: Dict[str, str] = {}
        
    def get_queue_metrics(self) -> Dict[str, Any]:
        try:
            return {
                'ordenes_pendientes': self.redis.llen('gastroapp_orders'),
                'notificaciones_pendientes': self.redis.llen('gastroapp_notifications'),
                'tiempo_promedio': self.redis.get('metrics:avg_processing_time') or 0
            }
        except Exception as e:
            self.logger.error(f"Error obteniendo métricas: {str(e)}")
            return {}

    def update_circuit_breaker(self, service_name: str, state: str):
        self.circuit_breaker_states[service_name] = {
            'state': state,
            'last_updated': datetime.utcnow().isoformat()
        }

    def generate_report(self) -> Dict[str, Any]:
        return {
            'queues': self.get_queue_metrics(),
            'circuit_breakers': self.circuit_breaker_states,
            'timestamp': datetime.utcnow().isoformat()
        }
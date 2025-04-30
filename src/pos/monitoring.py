import logging
from typing import Dict, Any
from datetime import datetime
import jsonschema
from logging.handlers import RotatingFileHandler

class MonitoringDashboard:
    def __init__(self, redis_conn):
        self.redis = redis_conn
        self._configure_logger()
        self.circuit_breaker_states: Dict[str, str] = {}
        self.history_prefix = 'metrics:history:'
        self.order_schema = {
            'type': 'object',
            'properties': {
                'items': {'type': 'array'},
                'total': {'type': 'number'},
                'cliente_id': {'type': 'string'}
            },
            'required': ['items', 'total']
        }
        
    def get_queue_metrics(self) -> Dict[str, Any]:
        try:
            return {
                'ordenes_pendientes': self.redis.llen('gastroflow_orders'),
                'notificaciones_pendientes': self.redis.llen('gastroflow_notifications'),
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

    def generate_report(self, hours_back: int = 24) -> Dict[str, Any]:
        report = {
            'queues': self.get_queue_metrics(),
            'circuit_breakers': self.circuit_breaker_states,
            'timestamp': datetime.utcnow().isoformat(),
            'historical_metrics': {
                'data': self.get_historical_metrics(hours_back),
                'metrics': ['ordenes_pendientes', 'notificaciones_pendientes', 'tiempo_promedio']
            }
        }
        self._validate_report_schema(report)
        return report

    def track_historical_metrics(self):
        metrics = self.get_queue_metrics()
        timestamp = datetime.utcnow().timestamp()
        pipeline = self.redis.pipeline()
        for metric_name, value in metrics.items():
            pipeline.zadd(f'{self.history_prefix}{metric_name}', {timestamp: value})
        pipeline.execute()

    def get_historical_metrics(self, hours_back: int) -> list:
        end = datetime.utcnow().timestamp()
        start = end - (hours_back * 3600)
        metric_data = {}
        
        # Recopilar datos de todas las métricas
        for metric in ['ordenes_pendientes', 'notificaciones_pendientes', 'tiempo_promedio']:
            values = self.redis.zrangebyscore(
                f'{self.history_prefix}{metric}', start, end,
                withscores=True
            )
            for val, ts in values:
                if ts not in metric_data:
                    metric_data[ts] = {'timestamp': datetime.utcfromtimestamp(ts).isoformat()}
                metric_data[ts][metric] = float(val)
        
        # Ordenar y formatear resultados
        sorted_ts = sorted(metric_data.keys())
        return [metric_data[ts] for ts in sorted_ts]

    def _configure_logger(self):
        handler = RotatingFileHandler(
            'monitoring.log',
            maxBytes=10485760,
            backupCount=5,
            encoding='utf-8'
        )
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        self.logger = logging.getLogger('monitoring')
        self.logger.addHandler(handler)
        self.logger.setLevel(logging.INFO)

    def validate_order(self, order_data: Dict) -> bool:
        try:
            jsonschema.validate(instance=order_data, schema=self.order_schema)
            return True
        except jsonschema.ValidationError as e:
            self.logger.error(f"Orden inválida: {str(e)}")
            return False

    def _validate_report_schema(self, report: Dict):
        schema = {
            'type': 'object',
            'properties': {
                'queues': {'type': 'object'},
                'circuit_breakers': {'type': 'object'},
                'timestamp': {'type': 'string'},
                'historical_metrics': {'type': 'object'}
            },
            'required': ['queues', 'circuit_breakers', 'timestamp']
        }
        try:
            jsonschema.validate(instance=report, schema=schema)
        except jsonschema.ValidationError as e:
            self.logger.error(f"Invalid report schema: {str(e)}")
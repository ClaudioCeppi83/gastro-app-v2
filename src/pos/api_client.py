import requests
import os
import yaml
import redis
import json
import jwt
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import logging
from pydantic import BaseModel, ValidationError
from typing import Optional, Dict
from datetime import datetime, timedelta

class CircuitBreaker:
    def __init__(self, max_failures=3, reset_timeout=60):
        self.max_failures = max_failures
        self.reset_timeout = reset_timeout
        self.failure_count = 0
        self.last_failure: Optional[datetime] = None
        self.state = 'CLOSED'

    def is_open(self):
        if self.state == 'OPEN' and self.last_failure:
            if datetime.now() > self.last_failure + timedelta(seconds=self.reset_timeout):
                self.state = 'HALF_OPEN'
                return False
        return self.state == 'OPEN'

    def record_failure(self):
        self.failure_count += 1
        self.last_failure = datetime.now()
        if self.failure_count >= self.max_failures:
            self.state = 'OPEN'

    def record_success(self):
        self.failure_count = 0
        self.state = 'CLOSED'

class OrderSchema(BaseModel):
    items: list[Dict[str, int]]
    total: float
    cliente_id: str
    direccion: Optional[str] = None

class APIClient:
    def __init__(self, base_url, client_id, secret, timeout=5):
        self.base_url = base_url
        self.timeout = timeout
        self.session = requests.Session()
        self.client_id = client_id
        self.secret = secret
        self._token = None
        self._token_exp = 0
        token = self._get_auth_token()
        self.session.headers.update({'Authorization': f'Bearer {token}'})
        
        # Configurar retry logic
        retry_strategy = Retry(
            total=3,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["POST", "GET", "PUT"],
            backoff_factor=1
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("https://", adapter)
        
        self.logger = logging.getLogger(__name__)
        self.circuit_breaker = CircuitBreaker()

        # Cargar configuración Redis
        config_path = os.path.join(os.path.dirname(__file__), 'config.yaml')
        with open(config_path) as f:
            config = yaml.safe_load(f)
        
        redis_config = config['redis']
        self.redis_client = redis.Redis(
            host=redis_config['host'],
            port=redis_config['port'],
            password=redis_config['password'],
            decode_responses=True
        )
        self.redis_queue = redis_config['queues']['ordenes']

    def _get_auth_token(self):
        if time.time() < self._token_exp - 60:
            return self._token
        
        payload = {
            'iss': self.client_id,
            'exp': time.time() + 3600,
            'aud': 'api-gateway'
        }
        self._token = jwt.encode(payload, self.secret, algorithm='HS256')
        self._token_exp = payload['exp']
        return self._token

    def post_order(self, order_data):
        # Validación de schema
        try:
            OrderSchema.model_validate(order_data)
        except ValidationError as e:
            self.logger.error(f"Error de validación: {e}", extra={"circuit_breaker": self.circuit_breaker.state})
            self.circuit_breaker.record_failure()
            raise ValueError("Datos de orden inválidos") from e

        # Verificación estado circuit breaker
        if self.circuit_breaker.is_open():
            self.logger.warning("Circuit breaker abierto - Bloqueando solicitud",
                             extra={"failures": self.circuit_breaker.failure_count})
            raise Exception("Servicio no disponible temporalmente")

        try:
            response = self.session.post(
                f"{self.base_url}/v1/ordenes",
                json=order_data,
                timeout=self.timeout
            )
            response.raise_for_status()
            self.circuit_breaker.record_success()

            # Publicar en cola Redis
            try:
                self.redis_client.lpush(self.redis_queue, json.dumps(order_data))
            except redis.RedisError as e:
                self.logger.error(f"Error al publicar en Redis: {str(e)}")

            return response
        except requests.exceptions.RequestException as e:
            self.circuit_breaker.record_failure()
            self.logger.error("Falla en API - Circuit Breaker: %s", self.circuit_breaker.state,
                          exc_info=True, stack_info=True)
            raise
        finally:
            self.logger.info("Métrica Circuit Breaker: %s",
                          {"state": self.circuit_breaker.state,
                           "failures": self.circuit_breaker.failure_count})
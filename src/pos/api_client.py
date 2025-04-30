import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import logging

class APIClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Authorization': f'Bearer {api_key}'})
        
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

    def post_order(self, order_data):
        try:
            response = self.session.post(
                f"{self.base_url}/v1/ordenes",
                json=order_data,
                timeout=5
            )
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Error en API: {str(e)}", exc_info=True)
            raise
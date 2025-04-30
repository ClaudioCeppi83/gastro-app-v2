import jwt
import time
from typing import Optional
from requests import Session, Response
from src.pos.logging import setup_logger

class APIClient:
    def __init__(self, base_url: str, client_id: str, secret: str):
        self.base_url = base_url
        self.client_id = client_id
        self.secret = secret
        self.session = Session()
        self.logger = setup_logger('api_client')
        self._token: Optional[str] = None
        self._token_exp: float = 0

    def _get_auth_token(self) -> str:
        if time.time() < self._token_exp - 60:  # Renovar 1 min antes de expiración
            return self._token
            
        payload = {
            'iss': self.client_id,
            'exp': time.time() + 3600,
            'aud': 'api-gateway'
        }
        self._token = jwt.encode(payload, self.secret, algorithm='HS256')
        self._token_exp = payload['exp']
        return self._token

    def make_authenticated_request(self, method: str, endpoint: str, **kwargs) -> Response:
        token = self._get_auth_token()
        headers = kwargs.pop('headers', {})
        headers.update({'Authorization': f'Bearer {token}'})
        
        try:
            response = self.session.request(
                method=method,
                url=f'{self.base_url}/{endpoint}',
                headers=headers,
                **kwargs
            )
            response.raise_for_status()
        except Exception as e:
            self.logger.error(f'Error en solicitud a {endpoint}: {str(e)}')
            if response.status_code == 401:
                raise AuthenticationError("Token JWT inválido o expirado") from e
            raise
            
        return response

class AuthenticationError(Exception):
    pass
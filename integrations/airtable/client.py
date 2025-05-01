import requests
from requests import Session, Response
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from src.pos.logging import setup_logger

class AirtableError(Exception):
    pass

class AirtableClient:
    def __init__(self, base_id: str, api_key: str):
        self.base_id = base_id
        self.api_key = api_key
        self.session = Session()
        self.logger = setup_logger('airtable_client')
        self.session.headers.update({
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        })

    def _build_url(self, table_name: str) -> str:
        return f'https://api.airtable.com/v0/{self.base_id}/{table_name}'

    def create_record(self, table_name: str, data: Dict[str, Any]) -> Response:
        try:
            response = self.session.post(
                url=self._build_url(table_name),
                json={'fields': data}
            )
            response.raise_for_status()
            return response
        except requests.exceptions.HTTPError as e:
            self.logger.error(f'Error creando registro: {str(e)}')
            if response.status_code == 401:
                raise AirtableError("API key inválida") from e
            raise

    def get_records(self, table_name: str, filter_formula: Optional[str] = None) -> Response:
        params = {'filterByFormula': filter_formula} if filter_formula else None
        try:
            response = self.session.get(
                url=self._build_url(table_name),
                params=params
            )
            response.raise_for_status()
            return response
        except requests.exceptions.HTTPError as e:
            self.logger.error(f'Error obteniendo registros: {str(e)}')
            raise


class MenuItem(BaseModel):
    nombre: str = Field(..., max_length=100)
    precio: float = Field(..., gt=0)
    categoria: str = Field(..., max_length=50)
    descripcion: Optional[str] = Field(None, max_length=255)

class OrderItem(BaseModel):
    item_id: str
    cantidad: int = Field(..., gt=0)
    notas: Optional[str] = None

def create_menu(self, item: MenuItem) -> Response:
    return self.create_record('Menú', item.dict())

def create_order(self, order: List[OrderItem], mesa: str) -> Response:
    return self.create_record('Órdenes', {
        'items': [item.dict() for item in order],
        'mesa': mesa,
        'estado': 'pendiente'
    })
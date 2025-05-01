from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MenuItem(BaseModel):
    item_id: str
    nombre: str
    precio: float
    categoria: str
    descripcion: Optional[str] = None
    disponible: bool = True

class Order(BaseModel):
    order_id: str
    items: List[MenuItem]
    total: float
    fecha: datetime
    estado: str  # 'pendiente', 'en_proceso', 'completado'
    mesa: Optional[int] = None
    notas: Optional[str] = None
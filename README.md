# GastroFlow - Sistema de Gestión para Restaurantes

## Descripción del Sistema
Plataforma integral para gestión de restaurantes con:
- POS integrado
- Control de inventario
- Integraciones con proveedores vía n8n
- Reportes analíticos

## Estructura de Directorios
```
├── integrations/
│   └── n8n/
│       ├── api_client.py      # Cliente para API de integración
│       ├── api_schema.md     # Especificación técnica
│       └── openapi.yaml      # Definición OpenAPI
├── src/
│   ├── pos/                  # Módulo principal del POS
│   └── ...
```

## Requisitos Técnicos
- Python 3.9+
- PostgreSQL 12+
- n8n 0.218+

## Configuración Inicial
1. Crear archivo `.env` con:
```bash
API_BASE_URL=https://api.tu-restaurante.com
CLIENT_ID=tu_client_id
SECRET_KEY=tu_secreto
```

## Integración con n8n
Ver documentación técnica detallada en [api_schema.md](integrations/n8n/api_schema.md)

## Despliegue
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Diagrama de Arquitectura
![Arquitectura](docs/architecture.png)
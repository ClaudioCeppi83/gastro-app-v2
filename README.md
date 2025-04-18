# gastro-app-V2

**gastro-app-V2** es una plataforma modular y escalable diseñada para optimizar la gestión de restaurantes. Combina toma de órdenes, gestión de menú, reportes, finanzas, cocina y más, todo accesible según el tipo de suscripción.

---

## Características Principales

- Toma y gestión de órdenes en tiempo real
- Administración de productos y categorías
- Reportes básicos de ventas y estadísticas
- Preparado para autenticación por roles
- Estructura modular por suites (POS, Admin, Cocina)

---

## 📦 Estructura del Proyecto

`gastro-app-V3/
├── app/                  # Rutas del sistema
├── components/           # UI reutilizable
├── features/             # Lógica por módulo
│   ├── order-system/     
│   └── menu-management/
├── providers/            # Estado global
├── utils/                # Funciones de ayuda
├── testing/              # Reportes de pruebas
├── .idx/                 # Configuración Firebase Studio
├── .vscode/              # Entorno de desarrollo
└── public/               # Recursos públicos`

---

## Tecnologías Usadas

- Frontend: React + Next.js (App Router)

- Lenguaje: TypeScript

- Estado: Context API + Hooks

- Estilos: CSS Global

- IDE: Firebase Studio y/o VScode

- Linting/Formatting: ESLint + Prettier

---

## Cómo Ejecutar el Proyecto

 ### Clona el repositorio
  [git clone ](https://github.com/claudioceppi83/gastro-app-V2.git)

 ### Entra al directorio
  `cd gastro-app-V2/`

 ### Instala dependencias
  `npm install`

 ### Ejecuta en modo desarrollo
  `npm run dev`

---

Este proyecto está optimizado para funcionar en Firebase Studio (IDX), pero también puede adaptarse a otros entornos.

---

## Roadmap

- Estructura inicial POS

- Hooks personalizados

- Gestión de productos y órdenes

- Autenticación de usuarios

- Suite administrativa

- Suite de cocina

- Persistencia en Firestore

- Deploy final (Firebase / Vercel)

---

## Documentación

- Informe de Desarrollo

- Documentación Técnica

---

## Autor
Desarrollado por un apasionado del desarrollo web fullstack y la gestión gastronómica digital.

---

## Licencia
Este proyecto está bajo una licencia de uso privado hasta futura decisión comercial.

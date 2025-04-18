# 🧾 Informe de Desarrollo - gastro-app-V2

## Descripción General
**gastro-app-V2** es un software administrativo modular para restaurantes, dividido en tres suites funcionales:
1. **Suite de Punto de Venta (POS)** – Órdenes, menú, reportes.
2. **Suite Administrativa** – Inventarios, finanzas, personal.
3. **Suite de Cocina** – Recetas, tiempos, inventario técnico.

Cada suite compartirá una base de datos centralizada, y el acceso estará condicionado por el tipo de suscripción o paquete contratado. Actualmente, el desarrollo se centra en la **Suite POS**.

## Fase Actual del Desarrollo

### Progreso Actual (Suite POS)
- Página principal de órdenes: inicio del sistema de toma y gestión de pedidos.
- Módulo de menú: con categorías, precios y validaciones.
- Estructura inicial de reportes y lógica de cálculo de totales.
- Hooks personalizados para acciones de órdenes y menú.
- Validaciones e interfaces tipadas.
- Testing básico (`test_report.md`).
- Estilos globales iniciales y configuración de linting/prettier.

## 🛠️ Stack Tecnológico

| Capa              | Tecnología                                                         |
|-------------------|--------------------------------------------------------------------|
| Frontend          | Next.js 13+ (App Router), React                                    |
| Lenguaje          | TypeScript                                                         |
| Estilos           | CSS (global), con opción de Tailwind o CSS Modules futura          |
| Hooks             | React Custom Hooks (modularizados)                                 |
| Validación        | Funciones personalizadas (menuValidations.ts, orderValidations.ts) |
| Gestión de estado | Context API (OrderProvider.tsx)                                    |
| IDE / Entorno     | Firebase Studio (Google IDX) y/o VScode                            |
| Linter y Prettier | Configurados con ESLint, Prettier                                  |
| Pruebas           | Reporte de tests incluido                                          |

## Estructura Modular de Archivos

gastro-app-V2/
    ├── app/                       # Rutas de página y layout
    │   ├── layout.tsx
    │   ├── page.tsx               # Página principal (órdenes)
    │   └── globals.css
    ├── components/                # Componentes reutilizables
    │   └── ErrorMessage.tsx
    ├── features/                  # Lógica modular por función
    │   ├── menu-management/
    │   │   ├── types.ts
    │   │   ├── hooks/
    │   │   │   ├── useCategories.ts
    │   │   │   └── useMenuEditor.ts
    │   │   └── utils/
    │   │       ├── menuValidations.ts
    │   │       └── priceCalculations.ts
    │   └── order-system/
    │       ├── types.ts
    │       ├── index.ts
    │       ├── hooks/
    │       │   ├── useOrderActions.ts
    │       │   └── useOrderCalculator.ts
    │       ├── providers/
    │       │   └── OrderProvider.tsx
    │       └── utils/
    │           ├── orderTotals.ts
    │           └── orderValidations.ts
    ├── testing/
    │   └── test_report.md
    ├── .vscode/                   # Configuración del entorno
    ├── .idx/                      # Entorno de Firebase Studio
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    └── README.md


## Fases de Desarrollo Sugeridas

### Fase 1: Finalizar MVP POS
- Página de historial de órdenes
- Página de reportes básicos (ventas diarias, totales, por categoría)
- Mejoras de UX/UI (modal de productos, loading states, validaciones visuales)
- Añadir persistencia de datos simulada (Firebase u otra adecuada)
- Integración básica con autenticación (opcional para pruebas)

### Fase 2: Módulo Administrativo
- Diseño de CRUD para inventario
- Registro de flujo de caja (ingresos/egresos)
- Gestión de personal (roles, horarios)
- Permisos por usuario (Admin, Mesero, Cocina)
- Dashboard de resumen administrativo

### Fase 3: Módulo Cocina
- CRUD de recetas (ingredientes, pasos, tiempos)
- Control de stock técnico (insumos por receta)
- Temporizador de órdenes en cocina
- Modo visual de cocina (modo TV o tablet)

### Backend & Base de Datos
- Selección de base de datos (Firebase Firestore o SQL remoto)
- Conexión a base de datos y refactorización de lógica
- Implementación de suscripciones por suite contratada
- Deploy inicial (Firebase Hosting, Vercel, Netlify)

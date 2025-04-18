# Documentación Técnica — gastro-app-V2

## Nombre del Proyecto
**gastro-app-V2** — Sistema Administrativo para Restaurantes

## Objetivo del Proyecto
Desarrollar un software administrativo de restaurante que permita digitalizar y automatizar procesos claves como la toma de órdenes, gestión del menú, reportes de ventas, inventarios, personal y operaciones de cocina. Se ofrecerá en forma de suites independientes, accesibles según suscripción, pero sobre una base de datos común.

## Arquitectura General

Frontend (Next.js + React + TS)
         |
   Custom Hooks / Providers
         |
    Firebase Studio / VScode
         |
 Base de datos compartida (planeada)

## Stack Tecnológico

| Categoría            | Tecnología                                  |
|----------------------|---------------------------------------------|
| Lenguaje             | TypeScript                                  |
| Framework            | Next.js (App Router)                        |
| UI                   | React 18, CSS Global                        |
| Estado               | Context API + Custom Hooks                  |
| Hosting              | Firebase Studio                             |
| Linting              | ESLint + Prettier                           |
| Testing              | Manual (`test_report.md`)                   |
| Base de Datos        | 🔜 Firebase Firestore (a definir)           |
| Control de versiones | Git + GitHub                                |

## Estructura de Carpetas

gastro-app-V2/
├── app/                  # Rutas principales del sistema
├── components/           # Componentes reutilizables
├── features/             # Lógica por módulo funcional
│   ├── menu-management/  # Lógica del menú del restaurante
│   └── order-system/     # Lógica para gestionar órdenes
├── providers/            # Contextos para estado global
├── utils/                # Validaciones y cálculos
├── testing/              # Pruebas y documentación de testeo
├── .vscode/              # Configuración del entorno
├── .idx/                 # Firebase Studio configs
└── public/               # Recursos públicos (próximo)

## Módulos Principales

### 1. Order System
+ Funciones: Crear y gestionar órdenes, calcular totales, aplicar validaciones.
- Hooks: `useOrderActions` (Añadir, eliminar y editar órdenes.), `useOrderCalculator` (Calcular totales, descuentos, impuestos.).
- Contexto: `OrderProvider`
- Utils: `orderValidations`, `orderTotals`

### 2. Menu Management
+ Funciones: Administrar productos, categorías y precios.
- Hooks: `useCategories` (Gestión de categorías.), `useMenuEditor` (Edición y validación de productos.).
- Utils: `menuValidations`, `priceCalculations`

## Tipado Global

Ejemplo: Order.ts
```
export interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
}
```

## Pruebas y Validaciones

### Actualmente hay una sección de testing manual:
- testing/test_report.md (Informe inicial de pruebas manuales.).

### Próximos pasos:
- Añadir pruebas unitarias (Jest).
- Validación de formularios con Zod o Yup.
- Mock de base de datos para testeo.

## Autenticación (Futura)

- Firebase Auth con roles (`admin`, `mesero`, `cocinero`)
- Middleware y rutas protegidas
- Redirecciones condicionales por suite contratada.


## Roadmap Técnico

| Fase         | Objetivo                                  | Estado           |
|--------------|-------------------------------------------|------------------|
| MVP POS      | Toma de órdenes + menú + reportes simples | 🟢 En desarrollo |
| Persistencia | Integrar Firebase Firestore               | 🔜 Próximo paso  |
| Roles y Auth | Firebase Authentication                   | 🔜 Próximo paso  |
| Suite Admin  | Finanzas, inventario, empleados           | 🔲 En planeación |
| Suite Cocina | Recetas, tiempos, stock cocina            | 🔲 En planeación |
| Deploy       | Firebase Hosting, Vercel                  | 🔲 Fase final    |

## Notas de Implementación

- Evitar lógica duplicada: mantener reutilización en utils/ y hooks/.
- Todo el estado debe escalar desde providers/.
- Las suites futuras deben respetar la modularidad de features/.
- Preparar rutas independientes por suite si se habilita multi-login o subdominios por rol.

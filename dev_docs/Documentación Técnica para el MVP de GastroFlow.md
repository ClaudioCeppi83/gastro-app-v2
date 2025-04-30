Documentación Técnica para el MVP de GastroFlow

1. Documento de Desarrollo UI/UX (Equipo POS)
1.1 Principios de Diseño
    • Mobile-First: Priorizar pantallas táctiles (tabletas de 10"-12").
    • Accesibilidad AA: Contraste mínimo 4.5:1, tamaño de toque ≥48px.
    • Jerarquía Visual:
        ◦ Color primario: #2F80ED (azul confiable).
        ◦ Tipografía: Inter (sans-serif) con pesos 400/600/700.
    • Feedback Inmediato: Animaciones de 300ms para confirmar acciones (ej: añadir producto).
1.2 Componentes Clave
Componente
Descripción
Ejemplo de Código (React)
ProductCard
Tarjeta táctil con imagen, nombre y precio.

OrderSummary
Panel lateral con items, cantidades y totales.

CategoryTabs
Navegación horizontal entre categorías de menú.
Usar @radix-ui/react-tabs con estilos Tailwind.
ConfirmationModal
Modal para aprobar acciones críticas (ej: enviar orden).
Implementar con @radix-ui/react-dialog y animaciones de Framer Motion.
1.3 Flujos de Usuario Prioritarios
flowchart TD
  A[Inicio] --> B{Seleccionar Mesa}
  B --> C[Navegar Menú]
  C --> D[Añadir Producto]
  D --> E{Ajustar Cantidad?}
  E -->|Sí| F[Usar Selector +/-]
  E -->|No| G[Ver Resumen]
  G --> H[Enviar a Cocina/Imprimir]
1.4 Herramientas y Estándares
    • Prototipado: Figma (Enlace al prototipo).
    • Sistema de Diseño: Storybook para documentar componentes.
    • Pruebas de Usabilidad: Checklist basado en heuristicas de Nielsen.

2. Documento Técnico Backend (Equipo Fullstack)
2.1 Arquitectura de Datos en Airtable (MVP)
Estructura de Bases
Tabla
Campos Clave
Tipo
Órdenes
ID, Mesa, Items (JSON), Total, Estado
Tabla vinculada
Menú
Nombre, Precio, Categoría, Imagen_URL
Attachments
Inventario
Producto, Stock, Caducidad, Proveedor
Fórmulas (alertas)
Conexión con Next.js
// lib/airtable.ts
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY })
  .base(process.env.AIRTABLE_BASE_ID!);

export const getMenuItems = async () => {
  return base('Menú').select({ view: 'Grid view' }).all();
};
2.2 Migración a Firebase Firestore (Producción)
Estrategia de Transición
    1. Mapeo de Datos:
       // Migrador Airtable → Firestore
       const firestoreData = airtableRecord.fields;
       await db.collection('menu').doc(airtableRecord.id).set(firestoreData);
    2. Capa de Abstracción:
       // lib/database.ts
       export const getDatabase = () => {
         return isProduction ? firestore : airtable;
       };
Modelos TypeScript
// types/Order.ts
interface Order {
  id: string;
  table: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'preparing' | 'completed';
}
2.3 API Design (RESTful)
Endpoint
Método
Descripción
Ejemplo de Response
/api/orders
POST
Crear nueva orden
{ id: 'ORD_001', total: 45.50 }
/api/menu?category=...
GET
Obtener items del menú filtrados
Array<MenuItem>
/api/inventory/:id
PATCH
Actualizar stock tras una orden
{ success: true, newStock: 85 }

3. Estándares de Código
3.1 Frontend (Next.js/React)
    • Nomenclatura:
        ◦ Componentes: PascalCase (OrderSummary.tsx).
        ◦ Variables: camelCase (selectedTable).
    • Documentación:
      /**
       * @component ProductCard
       * @description Muestra un producto del menú con imagen interactiva
       * @param {Product} product - Objeto con datos del producto
       * @param {() => void} onAdd - Callback al añadir al carrito
       */
3.2 Backend (TypeScript/Node.js)
    • Validación:
      // api/orders/route.ts
      import { z } from 'zod';
      
      const OrderSchema = z.object({
        table: z.number().min(1),
        items: z.array(z.object({
          productId: z.string(),
          quantity: z.number().min(1),
        })),
      });
    • Logging:
      [2024-03-15T10:00:00Z] INFO: Orden ORD_001 creada para Mesa 5
      [2024-03-15T10:00:05Z] ERROR: Stock insuficiente para producto PROD_089

4. Pruebas y Monitoreo
4.1 Suite de Pruebas
Tipo
Herramienta
Cobertura Objetivo
Unitarias
Jest + Testing Library
85%
Integración
Cypress
Flujos completos POS
Rendimiento
Lighthouse CI
Puntaje ≥90 en móvil
4.2 Monitoreo en Producción
# docker-compose.prod.yml
services:
  monitoring:
    image: grafana/grafana
    ports:
      - 3000:3000
    links:
      - prometheus

5. Entrega y Siguientes Pasos
5.1 Entregables MVP
    1. Repositorio Frontend:
        ◦ Código en github.com/gastroflow/pos-mvp.
        ◦ Dockerfile para despliegue.
    2. Documentación Viva:
        ◦ Swagger en api.gastroflow.dev/docs.
        ◦ Storybook desplegado en Chromatic.
5.2 Roadmap Post-MVP
    1. Integrar Auth: Firebase Authentication con roles.
    2. Desplegar Agentes IA: Conectar MenuBot vía webhooks.
    3. Optimizar Caché: Implementar Redis para consultas frecuentes.

Este documento proporciona una base técnica sólida para el desarrollo coordinado del MVP, garantizando calidad, mantenibilidad y preparación para escalar.


# Pruebas Manuales para firestoreService

## Objetivo
Verificar la funcionalidad de `firestoreService.ts` manualmente.

## Pruebas a Realizar

### 1. Probar `getOrders`
- Llama a `getOrders()` y verifica que devuelva una lista de órdenes con sus IDs y datos.

### 2. Probar `createOrder`
- Crea una nueva orden con un número de mesa válido llamando a `createOrder(tableNumber)`.
- Verifica que la orden se cree correctamente en Firestore y que se devuelva el ID de la orden.

### 3. Probar `getOrder`
- Utiliza el ID de la orden creada en el paso anterior y llama a `getOrder(id)`.
- Verifica que los datos de la orden recuperada coincidan con los datos creados.

### 4. Probar `updateOrder`
- Actualiza la orden creada utilizando `updateOrder(id, data)` con nuevos datos.
- Verifica que los cambios se reflejen correctamente en Firestore.

### 5. Probar `deleteOrder`
- Elimina la orden creada utilizando `deleteOrder(id)`.
- Verifica que la orden se elimine correctamente de Firestore.

## Instrucciones
1. Abre la consola de Firestore y verifica los datos manualmente.
2. Utiliza un entorno de pruebas o desarrollo para evitar afectar datos de producción.
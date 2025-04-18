'use client';

import React, { useState, useMemo, useEffect } from 'react';
import useCategories from '../features/menu-management/hooks/useCategories';
import ErrorMessage from '../components/ErrorMessage';
import { useOrderContext } from '../features/order-system/providers/OrderProvider';

const OrderPage: React.FC = () => {
  const { categories, loading: loadingMenu, error: menuError } = useCategories();
  const {
    createOrder,
    addItemToOrder,
    removeItemFromOrder,
    loading: loadingOrder,
    error: orderError,
    setOrderError,
    getOrderItems,
    orders,
  } = useOrderContext();
  const [tableNumber, setTableNumber] = useState(0);
  const [orderItems, setOrderItems] = useState<
    { id: string; productName: string; quantity: number; price: number }[]
  >([]);
  const [personCount, setPersonCount] = useState(0);
  const [addItemError, setAddItemError] = useState<string | null>(null); // Local state for add item errors
  const [removeItemError, setRemoveItemError] = useState<{ [itemId: string]: string | null }>({}); // Local state for remove item errors
  const [removeItemLoading, setRemoveItemLoading] = useState<{ [itemId: string]: boolean }>({}); // Local state for remove item loading

  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Memoized products to avoid unnecessary recalculations
  const products = useMemo(() => {
    return categories.flatMap((category) =>
      category.dishes.map((dish) => ({
        id: dish.id,
        name: dish.name,
        category: category.name,
        price: dish.price,
      }))
    );
  }, [categories]);

  // Improved error handling in handleAddItem
  const handleAddItem = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!orderId) {
      setAddItemError('Por favor crea una orden primero');
      return;
    }

    if (!selectedProduct || quantity <= 0) {
      setAddItemError('Selecciona un producto y cantidad válida');
      return;
    }

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) {
      setAddItemError('Producto no encontrado');
      return;
    }

    try {
      await addItemToOrder(orderId, {
        id: `${orderId}-${product.id}`,
        dishId: product.id,
        quantity: quantity,
        price: product.price,
      });

      setSelectedProduct('');
      setQuantity(1);
      setAddItemError(null);
    } catch (error) {
      console.error('Error adding item:', error);
      setAddItemError('Error al agregar el producto. Intenta nuevamente.');
    }
  };

  // Adjusted useEffect to ensure orderItems sync correctly with orders
  useEffect(() => {
    if (!orderId) return;

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const itemsWithProductNames = order.items.map((item) => ({
      id: item.id,
      productName: products.find((p) => p.id === item.dishId)?.name || 'Unknown Product',
      quantity: item.quantity,
      price: item.price,
    }));

    setOrderItems(itemsWithProductNames);
  }, [orderId, orders, products]);

  // Updated handleRemoveItem to implement the suggested solution
  // Fixed ReferenceError by ensuring previousItems is defined in the correct scope
  const handleRemoveItem = async (index: number) => {
    if (!orderId || !orderItems?.[index]) return;

    const itemId = orderItems[index].id;

    // Prevent double execution if already loading
    if (removeItemLoading[itemId]) {
      console.warn('Remove action already in progress for item:', itemId);
      return;
    }

    console.log('Attempting to remove item:', { itemId, index });
    setRemoveItemLoading((prevLoading) => ({ ...prevLoading, [itemId]: true }));

    // Save the current state in case we need to revert
    const previousItems = [...orderItems];

    try {
      // Optimistic update - remove the item locally
      setOrderItems((prevItems) => prevItems.filter((_, i) => i !== index));

      // Call the API to remove the item
      await removeItemFromOrder(orderId, itemId);

      // No need to fetch items again, trust the backend operation succeeded
      setRemoveItemError((prevErrors) => ({ ...prevErrors, [itemId]: null }));
    } catch (error) {
      console.error('Error removing item:', error);

      // Revert the state if there is an error
      setOrderItems(previousItems);
      setRemoveItemError((prevErrors) => ({ ...prevErrors, [itemId]: 'Failed to remove item.' }));
    } finally {
      setRemoveItemLoading((prevLoading) => {
        console.log('Resetting removeItemLoading for item:', itemId);
        return { ...prevLoading, [itemId]: false };
      });
    }
  };

  // Calculate order summary using useMemo for efficiency
  const orderSummary = useMemo(() => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const iva = subtotal * 0.16; // 16% IVA (This could be configurable)
    return { subtotal, iva, total: subtotal + iva };
  }, [orderItems]);

  // Updated handleCreateOrder to handle the return type of createOrder properly
  // Ensure the error message is displayed and dismissible
  // Added validation to prevent creating an order with tableNumber or personCount as zero
  const handleCreateOrder = async () => {
    console.log('handleCreateOrder called with tableNumber:', tableNumber);

    if (tableNumber <= 0 || personCount <= 0) {
      console.error('Invalid table number or person count. Cannot create order.');
      setOrderError('El número de mesa y la cantidad de personas deben ser mayores a cero.');
      return;
    }

    try {
      const newOrder = await createOrder(tableNumber);
      if (newOrder && newOrder.id) {
        setOrderId(newOrder.id);
      } else {
        console.error('Order creation failed: Invalid response from createOrder');
        setOrderError('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderError('Failed to create order. Please try again.');
    }
  };

  return (
    <main className="container mx-auto p-4">
      {/* Logo and Navigation */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          <a href="/" aria-label="Página de inicio">
            Logo
          </a>
        </h1>
        <nav aria-label="Navegación principal">
          <menu className="flex space-x-4">
            <li>
              <a href="#" aria-current="page" className="text-indigo-600">
                Inicio
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-500">
                Órdenes
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-500">
                Reportes
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-500">
                Menú
              </a>
            </li>
          </menu>
        </nav>
      </header>

      <section className="grid grid-cols-2 gap-4">
        {/* Configuración de mesa */}
        <section aria-labelledby="table-config-heading">
          <h2 id="table-config-heading" className="text-lg font-semibold mb-2">
            Configuración de Mesa
          </h2>
          <form aria-labelledby="table-config-heading">
            <fieldset className="mb-4 space-y-3">
              <legend className="sr-only">Configuración de mesa</legend>

              <p className="[&:has(:focus)]:ring-2">
                <label
                  htmlFor="tableNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nº de mesa{' '}
                  <span className="text-red-500" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  type="number"
                  id="tableNumber"
                  name="tableNumber"
                  min="1"
                  value={tableNumber}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value > 0) {
                      setTableNumber(value);
                    } else {
                      setTableNumber(1); // or any other default value you prefer
                    }
                  }}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-required="true"
                />
              </p>

              <p className="[&:has(:focus)]:ring-2 rounded-md">
                <label
                  htmlFor="personCount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cantidad de Personas{' '}
                  <span className="text-red-500" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  type="number"
                  id="personCount"
                  name="personCount"
                  min="1"
                  value={personCount}
                  onChange={(e) => setPersonCount(Number(e.target.value))}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-required="true"
                />
              </p>
            </fieldset>
          </form>
        </section>

        {/* Orden actual */}
        <section aria-labelledby="current-order-heading">
          <h2 id="current-order-heading" className="text-lg font-semibold mb-2">
            Orden Actual
          </h2>
          {orderItems.length === 0 ? (
            <p>No items yet.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-indigo-600 hover:text-indigo-900"
                        disabled={removeItemLoading[item.id]}
                      >
                        {removeItemLoading[item.id] ? 'Eliminando...' : 'Eliminar'}
                      </button>
                      {removeItemError[item.id] && (
                        <ErrorMessage errorMessage={removeItemError[item.id]} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Agregar productos */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Agregar Productos</h2>
          {loadingMenu ? (
            <p>Cargando productos...</p>
          ) : (
            <form>
              {menuError ? (
                <p>Error cargando productos: {menuError}</p>
              ) : (
                <>
                  <div className="mb-2">
                    <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                      Producto
                    </label>
                    <select
                      id="product"
                      name="product"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Selecciona un producto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.category}) - ${product.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <button
                    onClick={handleAddItem}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    disabled={!orderId || loadingOrder}
                  >
                    {loadingOrder ? 'Agregando...' : 'Agregar'}
                  </button>
                  {addItemError && <ErrorMessage errorMessage={addItemError} />}
                </>
              )}
            </form>
          )}
        </section>

        {/* Resumen de orden */}
        <section aria-labelledby="order-summary-heading">
          <h2 id="order-summary-heading" className="text-lg font-semibold mb-2">
            Resumen
          </h2>
          <ErrorMessage errorMessage={orderError} onDismiss={() => setOrderError(null)} />
          <dl>
            <div>
              <dt className="text-gray-700">Mesa:</dt>
              <dd className="font-medium">{tableNumber}</dd>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-medium">${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">IVA (16%)</span>
                <span className="font-medium">${orderSummary.iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-700">Total</span>
                <span className="font-bold">${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
            {orderId && (
              <div>
                <dt className="text-gray-700">Order ID:</dt>
                <dd className="font-medium">{orderId}</dd>
              </div>
            )}
            <button
              onClick={handleCreateOrder}
              disabled={loadingOrder}
              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loadingOrder ? 'Creando...' : 'Crear Orden'}
            </button>
          </dl>
        </section>
      </section>
    </main>
  );
};

export default OrderPage;

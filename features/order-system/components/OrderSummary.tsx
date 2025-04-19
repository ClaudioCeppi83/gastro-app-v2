// features/order-system/components/OrderSummary.tsx
import React from 'react';
import ErrorMessage from '../../../components/ErrorMessage'; // Adjust path as needed

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  orderItems: OrderItem[];
  onRemoveItem: (index: number) => void;
  removeItemLoading: { [itemId: string]: boolean };
  removeItemError: { [itemId: string]: string | null };
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderItems,
  onRemoveItem,
  removeItemLoading,
  removeItemError,
}) => {
  return (
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
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 bg-gray-50"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orderItems.map((item, index) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onRemoveItem(index)}
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
  );
};

export default OrderSummary;
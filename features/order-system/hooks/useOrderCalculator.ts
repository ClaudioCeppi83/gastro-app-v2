import { useCallback, useState, useEffect } from 'react';
import { OrderItem, Order } from '../types';
import { getOrder } from '../../../services/firestoreService';

export function useOrderCalculator(orderId: string) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const order = await getOrder(orderId) as Order | null;
        if (order?.items) {
          setItems(order.items);
        } else {
          setError('Order not found');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
      }
    };

    fetchOrderItems();
  }, [orderId]);

  const calculateSubtotal = useCallback(() =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const calculateTaxes = useCallback((subtotal: number) => ({
    iva: subtotal * 0.12,
    serviceCharge: subtotal * 0.1
  }), []);

  return {
    calculateSubtotal,
    calculateTaxes,
    error
  };
}
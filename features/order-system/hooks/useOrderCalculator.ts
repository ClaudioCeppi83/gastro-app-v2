import { useCallback } from 'react';
import { OrderItem } from '../types';

export function useOrderCalculator(items: OrderItem[]) {
  const calculateSubtotal = useCallback(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const calculateTaxes = useCallback(
    (subtotal: number) => ({
      iva: subtotal * 0.12,
      serviceCharge: subtotal * 0.1,
    }),
    [],
  );

  return {
    calculateSubtotal,
    calculateTaxes,
  };
}

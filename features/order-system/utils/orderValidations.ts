import { OrderItem } from '../types';

export const validateOrderItem = (item: OrderItem): string[] => {
  const errors = [];
  if (item.quantity <= 0) errors.push('Cantidad inválida');
  if (!item.dishId) errors.push('Plato requerido');
  return errors;
};

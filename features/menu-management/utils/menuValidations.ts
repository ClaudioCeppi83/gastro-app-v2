import { Dish } from '../../order-system/types';

export const validateDish = (dish: Dish): string[] => {
  const errors: string[] = [];

  if (!dish.name) {
    errors.push('Name is required');
  }

  if (dish.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!dish.category) {
    errors.push('Category is required');
  }

  return errors;
};

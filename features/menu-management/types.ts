import { Dish } from '../../order-system/types';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface MenuSection {
  id: string;
  name: string;
  categories: Category[];
}

export { Dish };

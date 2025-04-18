import { Dish } from '../order-system/types';

export interface Category {
  id: string;
  name: string;
  description?: string;
  dishes: Dish[];
}

export interface MenuSection {
  id: string;
  name: string;
  categories: Category[];
}

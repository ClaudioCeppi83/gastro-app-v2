import { Dish } from '../order-system/types';

export interface Category {
  id: string;
  name: string;
  description?: string;
  dishIds: string[]; // Array of dish IDs
}

export interface MenuSection {
  id: string;
  name: string;
  categories: Category[];
}

export interface CategoryWithDishes extends Omit<Category, 'dishIds'> {
  dishes: Dish[];
}

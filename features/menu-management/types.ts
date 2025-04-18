// Removed local declaration of Dish and relied on imported type
import { OrderItem, Dish } from '../order-system'; // Simplified path

// Removed local declaration of Dish

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

// Removed re-export of Dish to avoid conflicts

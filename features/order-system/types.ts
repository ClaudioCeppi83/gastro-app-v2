import { Timestamp } from 'firebase/firestore';

export interface OrderItem {
  dishId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  subtotal: number;
  taxes: {
    iva: number;
    service: number;
  };
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  allergens: string[];
}

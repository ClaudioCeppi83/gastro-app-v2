// Ensure all types are exported properly
export type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

// Defining OrderItem type
export interface OrderItem {
  id: string;
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
  price: number;
  category: string;
  description: string;
  isActive: boolean;
  allergens: string[];
}

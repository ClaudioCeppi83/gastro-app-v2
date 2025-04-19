export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface OrderItem {
  id: string;
  dishId: string;
  quantity: number;
  price: number;
}

export interface BaseOrder {
  id: string;
  tableNumber: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'SUBMITTED';
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface Order extends BaseOrder {
  items: OrderItem[];
  subtotal: number;
  taxes: {
    iva: number;
    service: number;
  };
}

export type NewOrder = Partial<Order> & Pick<Order, 'id' | 'tableNumber' | 'status'>;

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  allergens: string[];
}
import React, { createContext, useContext } from 'react';
import { useOrderActions } from '../hooks/useOrderActions';
import { Order } from '../types'; // Assuming Order type is defined

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (tableNumber: number) => Promise<void>;
  addItemToOrder: (orderId: string, item: OrderItem) => Promise<void>;
  // Add other actions as needed
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { orders, loading, error, createOrder, addItemToOrder } = useOrderActions();

  const value: OrderContextType = {
    orders,
    loading,
    error,
    createOrder,
    addItemToOrder,
    // ... other actions
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};

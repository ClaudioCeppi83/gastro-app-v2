"use client";

import React, { createContext, useContext, useState } from 'react';
import { useOrderActions } from '../hooks/useOrderActions';
import { Order, OrderItem } from '../types'; // Assuming Order type is defined

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  createOrder: (tableNumber: number) => Promise<{ id: string }>; // Updated to match the implementation
  addItemToOrder: (orderId: string, item: OrderItem) => Promise<void>;
  removeItemFromOrder: (orderId: string, itemId: string) => Promise<void>;
  setOrderError: (error: string | null) => void;
  getOrderItems: (orderId: string) => Promise<OrderItem[]>;
  // Add other actions as needed
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { orders, loading, error, createOrder, addItemToOrder } = useOrderActions();

  const [orderError, setOrderError] = useState<string | null>(null);

  const removeItemFromOrder = async (orderId: string, itemId: string) => {
    // Implement the logic to remove an item from an order
    console.log(`Removing item ${itemId} from order ${orderId}`);
    // Add actual implementation here
  };

  const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
    // Implement the logic to fetch order items
    console.log(`Fetching items for order ${orderId}`);
    return []; // Replace with actual implementation
  };

  const value: OrderContextType = {
    orders,
    loading,
    error,
    createOrder,
    addItemToOrder,
    removeItemFromOrder,
    setOrderError,
    getOrderItems,
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

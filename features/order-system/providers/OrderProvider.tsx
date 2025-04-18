'use client';

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
  const {
    orders,
    loading,
    error,
    createOrder,
    addItemToOrder,
    removeItemFromOrder,
    getOrderItems,
    setOrderError,
  } = useOrderActions();

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

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};

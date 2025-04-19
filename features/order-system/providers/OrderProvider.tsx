'use client';

import React, { createContext, useContext, useState } from 'react';
import { useOrderActions } from '../hooks/useOrderActions';
import { Order, OrderItem } from '../types';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
    error: string | null;
    createOrder: (tableNumber: number) => Promise<{ id: string }>;
    addItemToOrder: (orderId: string, item: OrderItem) => Promise<Order>;
    removeItemFromOrder: (orderId: string, itemId: string) => Promise<Order>;
  setOrderError: (error: string | null) => void;
  getOrderItems: (orderId: string) => Promise<OrderItem[]>;
  getOrderFirestore: (orderId: string) => Promise<Order | undefined>;
  updateOrderFirestore: (orderId: string, orderData: Partial<Order>) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
      orders,
      loading,
      error,
      setOrderError,
      createOrder,
      addItemToOrder,
      removeItemFromOrder,
      getOrderItems,
      getOrderFirestore,
      updateOrderFirestore,
    } = useOrderActions();

  const value: OrderContextType = {
    orders: orders || [],
    loading,
    error,
    setOrderError,
    createOrder,
    addItemToOrder: addItemToOrder,
    removeItemFromOrder,
    getOrderItems,
    getOrderFirestore,
    updateOrderFirestore,
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
import { useState } from 'react';
import { Order, OrderItem, NewOrder } from '../types';
import {
  createOrder as createOrderFirestore,
  getOrder as getOrderFirestore,
  updateOrder as updateOrderFirestore,
} from '../../../services/firestoreService';

export const useOrderActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (tableNumber: number): Promise<Order> => {
    setLoading(true);
    setError(null);
    try {
      const orderId = await createOrderFirestore(tableNumber);
      const newOrder: NewOrder = {
        id: orderId,
        tableNumber,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
        subtotal: 0,
        taxes: {
          iva: 0,
          service: 0
        }
      };
      await updateOrderFirestore(orderId, newOrder);
      return newOrder as Order;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const addItemToOrder = async (orderId: string, item: OrderItem) => {
    setLoading(true);
    setError(null);
    try {
      const order = await getOrderFirestore(orderId) as Order | null;
      if (!order || !Array.isArray(order?.items)) {
        throw new Error('Order not found or invalid');
      }
      
      const updatedItems = [...order.items, item];
      const updatedOrder = {
        ...order,
        items: updatedItems,
        updatedAt: new Date()
      };
      
      await updateOrderFirestore(orderId, updatedOrder);
      return updatedOrder;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add item';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromOrder = async (orderId: string, itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      const order = await getOrderFirestore(orderId) as Order | null;
      if (!order || !Array.isArray(order?.items)) {
        throw new Error('Order not found or invalid');
      }
      
      const updatedItems = order.items.filter(i => i.id !== itemId);
      const updatedOrder = {
        ...order,
        items: updatedItems,
        updatedAt: new Date()
      };
      
      await updateOrderFirestore(orderId, updatedOrder);
      return updatedOrder;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove item';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
    try {
      const order = await getOrderFirestore(orderId) as Order | null;
      return order?.items || [];
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to get order items';
      setError(message);
      return [];
    }
  };

  return {
    loading,
    error,
    createOrder,
    addItemToOrder,
    getOrderItems,
    removeItemFromOrder,
  };
};
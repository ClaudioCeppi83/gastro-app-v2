import { useState } from 'react';
import { Order, OrderItem } from '../types';
import { Dish } from '../types';
// import { OrderService } from '../../services/orders';
export const useOrderActions = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Updated createOrder to add the new order to the local state
  const createOrder = async (tableNumber: number): Promise<{ id: string }> => {
    const newOrder = { id: `order-${tableNumber}-${Date.now()}`, tableNumber, items: [] };
    setOrders([...orders, newOrder]);
    return { id: newOrder.id };
  };

  // Reverted addItemToOrder to its original implementation
  const addItemToOrder = async (orderId: string, item: OrderItem) => {
    console.log('addItemToOrder called with:', { orderId, item });
    setLoading(true);
    setError(null);
    try {
      setOrders(
        orders.map((order) => {
          if (order.id === orderId) {
            const updatedOrder = { ...order, items: [...order.items, item] };
            console.log('Updated order:', updatedOrder);
            return updatedOrder;
          }
          return order;
        }),
      );
    } catch (err: any) {
      setError(err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  // Reverted removeItemFromOrder to its original implementation
  const removeItemFromOrder = async (orderId: string, itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      setOrders(
        orders.map((order) => {
          if (order.id === orderId) {
            return { ...order, items: order.items.filter((item) => item.id !== itemId) };
          }
          return order;
        })
      );
    } catch (err: any) {
      setError(err.message || 'Failed to remove item');
      throw err; // Re-throw the error to ensure it propagates
    } finally {
      setLoading(false);
    }
  };

  const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
    setLoading(true);
    setError(null);
    try {
      const order = orders.find((o) => o.id === orderId);
      return order ? order.items : [];
    } catch (err: any) {
      setError(err.message || 'Failed to get order items');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const setOrderError = (errorMessage: string | null) => {
    setLoading(false);
    setError(errorMessage);
  };

  // Implement other CRUD actions like updateOrder, deleteOrder, getOrders...

  return {
    orders,
    loading,
    error,
    createOrder,
    addItemToOrder,
    getOrderItems,
    removeItemFromOrder,
    setOrderError,
    // ... other actions
  };
};

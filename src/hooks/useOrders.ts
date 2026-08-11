import { useState, useCallback } from 'react';
import type { CartItem } from './useCart';

// ============================================================
// Order Types
// ============================================================

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size: string;
}

export type PaymentMethod = 'mpesa' | 'cod';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  delivery: DeliveryDetails;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

const ORDERS_STORAGE_KEY = 'kaelthrift_orders';
const DELIVERY_FEE = 300; // KES 300 flat delivery

// ============================================================
// Orders Hook
// ============================================================

function generateOrderNumber(): string {
  const prefix = 'KT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function useOrders() {
  const [loading, setLoading] = useState(false);

  const getOrders = useCallback((): Order[] => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const getOrder = useCallback(
    (orderId: string): Order | null => {
      const orders = getOrders();
      return orders.find((o) => o.id === orderId) || null;
    },
    [getOrders]
  );

  const createOrder = useCallback(
    async (
      cartItems: CartItem[],
      delivery: DeliveryDetails,
      paymentMethod: PaymentMethod
    ): Promise<Order> => {
      setLoading(true);

      try {
        // Simulate a brief processing delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const orderItems: OrderItem[] = cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0] || '',
          price: item.product.price,
          quantity: item.quantity,
          size: item.product.size,
        }));

        const subtotal = cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        const order: Order = {
          id: crypto.randomUUID(),
          orderNumber: generateOrderNumber(),
          items: orderItems,
          delivery,
          paymentMethod,
          subtotal,
          deliveryFee: DELIVERY_FEE,
          total: subtotal + DELIVERY_FEE,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        // Save to localStorage
        const existing = getOrders();
        localStorage.setItem(
          ORDERS_STORAGE_KEY,
          JSON.stringify([order, ...existing])
        );

        return order;
      } finally {
        setLoading(false);
      }
    },
    [getOrders]
  );

  return { loading, getOrders, getOrder, createOrder, DELIVERY_FEE };
}

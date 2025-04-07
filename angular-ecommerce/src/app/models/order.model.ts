import { CartItem } from './cart.model';

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'packed' | 'dispatched' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  expectedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  packedAt?: string;
  dispatchedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
} 
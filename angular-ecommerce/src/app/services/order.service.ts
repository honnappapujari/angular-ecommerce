import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order, OrderItem } from '../models/order.model';
import { CartService } from './cart.service';
import { environment } from '../../environments/environment';
import { CartItem } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  // Mock data for development
  private mockOrders: Order[] = [
    {
      id: '1',
      items: [
        {
          productId: 1,
          name: 'Nike Air Max 270',
          price: 150.00,
          quantity: 1,
          imageUrl: 'assets/images/products/nike-air-max-270.jpg'
        }
      ],
      totalAmount: 150.00,
      shippingAddress: {
        fullName: 'John Doe',
        addressLine1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        phone: '123-456-7890'
      },
      paymentMethod: 'credit_card',
      paymentStatus: 'completed',
      orderStatus: 'delivered',
      trackingNumber: 'TRK123456789',
      expectedDeliveryDate: '2024-03-10T00:00:00.000Z',
      createdAt: '2024-03-01T00:00:00.000Z',
      updatedAt: '2024-03-01T00:00:00.000Z',
      shippedAt: '2024-03-05T00:00:00.000Z',
      deliveredAt: '2024-03-10T00:00:00.000Z'
    }
  ];

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {
    this.loadOrdersFromStorage();
  }

  private loadOrdersFromStorage(): void {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      this.orders = JSON.parse(storedOrders);
      this.ordersSubject.next(this.orders);
    }
  }

  private saveOrdersToStorage(): void {
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  getOrder(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  createOrder(orderData: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData).pipe(
      map(order => {
        const currentOrders = this.ordersSubject.value;
        this.ordersSubject.next([...currentOrders, order]);
        return order;
      })
    );
  }

  updateOrderStatus(orderId: string, status: Order['orderStatus']): Observable<Order> {
    const order = this.getOrder(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();

    // Update the appropriate timestamp based on the status
    switch (status) {
      case 'packed':
        order.packedAt = order.updatedAt;
        break;
      case 'dispatched':
        order.dispatchedAt = order.updatedAt;
        break;
      case 'shipped':
        order.shippedAt = order.updatedAt;
        break;
      case 'delivered':
        order.deliveredAt = order.updatedAt;
        break;
    }

    this.ordersSubject.next(this.orders);
    this.saveOrdersToStorage();

    return of(order);
  }

  cancelOrder(orderId: string): Observable<Order> {
    return this.updateOrderStatus(orderId, 'cancelled');
  }

  createOrderFromCart(cartItems: CartItem[], totalAmount: number, paymentMethod: string, shippingAddress: any): Order {
    const now = new Date().toISOString();
    const order: Order = {
      id: this.generateOrderId(),
      items: this.cartItemsToOrderItems(cartItems),
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingAddress: {
        fullName: shippingAddress.fullName,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone
      },
      createdAt: now,
      updatedAt: now,
      packedAt: undefined,
      dispatchedAt: undefined,
      shippedAt: undefined,
      deliveredAt: undefined
    };

    this.orders.push(order);
    this.ordersSubject.next(this.orders);
    this.saveOrdersToStorage();
    this.cartService.clearCart();

    return order;
  }

  private cartItemsToOrderItems(cartItems: CartItem[]): OrderItem[] {
    return cartItems.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl[0]
    }));
  }

  private generateOrderId(): string {
    return 'ORD-' + Date.now().toString(36).toUpperCase();
  }
}

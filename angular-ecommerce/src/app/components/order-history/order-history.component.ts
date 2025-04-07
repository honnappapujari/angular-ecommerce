import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.component.html'
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  isLoading = false;
  error: string | null = null;
  private ordersSubscription?: Subscription;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.ordersSubscription?.unsubscribe();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = null;

    this.ordersSubscription = this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
        console.error('Error loading orders:', error);
      }
    });
  }

  getStatusClass(status: Order['orderStatus']): string {
    const classes: { [key in Order['orderStatus']]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'packed': 'bg-indigo-100 text-indigo-800',
      'dispatched': 'bg-orange-100 text-orange-800',
      'shipped': 'bg-teal-100 text-teal-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return classes[status] || classes['pending'];
  }

  getStatusIcon(status: Order['orderStatus']): string {
    const icons: { [key in Order['orderStatus']]: string } = {
      'pending': '⏳',
      'confirmed': '✓',
      'processing': '🔄',
      'packed': '📦',
      'dispatched': '🚚',
      'shipped': '✈️',
      'delivered': '✅',
      'cancelled': '❌'
    };
    return icons[status] || icons['pending'];
  }

  getPaymentMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      credit_card: 'Credit Card',
      paypal: 'PayPal',
      cash_on_delivery: 'Cash on Delivery'
    };
    return labels[method] || method;
  }

  canCancelOrder(order: Order): boolean {
    return ['pending', 'confirmed'].includes(order.orderStatus);
  }

  cancelOrder(orderId: string): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.loadOrders(); // Refresh the orders list
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
        }
      });
    }
  }
} 
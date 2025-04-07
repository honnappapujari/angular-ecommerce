import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-tracking.component.html'
})
export class OrderTrackingComponent implements OnInit {
  orderId: string = '';
  order: Order | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        this.orderId = params['orderId'];
        this.trackOrder();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  trackOrder(): void {
    if (!this.orderId) {
      this.error = 'Please enter an order ID';
      return;
    }

    this.isLoading = true;
    this.error = null;

    // First try to get the order from local storage
    const localOrder = this.orderService.getOrder(this.orderId);
    if (localOrder) {
      this.order = localOrder;
      this.isLoading = false;
      return;
    }

    // If not found locally, try to fetch from the server
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error tracking order:', error);
        this.error = 'Order not found. Please check your order ID and try again.';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'packed': 'bg-indigo-100 text-indigo-800',
      'dispatched': 'bg-orange-100 text-orange-800',
      'shipped': 'bg-teal-100 text-teal-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || statusClasses['pending'];
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      'pending': '⏳',
      'confirmed': '✓',
      'processing': '🔄',
      'packed': '📦',
      'dispatched': '🚚',
      'shipped': '✈️',
      'delivered': '✅',
      'cancelled': '❌'
    };
    return statusIcons[status] || statusIcons['pending'];
  }
} 
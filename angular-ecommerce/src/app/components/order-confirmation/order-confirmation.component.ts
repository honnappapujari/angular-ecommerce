import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.component.html'
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;
  error: string | null = null;
  private currentOrderId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.currentOrderId = params['id'];
        this.loadOrder();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  loadOrder(): void {
    if (!this.currentOrderId) {
      this.error = 'No order ID available';
      return;
    }

    this.error = null;
    this.orderService.getOrderById(this.currentOrderId).subscribe({
      next: (order) => {
        this.order = order;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.error = 'Unable to load order details. Please try again.';
      }
    });
  }
} 
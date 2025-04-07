import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | undefined;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(orderId)) {
      this.router.navigate(['/orders']);
      return;
    }

    this.orderService.getOrder(orderId).subscribe({
      next: (order) => {
        if (order && order.userId === currentUser.id) {
          this.order = order;
        } else {
          this.router.navigate(['/orders']);
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load order details. Please try again.';
        this.loading = false;
      }
    });
  }
}

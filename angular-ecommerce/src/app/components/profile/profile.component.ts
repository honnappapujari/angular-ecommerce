import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  recentOrders: Order[] = [];
  emailNotifications = true;
  smsNotifications = false;
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadRecentOrders(user.id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadRecentOrders(userId: number): void {
    this.orderService.getOrders(userId).subscribe({
      next: (orders: Order[]) => {
        this.recentOrders = orders.slice(0, 5); // Get only the 5 most recent orders
      },
      error: (error: Error) => {
        console.error('Error loading recent orders:', error);
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  toggleEmailNotifications(): void {
    this.emailNotifications = !this.emailNotifications;
    // Add logic to save notification preferences
  }

  toggleSmsNotifications(): void {
    this.smsNotifications = !this.smsNotifications;
    // Add logic to save notification preferences
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 
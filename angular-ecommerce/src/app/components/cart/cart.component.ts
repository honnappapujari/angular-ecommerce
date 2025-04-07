import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  private cartSubscription?: Subscription;
  private totalSubscription?: Subscription;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });

    this.totalSubscription = this.cartService.getCartTotal().subscribe(total => {
      this.cartTotal = total;
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.totalSubscription?.unsubscribe();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  checkout(): void {
    if (!this.authService.currentUser) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }
    this.router.navigate(['/checkout']);
  }
}

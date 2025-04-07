import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartTotalSubject = new BehaviorSubject<number>(0);
  private cartCountSubject = new BehaviorSubject<number>(0);

  cart$ = this.cartSubject.asObservable();
  cartTotal$ = this.cartTotalSubject.asObservable();
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.updateCart();
    }
  }

  private updateCart(): void {
    this.cartSubject.next(this.cartItems);
    this.cartTotalSubject.next(this.calculateTotal());
    this.cartCountSubject.next(this.calculateCount());
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private calculateTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  private calculateCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cart$;
  }

  getCartTotal(): Observable<number> {
    return this.cartTotal$;
  }

  getCartCount(): Observable<number> {
    return this.cartCount$;
  }

  getCurrentCartItems(): CartItem[] {
    return this.cartItems;
  }

  getCurrentTotal(): number {
    return this.calculateTotal();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }

    this.updateCart();
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCart();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }
}

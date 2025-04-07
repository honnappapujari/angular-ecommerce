import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: Product[] = [];
  private wishlistSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    this.loadWishlistFromStorage();
  }

  private loadWishlistFromStorage(): void {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      this.wishlistItems = JSON.parse(storedWishlist);
      this.wishlistSubject.next(this.wishlistItems);
    }
  }

  private saveWishlistToStorage(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
  }

  getWishlistItems(): Observable<Product[]> {
    return this.wishlistSubject.asObservable();
  }

  addToWishlist(product: Product): void {
    if (!this.wishlistItems.some(item => item.id === product.id)) {
      this.wishlistItems.push(product);
      this.wishlistSubject.next(this.wishlistItems);
      this.saveWishlistToStorage();
    }
  }

  removeFromWishlist(productId: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
    this.wishlistSubject.next(this.wishlistItems);
    this.saveWishlistToStorage();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.some(item => item.id === productId);
  }

  toggleWishlist(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }
} 
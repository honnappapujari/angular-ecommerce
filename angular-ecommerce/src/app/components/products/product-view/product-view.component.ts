import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="product-view-container">
      <div class="product-images">
        <div class="main-image">
          <img [src]="product?.imageUrl[0]" [alt]="product?.name">
        </div>
        <div class="thumbnail-images">
          <img *ngFor="let image of product?.imageUrl" 
               [src]="image" 
               [alt]="product?.name"
               (click)="selectImage(image)">
        </div>
      </div>

      <div class="product-details">
        <h1 class="product-name">{{product?.name}}</h1>
        <p class="product-brand">{{product?.brand}}</p>
        
        <div class="price-section">
          <span class="current-price">₹{{product?.price}}</span>
          <span class="mrp">MRP: ₹{{product?.mrp}}</span>
          <span class="discount">{{product?.discountPercentage}}% OFF</span>
        </div>

        <div class="size-section">
          <h3>Select Size</h3>
          <div class="size-options">
            <button *ngFor="let size of product?.sizes"
                    [class.selected]="selectedSize === size"
                    (click)="selectSize(size)">
              {{size}}
            </button>
          </div>
        </div>

        <div class="quantity-section">
          <h3>Quantity</h3>
          <div class="quantity-controls">
            <button (click)="decrementQuantity()">-</button>
            <input type="number" [(ngModel)]="quantity" min="1" [max]="product?.stock">
            <button (click)="incrementQuantity()">+</button>
          </div>
        </div>

        <div class="action-buttons">
          <button class="add-to-bag" (click)="addToBag()">
            ADD TO BAG
          </button>
          <button class="wishlist" (click)="toggleWishlist()">
            <i class="far" [class.fa-heart]="!product?.isFavorite" [class.fas]="product?.isFavorite"></i>
            WISHLIST
          </button>
        </div>

        <div class="product-description">
          <h3>Product Details</h3>
          <p>{{product?.description}}</p>
        </div>

        <div class="product-meta">
          <div class="rating">
            <span class="stars">{{product?.rating}} ★</span>
            <span class="count">{{product?.ratingCount}} Ratings</span>
          </div>
          <div class="delivery">
            <i class="fas fa-truck"></i>
            <span>Free Delivery by {{getDeliveryDate()}}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-view-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .product-images {
      .main-image {
        width: 100%;
        aspect-ratio: 3/4;
        margin-bottom: 20px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }
      }

      .thumbnail-images {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        
        img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
          transition: opacity 0.2s;
          
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }

    .product-details {
      h1 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .product-brand {
        color: #666;
        margin-bottom: 16px;
      }

      .price-section {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;

        .current-price {
          font-size: 24px;
          font-weight: 600;
        }

        .mrp {
          color: #666;
          text-decoration: line-through;
        }

        .discount {
          color: #ff6161;
          font-weight: 500;
        }
      }

      .size-section, .quantity-section {
        margin-bottom: 24px;

        h3 {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 12px;
        }
      }

      .size-options {
        display: flex;
        gap: 8px;
        
        button {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          
          &.selected {
            background: #000;
            color: white;
            border-color: #000;
          }
          
          &:hover {
            border-color: #000;
          }
        }
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 12px;
        
        button {
          width: 36px;
          height: 36px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          
          &:hover {
            background: #f5f5f5;
          }
        }
        
        input {
          width: 60px;
          height: 36px;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      }

      .action-buttons {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        
        button {
          flex: 1;
          padding: 16px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          
          &.add-to-bag {
            background: #000;
            color: white;
            border: none;
            
            &:hover {
              background: #333;
            }
          }
          
          &.wishlist {
            background: white;
            border: 1px solid #ddd;
            
            &:hover {
              border-color: #000;
            }
          }
        }
      }

      .product-description {
        margin-bottom: 24px;
        
        h3 {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        
        p {
          color: #666;
          line-height: 1.6;
        }
      }

      .product-meta {
        display: flex;
        justify-content: space-between;
        padding-top: 24px;
        border-top: 1px solid #eee;
        
        .rating {
          .stars {
            color: #ffc107;
            font-weight: 500;
          }
          
          .count {
            color: #666;
            margin-left: 8px;
          }
        }
        
        .delivery {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
        }
      }
    }

    @media (max-width: 768px) {
      .product-view-container {
        grid-template-columns: 1fr;
        padding: 20px;
      }
    }
  `]
})
export class ProductViewComponent implements OnInit {
  product: Product | null = null;
  selectedSize: string = '';
  quantity: number = 1;
  selectedImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProduct(parseInt(productId)).subscribe({
        next: (product) => {
          this.product = product;
          this.selectedImage = product.imageUrl[0];
        },
        error: (error) => {
          console.error('Error loading product:', error);
        }
      });
    }
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToBag(): void {
    if (this.product && this.selectedSize) {
      this.cartService.addToCart(this.product, this.quantity, this.selectedSize);
    }
  }

  toggleWishlist(): void {
    if (this.product) {
      this.productService.toggleWishlist(this.product.id).subscribe({
        next: () => {
          if (this.product) {
            this.product.isFavorite = !this.product.isFavorite;
          }
        },
        error: (error) => {
          console.error('Error toggling wishlist:', error);
        }
      });
    }
  }

  getDeliveryDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
} 
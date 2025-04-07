import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { fadeIn, staggerItems, scaleIn } from '../../animations';

interface CategoryWithDiscount {
  name: string;
  image: string;
  discount: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  animations: [fadeIn, staggerItems, scaleIn]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  newArrivals: Product[] = [];
  bestSellers: Product[] = [];
  categories: CategoryWithDiscount[] = [
    { 
      name: 'Ethnic Wear',
      image: 'assets/images/categories/ethnic-wear.jpg',
      discount: '50-80% OFF'
    },
    { 
      name: 'Casual Wear',
      image: 'assets/images/categories/casual-wear.jpg',
      discount: '40-80% OFF'
    },
    { 
      name: "Men's Activewear",
      image: 'assets/images/categories/mens-activewear.jpg',
      discount: '30-70% OFF'
    },
    { 
      name: "Women's Activewear",
      image: 'assets/images/categories/womens-activewear.jpg',
      discount: '30-70% OFF'
    },
    { 
      name: 'Western Wear',
      image: 'assets/images/categories/western-wear.jpg',
      discount: '40-80% OFF'
    },
    { 
      name: 'Sportswear',
      image: 'assets/images/categories/sportswear.jpg',
      discount: '30-80% OFF'
    }
  ];

  secondaryCategories: CategoryWithDiscount[] = [
    { 
      name: 'Loungewear',
      image: 'assets/images/categories/loungewear.jpg',
      discount: '30-60% OFF'
    },
    { 
      name: 'Innerwear',
      image: 'assets/images/categories/innerwear.jpg',
      discount: 'UP TO 70% OFF'
    },
    { 
      name: 'Lingerie',
      image: 'assets/images/categories/lingerie.jpg',
      discount: 'UP TO 70% OFF'
    },
    { 
      name: 'Watches',
      image: 'assets/images/categories/watches.jpg',
      discount: 'UP TO 80% OFF'
    },
    { 
      name: 'Grooming',
      image: 'assets/images/categories/grooming.jpg',
      discount: 'UP TO 60% OFF'
    },
    { 
      name: 'Beauty & Makeup',
      image: 'assets/images/categories/beauty.jpg',
      discount: 'UP TO 60% OFF'
    }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadNewArrivals();
    this.loadBestSellers();
  }

  loadFeaturedProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
      }
    });
  }

  loadNewArrivals(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.newArrivals = products
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading new arrivals:', error);
      }
    });
  }

  loadBestSellers(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.bestSellers = products
          .sort((a, b) => b.ratingCount - a.ratingCount)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading best sellers:', error);
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  toggleWishlist(product: Product): void {
    this.productService.toggleWishlist(product.id).subscribe({
      next: () => {
        product.isFavorite = !product.isFavorite;
      },
      error: (error) => {
        console.error('Error toggling wishlist:', error);
      }
    });
  }
}

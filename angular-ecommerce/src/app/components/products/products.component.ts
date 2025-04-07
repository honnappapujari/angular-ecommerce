import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty'];
  selectedCategories: { [key: string]: boolean } = {};
  priceRanges = [
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: 'Over $200', value: '200+' }
  ];
  selectedPriceRange: string = '';
  sortBy: string = 'price-asc';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Subscribe to route query params
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        if (params['category']) {
          this.selectedCategories[params['category']] = true;
        }
        this.loadProducts();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filterProducts();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // Fallback to mock data if API fails
        this.products = [
          {
            id: 1,
            brand: 'Sample Brand',
            name: 'Sample Product 1',
            description: 'Sample product description',
            price: 99.99,
            mrp: 129.99,
            discountPercentage: 23,
            imageUrl: ['assets/images/products/product1.jpg'],
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black', 'White'],
            category: 'Electronics',
            subCategory: 'Gadgets',
            gender: 'Unisex',
            rating: 4.5,
            ratingCount: 120,
            stock: 50,
            isNew: true,
            isFavorite: false,
            createdAt: '2024-03-01T00:00:00.000Z'
          },
          {
            id: 2,
            brand: 'Sample Brand',
            name: 'Sample Product 2',
            description: 'Sample product description',
            price: 149.99,
            mrp: 199.99,
            discountPercentage: 25,
            imageUrl: ['assets/images/products/product2.jpg'],
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Red', 'Blue'],
            category: 'Clothing',
            subCategory: 'T-Shirts',
            gender: 'Men',
            rating: 4.2,
            ratingCount: 85,
            stock: 30,
            isNew: true,
            isFavorite: false,
            createdAt: '2024-02-15T00:00:00.000Z'
          },
          {
            id: 3,
            brand: 'Sample Brand',
            name: 'Sample Product 3',
            description: 'Sample product description',
            price: 199.99,
            mrp: 249.99,
            discountPercentage: 20,
            imageUrl: ['assets/images/products/product3.jpg'],
            sizes: ['S', 'M', 'L'],
            colors: ['Green', 'Yellow'],
            category: 'Home & Kitchen',
            subCategory: 'Cookware',
            gender: 'Unisex',
            rating: 4.8,
            ratingCount: 45,
            stock: 20,
            isNew: true,
            isFavorite: false,
            createdAt: '2024-03-15T00:00:00.000Z'
          },
          {
            id: 4,
            brand: 'Sample Brand',
            name: 'Sample Product 4',
            description: 'Sample product description',
            price: 79.99,
            mrp: 99.99,
            discountPercentage: 20,
            imageUrl: ['assets/images/products/product4.jpg'],
            sizes: ['S', 'M', 'L'],
            colors: ['Pink', 'Purple'],
            category: 'Beauty',
            subCategory: 'Skincare',
            gender: 'Women',
            rating: 4.6,
            ratingCount: 65,
            stock: 40,
            isNew: true,
            isFavorite: false,
            createdAt: '2024-02-01T00:00:00.000Z'
          }
        ];
        this.filterProducts();
      }
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      // Filter by category
      if (Object.keys(this.selectedCategories).length > 0) {
        const selected = Object.entries(this.selectedCategories)
          .filter(([_, value]) => value)
          .map(([key]) => key);
        if (selected.length > 0 && !selected.includes(product.category)) {
          return false;
        }
      }

      // Filter by price range
      if (this.selectedPriceRange) {
        const [min, max] = this.selectedPriceRange.split('-');
        if (max === '+') {
          if (product.price < Number(min)) return false;
        } else {
          if (product.price < Number(min) || product.price > Number(max)) return false;
        }
      }

      return true;
    });

    this.sortProducts();
  }

  isInPriceRange(price: number): boolean {
    if (!this.selectedPriceRange) return true;
    const [min, max] = this.selectedPriceRange.split('-');
    if (max === '+') return price >= Number(min);
    return price >= Number(min) && price <= Number(max);
  }

  sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  navigateToProduct(product: Product): void {
    this.router.navigate(['/products', product.id]);
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

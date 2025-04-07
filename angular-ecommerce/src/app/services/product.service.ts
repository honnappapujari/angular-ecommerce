import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private wishlist: number[] = [];
  private wishlistSubject = new BehaviorSubject<number[]>([]);

  // Mock products data
  private mockProducts: Product[] = [
    {
      id: 1,
      brand: 'Nike',
      name: 'Air Max 270',
      description: 'The Nike Air Max 270 delivers visible cushioning under every step.',
      price: 150.00,
      mrp: 180.00,
      discountPercentage: 17,
      imageUrl: ['https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png'],
      sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
      colors: ['Black', 'White', 'Red'],
      category: 'Shoes',
      subCategory: 'Running',
      gender: 'Men',
      rating: 4.5,
      ratingCount: 120,
      stock: 50,
      isNew: true,
      isFavorite: false,
      createdAt: '2024-03-01T00:00:00.000Z'
    },
    {
      id: 2,
      brand: 'Adidas',
      name: 'Ultraboost 22',
      description: 'The Ultraboost 22 features responsive cushioning and a supportive fit.',
      price: 180.00,
      mrp: 200.00,
      discountPercentage: 10,
      imageUrl: ['https://assets.adidas.com/images/w_600,f_auto,q_auto/2c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c/ultraboost-22-shoes.jpg'],
      sizes: ['US 7', 'US 8', 'US 9', 'US 10'],
      colors: ['Blue', 'White', 'Black'],
      category: 'Shoes',
      subCategory: 'Running',
      gender: 'Men',
      rating: 4.7,
      ratingCount: 95,
      stock: 30,
      isNew: true,
      isFavorite: false,
      createdAt: '2024-02-15T00:00:00.000Z'
    },
    {
      id: 3,
      brand: 'Puma',
      name: 'RS-X³ Puzzle',
      description: 'The RS-X³ Puzzle features a bold design with comfortable cushioning.',
      price: 120.00,
      mrp: 150.00,
      discountPercentage: 20,
      imageUrl: ['https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/371915/01/sv01/fnd/IND/fmt/png/RS-X³-Puzzle-Unisex-Sneakers'],
      sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
      colors: ['Red', 'Blue', 'Yellow'],
      category: 'Shoes',
      subCategory: 'Lifestyle',
      gender: 'Unisex',
      rating: 4.3,
      ratingCount: 75,
      stock: 25,
      isNew: true,
      isFavorite: false,
      createdAt: '2024-03-15T00:00:00.000Z'
    },
    {
      id: 4,
      brand: 'New Balance',
      name: 'Fresh Foam 1080v12',
      description: 'The Fresh Foam 1080v12 provides plush comfort for long-distance running.',
      price: 160.00,
      mrp: 190.00,
      discountPercentage: 16,
      imageUrl: ['https://nb.scene7.com/is/image/NB/m1080v12_nb_02_i?$dw_detail_main_lg$&bgc=f5f5f5&layer=1&bgcolor=f5f5f5&blendMode=mult&scale=10&wid=1600&hei=1600'],
      sizes: ['US 7', 'US 8', 'US 9', 'US 10'],
      colors: ['Black', 'White', 'Gray'],
      category: 'Shoes',
      subCategory: 'Running',
      gender: 'Men',
      rating: 4.8,
      ratingCount: 110,
      stock: 40,
      isNew: true,
      isFavorite: false,
      createdAt: '2024-02-01T00:00:00.000Z'
    }
  ];

  constructor(private http: HttpClient) {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlist = JSON.parse(savedWishlist);
      this.wishlistSubject.next(this.wishlist);
    }
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      // Fallback to mock data if API fails
      catchError(() => of(this.mockProducts))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      // Fallback to mock data if API fails
      catchError(() => {
        const product = this.mockProducts.find(p => p.id === id);
        return of(product || this.mockProducts[0]);
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`).pipe(
      // Fallback to mock data if API fails
      catchError(() => of(this.mockProducts.filter(p => p.category === category)))
    );
  }

  getProductsByGender(gender: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?gender=${gender}`).pipe(
      // Fallback to mock data if API fails
      catchError(() => of(this.mockProducts.filter(p => p.gender === gender)))
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?q=${query}`).pipe(
      // Fallback to mock data if API fails
      catchError(() => of(this.mockProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )))
    );
  }

  toggleWishlist(productId: number): Observable<boolean> {
    const index = this.wishlist.indexOf(productId);
    if (index === -1) {
      this.wishlist.push(productId);
    } else {
      this.wishlist.splice(index, 1);
    }
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    this.wishlistSubject.next(this.wishlist);
    return of(index === -1);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.includes(productId);
  }

  getWishlistProducts(): Observable<Product[]> {
    if (this.wishlist.length === 0) {
      return of([]);
    }
    return this.http.get<Product[]>(`${this.apiUrl}?ids=${this.wishlist.join(',')}`).pipe(
      // Fallback to mock data if API fails
      catchError(() => of(this.mockProducts.filter(p => this.wishlist.includes(p.id))))
    );
  }
}

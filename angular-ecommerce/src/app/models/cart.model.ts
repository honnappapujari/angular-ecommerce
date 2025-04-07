import { Product } from './product.model';

export interface CartItem {
    product: Product;
    quantity: number;
    size: string;
}

export interface Cart {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
} 
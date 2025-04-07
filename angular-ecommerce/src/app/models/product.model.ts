export interface Product {
    id: number;
    brand: string;
    name: string;
    description: string;
    price: number;
    mrp: number;
    discountPercentage: number;
    imageUrl: string[];
    sizes: string[];
    colors: string[];
    category: string;
    subCategory: string;
    gender: string;
    rating: number;
    ratingCount: number;
    stock: number;
    isNew?: boolean;
    isFavorite?: boolean;
    createdAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
}

export interface Banner {
    id: number;
    imageUrl: string;
    title: string;
    description?: string;
    link: string;
}

export interface Category {
    id: number;
    name: string;
    imageUrl: string;
    description?: string;
    parentId?: number;
} 
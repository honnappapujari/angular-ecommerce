export interface User {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    phone?: string;
    location?: string;
    role: 'user' | 'admin';
} 
export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    isActive: boolean;
    sellerId: number;
    rating: number;
    createdAt: string;
  }
  
  export interface Order {
    id: number;
    buyerId: number;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    items: OrderItem[];
    createdAt: string;
  }
  
  export interface OrderItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }
  
  export interface Stats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
  }

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  allergens?: string[];
  cookingOptions?: string[];
  sides?: string[];
  isAvailable: boolean;
  isDailySpecial?: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: {
    cooking?: string;
    sides?: string[];
    notes?: string;
  };
}

export interface Order {
  id: string;
  tableNumber?: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  total: number;
  timestamp: Date;
  estimatedTime?: number;
  orderType: 'dine-in' | 'takeaway';
  paymentMethod?: 'cash' | 'mobile';
  customerInfo?: {
    id?: string;
    name?: string;
    email?: string;
    loyaltyPoints?: number;
  };
  rating?: {
    score: number;
    comment?: string;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  logo?: string;
  categories: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  loyaltyPoints: number;
  orderHistory: Order[];
  preferences: string[];
}

export interface DailyMenu {
  id: string;
  date: Date;
  specialItems: MenuItem[];
  description: string;
}

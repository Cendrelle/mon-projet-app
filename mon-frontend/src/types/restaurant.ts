
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
  price: number;
}

export interface Order {
  id: string;
  tableNumber?: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  total: number;
  timestamp: Date;
  estimatedTime?: number;
  description?: string;
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
  commande_uuid: string; 
  earned_points?: number; 
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
  firstname: string;
  lastname: string;
  phone: string;
  loyaltyPoints: {
    earned_points: number;
    total_points: number;
  };
  orderHistory: Order[];
  preferences: string[];
  date_joined: string;
  token?: string;
}

export interface DailyMenu {
  id: string;
  date: Date;
  specialItems: MenuItem[];
  description: string;
}

export interface BackendPlat {
  id: number;           // id du plat dans la table PlatCommandes
  plat: number;         // id du menuItem
  nom_plat?: string;    // nom du plat (si disponible côté backend)
  quantite: number;
  prix: number;
  description: string;
  categorie: string;
  // ajouter d'autres champs si besoin
}

export interface BackendCommande {
  commande: number;            // correspond à cmd.id
  date: string;                // cmd.date_commande
  statut: string;              // cmd.statut
  table_number?: string;       // numéro de table
  type_service: 'sur_place' | 'emporter';
  mode?: 'en_ligne' | 'espèces';
  plats: BackendPlat[];
  rating?: {
    score: number;
    comment?: string;
  };
}

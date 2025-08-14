
import { MenuItem, Restaurant } from '@/types/restaurant';

export const restaurantInfo: Restaurant = {
  id: 'restaurant-1',
  name: 'Le Petit Bistrot',
  description: 'Cuisine française authentique',
  logo: '/logo.png',
  categories: ['Entrées', 'Plats', 'Desserts', 'Boissons']
};

export const menuItems: MenuItem[] = [
  // Entrées
  {
    id: 'entree-1',
    name: 'Escargots de Bourgogne',
    description: 'Escargots traditionnels au beurre persillé',
    price: 12.50,
    category: 'Entrées',
    image: '/images/escargots.jpg',
    allergens: ['gluten', 'lactose'],
    sides: ['pain grillé', 'salade verte'],
    isAvailable: true
  },
  {
    id: 'entree-2',
    name: 'Soupe à l\'oignon',
    description: 'Soupe traditionnelle française gratinée',
    price: 8.50,
    category: 'Entrées',
    allergens: ['lactose', 'gluten'],
    sides: ['croûtons', 'fromage râpé'],
    isAvailable: true
  },
  {
    id: 'entree-3',
    name: 'Salade de chèvre chaud',
    description: 'Mesclun, tomates cerises, crottin de chèvre',
    price: 10.00,
    category: 'Entrées',
    allergens: ['lactose'],
    sides: ['noix', 'vinaigrette miel', 'croûtons'],
    isAvailable: true
  },
  
  // Plats
  {
    id: 'plat-1',
    name: 'Coq au vin',
    description: 'Coq mijoté au vin rouge avec légumes',
    price: 18.50,
    category: 'Plats',
    cookingOptions: ['saignant', 'à point', 'bien cuit'],
    sides: ['pommes de terre', 'riz', 'légumes'],
    isAvailable: true
  },
  {
    id: 'plat-2',
    name: 'Bouillabaisse',
    description: 'Soupe de poissons méditerranéenne',
    price: 22.00,
    category: 'Plats',
    allergens: ['poisson', 'crustacés'],
    isAvailable: true
  },
  {
    id: 'plat-3',
    name: 'Boeuf bourguignon',
    description: 'Bœuf mijoté au vin rouge de Bourgogne',
    price: 19.50,
    category: 'Plats',
    sides: ['purée', 'pommes de terre', 'légumes'],
    isAvailable: true
  },
  {
    id: 'plat-4',
    name: 'Saumon grillé',
    description: 'Saumon grillé sauce hollandaise',
    price: 16.50,
    category: 'Plats',
    allergens: ['poisson'],
    cookingOptions: ['peu cuit', 'à point', 'bien cuit'],
    sides: ['riz', 'légumes', 'pommes de terre'],
    isAvailable: true
  },

  // Desserts
  {
    id: 'dessert-1',
    name: 'Tarte Tatin',
    description: 'Tarte aux pommes caramélisées',
    price: 7.50,
    category: 'Desserts',
    allergens: ['gluten', 'lactose', 'œufs'],
    sides: ['crème fraîche', 'glace vanille', 'chantilly'],
    isAvailable: true
  },
  {
    id: 'dessert-2',
    name: 'Crème brûlée',
    description: 'Crème vanille caramélisée',
    price: 6.50,
    category: 'Desserts',
    allergens: ['lactose', 'œufs'],
    sides: ['biscuit', 'fruits rouges'],
    isAvailable: true
  },
  {
    id: 'dessert-3',
    name: 'Profiteroles',
    description: 'Choux à la crème glacée, sauce chocolat',
    price: 8.00,
    category: 'Desserts',
    allergens: ['gluten', 'lactose', 'œufs'],
    sides: ['sauce caramel', 'amandes effilées', 'fruits frais'],
    isAvailable: true
  },

  // Boissons
  {
    id: 'boisson-1',
    name: 'Vin rouge - Côtes du Rhône',
    description: 'Verre de vin rouge AOC',
    price: 5.50,
    category: 'Boissons',
    isAvailable: true
  },
  {
    id: 'boisson-2',
    name: 'Eau minérale',
    description: 'Bouteille 50cl',
    price: 2.50,
    category: 'Boissons',
    isAvailable: true
  },
  {
    id: 'boisson-3',
    name: 'Café',
    description: 'Expresso français',
    price: 2.00,
    category: 'Boissons',
    isAvailable: true
  }
];

export const dailySpecials: MenuItem[] = [
  {
    id: 'special-1',
    name: 'Menu du jour',
    description: 'Entrée + Plat + Dessert du chef',
    price: 24.90,
    category: 'Plats',
    isDailySpecial: true,
    isAvailable: true
  },
  {
    id: 'special-2',
    name: 'Plat du jour',
    description: 'Pot-au-feu traditionnel',
    price: 15.90,
    category: 'Plats',
    isDailySpecial: true,
    isAvailable: true
  }
];

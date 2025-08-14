
import { MenuItem } from '@/types/restaurant';
import MenuItemCard from './MenuItemCard';

interface MenuCategoryProps {
  category: string;
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const MenuCategory = ({ category, items, onAddToCart }: MenuCategoryProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-restaurant-200">
        {category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <MenuItemCard 
            key={item.id} 
            item={item} 
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;

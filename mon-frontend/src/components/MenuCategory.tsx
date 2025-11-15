import { MenuItem } from '@/types/restaurant';
import MenuItemCard from './MenuItemCard';
import 'swiper/css';
import 'swiper/css/pagination';

interface MenuCategoryProps {
  category: string;
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const colorByCategory = {
  'Entrée': 'text-green-600 border-green-200',
  'Plat principal': 'text-orange-600 border-orange-200',
  'Dessert': 'text-pink-600 border-pink-200',
  'Boisson': 'text-blue-600 border-blue-200',
  'Autre': 'text-gray-800 border-gray-300'
};

const MenuCategory = ({ category, items, onAddToCart }: MenuCategoryProps) => {
  const itemsInCategory = items.filter(item => item.category === category && item.isAvailable);

  if (itemsInCategory.length === 0) return null;

  const colorClass = colorByCategory[category] || 'text-gray-900 border-gray-200';

  return (
    <section className="bg-white rounded-2xl shadow-xl p-6 pt-8 transition hover:shadow-2xl" style={{ minHeight: 520 }}>
      {/* Nom de la catégorie */}
      <h2 className={`text-2xl font-bold mb-6 pb-2 border-b ${colorClass} tracking-wide uppercase`}>
        {category}
      </h2>
      
        {/* Grille 3 colonnes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsInCategory.map((item) => (
            <div key={item.id} className="bg-orange-100 rounded-xl shadow hover:shadow-lg transition p-4">
              <MenuItemCard item={item} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </section>
  );
}

export default MenuCategory;

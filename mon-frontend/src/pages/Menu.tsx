import MenuCategory from '@/components/MenuCategory';
import { useMenu } from '@/hooks/useMenu';
import { useCart } from '@/hooks/useCart';
import { MenuItem as MenuItemType } from '@/types/restaurant';

const MenuPage = () => {
  const { menu, loading, error } = useMenu();
  const { addItem } = useCart();

  const handleAddToCart = (item: MenuItemType) => {
    addItem(item);
  };

  if (loading) return <p>Chargement du menu...</p>;
  if (error) return <p>Erreur : {error}</p>;

  const categories: MenuItemType['category'][] = [
    'entree',
    'plat_principal',
    'dessert',
    'boisson',
    'accompagnement',
    'autre',
  ];

  return (
    <div className="space-y-12">
      {categories.map(category => {
        const itemsInCategory = menu.filter(item => item.category === category && item.isAvailable);
        if (!itemsInCategory.length) return null;
        return (
          <MenuCategory
            key={category}
            category={category}
            items={itemsInCategory}
            onAddToCart={handleAddToCart}
          />
        );
      })}
    </div>
  );
};

export default MenuPage;

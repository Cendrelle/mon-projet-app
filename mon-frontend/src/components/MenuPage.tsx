import MenuCategory from './MenuCategory';

// Les catégories présentes dans ton menu :
const categories = [
  'Entrée',
  'Plat principal',
  'Dessert',
  'Boisson',
  'Autre',
];

const MenuPage = ({ items, onAddToCart }) => (
  <div className="bg-orange-50 min-h-screen py-10">
    <h1 className="text-4xl font-extrabold text-orange-600 mb-14 text-center drop-shadow-md tracking-tight">
      Menu du Restaurant
    </h1>
    <div className="max-w-4xl mx-auto flex flex-col gap-12">
      {categories.map((category) => (
        <MenuCategory
          key={category}
          category={category}
          items={items}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  </div>
);

export default MenuPage;

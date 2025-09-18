
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ChefHat } from 'lucide-react';
import { MenuItem } from '@/types/restaurant';
import CustomizationModal from './CustomizationModal';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, customizations?: any) => void;
}

const MenuItemCard = ({ item, onAddToCart }: MenuItemCardProps) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const isMobile = useIsMobile();

  // Activation sauf pour boisson
const hasCustomizations = item.category !== 'boisson';

  const handleAddToCart = (customizations?: any) => {
    onAddToCart(item, customizations);
    setShowCustomization(false);
  };

  return (
    <>
      <Card className={`hover-scale cursor-pointer transition-all duration-200 hover:shadow-lg ${isMobile ? 'active:scale-95' : ''}`}>
        <CardContent className={isMobile ? 'p-5' : 'p-4'}>
          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'justify-between items-start'} mb-3`}>
            <div className="flex-1">
              <h3 className={`font-semibold text-gray-900 mb-1 ${isMobile ? 'text-lg' : 'text-lg'}`}>
                {item.name}
              </h3>
              <p className={`text-gray-600 mb-2 line-clamp-2 ${isMobile ? 'text-base' : 'text-sm'}`}>
                {item.description}
              </p>
              
              {item.allergens && item.allergens.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.allergens.map((allergen) => (
                    <Badge key={allergen} variant="outline" className={isMobile ? 'text-sm' : 'text-xs'}>
                      {allergen}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className={`${isMobile ? 'self-start' : 'ml-4'} text-right`}>
              <p className={`font-bold text-restaurant-600 ${isMobile ? 'text-2xl' : 'text-xl'}`}>
                {item.price.toFixed(2)}FCFA
              </p>
            </div>
          </div>

          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'justify-between items-center'}`}>
            {hasCustomizations && (
              <div className={`flex items-center text-restaurant-500 ${isMobile ? 'text-base justify-center' : 'text-sm'}`}>
                <ChefHat className={`mr-1 ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                <span>Personnalisable</span>
              </div>
            )}
            
            <Button
              onClick={() => hasCustomizations ? setShowCustomization(true) : handleAddToCart()}
              className={`bg-restaurant-500 hover:bg-restaurant-600 text-white ${isMobile ? 'w-full min-h-12 text-base' : 'ml-auto'}`}
              size={isMobile ? 'lg' : 'sm'}
            >
              <Plus className={`mr-2 ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {showCustomization && (
        <CustomizationModal
          item={item}
          onConfirm={handleAddToCart}
          onCancel={() => setShowCustomization(false)}
        />
      )}
    </>
  );
};

export default MenuItemCard;

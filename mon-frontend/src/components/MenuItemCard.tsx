
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
      <Card
        className={`group overflow-hidden hover:shadow-medium transition-all duration-300 cursor-pointer 
        ${isMobile ? 'active:scale-95' : ''}`} >
        <CardContent className="p-0">
          
          {/* Image + Badge + Bouton + Animation */}
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={`http://localhost:8000${item.image}`}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <Button
              size="icon"
              className="absolute bottom-2 right-2 rounded-full bg-restaurant-500 text-white 
              shadow-medium hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                hasCustomizations ? setShowCustomization(true) : handleAddToCart();
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Texte */}
          <div className="p-4">
            <h3 className="font-semibold text-lg text-foreground mb-1">{item.name}</h3>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {item.description}
            </p>

            {/* Allergènes */}
            {item.allergens?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {item.allergens.map((a) => (
                  <Badge key={a} variant="outline" className="text-xs">
                    {a}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-xl font-bold text-primary">
              {item.price.toFixed(2)} FCFA
            </p>
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

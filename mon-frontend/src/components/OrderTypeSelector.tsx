
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, ShoppingBag } from 'lucide-react';

interface OrderTypeSelectorProps {
  onSelectType: (type: 'dine-in' | 'takeaway') => void;
}

const OrderTypeSelector = ({ onSelectType }: OrderTypeSelectorProps) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Comment souhaitez-vous être servi ?
            </h1>
            <p className="text-gray-600">
              Choisissez votre mode de service
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => onSelectType('dine-in')}
              className="w-full h-20 bg-restaurant-500 hover:bg-restaurant-600 text-white flex flex-col items-center justify-center space-y-2"
              size="lg"
            >
              <Store className="w-8 h-8" />
              <span className="text-lg">Sur place</span>
            </Button>

            <Button
              onClick={() => onSelectType('takeaway')}
              variant="outline"
              className="w-full h-20 border-restaurant-500 text-restaurant-600 hover:bg-restaurant-50 flex flex-col items-center justify-center space-y-2"
              size="lg"
            >
              <ShoppingBag className="w-8 h-8" />
              <span className="text-lg">À emporter</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTypeSelector;

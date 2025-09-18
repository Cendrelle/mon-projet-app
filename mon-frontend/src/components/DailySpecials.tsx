
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Star } from 'lucide-react';
import { MenuItem } from '@/types/restaurant';

interface DailySpecialsProps {
  specialItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const DailySpecials = ({ specialItems, onAddToCart }: DailySpecialsProps) => {
  if (!specialItems.length) return null;

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-amber-700">
          <Calendar className="w-5 h-5" />
          <span>Menu du jour</span>
        </CardTitle>
        <p className="text-sm text-gray-600 capitalize">{today}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {specialItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-lg border border-amber-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                    <Star className="w-3 h-3 mr-1" />
                    Spécial
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <span className="font-bold text-amber-600 text-lg">{item.price.toFixed(2)}FCFA</span>
              </div>
              <Button
                onClick={() => onAddToCart(item)}
                className="bg-amber-500 hover:bg-amber-600 text-white ml-4"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySpecials;

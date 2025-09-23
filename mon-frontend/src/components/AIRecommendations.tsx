
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus } from 'lucide-react';
import { MenuItem, User } from '@/types/restaurant';

interface AIRecommendationsProps {
  user: User;
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const AIRecommendations = ({ user, menuItems, onAddToCart }: AIRecommendationsProps) => {
  if (!menuItems || menuItems.length === 0) return null; // si pas de reco -> rien à afficher

  if (user.id) {
    return (
      <Card className="mb-6 border-restaurant-200 bg-gradient-to-r from-restaurant-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-restaurant-700">
            <Sparkles className="w-5 h-5" />
            <span>Recommandations IA personnalisées</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Proposées selon vos préférences et votre historique
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-bold text-restaurant-600">{item.price.toFixed(2)} FCFA</span>
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Recommandé
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => onAddToCart(item)}
                  size="sm"
                  className="bg-restaurant-500 hover:bg-restaurant-600 ml-4"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };
};
export default AIRecommendations;

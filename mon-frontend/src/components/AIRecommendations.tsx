
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
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler l'IA pour générer des recommandations basées sur l'historique
    const generateRecommendations = () => {
      setIsLoading(true);
      setTimeout(() => {
        // Recommandations basées sur les préférences et l'historique
        let filtered = menuItems.filter(item => 
          user.preferences.some(pref => 
            item.name.toLowerCase().includes(pref.toLowerCase()) ||
            item.description.toLowerCase().includes(pref.toLowerCase())
          )
        ).slice(0, 3);

        // Si aucune recommandation basée sur les préférences, prendre les 3 premiers plats populaires
        if (filtered.length === 0) {
          filtered = menuItems.slice(0, 3);
        }

        setRecommendations(filtered);
        setIsLoading(false);
      }, 1500);
    };

    generateRecommendations();
  }, [user, menuItems]);

  if (!recommendations.length && !isLoading) return null;

  return (
    <Card className="mb-6 border-restaurant-200 bg-gradient-to-r from-restaurant-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-restaurant-700">
          <Sparkles className="w-5 h-5" />
          <span>Recommandations IA personnalisées</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Basées sur votre historique de commandes et vos préférences
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-bold text-restaurant-600">{item.price.toFixed(2)}€</span>
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Recommandé pour vous
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
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;

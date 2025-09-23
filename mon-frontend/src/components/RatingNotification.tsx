import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, X } from 'lucide-react';
import { Order } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';

interface RatingNotificationProps {
  order: Order;
  onRate: (rating: number) => void;
  onDismiss: () => void;
}

const RatingNotification = ({ order, onRate, onDismiss }: RatingNotificationProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();

  const handleRate = (starRating: number) => {
    setRating(starRating);
    onRate(starRating);
    toast({
      title: "Merci pour votre avis !",
      description: "Votre évaluation nous aide à améliorer notre service.",
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card className="bg-white shadow-lg border-l-4 border-l-restaurant-500 animate-in slide-in-from-right-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">Comment était votre repas ?</h4>
              <p className="text-sm text-gray-600">Commande #{order.id.toString().slice(-6)}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-center space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star 
                  className={`w-6 h-6 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDismiss}
            className="w-full text-xs"
          >
            Plus tard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingNotification;
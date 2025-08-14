
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { Order } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';

interface OrderRatingProps {
  order: Order;
  onComplete: () => void;
}

const OrderRating = ({ order, onComplete }: OrderRatingProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();

  const handleSubmit = () => {
    console.log('Rating submitted:', { rating, comment, orderId: order.id });
    toast({
      title: "Merci pour votre avis !",
      description: "Votre évaluation nous aide à améliorer notre service.",
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Évaluez votre expérience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Comment s'est passé votre repas ?
            </p>
            
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-left space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Commentaires (optionnel)
              </label>
              <Textarea
                placeholder="Dites-nous ce que vous avez pensé de votre repas..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full bg-restaurant-500 hover:bg-restaurant-600"
              size="lg"
            >
              Envoyer l'évaluation
            </Button>
            
            <Button 
              variant="outline"
              onClick={onComplete}
              className="w-full"
            >
              Passer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderRating;
